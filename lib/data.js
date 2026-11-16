/**
 * Tidy-log ingestion for the research signal figure workflow.
 *
 * One observation per row with the required columns
 * `benchmark, scenario, method, seed, step, value` and the optional
 * `metric, unit, variant, heterogeneity`. Every figure in the studio is
 * computed from these rows; nothing is synthesized except the explicitly
 * labelled demo dataset.
 */

const REQUIRED = ['benchmark', 'scenario', 'method', 'seed', 'step', 'value']
const OPTIONAL = ['metric', 'unit', 'variant', 'heterogeneity']

/** Split one CSV line, honouring double quotes. */
function splitLine(line, delimiter) {
  const cells = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i]
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cell += '"'
          i += 1
        } else {
          quoted = false
        }
      } else {
        cell += ch
      }
      continue
    }
    if (ch === '"') {
      quoted = true
    } else if (ch === delimiter) {
      cells.push(cell)
      cell = ''
    } else {
      cell += ch
    }
  }
  cells.push(cell)
  return cells
}

/** Parse RFC4180-ish CSV text into header names and raw string rows. */
export function parseCsv(text) {
  const source = String(text ?? '').replace(/^\uFEFF/, '')
  const lines = source.split(/\r\n|\n|\r/).filter((line) => line.trim() !== '')
  if (lines.length < 2) throw new Error('CSV must contain a header row and at least one data row')
  const delimiter = (lines[0].match(/\t/g) || []).length > (lines[0].match(/,/g) || []).length ? '\t' : ','
  const header = splitLine(lines[0], delimiter).map((name) => name.trim())
  const missing = REQUIRED.filter((name) => !header.includes(name))
  if (missing.length > 0) throw new Error(`missing required column(s): ${missing.join(', ')}`)
  const rows = []
  for (let i = 1; i < lines.length; i += 1) {
    const cells = splitLine(lines[i], delimiter)
    if (cells.every((cell) => cell.trim() === '')) continue
    const row = {}
    for (let c = 0; c < header.length; c += 1) row[header[c]] = (cells[c] ?? '').trim()
    row.__line = i + 1
    rows.push(row)
  }
  return { header, rows }
}

