/**
 * Studio operations shared by the Web panel and the agent tool.
 *
 * One operation has one implementation here: the HTTP route and the tool are
 * two callers, so a UI action and a model action can never drift apart.
 */
import { randomUUID } from 'node:crypto'
import { buildFigure, parseAndValidate, summaryCsv } from './data.js'
import { demoCsv } from './demo.js'
import { renderFigure } from './render.js'
import {
  FIGURE_TYPES,
  PALETTES,
  RECIPES,
  defaultSpec,
  mergeSpec,
  applyRecipe,
  qualityReport,
} from './spec.js'
import {
  csvTooLarge,
  deleteProject,
  findProject,
  loadProjects,
  projectSummary,
  storageDir,
  trimVersions,
  upsertProject,
} from './store.js'

const auditCache = new Map()

function cachedAudit(project) {
  const cached = auditCache.get(project.id)
  if (cached && cached.updatedAt === project.updatedAt) return cached.audit
  const audit = parseAndValidate(project.csvText)
  auditCache.set(project.id, { updatedAt: project.updatedAt, audit })
  return audit
}

function requireProject(id) {
  const project = findProject(id)
  if (!project) throw new Error(`unknown figure project: ${id}`)
  return project
}

function auditView(audit) {
  return {
    summary: audit.summary,
    errors: audit.errors.slice(0, 50),
    warnings: audit.warnings.slice(0, 50),
    errorCount: audit.errors.length,
    warningCount: audit.warnings.length,
  }
}

function versionView(version) {
  return {
    id: version.id,
    label: version.label,
    note: version.note ?? '',
    createdAt: version.createdAt,
    recipe: version.recipe ?? null,
    score: version.score ?? null,
  }
}

function flatten(value, prefix, out) {
  if (value === null || typeof value !== 'object') {
    out[prefix] = value
    return out
  }
  if (Array.isArray(value)) {
    out[prefix] = value.length === 0 ? '[]' : value.join(', ')
    return out
  }
  for (const [key, child] of Object.entries(value)) flatten(child, prefix ? `${prefix}.${key}` : key, out)
  return out
}

function specDiff(from, to) {
  const before = flatten(from, '', {})
  const after = flatten(to, '', {})
  const changes = []
  const keys = new Set([...Object.keys(before), ...Object.keys(after)])
  for (const key of keys) {
    if (key.startsWith('version') || key.startsWith('engineVersion')) continue
    const a = before[key]
    const b = after[key]
    if (String(a) === String(b)) continue
    changes.push({ path: key, from: a ?? null, to: b ?? null })
  }
  return changes.slice(0, 40)
}

function nextVersionId(project) {
  let n = project.versions.length + 1
  const taken = new Set(project.versions.map((version) => version.id))
  while (taken.has(`v${n}`)) n += 1
  return `v${n}`
}

function pushVersion(project, { note, recipe }) {
  const spec = JSON.parse(JSON.stringify(project.spec))
  const version = {
    id: nextVersionId(project),
    label: `v${project.versions.length + 1}`,
    note: note ?? '',
    recipe: recipe ?? null,
    createdAt: Date.now(),
    spec,
  }
  project.versions.push(version)
  project.headVersionId = version.id
  trimVersions(project)
  return version
}

function buildDetail(project, versionId) {
  const audit = cachedAudit(project)
  const version = versionId ? project.versions.find((item) => item.id === versionId) : undefined
  const spec = version ? version.spec : project.spec
  let figure = null
  let render = null
  let qa = null
  if (audit.errors.length === 0 && audit.rows.length > 0) {
    figure = buildFigure(spec, audit.rows)
    render = renderFigure(spec, figure)
    qa = qualityReport({ spec, figure, audit, versions: project.versions.length, dark: spec.canvas.background === 'dark' })
  }
  return {
    project: { ...projectSummary(project), csvName: project.csvName, headVersionId: project.headVersionId },
    spec,
    previewVersionId: version?.id ?? null,
    audit: auditView(audit),
    figure: figure
      ? {
          type: figure.type,
          panels: figure.panels.map((panel) => panel.title),
          methods: figure.methods,
          seedCount: figure.seedCount,
          variant: figure.variant,
          rows: figure.usedRows,
          checkpoints: figure.checkpoints,
        }
      : null,
    qa,
    warnings: render?.warnings ?? [],
    svg: render?.svg ?? null,
    layout: render?.layout ?? null,
    history: project.versions.map(versionView),
  }
}

