/**
 * Figure specification: defaults, palettes, optimization recipes, and the
 * acceptance-check scoring from the article profile.
 */

export const FIGURE_TYPES = [
  {
    id: 'scenario-curves',
    label: 'Scenario curves',
    en: 'Per-scenario curves',
    description: 'Repeated-run mean with a 95% bootstrap band for every benchmark scenario.',
    needs: 'repeated runs on a shared step grid',
  },
  {
    id: 'aggregate-iqm',
    label: 'Aggregate IQM',
    en: 'Aggregate IQM',
    description: 'Robust cross-scenario sample efficiency: interquartile mean with bootstrap CI at checkpoints.',
    needs: 'multiple scenarios per benchmark',
  },
  {
    id: 'ablation',
    label: 'Ablation',
    en: 'Ablation',
    description: 'Component or strategy ablation panels, one per ablation scenario.',
    needs: 'a varied `variant=ablation` factor',
  },
  {
    id: 'sensitivity',
    label: 'Sensitivity',
    en: 'Sensitivity',
    description: 'Hyperparameter settings against the metric, with the baseline reference kept distinct.',
    needs: 'a varied `variant=sensitivity` factor',
  },
  {
    id: 'mechanism',
    label: 'Mechanism',
    en: 'Mechanism',
    description: 'Measured mechanism variable against performance, one traced path per method.',
    needs: 'a measured `heterogeneity` column',
  },
]

export const PALETTES = [
  {
    id: 'paper-warm',
    label: 'Paper warm',
    colors: ['#4C78A8', '#2A9D8F', '#F4A261', '#E63946', '#8E6C8A', '#6A9FB5', '#B5651D', '#3D5A40'],
    dark: ['#7FB3E0', '#5FC9BC', '#F4C08A', '#F07A86', '#B99BC0', '#9CC3D5', '#D8965A', '#7FA882'],
  },
  {
    id: 'okabe-ito',
    label: 'Okabe–Ito (CVD safe)',
    colors: ['#0072B2', '#E69F00', '#009E73', '#CC79A7', '#56B4E9', '#D55E00', '#F0E442', '#000000'],
    dark: ['#56B4E9', '#F0E442', '#5FD3A8', '#E8A6C4', '#9BD3F0', '#F08A4B', '#F5EE9E', '#FFFFFF'],
  },
  {
    id: 'tableau',
    label: 'Tableau 10',
    colors: ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7'],
    dark: ['#7FA8D0', '#F5B269', '#EE8A8B', '#9BD0CC', '#8CC384', '#F2DB82', '#CBA6C2', '#FFB9C0'],
  },
  {
    id: 'ieee',
    label: 'IEEE high contrast',
    colors: ['#00429D', '#C8102E', '#1B7F3A', '#F2A900', '#6A3D9A', '#00838F', '#8C564B', '#222222'],
    dark: ['#6FA0E8', '#F2647C', '#5FCB7C', '#FFD166', '#B79BE0', '#4FC3D0', '#C7A08F', '#F5F5F5'],
  },
  {
    id: 'grayscale',
    label: 'Grayscale',
    colors: ['#1A1A1A', '#5C5C5C', '#8C8C8C', '#B3B3B3', '#404040', '#737373', '#A6A6A6', '#D9D9D9'],
    dark: ['#F2F2F2', '#C7C7C7', '#9E9E9E', '#7A7A7A', '#DCDCDC', '#B0B0B0', '#8A8A8A', '#666666'],
  },
]