function num(value) {
  if (value === undefined || value === '') return Number.NaN
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

/**
 * Enforce the log contract from the workflow: duplicate keys, non-finite
 * values, non-monotone steps inside a run, fewer than three trials, and
 * inconsistent step grids all stop the pipeline instead of being dropped.
 */
export function validate(parsed) {
  const errors = []
  const warnings = []
  const rows = []
  const seen = new Set()
  let malformed = 0

  for (const raw of parsed.rows) {
    const value = num(raw.value)
    const step = num(raw.step)
    const seed = raw.seed
    const key = [raw.benchmark, raw.scenario, raw.method, seed, raw.step].join('\u0001')
    if (!raw.benchmark || !raw.scenario || !raw.method || seed === '' || seed === undefined) {
      malformed += 1
      errors.push({ kind: 'incomplete-row', line: raw.__line, message: 'missing benchmark, scenario, method, or seed' })
      continue
    }
    if (!Number.isFinite(value)) {
      malformed += 1
      errors.push({ kind: 'non-finite', line: raw.__line, message: `value "${raw.value}" is not a finite number` })
      continue
    }
    if (!Number.isFinite(step)) {
      malformed += 1
      errors.push({ kind: 'non-finite', line: raw.__line, message: `step "${raw.step}" is not a finite number` })
      continue
    }
    if (seen.has(key)) {
      errors.push({
        kind: 'duplicate-key',
        line: raw.__line,
        message: `duplicate observation for ${raw.benchmark} / ${raw.scenario} / ${raw.method} / seed ${seed} / step ${raw.step}`,
      })
      continue
    }
    seen.add(key)
    const heterogeneity = num(raw.heterogeneity)
    rows.push({
      benchmark: raw.benchmark,
      scenario: raw.scenario,
      method: raw.method,
      seed: String(seed),
      step,
      value,
      metric: raw.metric || '',
      unit: raw.unit || '',
      variant: raw.variant || 'main',
      heterogeneity: Number.isFinite(heterogeneity) ? heterogeneity : null,
    })
  }

  if (malformed > 0) warnings.push(`${malformed} malformed row(s) were reported and excluded`)

  // Runs: benchmark + scenario + method + seed, ordered by step.
  const runs = new Map()
  for (const row of rows) {
    const key = [row.benchmark, row.scenario, row.method, row.seed].join('\u0001')
    let run = runs.get(key)
    if (!run) {
      run = { key, benchmark: row.benchmark, scenario: row.scenario, method: row.method, seed: row.seed, points: [] }
      runs.set(key, run)
    }
    run.points.push({ step: row.step, value: row.value })
  }
  for (const run of runs.values()) {
    run.points.sort((a, b) => a.step - b.step)
    for (let i = 1; i < run.points.length; i += 1) {
      if (run.points[i].step <= run.points[i - 1].step) {
        errors.push({
          kind: 'non-monotone',
          message: `${run.scenario} / ${run.method} / seed ${run.seed} repeats or decreases step ${run.points[i].step}`,
        })
        break
      }
    }
  }

  const seeds = [...new Set(rows.map((row) => row.seed))]
  if (seeds.length < 3) {
    errors.push({
      kind: 'seed-count',
      message: `only ${seeds.length} trial(s) detected; the workflow requires at least three`,
    })
  }

  // Step grid: every run of one scenario-method must share the same steps, and
  // methods inside a scenario must agree as well.
  const scenarioGrids = new Map()
  for (const run of runs.values()) {
    const key = [run.benchmark, run.scenario].join('\u0001')
    const signature = run.points.map((point) => point.step).join(',')
    const grid = scenarioGrids.get(key)
    if (!grid) scenarioGrids.set(key, { signature, method: run.method })
    else if (grid.signature !== signature) {
      errors.push({
        kind: 'step-grid',
        message: `${run.benchmark} / ${run.scenario} mixes step grids (${grid.method} vs ${run.method}); resample before plotting`,
      })
    }
  }

  const benchmarks = [...new Set(rows.map((row) => row.benchmark))]
  const scenarios = [...new Set(rows.map((row) => `${row.benchmark}\u0001${row.scenario}`))].map((key) => {
    const [benchmark, scenario] = key.split('\u0001')
    return { benchmark, scenario }
  })
  const methods = [...new Set(rows.map((row) => row.method))]
  const variants = [...new Set(rows.map((row) => row.variant))]
  const steps = [...new Set(rows.map((row) => row.step))].sort((a, b) => a - b)
  const first = rows[0] ?? {}

  return {
    rows,
    runs: [...runs.values()],
    errors,
    warnings,
    summary: {
      rows: rows.length,
      benchmarks: benchmarks.length,
      scenarios: scenarios.length,
      methods: methods.length,
      seeds: seeds.length,
      steps: steps.length,
      variants,
      stepRange: steps.length > 0 ? [steps[0], steps[steps.length - 1]] : [0, 0],
      metric: first.metric || '',
      unit: first.unit || '',
    },
  }
}

export function parseAndValidate(text) {
  if (String(text ?? '').trim() === '') {
    return {
      header: [],
      rows: [],
      runs: [],
      errors: [],
      warnings: ['no data imported yet'],
      summary: {
        rows: 0,
        benchmarks: 0,
        scenarios: 0,
        methods: 0,
        seeds: 0,
        steps: 0,
        variants: [],
        stepRange: [0, 0],
        metric: '',
        unit: '',
      },
    }
  }
  const parsed = parseCsv(text)
  const audit = validate(parsed)
  return { header: parsed.header, ...audit }
}

/* ------------------------------------------------------------------ stats */

/** Deterministic 32-bit PRNG so a figure re-renders identically forever. */
function mulberry32(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashString(text) {
  let hash = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mean(values) {
  let total = 0
  for (const value of values) total += value
  return total / values.length
}

/** Interquartile mean: trim 25% from each tail, average the middle half. */
export function iqm(values) {
  if (values.length === 0) return Number.NaN
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  const lo = Math.floor(0.25 * n)
  const hi = Math.max(Math.floor(0.75 * n), lo + 1)
  return mean(sorted.slice(lo, hi))
}

/** Percentile of an already sorted array, linear interpolation. */
function quantile(sorted, p) {
  if (sorted.length === 0) return Number.NaN
  const position = (sorted.length - 1) * p
  const base = Math.floor(position)
  const rest = position - base
  return sorted[base + 1] !== undefined ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base]
}

/**
 * Point estimate plus a deterministic percentile bootstrap interval.
 * `statistic` is 'mean' or 'iqm'; resampling always happens in the stored
 * (linear) domain, and the caller transforms the resulting endpoints.
 */
export function estimate(values, options) {
  const resamples = Math.max(100, Math.min(4000, options?.resamples ?? 1000))
  const seed = options?.seed ?? 20260830
  const key = options?.key ?? ''
  const statistic = options?.statistic === 'iqm' ? iqm : mean
  const point = statistic(values)
  if (!Array.isArray(values) || values.length < 2) {
    return { point, lo: point, hi: point, n: values?.length ?? 0 }
  }
  const random = mulberry32((seed ^ hashString(key)) >>> 0)
  const draws = []
  const n = values.length
  for (let r = 0; r < resamples; r += 1) {
    const sample = new Array(n)
    for (let i = 0; i < n; i += 1) sample[i] = values[Math.floor(random() * n)]
    draws.push(statistic(sample))
  }
  draws.sort((a, b) => a - b)
  return { point, lo: quantile(draws, 0.025), hi: quantile(draws, 0.975), n }
}

/** Causal rolling mean used only for presentation. */
export function smooth(values, window) {
  if (!Number.isFinite(window) || window <= 1) return [...values]
  const out = new Array(values.length)
  for (let i = 0; i < values.length; i += 1) {
    let total = 0
    let count = 0
    for (let j = Math.max(0, i - Math.floor(window) + 1); j <= i; j += 1) {
      if (Number.isFinite(values[j])) {
        total += values[j]
        count += 1
      }
    }
    out[i] = count > 0 ? total / count : Number.NaN
  }
  return out
}

function domainTransform(spec) {
  const transform = spec?.data?.transform ?? 'none'
  if (transform === 'linear-to-db') {
    return {
      toDisplay: (value) => (value > 0 ? 10 * Math.log10(value) : -120),
      label: (label) => (label.includes('dB') ? label : `${label} (dB)`),
    }
  }
  if (transform === 'amplitude-to-db') {
    return {
      toDisplay: (value) => (value > 0 ? 20 * Math.log10(value) : -120),
      label: (label) => (label.includes('dB') ? label : `${label} (dB)`),
    }
  }
  return { toDisplay: (value) => value, label: (label) => label }
}

/** Ordered unique panels/scenarios from rows, honouring a user order. */
function orderBy(list, order) {
  if (!Array.isArray(order) || order.length === 0) return list
  const rank = new Map(order.map((item, index) => [item, index]))
  return [...list].sort((a, b) => {
    const ra = rank.has(a) ? rank.get(a) : Number.MAX_SAFE_INTEGER
    const rb = rank.has(b) ? rank.get(b) : Number.MAX_SAFE_INTEGER
    return ra - rb
  })
}

function availableSteps(pointsByRun) {
  const set = new Set()
  for (const points of pointsByRun) for (const point of points) set.add(point.step)
  return [...set].sort((a, b) => a - b)
}

/** Pick evaluation checkpoints: explicit, early-dense, or evenly spaced. */
function pickCheckpoints(steps, spec) {
  const requested = spec?.data?.checkpoints
  if (Array.isArray(requested) && requested.length > 0) {
    return requested.filter((step) => steps.includes(step))
  }
  const count = Math.max(2, Math.min(10, spec?.data?.checkpointCount ?? 6))
  if (steps.length <= count) return steps
  if (spec?.data?.checkpointMode === 'log' && steps[0] > 0) {
    const lo = Math.log10(steps[0])
    const hi = Math.log10(steps[steps.length - 1])
    const picked = new Set()
    for (let i = 0; i < count; i += 1) {
      const target = 10 ** (lo + ((hi - lo) * i) / (count - 1))
      let best = steps[0]
      for (const step of steps) if (Math.abs(step - target) < Math.abs(best - target)) best = step
      picked.add(best)
    }
    return [...picked].sort((a, b) => a - b)
  }
  const picked = new Set()
  for (let i = 0; i < count; i += 1) {
    picked.add(steps[Math.round((i * (steps.length - 1)) / (count - 1))])
  }
  return [...picked].sort((a, b) => a - b)
}

function pointsByMethod(runRows) {
  const map = new Map()
  for (const run of runRows) {
    let entry = map.get(run.method)
    if (!entry) {
      entry = []
      map.set(run.method, entry)
    }
    entry.push(run.points)
  }
  return map
}

/**
 * Aggregate one step across trials, in the stored domain, then transform the
 * point and both interval endpoints for display.
 */
function aggregateAt(step, pointsByRun, transform, options) {
  const values = []
  for (const points of pointsByRun) {
    for (const point of points) if (point.step === step) values.push(point.value)
  }
  const estimateResult = estimate(values, { ...options, key: `${options.key}:${step}` })
  return {
    n: values.length,
    point: transform.toDisplay(estimateResult.point),
    lo: transform.toDisplay(estimateResult.lo),
    hi: transform.toDisplay(estimateResult.hi),
    raw: estimateResult.point,
  }
}

/**
 * Build the plot-ready series for one figure type. Returns panels with their
 * series, axes domains, and the metadata the QA report needs.
 */
export function buildFigure(spec, rows) {
  const type = spec.type
  const transform = domainTransform(spec)
  const statsOptions = {
    resamples: spec.stats?.resamples ?? 1000,
    seed: spec.stats?.seed ?? 20260830,
    statistic: spec.stats?.estimator === 'iqm' ? 'iqm' : 'mean',
  }
  const methodsOrdered = orderBy([...new Set(rows.map((row) => row.method))], spec.data?.methodOrder)
  const variantFilter = spec.data?.variant ?? (type === 'ablation' ? 'ablation' : type === 'sensitivity' ? 'sensitivity' : 'main')
  const scoped = rows.filter((row) => (variantFilter === 'all' ? true : row.variant === variantFilter))
  const source = scoped.length > 0 ? scoped : rows

  const runs = new Map()
  for (const row of source) {
    const key = [row.benchmark, row.scenario, row.method, row.seed].join('\u0001')
    let run = runs.get(key)
    if (!run) {
      run = { benchmark: row.benchmark, scenario: row.scenario, method: row.method, seed: row.seed, points: [] }
      runs.set(key, run)
    }
    run.points.push({ step: row.step, value: row.value })
  }
  for (const run of runs.values()) run.points.sort((a, b) => a.step - b.step)
  const runsList = [...runs.values()]
  const seedCount = new Set(source.map((row) => row.seed)).size

  const panels = []
  const summary = []

  if (type === 'scenario-curves' || type === 'ablation') {
    const scenarioKeys = []
    for (const run of runsList) {
      const label = `${run.benchmark} · ${run.scenario}`
      if (!scenarioKeys.includes(label)) scenarioKeys.push(label)
    }
    for (const label of orderBy(scenarioKeys, spec.data?.panelOrder)) {
      const [benchmark, scenario] = label.split(' · ')
      const panelRuns = runsList.filter((run) => run.benchmark === benchmark && run.scenario === scenario)
      const byMethod = pointsByMethod(panelRuns)
      const steps = availableSteps([...byMethod.values()].flat())
      const series = []
      for (const method of methodsOrdered) {
        const pointsByRun = byMethod.get(method)
        if (!pointsByRun) continue
        const aggregated = steps.map((step) => ({ step, ...aggregateAt(step, pointsByRun, transform, { ...statsOptions, key: label + method }) }))
        const displayed = aggregated.map((entry) => entry.point)
        const smoothed = smooth(displayed, spec.style?.smoothWindow ?? 1)
        series.push({
          method,
          steps,
          values: smoothed,
          lo: smooth(aggregated.map((entry) => entry.lo), spec.style?.smoothWindow ?? 1),
          hi: smooth(aggregated.map((entry) => entry.hi), spec.style?.smoothWindow ?? 1),
          final: aggregated[aggregated.length - 1],
        })
        summary.push({
          panel: label,
          method,
          step: aggregated[aggregated.length - 1].step,
          value: aggregated[aggregated.length - 1].point,
          ciLow: aggregated[aggregated.length - 1].lo,
          ciHigh: aggregated[aggregated.length - 1].hi,
          trials: aggregated[aggregated.length - 1].n,
        })
      }
      panels.push({ title: `${benchmark} · ${scenario}`, benchmark, scenario, steps, series, kind: 'curves' })
    }
  } else if (type === 'aggregate-iqm') {
    const benchmarks = orderBy([...new Set(runsList.map((run) => run.benchmark))], spec.data?.panelOrder)
    for (const benchmark of benchmarks) {
      const panelRuns = runsList.filter((run) => run.benchmark === benchmark)
      const byMethod = pointsByMethod(panelRuns)
      const steps = availableSteps([...byMethod.values()].flat())
      const checkpoints = pickCheckpoints(steps, spec)
      const series = []
      for (const method of methodsOrdered) {
        const pointsByRun = byMethod.get(method)
        if (!pointsByRun) continue
        const aggregated = checkpoints.map((step) =>
          aggregateAt(step, pointsByRun, transform, { ...statsOptions, statistic: 'iqm', key: `${benchmark}:${method}` }),
        )
        series.push({
          method,
          steps: checkpoints,
          values: aggregated.map((entry) => entry.point),
          lo: aggregated.map((entry) => entry.lo),
          hi: aggregated.map((entry) => entry.hi),
          final: aggregated[aggregated.length - 1],
        })
        summary.push({
          panel: benchmark,
          method,
          step: checkpoints[checkpoints.length - 1],
          value: aggregated[aggregated.length - 1].point,
          ciLow: aggregated[aggregated.length - 1].lo,
          ciHigh: aggregated[aggregated.length - 1].hi,
          trials: aggregated[aggregated.length - 1].n,
        })
      }
      const scenarioCount = new Set(panelRuns.map((run) => run.scenario)).size
      panels.push({
        title: `${scenarioCount} scenario${scenarioCount === 1 ? '' : 's'} in ${benchmark}`,
        benchmark,
        steps: checkpoints,
        series,
        kind: 'points',
      })
    }
  } else if (type === 'sensitivity') {
    const scenarioKeys = []
    for (const run of runsList) {
      const label = `${run.benchmark} · ${run.scenario}`
      if (!scenarioKeys.includes(label)) scenarioKeys.push(label)
    }
    for (const label of orderBy(scenarioKeys, spec.data?.panelOrder)) {
      const [benchmark, scenario] = label.split(' · ')
      const panelRuns = runsList.filter((run) => run.benchmark === benchmark && run.scenario === scenario)
      const byMethod = pointsByMethod(panelRuns)
      const steps = availableSteps([...byMethod.values()].flat())
      const series = []
      for (const method of methodsOrdered) {
        const pointsByRun = byMethod.get(method)
        if (!pointsByRun) continue
        const aggregated = steps.map((step) => ({ step, ...aggregateAt(step, pointsByRun, transform, { ...statsOptions, key: label + method }) }))
        series.push({
          method,
          steps,
          values: smooth(aggregated.map((entry) => entry.point), spec.style?.smoothWindow ?? 1),
          lo: smooth(aggregated.map((entry) => entry.lo), spec.style?.smoothWindow ?? 1),
          hi: smooth(aggregated.map((entry) => entry.hi), spec.style?.smoothWindow ?? 1),
          final: aggregated[aggregated.length - 1],
          reference: method.toLowerCase().includes('baseline'),
        })
      }
      panels.push({ title: `Sensitivity: ${scenario}`, benchmark, scenario, steps, series, kind: 'curves' })
    }
  } else if (type === 'mechanism') {
    const scenarioKeys = []
    for (const run of runsList) {
      const label = `${run.benchmark} · ${run.scenario}`
      if (!scenarioKeys.includes(label)) scenarioKeys.push(label)
    }
    for (const label of orderBy(scenarioKeys, spec.data?.panelOrder)) {
      const [benchmark, scenario] = label.split(' · ')
      const panelRows = source.filter((row) => row.benchmark === benchmark && row.scenario === scenario && row.heterogeneity !== null)
      if (panelRows.length === 0) continue
      const steps = [...new Set(panelRows.map((row) => row.step))].sort((a, b) => a - b)
      const series = []
      for (const method of methodsOrdered) {
        const methodRows = panelRows.filter((row) => row.method === method)
        if (methodRows.length === 0) continue
        const xs = []
        const ys = []
        for (const step of steps) {
          const pair = methodRows.filter((row) => row.step === step)
          if (pair.length === 0) continue
          xs.push(mean(pair.map((row) => row.heterogeneity)))
          ys.push(transform.toDisplay(mean(pair.map((row) => row.value))))
        }
        series.push({ method, steps, xs, values: ys, lo: ys.map((value) => value), hi: ys.map((value) => value), final: { point: ys[ys.length - 1] } })
      }
      panels.push({ title: `${benchmark} · ${scenario}`, benchmark, scenario, steps, series, kind: 'path', xLabel: 'Measured heterogeneity (a.u.)' })
    }
  }

  const first = source[0] ?? {}
  const present = new Set()
  for (const panel of panels) for (const series of panel.series) present.add(series.method)
  const presentMethods = methodsOrdered.filter((method) => present.has(method))
  for (const method of present) if (!presentMethods.includes(method)) presentMethods.push(method)
  return {
    type,
    panels,
    methods: presentMethods,
    seedCount,
    transform,
    metric: first.metric || '',
    unit: first.unit || '',
    summary,
    checkpoints: (panels[0]?.steps ?? []).slice(0, 12),
    usedRows: source.length,
    variant: variantFilter,
    statsOptions,
  }
}

/** Endpoint table as CSV for the machine-readable summary artifact. */
export function summaryCsv(figure) {
  const cell = (value) => {
    const text = String(value ?? '')
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
  }
  const lines = ['panel,method,step,value,ci_low,ci_high,trials']
  for (const row of figure.summary) {
    lines.push(
      [cell(row.panel), cell(row.method), row.step, round(row.value), round(row.ciLow), round(row.ciHigh), row.trials].join(','),
    )
  }
  return lines.join('\n')
}

function round(value) {
  return Number.isFinite(value) ? Number(value.toFixed(6)) : ''
}

export { mean, quantile }
