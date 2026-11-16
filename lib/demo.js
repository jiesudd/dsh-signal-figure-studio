/**
 * Deterministic synthetic dataset for exercising the studio.
 *
 * This mirrors the workflow's `generate_demo_data.py`: clearly labelled fake
 * data with the same shape, never evidence for a scientific claim.
 */

const HEADER = ['benchmark', 'scenario', 'method', 'seed', 'step', 'value', 'metric', 'unit', 'variant', 'heterogeneity']

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

function makeRandom(seed) {
  const random = mulberry32(seed)
  let spare = null
  return {
    uniform: (a, b) => a + (b - a) * random(),
    gauss: (mu, sigma) => {
      if (spare !== null) {
        const value = spare
        spare = null
        return mu + sigma * value
      }
      let u = 0
      let v = 0
      while (u === 0) u = random()
      while (v === 0) v = random()
      const magnitude = Math.sqrt(-2 * Math.log(u))
      spare = magnitude * Math.sin(2 * Math.PI * v)
      return mu + sigma * magnitude * Math.cos(2 * Math.PI * v)
    },
  }
}

const BENCHMARKS = {
  Kinematic: ['Chirp tracking', 'Step response'],
  'Noisy channel': ['Low SNR', 'Burst noise'],
  'Array sensing': ['Sparse targets', 'Dense targets'],
}
const METHODS = ['Baseline-A', 'Baseline-B', 'Proposed-Pair', 'Proposed-Global']
const GAINS = { 'Baseline-A': 0.62, 'Baseline-B': 0.73, 'Proposed-Pair': 0.86, 'Proposed-Global': 0.95 }

export function demoCsv() {
  const rng = makeRandom(20260830)
  const rows = []
  let benchmarkIndex = 0
  for (const [benchmark, scenarios] of Object.entries(BENCHMARKS)) {
    scenarios.forEach((scenario, scenarioIndex) => {
      METHODS.forEach((method, methodIndex) => {
        for (let seed = 0; seed < 5; seed += 1) {
          const phase = rng.uniform(-0.15, 0.15)
          const scale = 1 + 0.08 * benchmarkIndex + 0.04 * scenarioIndex
          for (let k = 0; k < 41; k += 1) {
            const x = k * 2500
            const learn = 1 - Math.exp(-k / (9.5 + methodIndex))
            const ripple = 0.035 * Math.sin(0.48 * k + phase + methodIndex)
            const y = scale * (GAINS[method] * learn + ripple) + rng.gauss(0, 0.028 + 0.005 * methodIndex)
            const heterogeneity =
              (0.22 + 0.13 * methodIndex) * (1 - Math.exp(-k / 7)) * Math.exp(-k / 95) + rng.gauss(0, 0.01)
            rows.push([
              benchmark,
              scenario,
              method,
              seed,
              x,
              Math.max(0, y).toFixed(6),
              'normalized score',
              'a.u.',
              'main',
              Math.max(0, heterogeneity).toFixed(6),
            ])
          }
        }
      })
    })
    benchmarkIndex += 1
  }

  const ablation = {
    'No incentive': 0.58,
    Entropy: 0.66,
    'KL divergence': 0.72,
    'Pairwise divergence': 0.86,
    'Global divergence': 0.95,
  }
  ;['Kinematic aggregate', 'Channel aggregate', 'Array aggregate'].forEach((scenario, scenarioIndex) => {
    Object.entries(ablation).forEach(([method, gain], methodIndex) => {
      for (let seed = 0; seed < 5; seed += 1) {
        for (let k = 0; k < 9; k += 1) {
          const x = k * 12500
          const y = (1 + 0.06 * scenarioIndex) * gain * (1 - Math.exp(-k / (2.5 + 0.15 * methodIndex))) + rng.gauss(0, 0.025)
          rows.push(['Ablation', scenario, method, seed, x, Math.max(0, y).toFixed(6), 'IQM normalized score', 'a.u.', 'ablation', ''])
        }
      }
    })
  })

  const sensitivity = {
    lambda: [
      ['0.1', 0.91],
      ['0.2', 0.96],
      ['0.5', 0.88],
      ['baseline', 0.68],
    ],
    sigma: [
      ['1e3', 0.9],
      ['2e3', 0.96],
      ['5e3', 0.86],
      ['baseline', 0.68],
    ],
  }
  for (const [scenario, settings] of Object.entries(sensitivity)) {
    settings.forEach(([method, gain], methodIndex) => {
      for (let seed = 0; seed < 5; seed += 1) {
        for (let k = 0; k < 21; k += 1) {
          const x = k * 5000
          const y = gain * (1 - Math.exp(-k / (5.2 + 0.2 * methodIndex))) + rng.gauss(0, 0.025)
          rows.push(['Sensitivity', scenario, method, seed, x, Math.max(0, y).toFixed(6), 'normalized score', 'a.u.', 'sensitivity', ''])
        }
      }
    })
  }

  return [HEADER.join(','), ...rows.map((row) => row.join(','))].join('\n')
}