export function createStudio() {
  return {
    bootstrap() {
      return {
        types: FIGURE_TYPES,
        palettes: PALETTES,
        recipes: RECIPES.map(({ id, label, note }) => ({ id, label, note })),
        projects: loadProjects().map(projectSummary),
        defaults: defaultSpec('scenario-curves'),
        storage: storageDir(),
      }
    },

    list() {
      return { projects: loadProjects().map(projectSummary) }
    },

    open({ id }) {
      return buildDetail(requireProject(id))
    },

    create({ name, type, demo }) {
      const chosen = FIGURE_TYPES.some((item) => item.id === type) ? type : 'scenario-curves'
      const project = {
        id: randomUUID(),
        name: String(name ?? '').trim() || (demo ? 'Demo dataset' : 'Untitled figure'),
        type: chosen,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        csvName: demo ? 'synthetic-demo.csv' : '',
        csvText: demo ? demoCsv() : '',
        demo: demo === true,
        spec: defaultSpec(chosen),
        versions: [],
        headVersionId: null,
      }
      if (demo) pushVersion(project, { note: 'Initial demo figure' })
      project.updatedAt = Date.now()
      // Build the first view before persisting so a malformed create cannot
      // leave a half-made project behind.
      const detail = buildDetail(project)
      upsertProject(project)
      return detail
    },

    rename({ id, name }) {
      const project = requireProject(id)
      const trimmed = String(name ?? '').trim()
      if (!trimmed) throw new Error('a figure name cannot be empty')
      project.name = trimmed.slice(0, 120)
      upsertProject(project)
      return buildDetail(project)
    },

    setType({ id, type }) {
      const project = requireProject(id)
      if (!FIGURE_TYPES.some((item) => item.id === type)) throw new Error(`unknown figure type: ${type}`)
      project.type = type
      project.spec = mergeSpec(project.spec, {
        type,
        data: {
          variant: type === 'ablation' ? 'ablation' : type === 'sensitivity' ? 'sensitivity' : 'main',
        },
        stats: { estimator: type === 'aggregate-iqm' ? 'iqm' : 'mean' },
      })
      upsertProject(project)
      return buildDetail(project)
    },

    importCsv({ id, csvText, csvName, demo }) {
      const project = requireProject(id)
      const text = demo === true ? demoCsv() : String(csvText ?? '')
      if (!text.trim()) throw new Error('no CSV content was supplied')
      if (csvTooLarge(text)) throw new Error('CSV exceeds the 8 MB project limit; split the log first')
      const audit = parseAndValidate(text)
      project.csvText = text
      project.csvName = String(csvName ?? (demo ? 'synthetic-demo.csv' : 'upload.csv')).slice(0, 200)
      project.demo = demo === true
      upsertProject(project)
      auditCache.delete(project.id)
      return buildDetail(project)
    },

    setSpec({ id, patch, replace }) {
      const project = requireProject(id)
      if (!patch || typeof patch !== 'object') throw new Error('patch must be an object')
      const base = replace === true ? defaultSpec(patch.type ?? project.type) : project.spec
      project.spec = mergeSpec(base, patch)
      if (patch.type && FIGURE_TYPES.some((item) => item.id === patch.type)) project.type = patch.type
      upsertProject(project)
      return buildDetail(project)
    },

    resetSpec({ id, type }) {
      const project = requireProject(id)
      project.spec = defaultSpec(type ?? project.type)
      project.type = project.spec.type
      upsertProject(project)
      return buildDetail(project)
    },

    preview({ id, versionId }) {
      return buildDetail(requireProject(id), versionId)
    },

    optimize({ id, recipeId, note }) {
      const project = requireProject(id)
      const { spec, recipe } = applyRecipe(project.spec, recipeId)
      project.spec = spec
      project.type = spec.type
      pushVersion(project, { note: note ?? recipe.note, recipe: recipe.id })
      upsertProject(project)
      return buildDetail(project)
    },

    commit({ id, note }) {
      const project = requireProject(id)
      const version = pushVersion(project, { note: note ?? 'Manual checkpoint' })
      upsertProject(project)
      return { ...buildDetail(project), committed: versionView(version) }
    },

    rollback({ id, versionId }) {
      const project = requireProject(id)
      const version = project.versions.find((item) => item.id === versionId)
      if (!version) throw new Error(`unknown version: ${versionId}`)
      project.spec = JSON.parse(JSON.stringify(version.spec))
      project.type = project.spec.type
      const restored = pushVersion(project, { note: `Rolled back to ${version.id}${version.note ? ` — ${version.note}` : ''}` })
      upsertProject(project)
      return { ...buildDetail(project), restored: versionView(version), committed: versionView(restored) }
    },

    history({ id }) {
      const project = requireProject(id)
      return {
        projectId: project.id,
        headVersionId: project.headVersionId,
        versions: project.versions.map((version) => ({
          ...versionView(version),
          diff: specDiff(project.spec, version.spec),
        })),
      }
    },

    remove({ id }) {
      const project = requireProject(id)
      deleteProject(id)
      auditCache.delete(id)
      return { removed: project.id }
    },

    artifacts({ id, versionId }) {
      const project = requireProject(id)
      const detail = buildDetail(project, versionId)
      if (!detail.svg) throw new Error('this project has no valid figure yet; fix the log audit first')
      const spec = versionId ? project.versions.find((item) => item.id === versionId)?.spec : project.spec
      const audit = cachedAudit(project)
      const figure = buildFigure(spec, audit.rows)
      return {
        svg: detail.svg,
        csv: summaryCsv(figure),
        spec: JSON.stringify(spec, null, 2),
        qa: JSON.stringify(detail.qa, null, 2),
        name: project.name,
      }
    },

    qa({ id, versionId }) {
      const detail = buildDetail(requireProject(id), versionId)
      if (!detail.qa) throw new Error('no QA report: the log audit blocks rendering')
      return { qa: detail.qa, warnings: detail.warnings, audit: detail.audit }
    },
  }
}
