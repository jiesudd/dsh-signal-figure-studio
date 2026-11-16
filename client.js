window.__ModuleLoader__.load({
  id: '@local/dsh-signal-figure-studio',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'signal-figure-studio'
    const ROUTE = '/api/signal-figure-studio'
    const TYPES = ['scenario-curves', 'aggregate-iqm', 'ablation', 'sensitivity', 'mechanism']

    const DICT = {
      en: {
        'panel.title': 'Signal figure studio',
        'panel.subtitle': 'Experiment figures from tidy run logs',
        'types': 'Figure type',
        'types.hint': 'Pick the evidence the experiment actually produced.',
        'projects': 'Figures',
        'projects.empty': 'No figure yet',
        'data': 'Data',
        'style': 'Style',
        'qa': 'QA',
        'history': 'History',
        'layout': 'Layout',
        'typography': 'Typography',
        'palette': 'Colour',
        'axes': 'Axes',
        'statistics': 'Statistics',
        'canvas': 'Canvas',
        'import': 'Import CSV',
        'demo': 'Load demo dataset',
        'new': 'New figure',
        'rename': 'Rename',
        'delete': 'Delete',
        'commit': 'Save version',
        'rollback': 'Roll back',
        'compare': 'Compare',
        'compare.current': 'Current',
        'compare.selected': 'Selected',
        'optimize': 'Optimize',
        'optimize.hint': 'Each optimization saves a version you can roll back to.',
        'download.svg': 'SVG',
        'download.png': 'PNG',
        'download.csv': 'Summary CSV',
        'download.spec': 'Spec JSON',
        'download.qa': 'QA report',
        'refresh': 'Refresh',
        'retry': 'Retry',
        'busy': 'Rendering…',
        'no.figure': 'Pick a figure on the left, or start from the clearly labelled demo dataset.',
        'width': 'Width (in)',
        'height': 'Height (in)',
        'margins': 'Left margin',
        'download': 'Export',
        'dpi': 'PNG dpi',
        'background': 'Background',
        'light': 'Light',
        'dark': 'Dark',
        'columns': 'Columns',
        'auto': 'Auto',
        'gapX': 'Column gap',
        'gapY': 'Row gap',
        'panelTitles': 'Panel titles',
        'legend': 'Legend',
        'legend.inside': 'Inside panel',
        'legend.above': 'Above',
        'legend.below': 'Below',
        'legend.right': 'Right',
        'legend.none': 'None',
        'legendColumns': 'Legend columns',
        'legendCorner': 'Legend corner',
        'title': 'Title',
        'title.auto': 'Automatic',
        'title.none': 'No title',
        'subtitle': 'Subtitle',
        'family': 'Font family',
        'family.sans': 'Sans',
        'family.serif': 'Serif',
        'baseSize': 'Base size',
        'titleSize': 'Title size',
        'labelSize': 'Axis label size',
        'tickSize': 'Tick size',
        'legendSize': 'Legend size',
        'paletteId': 'Palette',
        'overrides': 'Per-method colours',
        'lineWidth': 'Line width',
        'bandAlpha': 'Band opacity',
        'grid': 'Grid',
        'grid.none': 'None',
        'grid.y': 'Horizontal',
        'grid.x': 'Vertical',
        'grid.both': 'Both',
        'spines': 'Spines',
        'spines.left-bottom': 'Left + bottom',
        'spines.box': 'Full box',
        'spines.none': 'None',
        'markers': 'Markers',
        'markers.none': 'None',
        'markers.auto': 'Automatic',
        'markerSize': 'Marker size',
        'lineDash': 'Line styles',
        'lineDash.auto': 'Distinct',
        'lineDash.solid': 'All solid',
        'uncertainty': 'Uncertainty',
        'uncertainty.band': '95% band',
        'uncertainty.errorbar': 'Error bars',
        'uncertainty.none': 'None',
        'xScale': 'X scale',
        'yScale': 'Y scale',
        'linear': 'Linear',
        'log': 'Log',
        'includeZero': 'Include zero',
        'shareY': 'Shared Y axis',
        'xLabel': 'X axis label',
        'yLabel': 'Y axis label',
        'xTicks': 'X ticks',
        'yTicks': 'Y ticks',
        'sci': 'Scientific notation',
        'sci.auto': 'Automatic',
        'sci.never': 'Plain numbers',
        'metric': 'Metric name',
        'unit': 'Unit',
        'direction': 'Better direction',
        'higher': 'Higher is better',
        'lower': 'Lower is better',
        'directionNote': 'Print direction note',
        'bootstrapNote': 'Print bootstrap note',
        'estimator': 'Estimator',
        'mean': 'Mean',
        'iqm': 'IQM',
        'resamples': 'Bootstrap resamples',
        'seed': 'Bootstrap seed',
        'smooth': 'Display smoothing',
        'checkpoints': 'Checkpoints',
        'checkpointMode': 'Checkpoint spacing',
        'checkpointMode.linear': 'Even',
        'checkpointMode.log': 'Logarithmic',
        'transform': 'Value transform',
        'transform.none': 'None',
        'transform.linear-to-db': 'Power → dB (10·log10)',
        'transform.amplitude-to-db': 'Amplitude → dB (20·log10)',
        'variant': 'Variant subset',
        'variant.main': 'main',
        'variant.ablation': 'ablation',
        'variant.sensitivity': 'sensitivity',
        'variant.all': 'all',
        'audit': 'Log audit',
        'audit.rows': 'Rows',
        'audit.scenarios': 'Scenarios',
        'audit.methods': 'Methods',
        'audit.trials': 'Trials',
        'audit.steps': 'Steps',
        'audit.range': 'Step range',
        'audit.ok': 'The tidy-log contract passes.',
        'audit.blocked': 'Rendering is blocked until these log errors are fixed.',
        'audit.warnings': 'Warnings',
        'qa.score': 'Acceptance score',
        'qa.publishable': 'Publishable',
        'qa.notPublishable': 'Below the 18/20 bar',
        'qa.blocking': 'Blocking checks',
        'qa.hint': 'Ten checks from the article profile; no zero is allowed in the first five.',
        'versions': 'Versions',
        'versions.empty': 'Nothing saved yet. Save a version to start the rollback history.',
        'versions.note': 'Version note',
        'versions.notePlaceholder': 'What changed in this round?',
        'versions.head': 'current',
        'versions.count': 'versions',
        'versions.diff': 'Changes',
        'versions.diffHint': 'what rolling back to a version would change',
        'warnings': 'Layout warnings',
        'error': 'Something went wrong',
        'empty': 'No data yet',
        'meta.demo': 'Synthetic demo — not evidence',
        'meta.rows': 'rows',
        'hint.zoomFit': 'Fit',
        'hint.zoom100': '100%',
        'hint.zoom200': '200%',
        'panel.pickType': 'Choose a figure type to start',
        'panel.needImport': 'Import a tidy CSV to see the figure.',
        'panel.saved': 'Saved',
        'panel.rendered': 'Rendered',
        'loading': 'Loading studio…',
        'confirm.delete': 'Delete this figure and its version history?',
        'figure.panels': 'panels',
        'version.restored': 'Rolled back',
        'opt.recipe': 'Style recipe',
        'type.scenario-curves': 'Per-scenario curves',
        'type.aggregate-iqm': 'Aggregate IQM',
        'type.ablation': 'Ablation',
        'type.sensitivity': 'Sensitivity',
        'type.mechanism': 'Mechanism',
        'type.scenario-curves.desc': 'Mean with a 95% bootstrap band for every scenario.',
        'type.aggregate-iqm.desc': 'Robust cross-scenario IQM with bootstrap CI at checkpoints.',
        'type.ablation.desc': 'Component or strategy ablation panels.',
        'type.sensitivity.desc': 'Hyperparameter settings against the metric.',
        'type.mechanism.desc': 'Measured mechanism variable against performance.',
      },
      zh: {
        'panel.title': '信号实验图工作台',
        'panel.subtitle': '从整洁运行日志到论文插图',
        'types': '实验图类型',
        'types.hint': '选择实验真正产出的证据类型。',
        'projects': '图',
        'projects.empty': '还没有图',
        'data': '数据',
        'style': '样式',
        'qa': '质检',
        'history': '历史',
        'layout': '排版',
        'typography': '字体',
        'palette': '配色',
        'axes': '坐标轴',
        'statistics': '统计',
        'canvas': '画布',
        'import': '导入 CSV',
        'demo': '载入演示数据',
        'new': '新建图',
        'rename': '重命名',
        'delete': '删除',
        'commit': '保存版本',
        'rollback': '回滚',
        'compare': '对比',
        'compare.current': '当前',
        'compare.selected': '所选版本',
        'optimize': '优化',
        'optimize.hint': '每次优化都会保存一个可回滚的版本。',
        'download.svg': 'SVG',
        'download.png': 'PNG',
        'download.csv': '汇总 CSV',
        'download.spec': '规格 JSON',
        'download.qa': '质检报告',
        'refresh': '刷新',
        'retry': '重试',
        'busy': '渲染中…',
        'no.figure': '从左侧选择一张图，或用明确标注的演示数据开始。',
        'width': '宽度 (英寸)',
        'height': '高度 (英寸)',
        'margins': '左边距',
        'download': '导出',
        'dpi': 'PNG 分辨率',
        'background': '背景',
        'light': '浅色',
        'dark': '深色',
        'columns': '列数',
        'auto': '自动',
        'gapX': '列间距',
        'gapY': '行间距',
        'panelTitles': '面板标题',
        'legend': '图例',
        'legend.inside': '面板内',
        'legend.above': '上方',
        'legend.below': '下方',
        'legend.right': '右侧',
        'legend.none': '无',
        'legendColumns': '图例列数',
        'legendCorner': '图例角落',
        'title': '标题',
        'title.auto': '自动',
        'title.none': '不显示标题',
        'subtitle': '副标题',
        'family': '字体族',
        'family.sans': '无衬线',
        'family.serif': '衬线',
        'baseSize': '基础字号',
        'titleSize': '标题字号',
        'labelSize': '轴标签字号',
        'tickSize': '刻度字号',
        'legendSize': '图例字号',
        'paletteId': '调色板',
        'overrides': '按方法覆盖颜色',
        'lineWidth': '线宽',
        'bandAlpha': '置信带透明度',
        'grid': '网格',
        'grid.none': '无',
        'grid.y': '水平',
        'grid.x': '垂直',
        'grid.both': '双向',
        'spines': '轴框',
        'spines.left-bottom': '左 + 下',
        'spines.box': '完整边框',
        'spines.none': '无',
        'markers': '标记',
        'markers.none': '无',
        'markers.auto': '自动',
        'markerSize': '标记大小',
        'lineDash': '线型',
        'lineDash.auto': '区分线型',
        'lineDash.solid': '全部实线',
        'uncertainty': '不确定性编码',
        'uncertainty.band': '95% 置信带',
        'uncertainty.errorbar': '误差棒',
        'uncertainty.none': '不显示',
        'xScale': 'X 轴刻度',
        'yScale': 'Y 轴刻度',
        'linear': '线性',
        'log': '对数',
        'includeZero': '包含 0',
        'shareY': '共享 Y 轴',
        'xLabel': 'X 轴标题',
        'yLabel': 'Y 轴标题',
        'xTicks': 'X 刻度数',
        'yTicks': 'Y 刻度数',
        'sci': '科学计数法',
        'sci.auto': '自动',
        'sci.never': '普通数字',
        'metric': '指标名',
        'unit': '单位',
        'direction': '优劣方向',
        'higher': '越高越好',
        'lower': '越低越好',
        'directionNote': '打印方向标注',
        'bootstrapNote': '打印自助法说明',
        'estimator': '估计量',
        'mean': '均值',
        'iqm': 'IQM',
        'resamples': '自助重采样次数',
        'seed': '自助随机种子',
        'smooth': '显示平滑窗口',
        'checkpoints': '检查点数量',
        'checkpointMode': '检查点分布',
        'checkpointMode.linear': '均匀',
        'checkpointMode.log': '对数',
        'transform': '数值变换',
        'transform.none': '不变换',
        'transform.linear-to-db': '功率 → dB (10·log10)',
        'transform.amplitude-to-db': '幅度 → dB (20·log10)',
        'variant': '数据子集',
        'variant.main': '主实验',
        'variant.ablation': '消融',
        'variant.sensitivity': '敏感性',
        'variant.all': '全部',
        'audit': '日志审计',
        'audit.rows': '行数',
        'audit.scenarios': '场景数',
        'audit.methods': '方法数',
        'audit.trials': '重复次数',
        'audit.steps': '步数',
        'audit.range': '步范围',
        'audit.ok': '整洁日志契约校验通过。',
        'audit.blocked': '以下日志错误修复前不会渲染。',
        'audit.warnings': '警告',
        'qa.score': '验收得分',
        'qa.publishable': '达到发表标准',
        'qa.notPublishable': '低于 18/20 门槛',
        'qa.blocking': '阻塞项',
        'qa.hint': '文章画像的十项验收；前五项不得为 0。',
        'versions': '版本',
        'versions.empty': '尚未保存版本。保存一个版本即可开始回滚历史。',
        'versions.note': '版本说明',
        'versions.notePlaceholder': '这一轮改了什么？',
        'versions.head': '当前',
        'versions.count': '个版本',
        'versions.diff': '改动',
        'versions.diffHint': '回滚到某版本会产生的改动',
        'warnings': '排版警告',
        'error': '出错了',
        'empty': '还没有数据',
        'meta.demo': '合成演示数据 — 不是证据',
        'meta.rows': '行',
        'hint.zoomFit': '适应',
        'hint.zoom100': '100%',
        'hint.zoom200': '200%',
        'panel.pickType': '先选择一种实验图类型',
        'panel.needImport': '导入整洁 CSV 后即可看到图。',
        'panel.saved': '已保存',
        'panel.rendered': '已渲染',
        'loading': '正在载入工作台…',
        'confirm.delete': '删除这张图及其版本历史？',
        'figure.panels': '面板',
        'version.restored': '已回滚',
        'opt.recipe': '样式配方',
        'type.scenario-curves': '逐场景曲线',
        'type.aggregate-iqm': '跨场景 IQM',
        'type.ablation': '消融',
        'type.sensitivity': '敏感性',
        'type.mechanism': '机制',
        'type.scenario-curves.desc': '每个场景的均值与 95% 自助置信带。',
        'type.aggregate-iqm.desc': '跨场景稳健 IQM 与检查点自助置信区间。',
        'type.ablation.desc': '组件或策略消融面板。',
        'type.sensitivity.desc': '超参数设置对指标的影响。',
        'type.mechanism.desc': '实测机制变量与性能的关系。',
      },
    }

    async function call(method, params) {
      const response = await fetch(ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method, params: params ?? {} }),
      })
      let body
      try {
        body = await response.json()
      } catch {
        throw new Error(`studio route returned ${response.status}`)
      }
      if (!body.ok) throw new Error(body.error || `studio route returned ${response.status}`)
      return body.result
    }

    function svgDataUrl(svg) {
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    }

    function triggerDownload(name, data, type) {
      const blob = new Blob([data], { type })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = name
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(url), 4000)
    }

    function safeName(text) {
      return (
        String(text ?? 'figure')
          .replace(/[\\/:*?"<>|]+/g, '-')
          .replace(/\s+/g, '-')
          .slice(0, 80) || 'figure'
      )
    }

    function numberOr(value, fallback) {
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : fallback
    }

    /* ------------------------------------------------------------ controls */

    function Field({ label, children, hint }) {
      return h(
        'div',
        { className: 'sf-field' },
        h('div', { className: 'sf-field-label' }, h('label', null, label), hint ? h('div', { className: 'sf-hint' }, hint) : null),
        h('div', { className: 'sf-field-control' }, children),
      )
    }

    function Section({ title, children, defaultOpen = true }) {
      const [open, setOpen] = React.useState(defaultOpen)
      return h(
        'div',
        { className: 'sf-section' },
        h(
          'button',
          { className: 'sf-section-head', onClick: () => setOpen(!open), type: 'button', 'aria-expanded': open },
          h('span', null, title),
          h('span', { className: 'sf-chevron' }, open ? '−' : '+'),
        ),
        open ? h('div', { className: 'sf-section-body' }, children) : null,
      )
    }

    function Slider({ label, value, min, max, step, onChange, suffix }) {
      return h(
        Field,
        { label: `${label}${suffix ? ` · ${value}${suffix}` : ` · ${value}`}` },
        h('input', {
          type: 'range',
          min,
          max,
          step,
          value,
          onChange: (event) => onChange(Number(event.target.value)),
        }),
      )
    }

    function Select({ label, value, options, onChange }) {
      return h(
        Field,
        { label },
        h(
          'select',
          { value, onChange: (event) => onChange(event.target.value) },
          options.map((option) => h('option', { key: option[0], value: option[0] }, option[1])),
        ),
      )
    }

    function Toggle({ label, checked, onChange }) {
      return h(
        Field,
        { label },
        h('input', { type: 'checkbox', checked: !!checked, onChange: (event) => onChange(event.target.checked) }),
      )
    }

    function TextField({ label, value, onChange, placeholder }) {
      return h(
        Field,
        { label },
        h('input', {
          type: 'text',
          value: value ?? '',
          placeholder: placeholder ?? '',
          onChange: (event) => onChange(event.target.value),
        }),
      )
    }

    function NumberField({ label, value, min, max, step, onChange }) {
      return h(
        Field,
        { label },
        h('input', {
          type: 'number',
          value,
          min,
          max,
          step,
          onChange: (event) => {
            const parsed = Number(event.target.value)
            if (Number.isFinite(parsed)) onChange(parsed)
          },
        }),
      )
    }

    /* --------------------------------------------------------------- panel */

    function StudioApp({ t }) {
      const [boot, setBoot] = React.useState(null)
      const [detail, setDetail] = React.useState(null)
      const [compare, setCompare] = React.useState(null)
      const [error, setError] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [tab, setTab] = React.useState('style')
      const [zoom, setZoom] = React.useState('fit')
      const [note, setNote] = React.useState('')
      const [optimizeOpen, setOptimizeOpen] = React.useState(false)
      const [renameOpen, setRenameOpen] = React.useState(false)

      const requestId = React.useRef(0)
      const patchTimer = React.useRef(null)
      const pendingPatch = React.useRef(null)
      const undoStack = React.useRef([])
      const redoStack = React.useRef([])

      const run = React.useCallback(async (task, options) => {
        const id = (requestId.current += 1)
        if (options?.quiet !== true) setBusy(true)
        try {
          const value = await task()
          if (id !== requestId.current) return null
          setError('')
          return value
        } catch (failure) {
          if (id === requestId.current) setError(failure instanceof Error ? failure.message : String(failure))
          return null
        } finally {
          if (id === requestId.current && options?.quiet !== true) setBusy(false)
        }
      }, [])

      const openProject = React.useCallback(
        async (id, quiet) => {
          if (patchTimer.current) clearTimeout(patchTimer.current)
          pendingPatch.current = null
          const next = await run(() => call('open', { id }), { quiet })
          if (!next) return
          setDetail(next)
          setCompare(null)
          undoStack.current = []
          redoStack.current = []
        },
        [run],
      )

      const load = React.useCallback(async () => {
        const state = await run(async () => {
          const booted = await call('bootstrap', {})
          let opened = null
          if (booted.projects.length > 0) {
            opened = await call('open', { id: booted.projects[0].id })
          }
          return { booted, opened }
        })
        if (!state) return
        setBoot(state.booted)
        if (state.opened) setDetail(state.opened)
      }, [run])

      React.useEffect(() => {
        load()
      }, [load])

      const sendPatch = React.useCallback(async () => {
        const patch = pendingPatch.current
        pendingPatch.current = null
        if (!patch || !detail) return
        const snapshot = detail.spec
        if (JSON.stringify(undoStack.current.at(-1)) !== JSON.stringify(snapshot)) {
          undoStack.current.push(snapshot)
          if (undoStack.current.length > 40) undoStack.current.shift()
          redoStack.current = []
        }
        const next = await run(() => call('set_spec', { id: detail.project.id, patch }), { quiet: true })
        if (next) setDetail(next)
      }, [detail, run])

      const applyPatch = React.useCallback(
        (patch, immediate) => {
          if (!detail) return
          pendingPatch.current = mergeDeep(pendingPatch.current ?? {}, patch)
          if (patchTimer.current) clearTimeout(patchTimer.current)
          patchTimer.current = setTimeout(sendPatch, immediate ? 0 : 90)
        },
        [detail, sendPatch],
      )

      const replaceSpec = React.useCallback(
        async (spec) => {
          if (!detail) return
          const next = await run(() => call('set_spec', { id: detail.project.id, patch: spec, replace: true }))
          if (next) setDetail(next)
        },
        [detail, run],
      )

      const undo = React.useCallback(() => {
        if (!detail || undoStack.current.length === 0) return
        const previous = undoStack.current.pop()
        redoStack.current.push(detail.spec)
        replaceSpec(previous)
      }, [detail, replaceSpec])

      const redo = React.useCallback(() => {
        if (!detail || redoStack.current.length === 0) return
        const next = redoStack.current.pop()
        undoStack.current.push(detail.spec)
        replaceSpec(next)
      }, [detail, replaceSpec])

      const setType = React.useCallback(
        async (type) => {
          if (!detail) return
          const next = await run(() => call('set_type', { id: detail.project.id, type }))
          if (next) {
            setDetail(next)
            setCompare(null)
          }
        },
        [detail, run],
      )

      const optimize = React.useCallback(
        async (recipe) => {
          if (!detail) return
          setOptimizeOpen(false)
          const next = await run(() => call('optimize', { id: detail.project.id, recipe, note: note || undefined }))
          if (next) {
            setDetail(next)
            setNote('')
          }
        },
        [detail, note, run],
      )

      const commit = React.useCallback(async () => {
        if (!detail) return
        const next = await run(() => call('commit', { id: detail.project.id, note: note || undefined }))
        if (next) {
          setDetail(next)
          setNote('')
        }
      }, [detail, note, run])

      const rollback = React.useCallback(
        async (versionId) => {
          if (!detail || !versionId) return
          const next = await run(() => call('rollback', { id: detail.project.id, versionId }))
          if (next) {
            setDetail(next)
            setCompare(null)
          }
        },
        [detail, run],
      )

      const showVersion = React.useCallback(
        async (versionId) => {
          if (!detail) return
          if (versionId === detail.project.headVersionId) {
            setCompare(null)
            return
          }
          const next = await run(() => call('preview', { id: detail.project.id, versionId }))
          if (next) setCompare(next)
        },
        [detail, run],
      )

      const importCsv = React.useCallback(
        (file) => {
          if (!detail || !file) return
          const reader = new FileReader()
          reader.onload = async () => {
            const text = String(reader.result ?? '')
            const next = await run(() => call('import_csv', { id: detail.project.id, csvText: text, csvName: file.name }))
            if (next) setDetail(next)
          }
          reader.readAsText(file, 'utf-8')
        },
        [detail, run],
      )

      const loadDemo = React.useCallback(async () => {
        if (!detail) return
        const next = await run(() => call('import_csv', { id: detail.project.id, demo: true }))
        if (next) setDetail(next)
      }, [detail, run])

      const createProject = React.useCallback(async (type, demo) => {
        const next = await run(() => call('create', { name: demo ? t('demo') : t('new'), type: type ?? detail?.project.type ?? 'scenario-curves', demo: demo === true }))
        if (!next) return
        setBoot((current) => (current ? { ...current, projects: [{ ...next.project, versions: next.history.length }, ...current.projects] } : current))
        setDetail(next)
        setCompare(null)
      }, [detail, run, t])

      const removeProject = React.useCallback(async () => {
        if (!detail) return
        if (!window.confirm(t('confirm.delete'))) return
        await run(() => call('remove', { id: detail.project.id }))
        setDetail(null)
        setCompare(null)
        const state = await run(async () => {
          const booted = await call('bootstrap', {})
          const opened = booted.projects.length > 0 ? await call('open', { id: booted.projects[0].id }) : null
          return { booted, opened }
        })
        if (state) {
          setBoot(state.booted)
          if (state.opened) setDetail(state.opened)
        }
      }, [detail, run])

      const renameProject = React.useCallback(
        async (name) => {
          if (!detail) return
          setRenameOpen(false)
          const next = await run(() => call('rename', { id: detail.project.id, name }))
          if (next) {
            setDetail(next)
            setBoot((current) =>
              current
                ? { ...current, projects: current.projects.map((project) => (project.id === next.project.id ? { ...project, name: next.project.name } : project)) }
                : current,
            )
          }
        },
        [detail, run],
      )

      const download = React.useCallback(
        async (kind) => {
          if (!detail) return
          const artifacts = await run(() => call('artifacts', { id: detail.project.id, versionId: compare?.previewVersionId ?? detail.previewVersionId }))
          if (!artifacts) return
          const base = safeName(detail.project.name)
          const versionSuffix = detail.previewVersionId ? `-${detail.previewVersionId}` : ''
          if (kind === 'svg') triggerDownload(`${base}${versionSuffix}.svg`, artifacts.svg, 'image/svg+xml;charset=utf-8')
          else if (kind === 'csv') triggerDownload(`${base}${versionSuffix}-summary.csv`, artifacts.csv, 'text/csv;charset=utf-8')
          else if (kind === 'spec') triggerDownload(`${base}${versionSuffix}-spec.json`, artifacts.spec, 'application/json')
          else if (kind === 'qa') triggerDownload(`${base}${versionSuffix}-qa.json`, artifacts.qa, 'application/json')
          else if (kind === 'png') {
            const dpi = numberOr(detail.spec.canvas.dpi, 320)
            const width = Math.round(detail.spec.canvas.widthIn * dpi)
            const height = Math.round(detail.spec.canvas.heightIn * dpi)
            try {
              const blob = await rasterize(artifacts.svg, width, height, detail.spec.canvas.background === 'dark' ? '#14181D' : '#FFFFFF')
              triggerDownload(`${base}${versionSuffix}-${dpi}dpi.png`, blob, 'image/png')
            } catch (failure) {
              setError(`PNG export failed: ${failure instanceof Error ? failure.message : String(failure)}`)
            }
          }
        },
        [compare, detail, run],
      )

      React.useEffect(() => {
        return () => {
          if (patchTimer.current) clearTimeout(patchTimer.current)
        }
      }, [])

      const spec = detail?.spec
      const qa = detail?.qa
      const audit = detail?.audit

      if (error && !detail) {
        return h(
          'div',
          { className: 'sf-root sf-center-state' },
          h('style', null, CSS),
          h('div', { className: 'sf-state-card' },
            h('div', { className: 'sf-state-title' }, t('error')),
            h('div', { className: 'sf-state-text' }, error),
            h('button', { className: 'sf-btn sf-btn-primary', onClick: load }, t('retry')),
          ),
        )
      }

      if (!boot && !detail) {
        return h('div', { className: 'sf-root sf-center-state' }, h('style', null, CSS), h('div', { className: 'sf-state-text' }, t('loading')))
      }

      return h(
        'div',
        { className: 'sf-root' },
        h('style', null, CSS),
        h(
          'div',
          { className: 'sf-toolbar' },
          h('div', { className: 'sf-toolbar-title' },
            h('div', { className: 'sf-title' }, detail?.project?.name ?? t('panel.title')),
            h('div', { className: 'sf-muted' },
              detail?.project?.demo ? t('meta.demo') : t('panel.subtitle'),
              detail?.figure ? ` · ${detail.figure.panels.length} ${t('figure.panels')}` : '',
              qa ? ` · QA ${qa.total}/${qa.max}` : '',
              detail?.history?.length ? ` · ${detail.history.length} ${t('versions.count')}` : '',
            ),
          ),
          busy ? h('span', { className: 'sf-busy' }, t('busy')) : null,
          h('div', { className: 'sf-toolbar-actions' },
            h('button', { className: 'sf-btn', onClick: () => load(), title: t('refresh') }, t('refresh')),
            h('button', { className: 'sf-btn', onClick: undo, title: 'Undo' }, '↶'),
            h('button', { className: 'sf-btn', onClick: redo, title: 'Redo' }, '↷'),
            h('button', { className: 'sf-btn', onClick: () => download('svg') }, `${t('download.svg')} ↓`),
            h('button', { className: 'sf-btn', onClick: () => download('png') }, `${t('download.png')} ↓`),
            h('div', { className: 'sf-menu' },
              h('button', { className: 'sf-btn', onClick: () => setOptimizeOpen(!optimizeOpen) }, `${t('optimize')} ▾`),
              optimizeOpen && boot
                ? h('div', { className: 'sf-menu-list' },
                    h('div', { className: 'sf-menu-title' }, t('opt.recipe')),
                    boot.recipes.map((recipe) =>
                      h('button', {
                        key: recipe.id,
                        className: 'sf-menu-item',
                        onClick: () => optimize(recipe.id),
                        title: recipe.note,
                      },
                        h('span', null, recipe.label),
                        h('span', { className: 'sf-menu-note' }, recipe.note),
                      ),
                    ),
                    h('div', { className: 'sf-menu-foot' }, t('optimize.hint')),
                  )
                : null,
            ),
            h('button', { className: 'sf-btn sf-btn-primary', onClick: commit }, t('commit')),
          ),
        ),
        h(
          'div',
          { className: 'sf-body' },
          h(LeftPane, { t, boot, detail, onType: (type) => (detail ? setType(type) : createProject(type, false)), onOpen: openProject, onNew: () => createProject(undefined, false), onRemove: removeProject, onRename: () => setRenameOpen(true) }),
          h(CanvasPane, {
            t,
            detail,
            compare,
            zoom,
            setZoom,
            busy,
            error,
            setError,
            onCreate: () => createProject(undefined, false),
            onCreateDemo: () => createProject(undefined, true),
            onImport: importCsv,
            onDemo: loadDemo,
            onClearCompare: () => setCompare(null),
            onRollback: rollback,
            onDownload: download,
          }),
          h(RightPane, {
            t,
            detail,
            spec,
            qa,
            audit,
            palettes: boot?.palettes ?? [],
            tab,
            setTab,
            note,
            setNote,
            patch: applyPatch,
            onCommit: commit,
            onRollback: rollback,
            onShowVersion: showVersion,
            onDownload: download,
          }),
        ),
        h(VersionStrip, { t, detail, compare, onShowVersion: showVersion, onRollback: rollback }),
        renameOpen
          ? h(RenameDialog, {
              t,
              initial: detail?.project?.name ?? '',
              onCancel: () => setRenameOpen(false),
              onConfirm: renameProject,
            })
          : null,
      )
    }

    /* --------------------------------------------------------- left column */

    function LeftPane({ t, boot, detail, onType, onOpen, onNew, onRemove, onRename }) {
      return h(
        'aside',
        { className: 'sf-left' },
        h('div', { className: 'sf-pane-head' },
          h('span', null, t('types')),
          h('button', { className: 'sf-link', onClick: onNew }, `+ ${t('new')}`),
        ),
        h('div', { className: 'sf-type-list' },
          TYPES.map((type) =>
            h('button', {
              key: type,
              type: 'button',
              className: 'sf-type-card',
              'data-active': detail?.project?.type === type,
              onClick: () => onType(type),
            },
              h('div', { className: 'sf-type-name' }, t(`type.${type}`)),
              h('div', { className: 'sf-type-desc' }, t(`type.${type}.desc`)),
            ),
          ),
        ),
        h('div', { className: 'sf-pane-head sf-pane-head-gap' },
          h('span', null, t('projects')),
          detail ? h('button', { className: 'sf-link', onClick: onRename }, t('rename')) : null,
        ),
        h('div', { className: 'sf-project-list' },
          (boot?.projects ?? []).length === 0
            ? h('div', { className: 'sf-hint' }, t('projects.empty'))
            : boot.projects.map((project) =>
                h('button', {
                  key: project.id,
                  type: 'button',
                  className: 'sf-project',
                  'data-active': project.id === detail?.project?.id,
                  onClick: () => onOpen(project.id),
                },
                  h('span', { className: 'sf-project-name' }, project.name),
                  h('span', { className: 'sf-project-meta' }, `${project.type} · ${project.versions}`),
                ),
              ),
        ),
        detail
          ? h('div', { className: 'sf-left-foot' }, h('button', { className: 'sf-link sf-danger', onClick: onRemove }, t('delete')))
          : null,
      )
    }

    /* -------------------------------------------------------------- canvas */

    function CanvasPane({ t, detail, compare, zoom, setZoom, busy, error, setError, onCreate, onCreateDemo, onImport, onDemo, onClearCompare, onRollback, onDownload }) {
      const fileInput = React.useRef(null)
      const imageStyle = React.useMemo(() => {
        if (zoom === '100') return { width: detail?.layout?.width ?? 'auto' }
        if (zoom === '200') return { width: (detail?.layout?.width ?? 600) * 2 }
        return { maxWidth: '100%', maxHeight: '100%' }
      }, [zoom, detail])

      if (!detail) {
        return h('main', { className: 'sf-center' },
          h('div', { className: 'sf-empty' },
            h('div', { className: 'sf-empty-title' }, t('no.figure')),
            h('div', { className: 'sf-empty-actions' },
              h('button', { className: 'sf-btn sf-btn-primary', onClick: onCreate }, t('new')),
              h('button', { className: 'sf-btn', onClick: onCreateDemo }, t('demo')),
            ),
          ),
        )
      }

      const blocked = !detail.svg
      const emptyProject = !detail.figure && (detail.audit?.summary?.rows ?? 0) === 0
      return h(
        'main',
        { className: 'sf-center' },
        h('input', {
          ref: fileInput,
          type: 'file',
          accept: '.csv,.tsv,text/csv',
          style: { display: 'none' },
          onChange: (event) => {
            const file = event.target.files?.[0]
            if (file) onImport(file)
            event.target.value = ''
          },
        }),
        h('div', { className: 'sf-canvas-head' },
          h('div', { className: 'sf-canvas-actions' },
            h('button', { className: 'sf-btn', onClick: () => fileInput.current?.click() }, t('import')),
            h('button', { className: 'sf-btn', onClick: onDemo }, t('demo')),
            h('div', { className: 'sf-seg' },
              ['fit', '100', '200'].map((mode) =>
                h('button', { key: mode, type: 'button', 'data-active': zoom === mode, onClick: () => setZoom(mode) },
                  mode === 'fit' ? t('hint.zoomFit') : mode === '100' ? '100%' : '200%'),
              ),
            ),
            compare
              ? h('button', { className: 'sf-btn', onClick: onClearCompare }, t('compare.current'))
              : null,
          ),
          detail.svg ? h('div', { className: 'sf-muted sf-canvas-meta' },
            `${detail.spec.canvas.widthIn} × ${detail.spec.canvas.heightIn} in · ${detail.layout?.width ?? 0} × ${detail.layout?.height ?? 0} px`,
            detail.project.demo ? ` · ${t('meta.demo')}` : '',
          ) : null,
        ),
        error ? h('div', { className: 'sf-inline-error' }, error, h('button', { className: 'sf-link', onClick: () => setError('') }, '✕')) : null,
        h('div', { className: 'sf-canvas' },
          blocked
            ? h('div', { className: 'sf-empty' },
                h('div', { className: 'sf-empty-title' }, emptyProject ? t('panel.needImport') : t('audit.blocked')),
                h('div', { className: 'sf-empty-actions' },
                  h('button', { className: 'sf-btn sf-btn-primary', onClick: () => fileInput.current?.click() }, t('import')),
                  h('button', { className: 'sf-btn', onClick: onDemo }, t('demo')),
                ),
              )
            : compare && compare.svg
              ? h('div', { className: 'sf-compare' },
                  h('div', { className: 'sf-compare-pane' },
                    h('div', { className: 'sf-compare-label' }, t('compare.current')),
                    h('img', { className: 'sf-figure', style: imageStyle, src: svgDataUrl(detail.svg), alt: t('compare.current') }),
                  ),
                  h('div', { className: 'sf-compare-pane' },
                    h('div', { className: 'sf-compare-label' },
                      `${t('compare.selected')} · ${compare.previewVersionId}`,
                      h('button', { className: 'sf-link', onClick: () => onRollback(compare.previewVersionId) }, t('rollback')),
                    ),
                    h('img', { className: 'sf-figure', style: imageStyle, src: svgDataUrl(compare.svg), alt: t('compare.selected') }),
                  ),
                )
              : h('img', { className: 'sf-figure', style: imageStyle, src: svgDataUrl(detail.svg), alt: detail.project.name }),
        ),
        detail.warnings?.length
          ? h('div', { className: 'sf-warnings' },
              h('span', { className: 'sf-warnings-tag' }, t('warnings')),
              detail.warnings.map((warning, index) => h('span', { key: index, className: 'sf-warning' }, warning)),
            )
          : null,
        h('div', { className: 'sf-canvas-foot' },
          h('button', { className: 'sf-link', onClick: () => onDownload('svg') }, `↓ ${t('download.svg')}`),
          h('button', { className: 'sf-link', onClick: () => onDownload('png') }, `↓ ${t('download.png')}`),
          h('button', { className: 'sf-link', onClick: () => onDownload('csv') }, `↓ ${t('download.csv')}`),
          h('button', { className: 'sf-link', onClick: () => onDownload('spec') }, `↓ ${t('download.spec')}`),
          h('button', { className: 'sf-link', onClick: () => onDownload('qa') }, `↓ ${t('download.qa')}`),
          busy ? h('span', { className: 'sf-muted' }, t('busy')) : null,
        ),
      )
    }

    /* --------------------------------------------------------- right column */

    function RightPane({ t, detail, spec, qa, audit, palettes, tab, setTab, note, setNote, patch, onCommit, onRollback, onShowVersion, onDownload }) {
      if (!detail || !spec) {
        return h('aside', { className: 'sf-right' }, h('div', { className: 'sf-scroll' }, h('div', { className: 'sf-hint' }, t('no.figure'))))
      }
      return h(
        'aside',
        { className: 'sf-right' },
        h('div', { className: 'sf-tabs' },
          ['style', 'data', 'qa', 'history'].map((id) =>
            h('button', { key: id, type: 'button', className: 'sf-tab', 'data-active': tab === id, onClick: () => setTab(id) },
              id === 'style' ? t('style') : id === 'data' ? t('data') : id === 'qa' ? t('qa') : t('history'),
            ),
          ),
        ),
        h('div', { className: 'sf-scroll' },
          tab === 'style' ? h(StyleTab, { t, spec, methods: detail.figure?.methods ?? [], palettes, patch }) : null,
          tab === 'data' ? h(DataTab, { t, detail, audit, patch, onDownload }) : null,
          tab === 'qa' ? h(QaTab, { t, qa, detail }) : null,
          tab === 'history' ? h(HistoryTab, { t, detail, note, setNote, onCommit, onRollback, onShowVersion }) : null,
        ),
      )
    }

    let PALETTES_FALLBACK = [
      { id: 'paper-warm', label: 'Paper warm' },
      { id: 'okabe-ito', label: 'Okabe–Ito' },
      { id: 'tableau', label: 'Tableau 10' },
      { id: 'ieee', label: 'IEEE high contrast' },
      { id: 'grayscale', label: 'Grayscale' },
    ]

    function StyleTab({ t, spec, methods, palettes, patch }) {
      const paletteOptions = (palettes && palettes.length > 0 ? palettes : PALETTES_FALLBACK).map((palette) => [palette.id, palette.label])
      const set = (group, key, value) => patch({ [group]: { [key]: value } }, true)
      const setCanvas = (key, value) => patch({ canvas: { [key]: value } }, true)
      return h(
        'div',
        null,
        h(Section, { title: t('canvas') },
          h(NumberField, { label: t('width'), value: spec.canvas.widthIn, min: 1, max: 30, step: 0.1, onChange: (value) => setCanvas('widthIn', value) }),
          h(NumberField, { label: t('height'), value: spec.canvas.heightIn, min: 1, max: 30, step: 0.1, onChange: (value) => setCanvas('heightIn', value) }),
          h(NumberField, { label: t('dpi'), value: spec.canvas.dpi, min: 96, max: 900, step: 10, onChange: (value) => setCanvas('dpi', value) }),
          h(Select, {
            label: t('background'),
            value: spec.canvas.background,
            options: [['light', t('light')], ['dark', t('dark')]],
            onChange: (value) => setCanvas('background', value),
          }),
          h(Select, {
            label: t('title'),
            value: spec.labels.title,
            options: [['auto', t('title.auto')], ['none', t('title.none')]],
            onChange: (value) => patch({ labels: { title: value } }, true),
          }),
          spec.labels.title === 'auto'
            ? h(TextField, { label: t('subtitle'), value: spec.labels.subtitle, onChange: (value) => patch({ labels: { subtitle: value } }) })
            : h(TextField, { label: t('title'), value: spec.labels.title, onChange: (value) => patch({ labels: { title: value } }) }),
          h(NumberField, { label: t('margins'), value: spec.canvas.margins.left, min: 0, max: 200, step: 2, onChange: (value) => patch({ canvas: { margins: { left: value } } }, true) }),
        ),
        h(Section, { title: t('layout') },
          h(Select, {
            label: t('columns'),
            value: String(spec.layout.columns),
            options: [['0', t('auto')], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6']],
            onChange: (value) => set('layout', 'columns', Number(value)),
          }),
          h(Slider, { label: t('gapX'), value: spec.layout.gapX, min: 0, max: 80, step: 2, onChange: (value) => set('layout', 'gapX', value) }),
          h(Slider, { label: t('gapY'), value: spec.layout.gapY, min: 0, max: 90, step: 2, onChange: (value) => set('layout', 'gapY', value) }),
          h(Toggle, { label: t('panelTitles'), checked: spec.layout.panelTitles, onChange: (value) => set('layout', 'panelTitles', value) }),
          h(Select, {
            label: t('legend'),
            value: spec.layout.legend,
            options: [
              ['inside', t('legend.inside')],
              ['above', t('legend.above')],
              ['below', t('legend.below')],
              ['right', t('legend.right')],
              ['none', t('legend.none')],
            ],
            onChange: (value) => set('layout', 'legend', value),
          }),
          spec.layout.legend === 'inside'
            ? h(Select, {
                label: t('legendCorner'),
                value: spec.layout.legendCorner,
                options: [['bottom-left', '◣'], ['bottom-right', '◢'], ['top-left', '◤'], ['top-right', '◥']],
                onChange: (value) => set('layout', 'legendCorner', value),
              })
            : null,
          h(Select, {
            label: t('legendColumns'),
            value: String(spec.layout.legendColumns),
            options: [['0', t('auto')], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']],
            onChange: (value) => set('layout', 'legendColumns', Number(value)),
          }),
        ),
        h(Section, { title: t('typography') },
          h(Select, {
            label: t('family'),
            value: spec.typography.family,
            options: [['sans', t('family.sans')], ['serif', t('family.serif')]],
            onChange: (value) => set('typography', 'family', value),
          }),
          h(Slider, { label: t('tickSize'), value: spec.typography.tickSize, min: 5, max: 16, step: 0.5, onChange: (value) => set('typography', 'tickSize', value) }),
          h(Slider, { label: t('labelSize'), value: spec.typography.labelSize, min: 5, max: 18, step: 0.5, onChange: (value) => set('typography', 'labelSize', value) }),
          h(Slider, { label: t('titleSize'), value: spec.typography.titleSize, min: 6, max: 24, step: 0.5, onChange: (value) => set('typography', 'titleSize', value) }),
          h(Slider, { label: t('legendSize'), value: spec.typography.legendSize, min: 5, max: 16, step: 0.5, onChange: (value) => set('typography', 'legendSize', value) }),
        ),
        h(Section, { title: t('palette') },
          h(Select, {
            label: t('paletteId'),
            value: spec.palette.id,
            options: paletteOptions,
            onChange: (value) => patch({ palette: { id: value } }, true),
          }),
          h(Slider, { label: t('lineWidth'), value: spec.style.lineWidth, min: 0.6, max: 4, step: 0.1, onChange: (value) => set('style', 'lineWidth', value) }),
          h(Slider, { label: t('bandAlpha'), value: spec.style.bandAlpha, min: 0, max: 0.6, step: 0.02, onChange: (value) => set('style', 'bandAlpha', value) }),
          h(Select, {
            label: t('grid'),
            value: spec.style.grid,
            options: [['none', t('grid.none')], ['y', t('grid.y')], ['x', t('grid.x')], ['both', t('grid.both')]],
            onChange: (value) => set('style', 'grid', value),
          }),
          h(Select, {
            label: t('spines'),
            value: spec.style.spines,
            options: [
              ['left-bottom', t('spines.left-bottom')],
              ['left-bottom-top-right', t('spines.box')],
              ['none', t('spines.none')],
            ],
            onChange: (value) => set('style', 'spines', value),
          }),
          h(Select, {
            label: t('uncertainty'),
            value: spec.style.uncertainty,
            options: [['band', t('uncertainty.band')], ['errorbar', t('uncertainty.errorbar')], ['none', t('uncertainty.none')]],
            onChange: (value) => set('style', 'uncertainty', value),
          }),
          h(Select, {
            label: t('markers'),
            value: spec.style.markers,
            options: [['none', t('markers.none')], ['auto', t('markers.auto')]],
            onChange: (value) => set('style', 'markers', value),
          }),
          h(Select, {
            label: t('lineDash'),
            value: spec.style.lineDash,
            options: [['auto', t('lineDash.auto')], ['solid', t('lineDash.solid')]],
            onChange: (value) => set('style', 'lineDash', value),
          }),
          h('div', { className: 'sf-subhead' }, t('overrides')),
          methods.map((method) =>
            h('div', { key: method, className: 'sf-color-row' },
              h('span', { className: 'sf-color-name' }, method),
              h('input', {
                type: 'color',
                value: spec.palette.overrides?.[method] || resolvedColor(spec, method, methods.indexOf(method)),
                onChange: (event) => patch({ palette: { overrides: { [method]: event.target.value } } }, true),
              }),
              spec.palette.overrides?.[method]
                ? h('button', {
                    className: 'sf-link',
                    onClick: () => patch({ palette: { overrides: { [method]: null } } }, true),
                  }, '↺')
                : null,
            ),
          ),
        ),
        h(Section, { title: t('axes') },
          h(Select, {
            label: t('xScale'),
            value: spec.axes.xScale,
            options: [['linear', t('linear')], ['log', t('log')]],
            onChange: (value) => set('axes', 'xScale', value),
          }),
          h(Select, {
            label: t('yScale'),
            value: spec.axes.yScale,
            options: [['linear', t('linear')], ['log', t('log')]],
            onChange: (value) => set('axes', 'yScale', value),
          }),
          h(Toggle, { label: t('includeZero'), checked: spec.axes.includeZero, onChange: (value) => set('axes', 'includeZero', value) }),
          h(Toggle, { label: t('shareY'), checked: spec.axes.shareY, onChange: (value) => set('axes', 'shareY', value) }),
          h(Slider, { label: t('xTicks'), value: spec.axes.xTickCount, min: 3, max: 12, step: 1, onChange: (value) => set('axes', 'xTickCount', value) }),
          h(Slider, { label: t('yTicks'), value: spec.axes.yTickCount, min: 3, max: 10, step: 1, onChange: (value) => set('axes', 'yTickCount', value) }),
          h(Select, {
            label: t('sci'),
            value: spec.axes.sciNotation,
            options: [['auto', t('sci.auto')], ['never', t('sci.never')]],
            onChange: (value) => set('axes', 'sciNotation', value),
          }),
          h(TextField, { label: t('xLabel'), value: spec.axes.xLabel === 'auto' ? '' : spec.axes.xLabel, placeholder: 'auto', onChange: (value) => set('axes', 'xLabel', value || 'auto') }),
          h(TextField, { label: t('yLabel'), value: spec.axes.yLabel === 'auto' ? '' : spec.axes.yLabel, placeholder: 'auto', onChange: (value) => set('axes', 'yLabel', value || 'auto') }),
          h(TextField, { label: t('metric'), value: spec.labels.metric, placeholder: 'auto', onChange: (value) => patch({ labels: { metric: value } }) }),
          h(TextField, { label: t('unit'), value: spec.labels.unit, placeholder: 'auto', onChange: (value) => patch({ labels: { unit: value } }) }),
          h(Select, {
            label: t('direction'),
            value: spec.labels.direction,
            options: [['higher', t('higher')], ['lower', t('lower')]],
            onChange: (value) => patch({ labels: { direction: value } }, true),
          }),
          h(Toggle, { label: t('directionNote'), checked: spec.labels.directionNote, onChange: (value) => patch({ labels: { directionNote: value } }, true) }),
          h(Toggle, { label: t('bootstrapNote'), checked: spec.labels.bootstrapNote, onChange: (value) => patch({ labels: { bootstrapNote: value } }, true) }),
        ),
        h(Section, { title: t('statistics'), defaultOpen: false },
          h(Select, {
            label: t('estimator'),
            value: spec.stats.estimator,
            options: [['mean', t('mean')], ['iqm', t('iqm')]],
            onChange: (value) => set('stats', 'estimator', value),
          }),
          h(Slider, { label: t('resamples'), value: spec.stats.resamples, min: 200, max: 4000, step: 100, onChange: (value) => set('stats', 'resamples', value) }),
          h(NumberField, { label: t('seed'), value: spec.stats.seed, min: 0, max: 999999999, step: 1, onChange: (value) => set('stats', 'seed', value) }),
          h(Slider, { label: t('smooth'), value: spec.style.smoothWindow, min: 1, max: 15, step: 1, onChange: (value) => set('style', 'smoothWindow', value) }),
          h(Slider, { label: t('checkpoints'), value: spec.data.checkpointCount, min: 2, max: 12, step: 1, onChange: (value) => set('data', 'checkpointCount', value) }),
          h(Select, {
            label: t('checkpointMode'),
            value: spec.data.checkpointMode,
            options: [['linear', t('checkpointMode.linear')], ['log', t('checkpointMode.log')]],
            onChange: (value) => set('data', 'checkpointMode', value),
          }),
          h(Select, {
            label: t('transform'),
            value: spec.data.transform,
            options: [
              ['none', t('transform.none')],
              ['linear-to-db', t('transform.linear-to-db')],
              ['amplitude-to-db', t('transform.amplitude-to-db')],
            ],
            onChange: (value) => set('data', 'transform', value),
          }),
          h(Select, {
            label: t('variant'),
            value: spec.data.variant,
            options: [
              ['main', t('variant.main')],
              ['ablation', t('variant.ablation')],
              ['sensitivity', t('variant.sensitivity')],
              ['all', t('variant.all')],
            ],
            onChange: (value) => set('data', 'variant', value),
          }),
        ),
      )
    }

    function resolvedColor(spec, method, index) {
      const palettes = {
        'paper-warm': ['#4C78A8', '#2A9D8F', '#F4A261', '#E63946', '#8E6C8A', '#6A9FB5', '#B5651D', '#3D5A40'],
        'okabe-ito': ['#0072B2', '#E69F00', '#009E73', '#CC79A7', '#56B4E9', '#D55E00', '#F0E442', '#000000'],
        tableau: ['#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F', '#EDC948', '#B07AA1', '#FF9DA7'],
        ieee: ['#00429D', '#C8102E', '#1B7F3A', '#F2A900', '#6A3D9A', '#00838F', '#8C564B', '#222222'],
        grayscale: ['#1A1A1A', '#5C5C5C', '#8C8C8C', '#B3B3B3', '#404040', '#737373', '#A6A6A6', '#D9D9D9'],
      }
      const colors = palettes[spec.palette.id] ?? palettes['paper-warm']
      return colors[Math.max(0, index) % colors.length]
    }

    /* ------------------------------------------------------------ data tab */

    function DataTab({ t, detail, audit, patch, onDownload }) {
      const summary = audit?.summary
      return h(
        'div',
        null,
        h(Section, { title: t('audit') },
          summary
            ? h('div', { className: 'sf-stats-grid' },
                h(Stat, { label: t('audit.rows'), value: summary.rows }),
                h(Stat, { label: t('audit.scenarios'), value: summary.scenarios }),
                h(Stat, { label: t('audit.methods'), value: summary.methods }),
                h(Stat, { label: t('audit.trials'), value: summary.seeds }),
                h(Stat, { label: t('audit.steps'), value: summary.steps }),
                h(Stat, { label: t('audit.range'), value: `${summary.stepRange[0]}–${summary.stepRange[1]}` }),
              )
            : h('div', { className: 'sf-hint' }, t('empty')),
          h('div', { className: 'sf-source' },
            h('span', { className: 'sf-chip-static' }, detail.project.csvName || '—'),
            detail.project.demo ? h('span', { className: 'sf-chip-warn' }, t('meta.demo')) : null,
          ),
          summary?.metric ? h('div', { className: 'sf-hint' }, `${summary.metric} · ${summary.unit || 'a.u.'}`) : null,
          h('div', { className: 'sf-audit-banner', 'data-state': audit?.errorCount ? 'bad' : 'good' },
            audit?.errorCount ? t('audit.blocked') : t('audit.ok')),
          audit?.errors?.length
            ? h('div', { className: 'sf-audit-list' },
                audit.errors.map((item, index) => h('div', { key: index, className: 'sf-audit-item sf-audit-bad' },
                  h('span', { className: 'sf-audit-kind' }, item.kind),
                  h('span', null, item.message),
                )),
              )
            : null,
          audit?.warnings?.length
            ? h('div', { className: 'sf-audit-list' },
                audit.warnings.map((message, index) => h('div', { key: index, className: 'sf-audit-item sf-audit-warn' }, message)),
              )
            : null,
        ),
        detail.figure
          ? h(Section, { title: `${t('data')} · ${detail.figure.panels.length} ${t('figure.panels')}` },
              h('div', { className: 'sf-hint' }, detail.figure.panels.join(' · ')),
              h('div', { className: 'sf-hint' },
                `${detail.figure.methods.length} methods · ${detail.figure.seedCount} trials · ${detail.figure.rows} rows · variant "${detail.figure.variant}"`),
              h('div', { className: 'sf-hint' }, `checkpoints: ${detail.figure.checkpoints.join(', ')}`),
            )
          : null,
        h(Section, { title: t('download'), defaultOpen: false },
          h('div', { className: 'sf-download-grid' },
            h('button', { className: 'sf-btn', onClick: () => onDownload('svg') }, t('download.svg')),
            h('button', { className: 'sf-btn', onClick: () => onDownload('png') }, t('download.png')),
            h('button', { className: 'sf-btn', onClick: () => onDownload('csv') }, t('download.csv')),
            h('button', { className: 'sf-btn', onClick: () => onDownload('spec') }, t('download.spec')),
            h('button', { className: 'sf-btn', onClick: () => onDownload('qa') }, t('download.qa')),
          ),
        ),
        h(Section, { title: t('variant'), defaultOpen: false },
          h(Select, {
            label: t('variant'),
            value: detail.spec.data.variant,
            options: [['main', t('variant.main')], ['ablation', t('variant.ablation')], ['sensitivity', t('variant.sensitivity')], ['all', t('variant.all')]],
            onChange: (value) => patch({ data: { variant: value } }, true),
          }),
        ),
      )
    }

    function Stat({ label, value }) {
      return h('div', { className: 'sf-stat' }, h('div', { className: 'sf-stat-value' }, String(value)), h('div', { className: 'sf-stat-label' }, label))
    }

    /* -------------------------------------------------------------- QA tab */

    function QaTab({ t, qa, detail }) {
      if (!qa) return h('div', { className: 'sf-hint' }, t('panel.needImport'))
      return h(
        'div',
        null,
        h('div', { className: 'sf-qa-head' },
          h('div', { className: 'sf-qa-score' }, h('span', null, qa.total), h('small', null, `/${qa.max}`)),
          h('div', null,
            h('div', { className: 'sf-qa-state', 'data-ok': qa.publishable }, qa.publishable ? t('qa.publishable') : t('qa.notPublishable')),
            h('div', { className: 'sf-hint' }, t('qa.hint')),
          ),
        ),
        h('div', { className: 'sf-qa-bar' },
          h('div', { className: 'sf-qa-bar-fill', style: { width: `${(qa.total / qa.max) * 100}%` }, 'data-ok': qa.publishable }),
        ),
        qa.blocking?.length ? h('div', { className: 'sf-audit-banner', 'data-state': 'bad' }, `${t('qa.blocking')}: ${qa.blocking.join(', ')}`) : null,
        h('div', { className: 'sf-qa-list' },
          qa.items.map((item) =>
            h('div', { key: item.id, className: 'sf-qa-item', 'data-score': item.score },
              h('span', { className: 'sf-qa-dot' }),
              h('div', { className: 'sf-qa-text' },
                h('div', { className: 'sf-qa-label' }, item.label, h('span', { className: 'sf-qa-points' }, `${item.score}/2`)),
                h('div', { className: 'sf-qa-note' }, item.note),
              ),
            ),
          ),
        ),
        detail?.warnings?.length
          ? h(Section, { title: t('warnings') },
              detail.warnings.map((warning, index) => h('div', { key: index, className: 'sf-audit-item sf-audit-warn' }, warning)),
            )
          : null,
      )
    }

    /* --------------------------------------------------------- history tab */

    function HistoryTab({ t, detail, note, setNote, onCommit, onRollback, onShowVersion }) {
      const versions = detail.history ?? []
      return h(
        'div',
        null,
        h('div', { className: 'sf-note-row' },
          h('input', {
            type: 'text',
            placeholder: t('versions.notePlaceholder'),
            value: note,
            onChange: (event) => setNote(event.target.value),
          }),
          h('button', { className: 'sf-btn sf-btn-primary', onClick: onCommit }, t('commit')),
        ),
        versions.length === 0 ? h('div', { className: 'sf-hint' }, t('versions.empty')) : null,
        versions.length > 0 ? h('div', { className: 'sf-hint' }, `${t('versions.diff')}: ${t('versions.diffHint')}`) : null,
        h('div', { className: 'sf-version-list' },
          versions.slice().reverse().map((version) =>
            h('div', { key: version.id, className: 'sf-version', 'data-head': version.id === detail.project.headVersionId },
              h('div', { className: 'sf-version-head' },
                h('span', { className: 'sf-version-id' }, version.id),
                version.id === detail.project.headVersionId ? h('span', { className: 'sf-chip-ok' }, t('versions.head')) : null,
                h('span', { className: 'sf-version-time' }, new Date(version.createdAt).toLocaleString()),
              ),
              version.note ? h('div', { className: 'sf-version-note' }, version.note) : null,
              version.diff?.length
                ? h('div', { className: 'sf-version-diff' },
                    version.diff.slice(0, 6).map((change, index) =>
                      h('div', { key: index, className: 'sf-diff-row' },
                        h('code', null, change.path),
                        h('span', null, ` ${String(change.from ?? '∅')} → ${String(change.to ?? '∅')}`),
                      ),
                    ),
                    version.diff.length > 6 ? h('div', { className: 'sf-hint' }, `+${version.diff.length - 6}`) : null,
                  )
                : null,
              h('div', { className: 'sf-version-actions' },
                h('button', { className: 'sf-link', onClick: () => onShowVersion(version.id) }, t('compare')),
                version.id === detail.project.headVersionId
                  ? null
                  : h('button', { className: 'sf-link sf-danger', onClick: () => onRollback(version.id) }, t('rollback')),
              ),
            ),
          ),
        ),
      )
    }

    /* ------------------------------------------------------ version strip */

    function VersionStrip({ t, detail, compare, onShowVersion, onRollback }) {
      if (!detail) return null
      const versions = detail.history ?? []
      return h(
        'div',
        { className: 'sf-versions' },
        h('span', { className: 'sf-versions-label' }, t('versions')),
        versions.length === 0 ? h('span', { className: 'sf-hint' }, t('versions.empty')) : null,
        versions.map((version) =>
          h('button', {
            key: version.id,
            type: 'button',
            className: 'sf-chip',
            'data-head': version.id === detail.project.headVersionId,
            'data-selected': compare?.previewVersionId === version.id,
            title: version.note || version.id,
            onClick: () => onShowVersion(version.id),
          }, version.id),
        ),
        compare?.previewVersionId
          ? h('button', { className: 'sf-btn sf-btn-primary sf-chip-action', onClick: () => onRollback(compare.previewVersionId) }, `${t('rollback')} → ${compare.previewVersionId}`)
          : null,
      )
    }

    function RenameDialog({ t, initial, onCancel, onConfirm }) {
      const [value, setValue] = React.useState(initial)
      return h(
        'div',
        { className: 'sf-modal-backdrop', onClick: onCancel },
        h('div', { className: 'sf-modal', onClick: (event) => event.stopPropagation() },
          h('div', { className: 'sf-modal-title' }, t('rename')),
          h('input', { type: 'text', value, autoFocus: true, onChange: (event) => setValue(event.target.value), onKeyDown: (event) => { if (event.key === 'Enter') onConfirm(value); if (event.key === 'Escape') onCancel() } }),
          h('div', { className: 'sf-modal-actions' },
            h('button', { className: 'sf-btn', onClick: onCancel }, '✕'),
            h('button', { className: 'sf-btn sf-btn-primary', onClick: () => onConfirm(value) }, '✓'),
          ),
        ),
      )
    }

    /* -------------------------------------------------------------- helpers */

    function mergeDeep(target, patch) {
      const out = { ...target }
      for (const [key, value] of Object.entries(patch)) {
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          out[key] = mergeDeep(target?.[key] ?? {}, value)
        } else {
          out[key] = value
        }
      }
      return out
    }

    function rasterize(svg, width, height, background) {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.onload = () => {
          try {
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const context = canvas.getContext('2d')
            context.fillStyle = background
            context.fillRect(0, 0, width, height)
            context.drawImage(image, 0, 0, width, height)
            canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('canvas produced no image'))), 'image/png')
          } catch (failure) {
            reject(failure)
          }
        }
        image.onerror = () => reject(new Error('the SVG could not be decoded'))
        image.src = svgDataUrl(svg)
      })
    }

    const CSS = `
.sf-root{display:flex;flex-direction:column;height:100%;min-height:560px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.45;overflow:hidden}
.sf-root *{box-sizing:border-box}
.sf-center-state{align-items:center;justify-content:center}
.sf-state-card{max-width:520px;padding:22px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}
.sf-state-title{font-size:15px;font-weight:600;margin-bottom:6px}
.sf-state-text{color:var(--dsw-alias-label-secondary);font-size:13px;margin-bottom:14px;white-space:pre-wrap}
.sf-toolbar{display:flex;align-items:center;gap:12px;padding:9px 14px;border-bottom:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);flex:none}
.sf-toolbar-title{flex:1;min-width:0}
.sf-title{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sf-muted{color:var(--dsw-alias-label-secondary);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sf-busy{font-size:11.5px;color:var(--dsw-alias-brand-primary)}
.sf-toolbar-actions{display:flex;align-items:center;gap:6px;flex:none}
.sf-body{display:flex;flex:1;min-height:0}
.sf-left{width:236px;flex:none;border-right:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);padding:10px;overflow:auto;display:flex;flex-direction:column;gap:8px}
.sf-right{width:318px;flex:none;border-left:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);display:flex;flex-direction:column;min-height:0}
.sf-scroll{flex:1;min-height:0;overflow:auto;padding:8px 12px 18px}
.sf-center{flex:1;min-width:0;display:flex;flex-direction:column;background:var(--dsw-alias-bg-layer-2);min-height:0}
.sf-canvas{flex:1;min-height:0;overflow:auto;display:flex;align-items:center;justify-content:center;padding:16px;gap:16px}
.sf-figure{display:block;background:#fff;box-shadow:0 1px 8px rgba(0,0,0,.16);border-radius:2px;max-width:100%;max-height:100%}
.sf-pane-head{display:flex;align-items:center;justify-content:space-between;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--dsw-alias-label-secondary)}
.sf-pane-head-gap{margin-top:6px}
.sf-link{background:none;border:none;color:var(--dsw-alias-brand-primary);cursor:pointer;font-size:12px;padding:2px 0}
.sf-link:hover{text-decoration:underline}
.sf-danger,.sf-link.sf-danger{color:var(--dsw-alias-state-error-primary)}
.sf-type-list{display:flex;flex-direction:column;gap:5px}
.sf-type-card{text-align:left;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:inherit;border-radius:8px;padding:7px 9px;cursor:pointer;transition:border-color .12s}
.sf-type-card:hover{border-color:var(--dsw-alias-border-l2)}
.sf-type-card[data-active=true]{border-color:var(--dsw-alias-brand-primary);box-shadow:inset 0 0 0 1px var(--dsw-alias-brand-primary)}
.sf-type-name{font-size:12.5px;font-weight:600}
.sf-type-desc{font-size:11px;color:var(--dsw-alias-label-secondary);margin-top:2px}
.sf-project-list{display:flex;flex-direction:column;gap:4px}
.sf-project{display:flex;flex-direction:column;gap:1px;text-align:left;border:1px solid transparent;background:none;color:inherit;border-radius:7px;padding:6px 8px;cursor:pointer}
.sf-project:hover{background:var(--dsw-alias-bg-layer-2)}
.sf-project[data-active=true]{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l1)}
.sf-project-name{font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sf-project-meta{font-size:10.5px;color:var(--dsw-alias-label-secondary)}
.sf-left-foot{margin-top:auto;padding-top:8px}
.sf-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:40px;max-width:520px}
.sf-empty-title{font-size:14px;color:var(--dsw-alias-label-secondary)}
.sf-empty-actions{display:flex;gap:8px}
.sf-canvas-head{display:flex;align-items:center;gap:10px;padding:8px 14px 0;flex:none}
.sf-canvas-actions{display:flex;align-items:center;gap:6px;flex:1;min-width:0;flex-wrap:wrap}
.sf-canvas-meta{margin-left:auto}
.sf-canvas-foot{display:flex;align-items:center;gap:14px;padding:7px 14px;border-top:1px solid var(--dsw-alias-border-l1);flex:none;flex-wrap:wrap}
.sf-seg{display:flex;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;overflow:hidden}
.sf-seg button{background:var(--dsw-alias-bg-layer-1);border:none;color:var(--dsw-alias-label-secondary);font-size:11.5px;padding:4px 9px;cursor:pointer}
.sf-seg button[data-active=true]{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font-weight:600}
.sf-btn{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border-radius:7px;padding:4px 10px;font-size:12px;cursor:pointer;white-space:nowrap}
.sf-btn:hover{border-color:var(--dsw-alias-border-l2)}
.sf-btn:disabled{opacity:.45;cursor:default}
.sf-btn-primary{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);color:#fff}
.sf-menu{position:relative}
.sf-menu-list{position:absolute;right:0;top:calc(100% + 4px);z-index:30;width:280px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.22);padding:6px;max-height:60vh;overflow:auto}
.sf-menu-title{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--dsw-alias-label-secondary);padding:4px 8px}
.sf-menu-item{display:flex;flex-direction:column;gap:2px;width:100%;text-align:left;background:none;border:none;color:inherit;border-radius:7px;padding:6px 8px;cursor:pointer;font-size:12.5px}
.sf-menu-item:hover{background:var(--dsw-alias-bg-layer-2)}
.sf-menu-note{font-size:10.5px;color:var(--dsw-alias-label-secondary)}
.sf-menu-foot{padding:6px 8px;font-size:10.5px;color:var(--dsw-alias-label-secondary);border-top:1px solid var(--dsw-alias-border-l1);margin-top:4px}
.sf-tabs{display:flex;border-bottom:1px solid var(--dsw-alias-border-l1);flex:none}
.sf-tab{flex:1;padding:8px 2px;font-size:12px;background:none;border:none;border-bottom:2px solid transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}
.sf-tab[data-active=true]{color:var(--dsw-alias-label-primary);border-bottom-color:var(--dsw-alias-brand-primary);font-weight:600}
.sf-section{border-bottom:1px solid var(--dsw-alias-border-l1);padding:2px 0}
.sf-section-head{display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:none;color:inherit;font-size:12px;font-weight:600;padding:8px 0 6px;cursor:pointer}
.sf-chevron{color:var(--dsw-alias-label-secondary);font-size:13px}
.sf-section-body{padding-bottom:6px}
.sf-field{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:3px 0;min-height:26px}
.sf-field-label{font-size:11.5px;color:var(--dsw-alias-label-secondary);flex:1;min-width:0}
.sf-field-control{flex:none;display:flex;align-items:center;gap:4px;max-width:52%}
.sf-field-control input[type=range]{width:96px}
.sf-hint{font-size:10.8px;color:var(--dsw-alias-label-secondary);line-height:1.4}
.sf-subhead{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--dsw-alias-label-secondary);margin:10px 0 4px}
.sf-color-row{display:flex;align-items:center;gap:6px;padding:2px 0}
.sf-color-name{flex:1;font-size:11.5px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
input[type=text],input[type=number],select{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l1);border-radius:6px;padding:3px 6px;font-size:11.5px;min-width:0;max-width:120px}
input[type=text]:focus,input[type=number]:focus,select:focus{outline:1px solid var(--dsw-alias-brand-primary);outline-offset:0}
input[type=checkbox]{accent-color:var(--dsw-alias-brand-primary);width:15px;height:15px}
input[type=color]{width:26px;height:22px;padding:0;border:1px solid var(--dsw-alias-border-l1);border-radius:5px;background:none;cursor:pointer}
input[type=range]{accent-color:var(--dsw-alias-brand-primary)}
.sf-stats-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin:4px 0 8px}
.sf-stat{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;padding:6px}
.sf-stat-value{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sf-stat-label{font-size:10px;color:var(--dsw-alias-label-secondary)}
.sf-source{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}
.sf-chip-static,.sf-chip-warn,.sf-chip-ok{font-size:10.5px;border-radius:20px;padding:1px 8px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);white-space:nowrap}
.sf-chip-warn{border-color:var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-state-warn-primary)}
.sf-chip-ok{border-color:var(--dsw-alias-state-success-primary);color:var(--dsw-alias-state-success-primary)}
.sf-audit-banner{margin:6px 0;padding:6px 8px;border-radius:7px;font-size:11.5px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1)}
.sf-audit-banner[data-state=bad]{border-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}
.sf-audit-banner[data-state=good]{border-color:var(--dsw-alias-state-success-primary)}
.sf-audit-list{display:flex;flex-direction:column;gap:4px;margin:4px 0}
.sf-audit-item{font-size:11px;line-height:1.4;padding:4px 6px;border-radius:6px;background:var(--dsw-alias-bg-layer-2)}
.sf-audit-bad{border-left:2px solid var(--dsw-alias-state-error-primary)}
.sf-audit-warn{border-left:2px solid var(--dsw-alias-state-warn-primary)}
.sf-audit-kind{font-size:9.5px;text-transform:uppercase;letter-spacing:.04em;color:var(--dsw-alias-label-secondary);margin-right:6px}
.sf-inline-error{margin:8px 14px 0;padding:6px 10px;border-radius:8px;border:1px solid var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary);display:flex;align-items:center;gap:10px;font-size:12px}
.sf-warnings{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:0 14px 6px;flex:none}
.sf-warnings-tag{font-size:10.5px;color:var(--dsw-alias-state-warn-primary);text-transform:uppercase;letter-spacing:.04em}
.sf-warning{font-size:10.8px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:20px;padding:1px 8px}
.sf-compare{display:flex;gap:16px;align-items:flex-start;width:100%;justify-content:center;flex-wrap:wrap}
.sf-compare-pane{display:flex;flex-direction:column;gap:6px;align-items:center;min-width:220px;max-width:46%}
.sf-compare-label{display:flex;gap:10px;align-items:center;font-size:11.5px;color:var(--dsw-alias-label-secondary)}
.sf-versions{display:flex;align-items:center;gap:6px;padding:7px 14px;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);overflow-x:auto;flex:none}
.sf-versions-label{font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--dsw-alias-label-secondary);margin-right:4px;flex:none}
.sf-chip{flex:none;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);border-radius:20px;padding:2px 10px;font-size:11px;cursor:pointer}
.sf-chip[data-head=true]{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary);font-weight:600}
.sf-chip[data-selected=true]{background:var(--dsw-alias-brand-primary);color:#fff;border-color:var(--dsw-alias-brand-primary)}
.sf-chip-action{margin-left:8px}
.sf-version-list{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.sf-version{border:1px solid var(--dsw-alias-border-l1);border-radius:9px;padding:8px;background:var(--dsw-alias-bg-layer-2)}
.sf-version[data-head=true]{border-color:var(--dsw-alias-brand-primary)}
.sf-version-head{display:flex;align-items:center;gap:8px;font-size:11.5px}
.sf-version-id{font-weight:600}
.sf-version-time{margin-left:auto;font-size:10px;color:var(--dsw-alias-label-secondary)}
.sf-version-note{font-size:11.5px;margin-top:3px}
.sf-version-diff{margin-top:5px;display:flex;flex-direction:column;gap:2px}
.sf-diff-row{font-size:10.5px;color:var(--dsw-alias-label-secondary);display:flex;gap:6px;overflow:hidden}
.sf-diff-row code{color:var(--dsw-alias-label-primary);font-size:10.5px;background:var(--dsw-alias-bg-layer-1);border-radius:4px;padding:0 4px}
.sf-version-actions{display:flex;gap:12px;margin-top:5px}
.sf-note-row{display:flex;gap:6px;align-items:center;padding:6px 0 2px}
.sf-note-row input{flex:1;max-width:none}
.sf-qa-head{display:flex;align-items:center;gap:12px;padding:6px 0}
.sf-qa-score{font-size:26px;font-weight:700;line-height:1}
.sf-qa-score small{font-size:12px;font-weight:500;color:var(--dsw-alias-label-secondary)}
.sf-qa-state{font-size:12px;font-weight:600}
.sf-qa-state[data-ok=true]{color:var(--dsw-alias-state-success-primary)}
.sf-qa-state[data-ok=false]{color:var(--dsw-alias-state-warn-primary)}
.sf-qa-bar{height:6px;border-radius:4px;background:var(--dsw-alias-bg-layer-2);overflow:hidden;margin:4px 0 10px}
.sf-qa-bar-fill{height:100%;background:var(--dsw-alias-state-warn-primary)}
.sf-qa-bar-fill[data-ok=true]{background:var(--dsw-alias-state-success-primary)}
.sf-qa-list{display:flex;flex-direction:column;gap:6px}
.sf-qa-item{display:flex;gap:8px;padding:5px 7px;border-radius:8px;background:var(--dsw-alias-bg-layer-2)}
.sf-qa-dot{width:7px;height:7px;border-radius:50%;margin-top:5px;flex:none;background:var(--dsw-alias-state-error-primary)}
.sf-qa-item[data-score="1"] .sf-qa-dot{background:var(--dsw-alias-state-warn-primary)}
.sf-qa-item[data-score="2"] .sf-qa-dot{background:var(--dsw-alias-state-success-primary)}
.sf-qa-text{flex:1;min-width:0}
.sf-qa-label{font-size:11.5px;font-weight:600;display:flex;justify-content:space-between;gap:8px}
.sf-qa-points{font-weight:500;color:var(--dsw-alias-label-secondary);font-size:10.5px}
.sf-qa-note{font-size:10.8px;color:var(--dsw-alias-label-secondary)}
.sf-download-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.sf-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;z-index:100}
.sf-modal{background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:12px;padding:16px;width:360px;display:flex;flex-direction:column;gap:10px;box-shadow:0 20px 50px rgba(0,0,0,.35)}
.sf-modal-title{font-size:13px;font-weight:600}
.sf-modal input{max-width:none;width:100%}
.sf-modal-actions{display:flex;justify-content:flex-end;gap:8px}
`

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        // Locale dictionaries for this plugin's own UI text.
        ctx.effect(() => {
          const disposers = []
          for (const locale of ['en', 'zh']) {
            disposers.push(ctx.locale.register(NS, locale, DICT[locale]))
          }
          return () => {
            for (const disposer of disposers) disposer()
          }
        }, 'signal-figure-studio: locale')

        const panel = () => h(StudioAppWithContext, { ctx })

        ctx.slots.inject('main', () =>
          ctx.slots.register({ name: 'main', key: 'signal-figure-studio' }, panel),
        )

        ctx.slots.inject('sidebar.panellist', () =>
          ctx.slots.register(
            { name: 'sidebar.panellist', id: 'signal-figure-studio', order: 20, label: () => translate(ctx, 'panel.title') },
            PanelIcon,
          ),
        )
      },
    }

    function translate(ctx, key) {
      try {
        const active = ctx.locale.getLocale().active
        return (DICT[active] ?? DICT.en)[key] ?? DICT.en[key] ?? key
      } catch {
        return DICT.en[key] ?? key
      }
    }

    function StudioAppWithContext({ ctx }) {
      const [, force] = React.useState(0)
      React.useEffect(() => {
        // Re-render on locale switches so every label follows the active language.
        const dispose = ctx.locale.subscribe(() => force((value) => value + 1))
        return dispose
      }, [ctx])
      const t = React.useCallback((key, fallback) => {
        const active = ctx.locale.getLocale().active
        return (DICT[active] ?? DICT.en)[key] ?? DICT.en[key] ?? fallback ?? key
      }, [ctx])
      return h(StudioApp, { t })
    }

    function PanelIcon({ size, active }) {
      const color = active ? 'var(--dsw-alias-brand-primary)' : 'currentColor'
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': true },
        h('path', { d: 'M2.5 15.5h15', stroke: color, strokeWidth: 1.3, strokeLinecap: 'round' }),
        h('path', { d: 'M2.5 12.2 6 7.4l3.1 3.1L13 4.6l4.5 6.2', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        h('path', { d: 'M2.5 6.5V15.5h15V10', stroke: color, strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.55 }),
      )
    }
  },
})
