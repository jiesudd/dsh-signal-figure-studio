/**
 * Deterministic SVG renderer for the figure studio.
 *
 * The SVG is a self-contained document: no external fonts, scripts, or
 * images. Sizes are expressed in inches at the root and laid out in a 96 px
 * per inch coordinate system, so typography is converted from points exactly.
 */
import { colorFor, dashFor, markerFor } from './spec.js'

const PX_PER_IN = 96
const PT_TO_PX = PX_PER_IN / 72

const THEME = {
  light: {
    background: '#FFFFFF',
    text: '#1B1F24',
    muted: '#5A6470',
    grid: '#E6E9ED',
    axis: '#2B3138',
    legendBackground: 'rgba(255,255,255,0.88)',
  },
  dark: {
    background: '#14181D',
    text: '#E8EAED',
    muted: '#A3ABB6',
    grid: '#2C343C',
    axis: '#C9D1DA',
    legendBackground: 'rgba(20,24,29,0.88)',
  },
}

const FONTS = {
  sans: "'Helvetica Neue', Helvetica, Arial, 'Segoe UI', sans-serif",
  serif: "'Times New Roman', Times, 'Nimbus Roman', serif",
  mono: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
}

const TITLES = {
  'scenario-curves': 'Per-scenario repeated-run comparison',
  'aggregate-iqm': 'Task-aggregated sample efficiency',
  ablation: 'Component ablation',
  sensitivity: 'Hyperparameter sensitivity',
  mechanism: 'Mechanism check',
}

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const clamp = (value, lo, hi) => Math.min(hi, Math.max(lo, value))

function textWidth(text, size, family) {
  const factor = family === 'serif' ? 0.5 : family === 'mono' ? 0.6 : 0.55
  return String(text).length * size * factor
}

/** Shrink then ellipsize a label so it never paints outside its box. */
function fitText(text, maxWidth, size, family) {
  const width = textWidth(text, size, family)
  if (!(maxWidth > 0) || width <= maxWidth) return { text: String(text), size }
  const scaled = Math.max(size * 0.72, size * (maxWidth / width))
  const factor = family === 'serif' ? 0.5 : family === 'mono' ? 0.6 : 0.55
  const maxChars = Math.max(4, Math.floor(maxWidth / (scaled * factor)))
  const source = String(text)
  const clipped = source.length > maxChars ? `${source.slice(0, Math.max(1, maxChars - 1)).trimEnd()}…` : source
  return { text: clipped, size: scaled }
}

function niceStep(raw) {
  if (!(raw > 0)) return 1
  const exponent = Math.floor(Math.log10(raw))
  const fraction = raw / 10 ** exponent
  const nice = fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10
  return nice * 10 ** exponent
}

function decimalsFor(step) {
  if (!(step > 0)) return 2
  const exponent = Math.floor(Math.log10(step))
  return clamp(-exponent, 0, 6)
}

function formatNumber(value, decimals) {
  if (!Number.isFinite(value)) return ''
  if (Math.abs(value) < 1e-12) return (0).toFixed(decimals)
  return value.toFixed(decimals)
}

function nextNiceStep(step) {
  const exponent = Math.floor(Math.log10(step) + 1e-9)
  const mantissa = step / 10 ** exponent
  if (mantissa < 1.5) return 2 * 10 ** exponent
  if (mantissa < 3) return 5 * 10 ** exponent
  if (mantissa < 7) return 10 * 10 ** exponent
  return 20 * 10 ** exponent
}

function linearTicks(min, max, count, sciMode) {
  let lo = min
  let hi = max
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return { ticks: [], exponent: null }
  if (lo === hi) {
    const delta = Math.abs(lo) * 0.1 || 1
    lo -= delta
    hi += delta
  }
  const limit = Math.max(2, Math.round(count))
  let step = niceStep((hi - lo) / Math.max(1, limit - 1))
  const build = (spacing) => {
    const start = Math.ceil(lo / spacing - 1e-9) * spacing
    const ticks = []
    for (let value = start; value <= hi + spacing * 1e-6; value += spacing) {
      ticks.push({ value, label: '' })
    }
    return ticks
  }
  let ticks = build(step)
  for (let guard = 0; ticks.length > limit + 1 && guard < 8; guard += 1) {
    step = nextNiceStep(step)
    ticks = build(step)
  }
  const maxAbs = Math.max(Math.abs(lo), Math.abs(hi))
  const auto = sciMode !== 'never' && (maxAbs >= 1e4 || (maxAbs > 0 && maxAbs < 1e-2))
  const exponent = auto ? Math.floor(Math.log10(maxAbs)) : null
  const scale = exponent === null ? 1 : 10 ** exponent
  const decimals = decimalsFor(step / scale)
  return { ticks: ticks.map((tick) => ({ value: tick.value, label: formatNumber(tick.value / scale, decimals) })), exponent }
}