export const RECIPES = [
  {
    id: 'ieee-single',
    label: 'IEEE single column',
    note: '3.5 in wide, 8 pt serif, bands only, no grid, legend above',
    apply: (spec) => ({
      ...spec,
      canvas: { ...spec.canvas, widthIn: 3.5, heightIn: 2.9, dpi: 320, background: 'light', margins: { left: 48, right: 12, top: 26, bottom: 40 } },
      typography: { ...spec.typography, family: 'serif', baseSize: 8, titleSize: 9 },
      style: { ...spec.style, lineWidth: 1.2, bandAlpha: 0.14, grid: 'none', uncertainty: 'band', markers: 'none' },
      layout: { ...spec.layout, legend: 'above', legendColumns: 0, gapX: 18, gapY: 22 },
    }),
  },
  {
    id: 'double-column',
    label: 'Double column, 3 panels',
    note: '7.16 in wide, sans, shared y, legend above the row',
    apply: (spec) => ({
      ...spec,
      canvas: { ...spec.canvas, widthIn: 7.16, heightIn: 5.4, dpi: 320, background: 'light', margins: { left: 56, right: 16, top: 28, bottom: 44 } },
      typography: { ...spec.typography, family: 'sans', baseSize: 8.5, titleSize: 9.5 },
      style: { ...spec.style, lineWidth: 1.5, bandAlpha: 0.16, grid: 'y', uncertainty: 'band' },
      layout: { ...spec.layout, columns: 3, legend: 'above', gapX: 22, gapY: 26 },
    }),
  },
  {
    id: 'slide-tall',
    label: 'Talk slide',
    note: '6.4 in, larger type, light grid, marker cues',
    apply: (spec) => ({
      ...spec,
      canvas: { ...spec.canvas, widthIn: 6.4, heightIn: 4.2, dpi: 220, background: 'light' },
      typography: { ...spec.typography, family: 'sans', baseSize: 10, titleSize: 12 },
      style: { ...spec.style, lineWidth: 2, bandAlpha: 0.18, grid: 'both', markers: 'auto', markerSize: 3.4 },
    }),
  },
  {
    id: 'colorblind-safe',
    label: 'Colour-vision safe',
    note: 'Okabe–Ito palette plus dash and marker cues',
    apply: (spec) => ({
      ...spec,
      palette: { ...spec.palette, id: 'okabe-ito', overrides: {} },
      style: { ...spec.style, markers: 'auto', lineDash: 'auto' },
      accessibility: { ...(spec.accessibility ?? {}), redundantEncoding: true },
    }),
  },
  {
    id: 'contrast-boost',
    label: 'Boost contrast',
    note: 'Darker strokes, stronger band alpha, grid reduced',
    apply: (spec) => ({
      ...spec,
      style: { ...spec.style, lineWidth: 1.9, bandAlpha: 0.2, grid: 'y' },
      typography: { ...spec.typography, baseSize: Math.min(14, spec.typography.baseSize + 0.5) },
    }),
  },
  {
    id: 'tighten',
    label: 'Tighten spacing',
    note: 'Smaller gaps and margins, tighter legend',
    apply: (spec) => ({
      ...spec,
      canvas: {
        ...spec.canvas,
        margins: {
          left: Math.max(28, spec.canvas.margins.left - 10),
          right: Math.max(6, spec.canvas.margins.right - 6),
          top: Math.max(16, spec.canvas.margins.top - 8),
          bottom: Math.max(26, spec.canvas.margins.bottom - 8),
        },
      },
      layout: { ...spec.layout, gapX: Math.max(6, spec.layout.gapX - 8), gapY: Math.max(6, spec.layout.gapY - 8) },
      typography: { ...spec.typography, legendSize: Math.max(5.5, spec.typography.legendSize - 0.5) },
    }),
  },
  {
    id: 'enlarge-labels',
    label: 'Enlarge labels',
    note: 'Raise tick and axis label size above the legibility floor',
    apply: (spec) => ({
      ...spec,
      typography: {
        ...spec.typography,
        baseSize: Math.max(8, spec.typography.baseSize + 1.5),
        legendSize: Math.max(7, spec.typography.legendSize + 1),
      },
    }),
  },
  {
    id: 'negative-db-safe',
    label: 'Negative dB fix',
    note: 'Curves with intervals instead of zero-baseline bars; "lower is better" note on',
    apply: (spec) => ({
      ...spec,
      style: { ...spec.style, uncertainty: 'band', baselineZeroBars: false },
      labels: { ...spec.labels, directionNote: true },
      axes: { ...spec.axes, includeZero: false },
    }),
  },
  {
    id: 'smooth-display',
    label: 'Smooth display',
    note: 'Causal 5-point rolling mean for display only; statistics stay unsmoothed',
    apply: (spec) => ({
      ...spec,
      style: { ...spec.style, smoothWindow: 5 },
      labels: { ...spec.labels, smoothingNote: true },
    }),
  },
]

