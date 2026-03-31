import { useCallback } from 'react'
import { useEvvOverrides } from '../context/EvvOverridesContext'
import { ALL_STATES_EVV, LEGEND_ITEMS } from '../data/evvByState'
import type { MapBucket } from '../data/evvTypes'
import { getUserOverride } from '../data/evvUserOverrides'

const BUCKET_OPTIONS: { value: MapBucket; label: string }[] = LEGEND_ITEMS.map(
  (item) => ({ value: item.bucket, label: item.label })
)

function formatSaved(ts: number | null): string {
  if (ts == null) return ''
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(ts))
  } catch {
    return new Date(ts).toLocaleString()
  }
}

export function EvvEditTab() {
  const {
    overrides,
    lastSavedAt,
    hasUnsavedChanges,
    patchOverride,
    clearOverride,
    saveToStorage,
    resetAllOverrides,
  } = useEvvOverrides()

  const onResetAll = useCallback(() => {
    if (
      window.confirm(
        'Clear all custom statuses, notes, and comments from this browser? This cannot be undone unless you saved a backup.'
      )
    ) {
      resetAllOverrides()
    }
  }, [resetAllOverrides])

  return (
    <section className="evv-edit-section" aria-labelledby="evv-edit-heading">
      <div className="evv-edit-header">
        <div>
          <h2 id="evv-edit-heading" className="evv-edit-title">
            Edit states
          </h2>
          <p className="evv-edit-intro">
            Override the rolled-up map color per state, and add local notes and
            comments. Changes apply to the map and summary table immediately;
            click <strong>Save to browser</strong> to persist them in this
            browser&apos;s storage (same device &amp; profile).
          </p>
        </div>
        <div className="evv-edit-actions">
          <button type="button" className="btn-primary" onClick={saveToStorage}>
            Save to browser
          </button>
          <button type="button" className="btn-secondary" onClick={onResetAll}>
            Reset all overrides
          </button>
        </div>
      </div>
      <p className="evv-edit-status" role="status">
        {lastSavedAt != null ? (
          <>
            Last saved:{' '}
            <time dateTime={new Date(lastSavedAt).toISOString()}>
              {formatSaved(lastSavedAt)}
            </time>
          </>
        ) : (
          <>No save recorded yet — use Save to browser to persist edits.</>
        )}
        {hasUnsavedChanges ? (
          <span className="evv-edit-unsaved"> Unsaved changes.</span>
        ) : null}
      </p>

      <div className="evv-edit-table-wrap">
        <table className="evv-edit-table">
          <thead>
            <tr>
              <th scope="col">State</th>
              <th scope="col">Code</th>
              <th scope="col">Map status</th>
              <th scope="col">Notes</th>
              <th scope="col">Comments</th>
              <th scope="col" className="evv-edit-col-actions">
                Row
              </th>
            </tr>
          </thead>
          <tbody>
            {ALL_STATES_EVV.map((s) => {
              const o = getUserOverride(s.code, overrides)
              return (
                <tr key={s.code}>
                  <td>{s.name}</td>
                  <td>
                    <code className="evv-table-code">{s.code}</code>
                  </td>
                  <td>
                    <label className="sr-only" htmlFor={`status-${s.code}`}>
                      Map status for {s.name}
                    </label>
                    <select
                      id={`status-${s.code}`}
                      className="evv-edit-select"
                      value={o?.bucketOverride ?? ''}
                      onChange={(e) => {
                        const v = e.target.value
                        if (v === '') {
                          patchOverride(s.code, { bucketOverride: undefined })
                        } else {
                          patchOverride(s.code, {
                            bucketOverride: v as MapBucket,
                          })
                        }
                      }}
                    >
                      <option value="">Guide default</option>
                      {BUCKET_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <label className="sr-only" htmlFor={`notes-${s.code}`}>
                      Notes for {s.name}
                    </label>
                    <textarea
                      id={`notes-${s.code}`}
                      className="evv-edit-textarea"
                      rows={2}
                      value={o?.notes ?? ''}
                      placeholder="Internal notes…"
                      onChange={(e) =>
                        patchOverride(s.code, { notes: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <label className="sr-only" htmlFor={`comments-${s.code}`}>
                      Comments for {s.name}
                    </label>
                    <textarea
                      id={`comments-${s.code}`}
                      className="evv-edit-textarea"
                      rows={2}
                      value={o?.comments ?? ''}
                      placeholder="Comments…"
                      onChange={(e) =>
                        patchOverride(s.code, { comments: e.target.value })
                      }
                    />
                  </td>
                  <td className="evv-edit-col-actions">
                    <button
                      type="button"
                      className="btn-linkish"
                      onClick={() => clearOverride(s.code)}
                    >
                      Clear
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
