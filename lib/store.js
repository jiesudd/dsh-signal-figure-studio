/**
 * Durable project storage for the studio.
 *
 * The Desktop Web surface binds an ephemeral port on every launch, so browser
 * storage cannot hold figure projects; the Host owns one JSON file under the
 * DSH home and publishes it atomically.
 */
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

const MAX_PROJECTS = 40
const MAX_VERSIONS = 60
const MAX_CSV_BYTES = 8 * 1024 * 1024

export function storageDir() {
  const home = process.env.DSH_HOME || join(homedir(), '.dsh')
  return join(home, 'storages', 'signal-figure-studio')
}

function projectFile() {
  return join(storageDir(), 'projects.json')
}

function emptyState() {
  return { version: 1, updatedAt: 0, projects: [] }
}

function readState() {
  try {
    const parsed = JSON.parse(readFileSync(projectFile(), 'utf8'))
    if (!parsed || !Array.isArray(parsed.projects)) return emptyState()
    return parsed
  } catch {
    return emptyState()
  }
}

function writeState(state) {
  const file = projectFile()
  mkdirSync(dirname(file), { recursive: true })
  const temporary = `${file}.${process.pid}.tmp`
  writeFileSync(temporary, JSON.stringify(state), 'utf8')
  renameSync(temporary, file)
}

export function loadProjects() {
  return readState().projects
}

export function findProject(id) {
  return readState().projects.find((project) => project.id === id)
}

export function upsertProject(project) {
  const state = readState()
  project.updatedAt = Date.now()
  const index = state.projects.findIndex((item) => item.id === project.id)
  if (index >= 0) state.projects[index] = project
  else state.projects.unshift(project)
  state.projects = state.projects.slice(0, MAX_PROJECTS)
  state.updatedAt = Date.now()
  writeState(state)
  return project
}

export function deleteProject(id) {
  const state = readState()
  const before = state.projects.length
  state.projects = state.projects.filter((project) => project.id !== id)
  state.updatedAt = Date.now()
  writeState(state)
  return state.projects.length < before
}

export function trimVersions(project) {
  if (project.versions.length > MAX_VERSIONS) {
    project.versions = project.versions.slice(-MAX_VERSIONS)
  }
  return project
}

export function csvTooLarge(text) {
  return Buffer.byteLength(String(text ?? ''), 'utf8') > MAX_CSV_BYTES
}

/** Strip the heavy CSV text from the list payload. */
export function projectSummary(project) {
  return {
    id: project.id,
    name: project.name,
    type: project.type,
    demo: project.demo === true,
    csvName: project.csvName,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    versions: project.versions.length,
    spec: project.spec,
  }
}