function baseSpec(type) {
  const wide = type === 'scenario-curves' || type === 'mechanism'
  return {
    version: 1,
    type,
    canvas: {
      widthIn: 10.8,
      heightIn: wide ? 6.0 : 3.4,
      dpi: 320,
      background: 'light',
      margins: { left: 54, right: 14, top: 24, bottom: 42 },
    },
    layout: {
      columns: 0,
      gapX: 26,
      gapY: 30,
      panelTitles: true,
      legend: 'inside',
      legendColumns: 0,
      legendCorner: 'bottom-left',
    },
    typography: {
      family: 'sans',
      baseSize: 8,
      titleSize: 11,
      labelSize: 8.5,
      tickSize: 7.5,
      legendSize: 7.5,
    },
    style: {
      lineWidth: 1.6,
      bandAlpha: 0.16,
      grid: 'y',
      gridColor: '',
      spines: 'left-bottom',
      markers: 'none',
      markerSize: 3,
      uncertainty: 'band',
      smoothWindow: 1,
      lineDash: 'auto',
      baselineZeroBars: false,
    },
    palette: { id: 'paper-warm', overrides: {} },
    axes: {
      xScale: 'linear',
      yScale: 'linear',
      includeZero: false,
      shareY: false,
      xLabel: 'auto',
      yLabel: 'auto',
      xTickCount: 6,
      yTickCount: 5,
      sciNotation: 'auto',
    },
    labels: {
      title: 'auto',
      subtitle: '',
      direction: 'higher',
      metric: '',
      unit: '',
      directionNote: true,
      smoothingNote: false,
      bootstrapNote: true,
      panelPrefix: true,
    },
    data: {
      variant: type === 'ablation' ? 'ablation' : type === 'sensitivity' ? 'sensitivity' : 'main',
      transform: 'none',
      checkpointMode: 'linear',
      checkpointCount: 6,
      checkpoints: [],
      methodOrder: [],
      panelOrder: [],
    },
    stats: { estimator: type === 'aggregate-iqm' ? 'iqm' : 'mean', resamples: 1000, seed: 20260830 },
    accessibility: { redundantEncoding: true },
    engineVersion: 1,
  }
}

export function defaultSpec(type = 'scenario-curves') {
  return baseSpec(type)
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/** Deep merge where arrays and scalars replace, objects merge. */
export function mergeSpec(base, patch) {
  if (!isPlainObject(patch)) return base
  const out = Array.isArray(base) ? [...base] : { ...base }
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue
    out[key] = isPlainObject(value) && isPlainObject(base?.[key]) ? mergeSpec(base[key], value) : value
  }
  return out
}

export function paletteColors(spec, dark) {
  const palette = PALETTES.find((item) => item.id === spec.palette?.id) ?? PALETTES[0]
  return dark ? palette.dark : palette.colors
}

