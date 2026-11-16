/**
 * Host half of the Signal figure studio bundle.
 *
 * One studio service owns every operation. The Web panel reaches it through
 * the same-origin route below, and the agent reaches it through the
 * `signal_figure_studio` tool, so both callers share one implementation,
 * one version history, and one audit.
 */
import { createStudio } from './lib/studio.js'
import { FIGURE_TYPES } from './lib/spec.js'

const ROUTE_PATH = '/api/signal-figure-studio'
const MAX_BODY_BYTES = 12 * 1024 * 1024

export const inject = ['tools']

function isLoopbackAuthority(host) {
  if (typeof host !== 'string' || host === '') return false
  let hostname
  if (host.startsWith('[')) {
    const end = host.indexOf(']')
    if (end < 0) return false
    hostname = host.slice(0, end + 1)
  } else {
    hostname = host.split(':')[0]
  }
  return hostname === '127.0.0.1' || hostname === 'localhost' || hostname === '[::1]' || hostname === '::1'
}

function isAllowed(req) {
  if (!isLoopbackAuthority(req.headers.host)) return false
  const origin = req.headers.origin
  if (typeof origin === 'string' && origin !== '') {
    try {
      return new URL(origin).host === req.headers.host
    } catch {
      return false
    }
  }
  return true
}

