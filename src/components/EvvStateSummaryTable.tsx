import { useEvvOverrides } from '../context/EvvOverridesContext'
import { ALL_STATES_EVV, computeMapBucket, rollupLabel } from '../data/evvByState'
import type { AggregatorRow, EvvStatus } from '../data/evvTypes'
import { displayBucketForState } from '../data/evvUserOverrides'
import { MAP_FILL } from '../mapColors'

function pathStatusShort(status: EvvStatus): string {
  switch (status) {
    case 'in_production':
      return 'In production'
    case 'in_development':
      return 'In development'
    case 'sponsored':
      return 'Sponsored'
    case 'closed':
      return 'Closed'
    case 'needs_certification':
      return 'Needs certification'
    default:
      return status
  }
}

function pathsSummary(rows: AggregatorRow[]): string {
  return rows
    .map((r) => `${r.aggregator} — ${pathStatusShort(r.status)}`)
    .join('; ')
}

export function EvvStateSummaryTable() {
  const { overrides } = useEvvOverrides()

  return (
    <section className="evv-table-section" aria-labelledby="evv-summary-heading">
      <h2 id="evv-summary-heading" className="evv-table-title">
        State summary
      </h2>
      <p className="evv-table-intro">
        Same data as the map, sorted alphabetically. <strong>Map status</strong>{' '}
        is the color on the map (guide rollup or your override from the Edit
        States (beta) tab). Paths list each aggregator line from the EVV guide.
      </p>
      <div className="evv-table-scroll">
        <table className="evv-summary-table">
          <thead>
            <tr>
              <th scope="col">State</th>
              <th scope="col">Code</th>
              <th scope="col">Map status</th>
              <th scope="col">Guide rollup</th>
              <th scope="col">Paths (aggregator — status)</th>
              <th scope="col">Your notes</th>
              <th scope="col">Your comments</th>
            </tr>
          </thead>
          <tbody>
            {ALL_STATES_EVV.map((s) => {
              const display = displayBucketForState(s.code, overrides)
              const guide = computeMapBucket(s.rows)
              const o = overrides[s.code]
              const customMap = display !== guide
              return (
                <tr key={s.code}>
                  <td>{s.name}</td>
                  <td>
                    <code className="evv-table-code">{s.code}</code>
                  </td>
                  <td>
                    <span className="evv-table-status">
                      <span
                        className="evv-table-swatch"
                        style={{ background: MAP_FILL[display] }}
                        aria-hidden
                      />
                      {rollupLabel(display)}
                      {customMap ? (
                        <span className="evv-table-custom" title="Custom map status">
                          *
                        </span>
                      ) : null}
                    </span>
                  </td>
                  <td>
                    <span className="evv-table-muted">{rollupLabel(guide)}</span>
                  </td>
                  <td className="evv-table-paths">{pathsSummary(s.rows)}</td>
                  <td className="evv-table-clip" title={o?.notes}>
                    {o?.notes?.trim() || '—'}
                  </td>
                  <td className="evv-table-clip" title={o?.comments}>
                    {o?.comments?.trim() || '—'}
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