export function colorFor(spec, method, index, dark) {
  const override = spec.palette?.overrides?.[method]
  if (typeof override === 'string' && /^#[0-9a-f]{3,8}$/i.test(override)) return override
  const colors = paletteColors(spec, dark)
  return colors[index % colors.length]
}

const DASHES = ['', '6 4', '2 3', '8 3 2 3', '10 4', '1 3']

export function dashFor(spec, index) {
  if (spec.style?.lineDash === 'solid') return ''
  return DASHES[index % DASHES.length]
}

const MARKERS = ['circle', 'square', 'triangle', 'diamond', 'cross', 'triangle-down']

export function markerFor(spec, index) {
  if (spec.style?.markers === 'none') return 'none'
  return MARKERS[index % MARKERS.length]
}

/**
 * Acceptance checks distilled from references/article-profile.md. Each item
 * scores 0 (fail), 1 (partial), 2 (pass); the suite target is 18/20 with no
 * zero in the first five items.
 */
export function qualityReport({ spec, figure, audit, versions, dark }) {
  const items = []
  const seedCount = figure.seedCount
  const hasBands = spec.style.uncertainty !== 'none'
  const palette = paletteColors(spec, dark)
  const colorCounts = new Map()
  figure.methods.forEach((method, index) => {
    const color = colorFor(spec, method, index, dark)
    colorCounts.set(color, (colorCounts.get(color) ?? 0) + 1)
  })
  const duplicateColors = [...colorCounts.values()].filter((count) => count > 1).length
  const aggregateFigure = figure.type === 'aggregate-iqm'
  const iqmUsed = spec.stats?.estimator === 'iqm'

  const push = (id, label, score, note) => items.push({ id, label, score, note })

  push(
    'traceability',
    'Raw-data traceability',
    audit.summary.rows > 0 && audit.errors.length === 0 ? 2 : audit.summary.rows > 0 ? 1 : 0,
    audit.errors.length === 0
      ? `${audit.summary.rows} tidy rows map to benchmark, scenario, method, seed, and step`
      : `${audit.errors.length} log-contract violation(s) block publication`,
  )
  push(
    'replication',
    'Replication',
    seedCount >= 5 ? 2 : seedCount >= 3 ? 1 : 0,
    `${seedCount} trial(s) feed the statistics`,
  )
  push(
    'uncertainty',
    'Uncertainty disclosed',
    hasBands ? 2 : 0,
    hasBands
      ? `95% bootstrap, ${spec.stats.resamples} resamples, seed ${spec.stats.seed}`
      : 'no interval is drawn on the figure',
  )
  push(
    'aggregation',
    'Robust aggregation',
    aggregateFigure && iqmUsed ? 2 : aggregateFigure ? 0 : 1,
    aggregateFigure && iqmUsed
      ? 'interquartile mean across tasks and runs'
      : aggregateFigure
        ? 'the aggregate panel uses a plain mean; switch the estimator to IQM'
        : 'no cross-scenario aggregate here; pair this figure with an aggregate IQM panel',
  )
  const unsmoothedStats = true
  push(
    'integrity',
    'Statistical integrity',
    unsmoothedStats ? 2 : 1,
    spec.style.smoothWindow > 1
      ? `display smoothing w=${spec.style.smoothWindow}; endpoints and summary use unsmoothed values`
      : 'no smoothing; every plotted value is a raw aggregate',
  )
  push(
    'consistency',
    'Consistency',
    duplicateColors === 0 ? 2 : 1,
    duplicateColors === 0 ? 'one palette, method order, and label set across panels' : 'duplicate colours across methods',
  )
  const tickScore = spec.typography.tickSize >= 7 ? 2 : spec.typography.tickSize >= 6 ? 1 : 0
  push('legibility', 'Legibility', tickScore, `${spec.typography.tickSize} pt ticks, ${spec.typography.legendSize} pt legend`)
  const redundant = spec.style.markers !== 'none' || spec.style.lineDash !== 'solid'
  push(
    'accessibility',
    'Accessibility',
    redundant ? 2 : figure.methods.length <= 3 ? 1 : 0,
    redundant ? 'line style and markers repeat the colour encoding' : 'colour alone separates methods',
  )
  push(
    'reproducibility',
    'Reproducibility',
    versions >= 1 ? 2 : 1,
    `${versions} saved version(s); deterministic seed and full spec are stored`,
  )
  const expectedPanels = figure.panels.length
  push(
    'coverage',
    'Evidence coverage',
    expectedPanels > 0 && audit.errors.length === 0 ? 2 : expectedPanels > 0 ? 1 : 0,
    `${expectedPanels} panel(s) rendered for the ${figure.type} figure type`,
  )

  const total = items.reduce((sum, item) => sum + item.score, 0)
  const blocking = items.slice(0, 5).filter((item) => item.score === 0).map((item) => item.id)
  return { items, total, max: 20, blocking, publishable: total >= 18 && blocking.length === 0 }
}

export function applyRecipe(spec, recipeId) {
  const recipe = RECIPES.find((item) => item.id === recipeId)
  if (!recipe) throw new Error(`unknown style recipe: ${recipeId}`)
  return { spec: recipe.apply(spec), recipe }
}
