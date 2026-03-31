import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loadOverridesFromStorage,
  normalizeOverrides,
  saveOverridesToStorage,
  type UserOverridesMap,
  type UserStateOverride,
} from '../data/evvUserOverrides'

type EvvOverridesContextValue = {
  overrides: UserOverridesMap
  lastSavedAt: number | null
  hasUnsavedChanges: boolean
  patchOverride: (code: string, patch: Partial<UserStateOverride>) => void
  clearOverride: (code: string) => void
  saveToStorage: () => void
  resetAllOverrides: () => void
}

const EvvOverridesContext = createContext<EvvOverridesContextValue | null>(null)

export function EvvOverridesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<UserOverridesMap>(() =>
    loadOverridesFromStorage()
  )
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const patchOverride = useCallback(
    (code: string, patch: Partial<UserStateOverride>) => {
      setHasUnsavedChanges(true)
      setOverrides((prev) => {
        const cur: UserStateOverride = { ...(prev[code] ?? {}) }
        if ('bucketOverride' in patch) {
          if (patch.bucketOverride === undefined) {
            delete cur.bucketOverride
          } else {
            cur.bucketOverride = patch.bucketOverride
          }
        }
        if ('notes' in patch) {
          cur.notes = patch.notes
        }
        if ('comments' in patch) {
          cur.comments = patch.comments
        }
        const hasBucket =
          cur.bucketOverride != null && cur.bucketOverride !== 'unknown'
        const hasNotes = (cur.notes ?? '').trim().length > 0
        const hasComments = (cur.comments ?? '').trim().length > 0
        const next = { ...prev }
        if (hasBucket || hasNotes || hasComments) {
          next[code] = cur
        } else {
          delete next[code]
        }
        return next
      })
    },
    []
  )

  const clearOverride = useCallback((code: string) => {
    setHasUnsavedChanges(true)
    setOverrides((prev) => {
      const next = { ...prev }
      delete next[code]
      return next
    })
  }, [])

  const saveToStorage = useCallback(() => {
    const cleaned = normalizeOverrides(overrides)
    setOverrides(cleaned)
    saveOverridesToStorage(cleaned)
    setLastSavedAt(Date.now())
    setHasUnsavedChanges(false)
  }, [overrides])

  const resetAllOverrides = useCallback(() => {
    setOverrides({})
    saveOverridesToStorage({})
    setLastSavedAt(Date.now())
    setHasUnsavedChanges(false)
  }, [])

  const value = useMemo(
    () => ({
      overrides,
      lastSavedAt,
      hasUnsavedChanges,
      patchOverride,
      clearOverride,
      saveToStorage,
      resetAllOverrides,
    }),
    [
      overrides,
      lastSavedAt,
      hasUnsavedChanges,
      patchOverride,
      clearOverride,
      saveToStorage,
      resetAllOverrides,
    ]
  )

  return (
    <EvvOverridesContext.Provider value={value}>
      {children}
    </EvvOverridesContext.Provider>
  )
}

export function useEvvOverrides(): EvvOverridesContextValue {
  const ctx = useContext(EvvOverridesContext)
  if (!ctx) {
    throw new Error('useEvvOverrides must be used within EvvOverridesProvider')
  }
  return ctx
}