function sendJson(res, status, value) {
  const body = JSON.stringify(value)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Length', Buffer.byteLength(body))
  res.end(body)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        reject(new Error('payload too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

/** Dispatch one studio operation by name; unknown methods fail loudly. */
function dispatch(studio, method, params) {
  const entries = {
    bootstrap: () => studio.bootstrap(),
    list: () => studio.list(),
    open: () => studio.open(params),
    create: () => studio.create(params),
    rename: () => studio.rename(params),
    set_type: () => studio.setType(params),
    import_csv: () => studio.importCsv(params),
    set_spec: () => studio.setSpec(params),
    reset_spec: () => studio.resetSpec(params),
    preview: () => studio.preview(params),
    optimize: () => studio.optimize(params),
    commit: () => studio.commit(params),
    rollback: () => studio.rollback(params),
    history: () => studio.history(params),
    remove: () => studio.remove(params),
    artifacts: () => studio.artifacts(params),
    qa: () => studio.qa(params),
  }
  if (!Object.hasOwn(entries, method)) throw new Error(`unknown studio method: ${method}`)
  return entries[method]()
}

function summarize(detail) {
  const parts = []
  const figure = detail.figure
  if (figure) {
    parts.push(
      `${figure.type}: ${figure.panels.length} panel(s), ${figure.methods.length} method(s), ${figure.seedCount} trial(s), ${figure.rows} rows`,
    )
  } else {
    parts.push('no figure yet')
  }
  if (detail.qa) parts.push(`QA ${detail.qa.total}/${detail.qa.max}${detail.qa.publishable ? ' (publishable)' : ''}`)
  if (detail.audit?.errorCount) parts.push(`${detail.audit.errorCount} log error(s)`)
  if (detail.warnings?.length) parts.push(`${detail.warnings.length} layout warning(s)`)
  return parts.join(' · ')
}

export function apply(ctx) {
  const studio = createStudio()

  ctx.inject(['webServer'], (webCtx) => {
    const handler = async (req, res) => {
      if (!isAllowed(req)) {
        sendJson(res, 403, { ok: false, error: 'forbidden' })
        return
      }
      const url = new URL(req.url ?? '/', `http://${req.headers.host ?? '127.0.0.1'}`)

      if (req.method === 'GET') {
        const projectId = url.searchParams.get('project')
        if (!projectId) {
          sendJson(res, 400, { ok: false, error: 'missing project parameter' })
          return
        }
        try {
          const versionId = url.searchParams.get('version') || undefined
          const detail = studio.preview({ id: projectId, versionId })
          if (!detail.svg) {
            sendJson(res, 409, { ok: false, error: 'figure is blocked by the log audit', audit: detail.audit })
            return
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.setHeader('Content-Length', Buffer.byteLength(detail.svg))
          res.end(detail.svg)
        } catch (error) {
          sendJson(res, 404, { ok: false, error: error instanceof Error ? error.message : String(error) })
        }
        return
      }

      if (req.method !== 'POST') {
        res.statusCode = 405
        res.setHeader('Allow', 'GET, POST')
        res.end()
        return
      }
      if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) {
        sendJson(res, 415, { ok: false, error: 'expected application/json' })
        return
      }
      try {
        const body = JSON.parse(await readBody(req))
        const result = dispatch(studio, body.method, body.params ?? {})
        sendJson(res, 200, { ok: true, result })
      } catch (error) {
        sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
      }
    }

    webCtx.effect(
      () => webCtx.webServer.register({ kind: 'exact', path: ROUTE_PATH, handler }),
      'signal-figure-studio: studio route',
    )
  })

  const parameterSchema = {
    type: 'object',
    additionalProperties: false,
    required: ['action'],
    properties: {
      action: {
        type: 'string',
        enum: [
          'bootstrap',
          'list',
          'open',
          'create',
          'import_csv',
          'set_type',
          'set_spec',
          'reset_spec',
          'preview',
          'optimize',
          'commit',
          'rollback',
          'history',
          'remove',
          'qa',
          'artifacts',
        ],
        description:
          'bootstrap lists figure types, palettes, style recipes, and projects. create makes a project. import_csv validates tidy logs. set_spec applies a JSON spec patch. optimize applies a style recipe and saves a version. rollback restores an earlier version. qa scores the ten acceptance checks. artifacts returns svg/summary/spec/qa text for export.',
      },
      projectId: { type: 'string', description: 'Project id from bootstrap/list/create/open.' },
      name: { type: 'string', description: 'Figure or project name.' },
      type: {
        type: 'string',
        enum: FIGURE_TYPES.map((item) => item.id),
        description: 'Figure type: scenario curves, aggregate IQM, ablation, sensitivity, or mechanism.',
      },
      csvPath: {
        type: 'string',
        description: 'Path to a tidy CSV in the session workspace; read through the filesystem service (preferred over csvText for large logs).',
      },
      csvText: { type: 'string', description: 'Inline tidy CSV content when no path is available.' },
      demo: { type: 'boolean', description: 'Use the clearly labelled synthetic dataset instead of real logs.' },
      patch: {
        type: 'object',
        description: 'Deep merge patch over the figure spec: canvas, layout, typography, style, palette, axes, labels, data, stats.',
        additionalProperties: true,
      },
      replace: { type: 'boolean', description: 'Replace the whole spec with the patch instead of merging it (used by undo).' },
      recipe: { type: 'string', description: 'Style recipe id from bootstrap, such as ieee-single or colorblind-safe.' },
      versionId: { type: 'string', description: 'Version id for rollback, preview, or artifacts.' },
      note: { type: 'string', description: 'Version note recorded in the history.' },
      includeSvg: { type: 'boolean', description: 'Include the rendered SVG text in artifacts (large).' },
    },
  }

  const tool = {
    name: 'signal_figure_studio',
    description:
      'Build paper figures from repeated-run signal experiments. Import tidy logs (benchmark, scenario, method, seed, step, value), pick a figure type, tune layout and palette, compare versions, and roll back. ' +
      'Every render validates the log contract (duplicate keys, non-finite values, non-monotone steps, fewer than three trials, inconsistent step grids) and reports the ten article-profile acceptance checks. ' +
      'The human can also open the Signal figure studio panel in the sidebar to do the same work visually.',
    parameters: parameterSchema,
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        required: ['ok', 'message', 'data'],
        properties: {
          ok: { type: 'boolean', description: 'Whether the operation succeeded.' },
          message: { type: 'string', description: 'One-line result summary.' },
          data: { type: 'string', description: 'Compact JSON payload of the operation result.' },
        },
      },
      render: (_args, value) => [{ type: 'text', text: `${value.message}\n\n${value.data}` }],
    },
    async execute(args, exec) {
      const action = args.action
      if (action === 'bootstrap') {
        const result = studio.bootstrap()
        return {
          ok: true,
          message: `Signal figure studio: ${result.types.length} figure types, ${result.recipes.length} style recipes, ${result.projects.length} project(s).`,
          data: JSON.stringify({
            types: result.types.map((item) => ({ id: item.id, label: item.label, needs: item.needs })),
            recipes: result.recipes,
            palettes: result.palettes.map((item) => ({ id: item.id, label: item.label })),
            projects: result.projects.map((item) => ({ id: item.id, name: item.name, type: item.type, versions: item.versions })),
          }),
        }
      }

      if (action === 'list') {
        const result = studio.list()
        return {
          ok: true,
          message: `${result.projects.length} figure project(s).`,
          data: JSON.stringify({
            projects: result.projects.map((item) => ({
              id: item.id,
              name: item.name,
              type: item.type,
              versions: item.versions,
              demo: item.demo,
            })),
          }),
        }
      }

      if (action === 'create') {
        let csvText = args.csvText
        let csvName = 'upload.csv'
        if (typeof args.csvPath === 'string' && args.csvPath.trim() !== '') {
          const loaded = await readCsv(ctx, exec, args.csvPath)
          csvText = loaded.text
          csvName = loaded.name
        }
        const created = studio.create({ name: args.name, type: args.type, demo: args.demo === true })
        let detail = created
        if (csvText) detail = studio.importCsv({ id: created.project.id, csvText, csvName })
        return {
          ok: true,
          message: `Created "${detail.project.name}" (${detail.project.type}) · ${summarize(detail)}`,
          data: JSON.stringify({
            projectId: detail.project.id,
            type: detail.project.type,
            audit: detail.audit,
            figure: detail.figure,
            qa: detail.qa,
            warnings: detail.warnings,
            versions: detail.history,
          }),
        }
      }

      if (action === 'import_csv') {
        const projectId = requireId(args.projectId, 'import_csv')
        let csvText = args.csvText
        let csvName = 'upload.csv'
        if (typeof args.csvPath === 'string' && args.csvPath.trim() !== '') {
          const loaded = await readCsv(ctx, exec, args.csvPath)
          csvText = loaded.text
          csvName = loaded.name
        }
        if (!csvText) throw new Error('import_csv needs csvPath or csvText')
        const detail = studio.importCsv({ id: projectId, csvText, csvName, demo: args.demo === true })
        return {
          ok: true,
          message: `Imported ${detail.audit.summary.rows} rows · ${summarize(detail)}`,
          data: JSON.stringify({
            projectId,
            audit: detail.audit,
            figure: detail.figure,
            qa: detail.qa,
            warnings: detail.warnings,
          }),
        }
      }

      if (action === 'open' || action === 'preview') {
        const projectId = requireId(args.projectId, action)
        const detail = studio.preview({ id: projectId, versionId: args.versionId })
        return {
          ok: true,
          message: `${detail.project.name} · ${summarize(detail)}`,
          data: JSON.stringify({
            projectId,
            name: detail.project.name,
            type: detail.project.type,
            spec: detail.spec,
            audit: detail.audit,
            figure: detail.figure,
            qa: detail.qa,
            warnings: detail.warnings,
            versions: detail.history,
          }),
        }
      }

      if (action === 'set_type') {
        const projectId = requireId(args.projectId, 'set_type')
        const detail = studio.setType({ id: projectId, type: args.type })
        return {
          ok: true,
          message: `Figure type is now ${detail.project.type} · ${summarize(detail)}`,
          data: JSON.stringify({ projectId, type: detail.project.type, figure: detail.figure, qa: detail.qa, warnings: detail.warnings }),
        }
      }

      if (action === 'set_spec') {
        const projectId = requireId(args.projectId, 'set_spec')
        if (!args.patch || typeof args.patch !== 'object') throw new Error('set_spec needs a patch object')
        const detail = studio.setSpec({ id: projectId, patch: args.patch, replace: args.replace === true })
        return {
          ok: true,
          message: `Updated layout/style · ${summarize(detail)}`,
          data: JSON.stringify({ projectId, spec: detail.spec, figure: detail.figure, qa: detail.qa, warnings: detail.warnings }),
        }
      }

      if (action === 'reset_spec') {
        const projectId = requireId(args.projectId, 'reset_spec')
        const detail = studio.resetSpec({ id: projectId, type: args.type })
        return { ok: true, message: `Reset the figure spec · ${summarize(detail)}`, data: JSON.stringify({ projectId, spec: detail.spec }) }
      }

      if (action === 'optimize') {
        const projectId = requireId(args.projectId, 'optimize')
        if (!args.recipe) throw new Error('optimize needs a recipe id')
        const detail = studio.optimize({ id: projectId, recipeId: args.recipe, note: args.note })
        return {
          ok: true,
          message: `Applied "${args.recipe}" and saved ${detail.project.headVersionId} · ${summarize(detail)}`,
          data: JSON.stringify({
            projectId,
            versionId: detail.project.headVersionId,
            spec: detail.spec,
            qa: detail.qa,
            warnings: detail.warnings,
            versions: detail.history,
          }),
        }
      }

      if (action === 'commit') {
        const projectId = requireId(args.projectId, 'commit')
        const detail = studio.commit({ id: projectId, note: args.note })
        return {
          ok: true,
          message: `Saved ${detail.committed?.id} · ${summarize(detail)}`,
          data: JSON.stringify({ projectId, versionId: detail.committed?.id, versions: detail.history }),
        }
      }

      if (action === 'rollback') {
        const projectId = requireId(args.projectId, 'rollback')
        if (!args.versionId) throw new Error('rollback needs a versionId')
        const detail = studio.rollback({ id: projectId, versionId: args.versionId })
        return {
          ok: true,
          message: `Rolled back to ${args.versionId} and saved ${detail.committed?.id} · ${summarize(detail)}`,
          data: JSON.stringify({ projectId, restored: args.versionId, versionId: detail.committed?.id, spec: detail.spec, qa: detail.qa }),
        }
      }

      if (action === 'history') {
        const projectId = requireId(args.projectId, 'history')
        const history = studio.history({ id: projectId })
        return {
          ok: true,
          message: `${history.versions.length} saved version(s); head ${history.headVersionId ?? 'none'}`,
          data: JSON.stringify(history),
        }
      }

      if (action === 'remove') {
        const projectId = requireId(args.projectId, 'remove')
        const result = studio.remove({ id: projectId })
        return { ok: true, message: `Removed project ${result.removed}`, data: JSON.stringify(result) }
      }

      if (action === 'qa') {
        const projectId = requireId(args.projectId, 'qa')
        const result = studio.qa({ id: projectId, versionId: args.versionId })
        return {
          ok: true,
          message: `QA ${result.qa.total}/${result.qa.max}${result.qa.publishable ? ' (publishable)' : ''}`,
          data: JSON.stringify(result),
        }
      }

      if (action === 'artifacts') {
        const projectId = requireId(args.projectId, 'artifacts')
        const result = studio.artifacts({ id: projectId, versionId: args.versionId })
        return {
          ok: true,
          message: `Artifacts for "${result.name}": SVG ${result.svg.length} bytes, summary CSV ${result.csv.split('\n').length - 1} rows.`,
          data: JSON.stringify({
            svg: args.includeSvg === true ? result.svg : undefined,
            svgBytes: result.svg.length,
            csv: result.csv,
            spec: result.spec,
            qa: result.qa,
          }),
        }
      }

      throw new Error(`unknown action: ${action}`)
    },
  }

  ctx.tools.register(tool)

  /** Read a workspace CSV through the sandbox-aware filesystem service. */
  async function readCsv(registrarCtx, exec, path) {
    const fs = registrarCtx.get('fs')
    if (!fs) throw new Error('the filesystem service is unavailable; pass csvText instead of csvPath')
    const workingDirectory = registrarCtx.get('workingDirectory')
    const cwd = exec?.agent ? workingDirectory?.get(exec.agent.session) : undefined
    const target = await fs.resolve(path, cwd ? { cwd } : undefined)
    const text = await fs.readText(target)
    if (typeof text !== 'string' || text.trim() === '') {
      throw new Error(
        `the CSV at "${path}" read back empty (cwd=${cwd ?? 'unset'}, target=${target?.displayPath ?? 'unknown'}); pass csvText instead`,
      )
    }
    return { text, name: path.split(/[\\/]/).pop() ?? 'upload.csv' }
  }

  function requireId(id, action) {
    if (typeof id !== 'string' || id.trim() === '') throw new Error(`${action} needs a projectId`)
    return id
  }
}