function logTicks(min, max) {
  if (!(min > 0) || !(max > 0)) return { ticks: [], exponent: null }
  const lo = Math.floor(Math.log10(min))
  const hi = Math.ceil(Math.log10(max))
  const stride = hi - lo > 8 ? 2 : 1
  const ticks = []
  for (let exponent = lo; exponent <= hi; exponent += stride) {
    const value = 10 ** exponent
    if (value < min / 1.9 || value > max * 1.9) continue
    ticks.push({ value, label: `1e${exponent}` })
  }
  return { ticks, exponent: null }
}

function extent(values) {
  let lo = Infinity
  let hi = -Infinity
  for (const value of values) {
    if (!Number.isFinite(value)) continue
    if (value < lo) lo = value
    if (value > hi) hi = value
  }
  return { lo, hi }
}

function padDomain(lo, hi, ratio) {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return { lo: 0, hi: 1 }
  if (lo === hi) {
    const delta = Math.abs(lo) * 0.08 || 1
    return { lo: lo - delta, hi: hi + delta }
  }
  const pad = (hi - lo) * ratio
  return { lo: lo - pad, hi: hi + pad }
}

function thinTicks(axis, budget) {
  const ticks = axis.ticks ?? []
  if (ticks.length <= budget || budget < 2) return axis
  const stride = Math.ceil(ticks.length / budget)
  return { ...axis, ticks: ticks.filter((_, index) => index % stride === 0) }
}

function pathFromPoints(points) {
  let path = ''
  let open = false
  for (const point of points) {
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      open = false
      continue
    }
    path += `${open ? 'L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    open = true
  }
  return path
}

function bandPath(upper, lower) {
  let path = ''
  let started = false
  for (let i = 0; i < upper.length; i += 1) {
    const point = upper[i]
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue
    path += `${started ? 'L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`
    started = true
  }
  for (let i = lower.length - 1; i >= 0; i -= 1) {
    const point = lower[i]
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue
    path += `L${point.x.toFixed(2)} ${point.y.toFixed(2)}`
  }
  return started ? `${path}Z` : ''
}

/** Shrink a set of points to at most `limit` evenly spaced samples. */
function thin(items, limit) {
  if (items.length <= limit) return items.map((item) => item.index)
  const indexes = []
  for (let i = 0; i < limit; i += 1) indexes.push(Math.round((i * (items.length - 1)) / (limit - 1)))
  return [...new Set(indexes)]
}

function markerShape(kind, x, y, size, color) {
  const half = size
  switch (kind) {
    case 'square':
      return `<rect x="${(x - half).toFixed(2)}" y="${(y - half).toFixed(2)}" width="${(half * 2).toFixed(2)}" height="${(half * 2).toFixed(2)}" fill="${color}"/>`
    case 'triangle':
      return `<path d="M${x.toFixed(2)} ${(y - half * 1.2).toFixed(2)}L${(x + half * 1.1).toFixed(2)} ${(y + half).toFixed(2)}L${(x - half * 1.1).toFixed(2)} ${(y + half).toFixed(2)}Z" fill="${color}"/>`
    case 'triangle-down':
      return `<path d="M${x.toFixed(2)} ${(y + half * 1.2).toFixed(2)}L${(x + half * 1.1).toFixed(2)} ${(y - half).toFixed(2)}L${(x - half * 1.1).toFixed(2)} ${(y - half).toFixed(2)}Z" fill="${color}"/>`
    case 'diamond':
      return `<path d="M${x.toFixed(2)} ${(y - half * 1.3).toFixed(2)}L${(x + half * 1.2).toFixed(2)} ${y.toFixed(2)}L${x.toFixed(2)} ${(y + half * 1.3).toFixed(2)}L${(x - half * 1.2).toFixed(2)} ${y.toFixed(2)}Z" fill="${color}"/>`
    case 'cross':
      return `<path d="M${(x - half).toFixed(2)} ${(y - half).toFixed(2)}L${(x + half).toFixed(2)} ${(y + half).toFixed(2)}M${(x - half).toFixed(2)} ${(y + half).toFixed(2)}L${(x + half).toFixed(2)} ${(y - half).toFixed(2)}" stroke="${color}" stroke-width="1.2" fill="none"/>`
    default:
      return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${half.toFixed(2)}" fill="${color}"/>`
  }
}

/** Resolve the method legend order actually present in the figure. */
function legendMethods(figure, spec) {
  const present = new Set()
  for (const panel of figure.panels) for (const series of panel.series) present.add(series.method)
  const ordered = figure.methods.filter((method) => present.has(method))
  for (const method of present) if (!ordered.includes(method)) ordered.push(method)
  return ordered
}

function autoColumns(spec, count) {
  if (Number.isFinite(spec.layout.columns) && spec.layout.columns >= 1) return clamp(Math.round(spec.layout.columns), 1, 6)
  if (count <= 1) return 1
  if (spec.type === 'mechanism' || spec.type === 'aggregate-iqm') return Math.min(3, count)
  return Math.min(3, count)
}

/**
 * Render one figure from a spec and its prepared figure data.
 * Returns `{ svg, layout, warnings }`.
 */
