import { computeMapBucket, getStateEvv } from './evvByState'
import type { MapBucket } from './evvTypes'

export const OVERRIDES_STORAGE_KEY = 'evv-us-map-user-overrides-v1'

export type UserStateOverride = {
  /** When set, map and summaries use this instead of the guide rollup. */
  bucketOverride?: MapBucket
  notes?: string
  comments?: string
}

export type UserOverridesMap = Record<string, UserStateOverride>

export function loadOverridesFromStorage(): UserOverridesMap {
  try {
    const raw = localStorage.getItem(OVERRIDES_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return parsed as UserOverridesMap
  } catch {
    return {}
  }
}

export function saveOverridesToStorage(map: UserOverridesMap): void {
  localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(map))
}

/** Strip empty fields and empty rows before persisting. */
export function normalizeOverrides(map: UserOverridesMap): UserOverridesMap {
  const out: UserOverridesMap = {}
  for (const [code, o] of Object.entries(map)) {
    const n: UserStateOverride = {}
    if (
      o.bucketOverride &&
      o.bucketOverride !== 'unknown'
    ) {
      n.bucketOverride = o.bucketOverride
    }
    const notes = o.notes?.trim()
    const comments = o.comments?.trim()
    if (notes) n.notes = notes
    if (comments) n.comments = comments
    if (Object.keys(n).length > 0) out[code] = n
  }
  return out
}

export function displayBucketForState(
  code: string | undefined,
  overrides: UserOverridesMap
): MapBucket {
  if (!code) return 'unknown'
  const guide = getStateEvv(code)
  if (!guide) return 'unknown'
  const o = overrides[code]
  if (o?.bucketOverride && o.bucketOverride !== 'unknown') {
    return o.bucketOverride
  }
  return computeMapBucket(guide.rows)
}

export function getUserOverride(
  code: string | undefined,
  overrides: UserOverridesMap
): UserStateOverride | undefined {
  if (!code) return undefined
  return overrides[code]
}
