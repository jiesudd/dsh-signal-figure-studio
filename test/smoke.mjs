import assert from 'node:assert/strict'
import { parseAndValidate, buildFigure, summaryCsv } from '../lib/data.js'
import { defaultSpec, qualityReport, RECIPES, applyRecipe } from '../lib/spec.js'
import { renderFigure } from '../lib/render.js'
import { demoCsv } from '../lib/demo.js'

const TYPES = ['scenario-curves', 'aggregate-iqm', 'ablation', 'sensitivity', 'mechanism']

function assertCleanSvg(svg, label) {
  assert.ok(svg.startsWith('<svg'), `${label}: not an SVG document`)
  assert.ok(svg.trimEnd().endsWith('</svg>'), `${label}: unclosed SVG`)
  assert.ok(!/NaN|Infinity/.test(svg), `${label}: non-finite coordinate in the SVG`)
  assert.ok(!/undefined/.test(svg), `${label}: undefined leaked into the SVG`)
  return svg
}

// 1. The synthetic demo must pass the log contract with five trials.
const audit = parseAndValidate(demoCsv())
assert.equal(audit.errors.length, 0, `demo audit errors: ${audit.errors.map((error) => error.message).join('; ')}`)
assert.equal(audit.summary.seeds, 5)
assert.ok(audit.summary.rows > 6000)
console.log(`audit: ${audit.summary.rows} rows, ${audit.summary.scenarios} scenarios, ${audit.summary.seeds} trials`)

// 2. Every figure type renders a non-empty, finite SVG.
for (const type of TYPES) {
  const spec = defaultSpec(type)
  const figure = buildFigure(spec, audit.rows)
  assert.ok(figure.panels.length > 0, `${type}: no panels`)
  const rendered = renderFigure(spec, figure)
  assertCleanSvg(rendered.svg, type)
  const qa = qualityReport({ spec, figure, audit, versions: 1, dark: false })
  assert.ok(qa.total >= 18, `${type}: QA ${qa.total}/20 is below the publishable bar`)
  console.log(`${type.padEnd(16)} panels=${figure.panels.length} series=${figure.panels.reduce((n, panel) => n + panel.series.length, 0)} qa=${qa.total}/20`)
}

// 3. Style recipes keep the figure valid.
for (const recipe of RECIPES) {
  const spec = applyRecipe(defaultSpec('scenario-curves'), recipe.id).spec
  const rendered = renderFigure(spec, buildFigure(spec, audit.rows))
  assertCleanSvg(rendered.svg, `recipe ${recipe.id}`)
}
console.log(`recipes: ${RECIPES.length} applied`)

// 4. The summary table carries one row per endpoint.
const figure = buildFigure(defaultSpec('scenario-curves'), audit.rows)
const summary = summaryCsv(figure).split('\n')
assert.equal(summary.length - 1, figure.summary.length)
assert.ok(summary.length > 10)
console.log(`summary: ${summary.length - 1} endpoint rows`)

// 5. The log contract rejects bad input instead of plotting it.
const singleSeed = parseAndValidate('benchmark,scenario,method,seed,step,value\nA,B,m,1,0,1\nA,B,m,1,1,2')
assert.ok(singleSeed.errors.some((error) => error.kind === 'seed-count'), 'single-trial log was accepted')

const duplicate = parseAndValidate(
  'benchmark,scenario,method,seed,step,value\nA,B,m,1,0,1\nA,B,m,2,0,2\nA,B,m,3,0,3\nA,B,m,1,0,9',
)
assert.ok(duplicate.errors.some((error) => error.kind === 'duplicate-key'), 'duplicate key was accepted')

const mixedGrid = parseAndValidate(
  'benchmark,scenario,method,seed,step,value\nA,B,m,1,0,1\nA,B,m,1,1,2\nA,B,n,1,0,1\nA,B,n,1,2,2',
)
assert.ok(mixedGrid.errors.some((error) => error.kind === 'step-grid'), 'mixed step grid was accepted')
console.log('negative cases: single trial, duplicate key, mixed step grid all rejected')

console.log('SMOKE OK')