export function renderFigure(spec, figure) {
  const dark = spec.canvas.background === 'dark'
  const theme = dark ? THEME.dark : THEME.light
  const family = spec.typography.family
  const fontFamily = FONTS[family] ?? FONTS.sans
  const warnings = []

  const px = (pt) => pt * PT_TO_PX
  let W = Math.max(240, Math.round(spec.canvas.widthIn * PX_PER_IN))
  let H = Math.max(180, Math.round(spec.canvas.heightIn * PX_PER_IN))
  const margin = spec.canvas.margins
  const titlePx = px(spec.typography.titleSize)
  const tickPx = px(spec.typography.tickSize)
  const labelPx = px(spec.typography.labelSize)
  const legendPx = px(spec.typography.legendSize)

  const methods = legendMethods(figure, spec)
  const panels = figure.panels
  if (panels.length === 0) {
    return { svg: emptyFigure(spec, theme, fontFamily, W, H), layout: null, warnings: ['no panel could be built from these rows'] }
  }

  const title = spec.labels.title === 'none' ? '' : spec.labels.title === 'auto' ? TITLES[figure.type] ?? '' : spec.labels.title

  // --- domains and ticks -------------------------------------------------
  const domains = panels.map((panel) => {
    const yValues = []
    const xValues = []
    for (const series of panel.series) {
      if (panel.kind === 'path') {
        for (const value of series.xs) xValues.push(value)
      } else {
        for (const step of series.steps) xValues.push(step)
      }
      for (const value of series.values) yValues.push(value)
      if (spec.style.uncertainty === 'band') {
        for (const value of series.lo) yValues.push(value)
        for (const value of series.hi) yValues.push(value)
      }
    }
    const isLog = spec.axes.xScale === 'log'
    const positiveX = xValues.every((value) => value > 0)
    if (isLog && !positiveX) warnings.push('log x-axis needs strictly positive steps; fell back to linear')
    const xExtent = extent(xValues)
    const yExtent = extent(yValues)
    const x = isLog && positiveX ? { lo: xExtent.lo, hi: xExtent.hi } : padDomain(xExtent.lo, xExtent.hi, spec.axes.xPadding ?? 0.02)
    let y = padDomain(yExtent.lo, yExtent.hi, 0.06)
    if (spec.axes.includeZero) y = { lo: Math.min(0, y.lo), hi: Math.max(0, y.hi) }
    return { x, y, logX: isLog && positiveX }
  })

  if (spec.axes.shareY) {
    const lo = Math.min(...domains.map((domain) => domain.y.lo))
    const hi = Math.max(...domains.map((domain) => domain.y.hi))
    for (const domain of domains) domain.y = { lo, hi }
  }

  const yAxisFor = (domain, count) => {
    const budget = Math.max(2, count)
    if (spec.axes.yScale === 'log' && domain.y.lo > 0) {
      const ticks = logTicks(domain.y.lo * 0.995, domain.y.hi * 1.005)
      return { ...thinTicks(ticks, budget), log: true }
    }
    if (spec.axes.yScale === 'log') warnings.push('log y-axis needs strictly positive values; panel fell back to linear')
    return { ...linearTicks(domain.y.lo, domain.y.hi, budget, spec.axes.sciNotation), log: false }
  }

  // --- geometry ----------------------------------------------------------
  const showTitle = title !== ''
  const titleBlock = showTitle ? titlePx * 1.9 : 0
  const gapX = spec.layout.gapX ?? 24
  const gapY = spec.layout.gapY ?? 28
  const noteItems = []
  if (spec.labels.bootstrapNote !== false && spec.style.uncertainty !== 'none') {
    noteItems.push(
      `${spec.stats.estimator === 'iqm' || figure.type === 'aggregate-iqm' ? 'IQM' : 'Mean'} with 95% bootstrap CI ` +
        `(${spec.stats.resamples} resamples, seed ${spec.stats.seed}); ${figure.seedCount} trial(s) per method.`,
    )
  }
  if (spec.style.smoothWindow > 1) {
    noteItems.push(`Display smoothed with a causal ${spec.style.smoothWindow}-point mean; statistics use unsmoothed values.`)
  }
  if (spec.labels.directionNote) {
    noteItems.push(spec.labels.direction === 'lower' ? 'Lower is better.' : 'Higher is better.')
  }
  if (spec.labels.smoothingNote && spec.style.smoothWindow <= 1) noteItems.push('No display smoothing applied.')
  const noteText = noteItems.join(' ')

  const legendHeight = legendPx * 1.7
  const MIN_PANEL_W = 125
  const MIN_PANEL_H = 150

  const planFor = (canvasW, canvasH, columns) => {
    const rows = Math.ceil(panels.length / columns)
    let contentLeft = margin.left
    let contentRight = canvasW - margin.right
    let contentTop = margin.top + titleBlock
    let contentBottom = canvasH - margin.bottom
    const noteLines = noteText ? wrapText(noteText, contentRight - contentLeft, tickPx * 0.92, family) : []
    const noteBlock = noteLines.length > 0 ? noteLines.length * tickPx * 1.55 + 2 : 0
    contentBottom -= noteBlock
    let legendBand = 0
    let legendRows = 0
    if (spec.layout.legend === 'above' || spec.layout.legend === 'below') {
      const available = contentRight - contentLeft
      const entryWidths = methods.map((method) => 22 + textWidth(method, legendPx, family) + 18)
      const total = entryWidths.reduce((sum, width) => sum + width, 0)
      legendRows = Math.max(1, Math.ceil(total / Math.max(120, available)))
      legendBand = legendRows * legendHeight + 6
      if (spec.layout.legend === 'above') contentTop += legendBand
      else contentBottom -= legendBand
    }
    let legendRightWidth = 0
    if (spec.layout.legend === 'right') {
      legendRightWidth = Math.max(...methods.map((method) => textWidth(method, legendPx, family))) + 34
      if (legendRightWidth > (contentRight - contentLeft) * 0.42) legendRightWidth = 0
    }
    const panelW = (contentRight - legendRightWidth - contentLeft - (columns - 1) * gapX) / columns
    const panelH = (contentBottom - contentTop - (rows - 1) * gapY) / rows
    return { columns, rows, panelW, panelH, contentLeft, contentRight, contentTop, contentBottom, legendBand, legendRows, legendRightWidth, noteLines, noteBlock }
  }

  let cols = autoColumns(spec, panels.length)
  while (cols > 1 && planFor(W, H, cols).panelW < MIN_PANEL_W) cols -= 1
  let plan = planFor(W, H, cols)
  if (plan.panelW < MIN_PANEL_W) {
    const needed = Math.ceil(plan.contentLeft + plan.legendRightWidth + cols * MIN_PANEL_W + (cols - 1) * gapX + margin.right)
    warnings.push(`canvas widened to ${(needed / PX_PER_IN).toFixed(1)} in so ${cols} column(s) stay legible`)
    W = Math.max(W, needed)
    plan = planFor(W, H, cols)
  }
  if (plan.panelH < MIN_PANEL_H) {
    const needed = Math.ceil(
      margin.top + margin.bottom + titleBlock + plan.legendBand + plan.noteBlock + plan.rows * MIN_PANEL_H + (plan.rows - 1) * gapY,
    )
    warnings.push(`canvas raised to ${(needed / PX_PER_IN).toFixed(1)} in so ${plan.rows} row(s) stay legible`)
    H = Math.max(H, needed)
    plan = planFor(W, H, cols)
  }
  if (plan.noteLines.length > 3) warnings.push('the figure note needs more than three lines; shorten the note or widen the canvas')

  const { rows, panelW, panelH, contentLeft, contentRight, contentTop, contentBottom, legendBand, legendRightWidth } = plan
  const noteLines = plan.noteLines
  const noteBlock = plan.noteBlock
  let legendRows = plan.legendRows

  const svg = []
  const uid = `f${hashSpec(spec, figure.type)}`
  svg.push(
    `<svg xmlns="http://www.w3.org/2000/svg" role="img" width="${(W / PX_PER_IN).toFixed(3)}in" height="${(H / PX_PER_IN).toFixed(3)}in" ` +
      `viewBox="0 0 ${W} ${H}" font-family="${esc(fontFamily)}" text-rendering="geometricPrecision">`,
  )
  svg.push(`<title>${esc(title || TITLES[figure.type] || 'Figure')}</title>`)
  svg.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="${theme.background}"/>`)

  if (showTitle) {
    const fittedTitle = fitText(title, W - margin.left - margin.right, titlePx, family)
    svg.push(
      `<text x="${W / 2}" y="${(margin.top + fittedTitle.size * 1.1).toFixed(2)}" text-anchor="middle" ` +
        `font-size="${fittedTitle.size.toFixed(2)}" fill="${theme.text}">${esc(fittedTitle.text)}</text>`,
    )
    if (spec.labels.subtitle) {
      const fittedSub = fitText(spec.labels.subtitle, W - margin.left - margin.right, tickPx * 1.05, family)
      svg.push(
        `<text x="${W / 2}" y="${(margin.top + titlePx * 2).toFixed(2)}" text-anchor="middle" ` +
          `font-size="${fittedSub.size.toFixed(2)}" fill="${theme.muted}">${esc(fittedSub.text)}</text>`,
      )
    }
  }

  // --- draw panels -------------------------------------------------------
  const axisLabels = {
    x: spec.axes.xLabel === 'auto' ? (figure.type === 'aggregate-iqm' ? 'Samples' : 'Samples') : spec.axes.xLabel,
    y:
      spec.axes.yLabel === 'auto'
        ? metricLabel(figure, spec)
        : spec.axes.yLabel,
  }
  if (figure.panels[0]?.kind === 'path' && spec.axes.xLabel === 'auto') axisLabels.x = figure.panels[0].xLabel ?? 'Mechanism variable'

  const panelBoxes = []
  const padTopGrid = spec.layout.panelTitles ? tickPx * 2.6 : tickPx * 0.8
  const padBottomGrid = tickPx * 2.7 + labelPx * 1.9
  const plotHeightEstimate = Math.max(30, panelH - padTopGrid - padBottomGrid)
  const gridYBudget = Math.max(2, Math.min((spec.axes.yTickCount ?? 5) + 1, Math.floor(plotHeightEstimate / (tickPx * 1.55))))
  const gridYAxes = domains.map((domain) => yAxisFor(domain, gridYBudget))
  const maxYLabelAll = gridYAxes.reduce(
    (width, axis) => axis.ticks.reduce((inner, tick) => Math.max(inner, textWidth(tick.label, tickPx, family)), width),
    0,
  )
  // Equal plot areas across the grid: reserve the y-label column and the x-label
  // row on every panel, then draw each title only where it belongs.
  const padLeftGrid = maxYLabelAll + labelPx * 1.9 + 6 + 10
  const padRightGrid = gridYAxes.some((axis) => axis.exponent !== null) ? tickPx * 2.4 : tickPx * 0.8
  panels.forEach((panel, index) => {
    const col = index % cols
    const row = Math.floor(index / cols)
    const cellX = contentLeft + col * (panelW + gapX)
    const cellY = contentTop + row * (panelH + gapY)
    const domain = domains[index]
    const isBottomRow = row === rows - 1 || index >= panels.length - cols
    const isLeftColumn = col === 0

    const yAxis = gridYAxes[index]
    const padLeft = padLeftGrid
    const padTop = spec.layout.panelTitles ? tickPx * 2.6 : tickPx * 0.8
    const padBottom = padBottomGrid
    const padRight = padRightGrid
    const rect = {
      x: cellX + padLeft,
      y: cellY + padTop,
      w: Math.max(20, panelW - padLeft - padRight),
      h: Math.max(20, panelH - padTop - padBottom),
    }
    panelBoxes.push(rect)

    const xAxisAuto = domain.logX ? logTicks(domain.x.lo, domain.x.hi) : linearTicks(domain.x.lo, domain.x.hi, spec.axes.xTickCount ?? 6, spec.axes.sciNotation)
    const widestXLabel = xAxisAuto.ticks.reduce((width, tick) => Math.max(width, textWidth(tick.label, tickPx, family)), 0)
    const xBudget = Math.max(2, Math.min((spec.axes.xTickCount ?? 6) + 1, Math.floor(rect.w / Math.max(18, widestXLabel + 12))))
    const xTicks = thinTicks(xAxisAuto, xBudget)
    const xScale = (value) =>
      domain.logX
        ? rect.x + ((Math.log10(value) - Math.log10(domain.x.lo)) / (Math.log10(domain.x.hi) - Math.log10(domain.x.lo))) * rect.w
        : rect.x + ((value - domain.x.lo) / (domain.x.hi - domain.x.lo)) * rect.w
    const yScaleLog = yAxis.log
    const yScale = (value) =>
      yScaleLog
        ? rect.y + rect.h - ((Math.log10(value) - Math.log10(domain.y.lo)) / (Math.log10(domain.y.hi) - Math.log10(domain.y.lo))) * rect.h
        : rect.y + rect.h - ((value - domain.y.lo) / (domain.y.hi - domain.y.lo)) * rect.h

    svg.push(`<g>`)
    svg.push(`<clipPath id="clip-${uid}-${index}"><rect x="${rect.x.toFixed(2)}" y="${rect.y.toFixed(2)}" width="${rect.w.toFixed(2)}" height="${rect.h.toFixed(2)}"/></clipPath>`)

    if (spec.style.grid === 'both' || spec.style.grid === 'x') {
      for (const tick of xTicks.ticks) {
        const position = xScale(tick.value)
        if (!Number.isFinite(position) || position < rect.x - 0.5 || position > rect.x + rect.w + 0.5) continue
        svg.push(`<line x1="${position.toFixed(2)}" y1="${rect.y.toFixed(2)}" x2="${position.toFixed(2)}" y2="${(rect.y + rect.h).toFixed(2)}" stroke="${spec.style.gridColor || theme.grid}" stroke-width="0.7"/>`)
      }
    }
    if (spec.style.grid === 'both' || spec.style.grid === 'y') {
      for (const tick of yAxis.ticks) {
        const position = yScale(tick.value)
        if (!Number.isFinite(position) || position < rect.y - 0.5 || position > rect.y + rect.h + 0.5) continue
        svg.push(`<line x1="${rect.x.toFixed(2)}" y1="${position.toFixed(2)}" x2="${(rect.x + rect.w).toFixed(2)}" y2="${position.toFixed(2)}" stroke="${spec.style.gridColor || theme.grid}" stroke-width="0.7"/>`)
      }
    }

    // axes
    const spines = spec.style.spines ?? 'left-bottom'
    if (spines !== 'none') {
      const parts = spines.split('-')
      if (parts.includes('left')) svg.push(`<line x1="${rect.x.toFixed(2)}" y1="${rect.y.toFixed(2)}" x2="${rect.x.toFixed(2)}" y2="${(rect.y + rect.h).toFixed(2)}" stroke="${theme.axis}" stroke-width="0.9"/>`)
      if (parts.includes('bottom')) svg.push(`<line x1="${rect.x.toFixed(2)}" y1="${(rect.y + rect.h).toFixed(2)}" x2="${(rect.x + rect.w).toFixed(2)}" y2="${(rect.y + rect.h).toFixed(2)}" stroke="${theme.axis}" stroke-width="0.9"/>`)
      if (parts.includes('top')) svg.push(`<line x1="${rect.x.toFixed(2)}" y1="${rect.y.toFixed(2)}" x2="${(rect.x + rect.w).toFixed(2)}" y2="${rect.y.toFixed(2)}" stroke="${theme.axis}" stroke-width="0.9"/>`)
      if (parts.includes('right')) svg.push(`<line x1="${(rect.x + rect.w).toFixed(2)}" y1="${rect.y.toFixed(2)}" x2="${(rect.x + rect.w).toFixed(2)}" y2="${(rect.y + rect.h).toFixed(2)}" stroke="${theme.axis}" stroke-width="0.9"/>`)
    }

    // tick marks + labels
    for (const tick of xTicks.ticks) {
      const position = xScale(tick.value)
      if (!Number.isFinite(position) || position < rect.x - 0.5 || position > rect.x + rect.w + 0.5) continue
      svg.push(`<line x1="${position.toFixed(2)}" y1="${(rect.y + rect.h).toFixed(2)}" x2="${position.toFixed(2)}" y2="${(rect.y + rect.h + 3).toFixed(2)}" stroke="${theme.axis}" stroke-width="0.8"/>`)
      if (isBottomRow) {
        svg.push(
          `<text x="${position.toFixed(2)}" y="${(rect.y + rect.h + tickPx * 1.9).toFixed(2)}" text-anchor="middle" ` +
            `font-size="${tickPx.toFixed(2)}" fill="${theme.muted}">${esc(tick.label)}</text>`,
        )
      }
    }
    if (xTicks.exponent !== null) {
      svg.push(
        `<text x="${(rect.x + rect.w).toFixed(2)}" y="${(rect.y + rect.h + tickPx * 3.5).toFixed(2)}" text-anchor="end" ` +
          `font-size="${(tickPx * 0.95).toFixed(2)}" fill="${theme.muted}">1e${xTicks.exponent}</text>`,
      )
    }
    for (const tick of yAxis.ticks) {
      const position = yScale(tick.value)
      if (!Number.isFinite(position) || position < rect.y - 0.5 || position > rect.y + rect.h + 0.5) continue
      svg.push(`<line x1="${(rect.x - 3).toFixed(2)}" y1="${position.toFixed(2)}" x2="${rect.x.toFixed(2)}" y2="${position.toFixed(2)}" stroke="${theme.axis}" stroke-width="0.8"/>`)
      svg.push(
        `<text x="${(rect.x - 6).toFixed(2)}" y="${(position + tickPx * 0.34).toFixed(2)}" text-anchor="end" ` +
          `font-size="${tickPx.toFixed(2)}" fill="${theme.muted}">${esc(tick.label)}</text>`,
      )
    }
    if (yAxis.exponent !== null) {
      svg.push(
        `<text x="${(rect.x - 2).toFixed(2)}" y="${(rect.y - 4).toFixed(2)}" text-anchor="end" ` +
          `font-size="${(tickPx * 0.95).toFixed(2)}" fill="${theme.muted}">1e${yAxis.exponent}</text>`,
      )
    }

    if (spec.layout.panelTitles && panel.title) {
      const fitted = fitText(panel.title, rect.w, tickPx * 1.1, family)
      svg.push(
        `<text x="${(rect.x + rect.w / 2).toFixed(2)}" y="${(rect.y - tickPx * 0.9).toFixed(2)}" text-anchor="middle" ` +
          `font-size="${fitted.size.toFixed(2)}" fill="${theme.text}">${esc(fitted.text)}</text>`,
      )
    }

    // series
    svg.push(`<g clip-path="url(#clip-${uid}-${index})">`)
    panel.series.forEach((series) => {
      const methodIndex = Math.max(0, figure.methods.indexOf(series.method))
      const color = colorFor(spec, series.method, methodIndex, dark)
      const dash = dashFor(spec, methodIndex)
      const marker = markerFor(spec, methodIndex)
      const lineWidth = spec.style.lineWidth
      if (panel.kind === 'path') {
        const points = series.xs.map((x, i) => ({ x: xScale(x), y: yScale(series.values[i]) }))
        svg.push(
          `<path d="${pathFromPoints(points)}" fill="none" stroke="${color}" stroke-width="${lineWidth}" ` +
            `stroke-dasharray="${dash}" stroke-linejoin="round" stroke-linecap="round"/>`,
        )
        const indexes = thin(points, spec.style.markerLimit ?? 10)
        for (const i of indexes) {
          const point = points[i]
          if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) continue
          svg.push(markerShape(marker === 'none' ? 'circle' : marker, point.x, point.y, spec.style.markerSize * 0.9, color))
        }
        return
      }
      const xPoints = series.steps.map((step) => xScale(step))
      const yPoints = series.values.map((value) => yScale(value))
      const points = xPoints.map((x, i) => ({ x, y: yPoints[i] }))
      if (spec.style.uncertainty === 'band') {
        const upper = xPoints.map((x, i) => ({ x, y: yScale(series.hi[i]) }))
        const lower = xPoints.map((x, i) => ({ x, y: yScale(series.lo[i]) }))
        const band = bandPath(upper, lower)
        if (band) svg.push(`<path d="${band}" fill="${color}" fill-opacity="${spec.style.bandAlpha}" stroke="none"/>`)
      }
      svg.push(
        `<path d="${pathFromPoints(points)}" fill="none" stroke="${color}" stroke-width="${lineWidth}" ` +
          `stroke-dasharray="${dash}" stroke-linejoin="round" stroke-linecap="round"/>`,
      )
      const showErrorBars = spec.style.uncertainty === 'errorbar'
      const markerEvery = Math.max(1, Math.ceil(points.length / 8))
      points.forEach((point, i) => {
        const atMarker = marker !== 'none' && (i % markerEvery === 0 || i === points.length - 1)
        if (atMarker && Number.isFinite(point.x) && Number.isFinite(point.y)) {
          svg.push(markerShape(marker, point.x, point.y, spec.style.markerSize, color))
        }
        if (showErrorBars && (i % markerEvery === 0 || i === points.length - 1) && Number.isFinite(point.y)) {
          const lo = yScale(series.lo[i])
          const hi = yScale(series.hi[i])
          if (Number.isFinite(lo) && Number.isFinite(hi) && Math.abs(hi - lo) > 0.4) {
            svg.push(
              `<path d="M${(point.x - 2).toFixed(2)} ${hi.toFixed(2)}L${(point.x + 2).toFixed(2)} ${hi.toFixed(2)}` +
                `M${point.x.toFixed(2)} ${hi.toFixed(2)}L${point.x.toFixed(2)} ${lo.toFixed(2)}` +
                `M${(point.x - 2).toFixed(2)} ${lo.toFixed(2)}L${(point.x + 2).toFixed(2)} ${lo.toFixed(2)}" ` +
                `stroke="${color}" stroke-width="0.9" fill="none"/>`,
            )
          }
        }
      })
    })
    svg.push(`</g>`)

    // axis titles
    if (isLeftColumn) {
      const fitted = fitText(axisLabels.y, rect.h + padTop * 0.6, labelPx, family)
      const labelX = rect.x - maxYLabelAll - 8 - labelPx * 0.9
      svg.push(
        `<text x="${labelX.toFixed(2)}" y="${(rect.y + rect.h / 2).toFixed(2)}" ` +
          `text-anchor="middle" transform="rotate(-90 ${labelX.toFixed(2)} ${(rect.y + rect.h / 2).toFixed(2)})" ` +
          `font-size="${fitted.size.toFixed(2)}" fill="${theme.text}">${esc(fitted.text)}</text>`,
      )
    }
    if (isBottomRow) {
      const fitted = fitText(axisLabels.x, rect.w + gapX * 0.8, labelPx, family)
      svg.push(
        `<text x="${(rect.x + rect.w / 2).toFixed(2)}" y="${(rect.y + rect.h + tickPx * 3.1 + labelPx * 1.2).toFixed(2)}" text-anchor="middle" ` +
          `font-size="${fitted.size.toFixed(2)}" fill="${theme.text}">${esc(fitted.text)}</text>`,
      )
    }
    svg.push(`</g>`)
  })

  // --- legend ------------------------------------------------------------
  const drawLegendRow = (x, y, method, index, font = legendPx, maxLabel = Number.POSITIVE_INFINITY) => {
    const color = colorFor(spec, method, index, dark)
    const dash = dashFor(spec, index)
    const marker = markerFor(spec, index)
    const swatchY = y - font * 0.32
    const fitted = fitText(method, maxLabel, font, family)
    svg.push(
      `<line x1="${x.toFixed(2)}" y1="${swatchY.toFixed(2)}" x2="${(x + 18).toFixed(2)}" y2="${swatchY.toFixed(2)}" stroke="${color}" ` +
        `stroke-width="${Math.max(1.1, spec.style.lineWidth * 0.9).toFixed(2)}" stroke-dasharray="${dash}"/>`,
    )
    if (marker !== 'none') svg.push(markerShape(marker, x + 9, swatchY, spec.style.markerSize * 0.85, color))
    svg.push(`<text x="${(x + 23).toFixed(2)}" y="${y.toFixed(2)}" font-size="${fitted.size.toFixed(2)}" fill="${theme.text}">${esc(fitted.text)}</text>`)
    return 23 + textWidth(fitted.text, fitted.size, family) + 14
  }

  const legendMode = spec.layout.legend
  if (legendMode === 'above' || legendMode === 'below') {
    const available = contentRight - contentLeft
    const entryWidths = methods.map((method) => 23 + textWidth(method, legendPx, family) + 14)
    const rowsOfEntries = []
    let current = []
    let width = 0
    methods.forEach((method, index) => {
      const entryWidth = entryWidths[index]
      if (current.length > 0 && width + entryWidth > available) {
        rowsOfEntries.push({ items: current, width })
        current = []
        width = 0
      }
      current.push({ method, index })
      width += entryWidth
    })
    if (current.length > 0) rowsOfEntries.push({ items: current, width })
    const bandTop = legendMode === 'above' ? contentTop - legendBand + 4 : contentBottom + 6
    rowsOfEntries.forEach((row, rowIndex) => {
      const y = bandTop + legendPx * 1.15 + rowIndex * legendHeight
      let x = contentLeft + Math.max(0, (available - row.width) / 2)
      for (const item of row.items) {
        x += drawLegendRow(x, y, item.method, item.index, legendPx, available - 40)
      }
    })
  } else if (legendMode === 'right' && legendRightWidth > 0) {
    const x = contentRight - legendRightWidth + 8
    let y = contentTop + legendPx * 1.1
    methods.forEach((method, index) => {
      drawLegendRow(x, y, method, index, legendPx, legendRightWidth - 34)
      y += legendHeight
    })
  } else if (legendMode === 'inside' && methods.length > 0) {
    const box = panelBoxes[0]
    let font = legendPx
    const naturalLabel = Math.max(...methods.map((method) => textWidth(method, font, family)))
    let columns = spec.layout.legendColumns >= 1 ? spec.layout.legendColumns : Math.min(2, methods.length)
    columns = Math.max(1, Math.min(columns, methods.length))
    let rowCount = Math.ceil(methods.length / columns)
    const maxRows = Math.max(1, Math.floor((box.h - 10) / (font * 1.7)))
    while (rowCount > maxRows && columns < methods.length) {
      columns += 1
      rowCount = Math.ceil(methods.length / columns)
    }
    // Last resort: shrink the legend type so a very short panel still gets one.
    while (rowCount * font * 1.7 + 6 > box.h - 8 && font > 4) {
      font *= 0.92
      rowCount = Math.ceil(methods.length / columns)
    }
    const rowHeight = font * 1.7
    const entryWidth = naturalLabel * (font / legendPx) + 23 + 14
    const columnWidth = Math.min(entryWidth + 10, Math.max(40, (box.w - 14) / columns))
    const boxHeight = rowCount * rowHeight + 6
    const boxWidth = Math.min(columnWidth * columns + 8, box.w - 8)
    const corner = spec.layout.legendCorner ?? 'bottom-left'
    const boxX = corner.includes('right') ? box.x + box.w - boxWidth - 4 : box.x + 4
    const boxY = corner.includes('top') ? box.y + 4 : box.y + box.h - boxHeight - 4
    svg.push(
      `<rect x="${boxX.toFixed(2)}" y="${boxY.toFixed(2)}" width="${boxWidth.toFixed(2)}" height="${boxHeight.toFixed(2)}" ` +
        `rx="2" fill="${theme.legendBackground}" stroke="${theme.grid}" stroke-width="0.6"/>`,
    )
    methods.forEach((method, index) => {
      const col = Math.floor(index / rowCount)
      const row = index % rowCount
      drawLegendRow(boxX + 5 + col * columnWidth, boxY + rowHeight * (row + 0.8), method, index, font, columnWidth - 27)
    })
  }

  if (noteLines.length > 0) {
    const top = H - margin.bottom - noteBlock
    noteLines.forEach((line, index) => {
      svg.push(
        `<text x="${margin.left}" y="${(top + tickPx * 1.2 + index * tickPx * 1.55).toFixed(2)}" font-size="${(tickPx * 0.92).toFixed(2)}" ` +
          `fill="${theme.muted}">${esc(line)}</text>`,
      )
    })
  }

  svg.push('</svg>')
  return {
    svg: svg.join(''),
    layout: { width: W, height: H, cols, rows, panels: panelBoxes, legendRows, legendRightWidth },
    warnings,
  }
}

function legendLerp(rowHeight, row) {
  return rowHeight * (row + 0.8)
}

/** Stable short id so two inline figures never share clip-path ids. */
function hashSpec(spec, type) {
  const text = `${type}|${JSON.stringify(spec)}`
  let hash = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

/** Greedy word wrap using the same width estimate as the layout. */
function wrapText(text, maxWidth, size, family) {
  const words = String(text).split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (line && textWidth(candidate, size, family) > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

function metricLabel(figure, spec) {
  const base = spec.labels.metric || figure.metric || 'Score'
  if (spec.data.transform === 'linear-to-db' || spec.data.transform === 'amplitude-to-db') {
    return base.toLowerCase().includes('db') ? base : `${base} (dB)`
  }
  if (spec.labels.unit) return `${base} (${spec.labels.unit})`
  return figure.unit ? `${base} (${figure.unit})` : base
}

function emptyFigure(spec, theme, fontFamily, W, H) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.canvas.widthIn}in" height="${spec.canvas.heightIn}in" ` +
    `viewBox="0 0 ${W} ${H}" font-family="${esc(fontFamily)}">` +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="${theme.background}"/>` +
    `<text x="${W / 2}" y="${H / 2}" text-anchor="middle" font-size="13" fill="${theme.muted}">` +
    'No panel matches this figure type and dataset</text></svg>'
  )
}
