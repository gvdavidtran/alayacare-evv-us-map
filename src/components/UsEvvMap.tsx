import { Fragment, useCallback, useMemo, useState } from 'react'
import USAMap, {
  StateAbbreviations,
  type USAStateAbbreviation,
} from '@mirawision/usa-map-react'
import { useEvvOverrides } from '../context/EvvOverridesContext'
import {
  computeMapBucket,
  getStateEvv,
  LEGEND_ITEMS,
  rollupLabel,
} from '../data/evvByState'
import {
  CHIP_H,
  CHIP_RX,
  CHIP_W,
  EAST_COAST_CHIP_STATES,
  EAST_COAST_CHIP_SET,
  EAST_COAST_LABEL_POSITIONS,
} from '../data/mapEastCoastLabelChips'
import type { EvvStatus, MapBucket, StateEvv } from '../data/evvTypes'
import {
  displayBucketForState,
  getUserOverride,
  type UserOverridesMap,
} from '../data/evvUserOverrides'
import {
  MAP_BADGE_FOREGROUND,
  MAP_CHIP_TEXT_STROKE,
  MAP_FILL,
  hoverFill,
} from '../mapColors'

const MAP_SR_HINT_ID = 'evv-map-sr-instructions'

export type UsEvvMapVariant = 'default' | 'beta'

/**
 * When `customStates` is set, usa-map-react uses each state's own `label` config only;
 * it does not fall back to `defaultState.label`. This render adds an SVG `title` element
 * (see MDN: SVG title) so assistive tech gets the full state name and EVV status, not only the abbreviation.
 */
function makeStateLabelRender(overrides: UserOverridesMap) {
  return function renderStateLabel(abbr: USAStateAbbreviation) {
    const code = abbr as string
    const evv = getStateEvv(code)
    const name = evv?.name ?? `State ${code}`
    const bucket = displayBucketForState(code, overrides)
    const status = rollupLabel(bucket)
    return (
      <Fragment>
        <title>{`${name} (${abbr}). EVV map status: ${status}.`}</title>
        {abbr}
      </Fragment>
    )
  }
}

function EastCoastLabelChipsOverlay({
  overrides,
  hoverCode,
  setHoverCode,
  onChipClick,
}: {
  overrides: UserOverridesMap
  hoverCode: string | null
  setHoverCode: (code: string | null) => void
  onChipClick: (abbr: USAStateAbbreviation) => void
}) {
  const [tip, setTip] = useState<{ x: number; y: number; code: string } | null>(
    null
  )

  return (
    <>
      <svg
        className="map-beta-overlay"
        viewBox="0 0 959 593"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {EAST_COAST_CHIP_STATES.map((code) => {
          const abbr = code as USAStateAbbreviation
          const pos = EAST_COAST_LABEL_POSITIONS[code]
          const bucket = displayBucketForState(code, overrides)
          const active = hoverCode === code
          const fill = active ? hoverFill(bucket) : MAP_FILL[bucket]
          const fg = MAP_BADGE_FOREGROUND[bucket]
          const chipStroke = MAP_CHIP_TEXT_STROKE[bucket]
          const evv = getStateEvv(code)
          const name = evv?.name ?? code
          const status = rollupLabel(bucket)
          return (
            <g key={code} transform={`translate(${pos.x},${pos.y})`}>
              <title>{`${name} (${code}). ${status}. Activate for details.`}</title>
              <rect
                className="map-beta-chip-hit"
                x={-CHIP_W / 2}
                y={-CHIP_H / 2}
                width={CHIP_W}
                height={CHIP_H}
                rx={CHIP_RX}
                fill={fill}
                stroke="#0f172a"
                strokeWidth={1}
                tabIndex={0}
                onMouseEnter={(e) => {
                  setHoverCode(code)
                  setTip({ x: e.clientX, y: e.clientY, code })
                }}
                onMouseMove={(e) => {
                  setTip({ x: e.clientX, y: e.clientY, code })
                }}
                onMouseLeave={() => {
                  setHoverCode(null)
                  setTip(null)
                }}
                onClick={() => onChipClick(abbr)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onChipClick(abbr)
                  }
                }}
              />
              <text
                className="map-beta-chip-text"
                textAnchor="middle"
                dominantBaseline="central"
                fill={fg}
                stroke={chipStroke}
                strokeWidth={3.25}
                paintOrder="stroke fill"
              >
                {code}
              </text>
            </g>
          )
        })}
      </svg>
      {tip ? (
        <div
          className="map-beta-floating-tooltip"
          style={{ left: tip.x + 12, top: tip.y + 12 }}
        >
          <span className="map-tooltip-inner">
            <strong>{getStateEvv(tip.code)?.name ?? tip.code}</strong>
            <br />
            {rollupLabel(displayBucketForState(tip.code, overrides))}
          </span>
        </div>
      ) : null}
    </>
  )
}

function statusLabel(status: EvvStatus): string {
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
      return 'Needs final certification'
    default:
      return status
  }
}

function DetailPanel({
  state,
  displayBucket,
  userNotes,
  userComments,
  guideRollup,
  pinned,
  onClearPin,
}: {
  state: StateEvv | undefined
  displayBucket: MapBucket
  userNotes?: string
  userComments?: string
  guideRollup: MapBucket
  pinned: string | null
  onClearPin: () => void
}) {
  if (!state) {
    return (
      <div className="detail-panel">
        <h2 className="detail-title">State details</h2>
        <p className="detail-muted">
          Hover a state on the map to see AlayaCare EVV status from the internal
          guide. Click a state to pin details (helpful on touch devices).
        </p>
      </div>
    )
  }

  const customStatus = guideRollup !== displayBucket

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <h2 className="detail-title">{state.name}</h2>
        <span
          className="detail-badge"
          style={{
            background: MAP_FILL[displayBucket],
            color: MAP_BADGE_FOREGROUND[displayBucket],
          }}
          title={rollupLabel(displayBucket)}
        >
          {rollupLabel(displayBucket)}
        </span>
      </div>
      {customStatus ? (
        <p className="detail-custom-hint">
          Map color uses a custom status (guide rollup: {rollupLabel(guideRollup)}
          ).
        </p>
      ) : null}
      {pinned === state.code ? (
        <p className="detail-pin-hint">
          Pinned —{' '}
          <button type="button" className="link-button" onClick={onClearPin}>
            Clear
          </button>
        </p>
      ) : null}
      {userNotes?.trim() ? (
        <div className="detail-user-block">
          <div className="detail-user-label">Your notes</div>
          <p className="detail-user-text">{userNotes}</p>
        </div>
      ) : null}
      {userComments?.trim() ? (
        <div className="detail-user-block">
          <div className="detail-user-label">Your comments</div>
          <p className="detail-user-text">{userComments}</p>
        </div>
      ) : null}
      <ul className="aggregator-list">
        {state.rows.map((row, i) => (
          <li key={`${row.aggregator}-${i}`} className="aggregator-item">
            <div className="aggregator-head">
              <strong>{row.aggregator}</strong>
              <span className="aggregator-status">{statusLabel(row.status)}</span>
            </div>
            {row.integrationType ? (
              <div className="detail-meta">Type: {row.integrationType}</div>
            ) : null}
            {row.notes ? <p className="detail-notes">{row.notes}</p> : null}
            {row.links && row.links.length > 0 ? (
              <ul className="link-list">
                {row.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function UsEvvMap({ variant = 'default' }: { variant?: UsEvvMapVariant }) {
  const { overrides } = useEvvOverrides()
  const [hoverCode, setHoverCode] = useState<string | null>(null)
  const [pinnedCode, setPinnedCode] = useState<string | null>(null)

  const activeCode = pinnedCode ?? hoverCode
  const activeState = getStateEvv(activeCode ?? undefined)
  const activeUser = getUserOverride(activeCode ?? undefined, overrides)
  const activeDisplayBucket = displayBucketForState(
    activeCode ?? undefined,
    overrides
  )
  const activeGuideRollup = activeState
    ? computeMapBucket(activeState.rows)
    : ('unknown' as MapBucket)

  const clearPin = useCallback(() => setPinnedCode(null), [])

  const handleStateClick = useCallback((abbr: USAStateAbbreviation) => {
    const code = abbr as string
    setPinnedCode((p) => (p === code ? null : code))
  }, [])

  const customStates = useMemo(() => {
    const labelRender = makeStateLabelRender(overrides)
    const states: NonNullable<Parameters<typeof USAMap>[0]['customStates']> =
      {}
    const hideBuiltinLabel =
      variant === 'beta'
        ? (code: string) => EAST_COAST_CHIP_SET.has(code)
        : () => false

    for (const abbr of StateAbbreviations as USAStateAbbreviation[]) {
      const code = abbr as string
      const bucket = displayBucketForState(abbr, overrides)
      const base = MAP_FILL[bucket]
      const fill = hoverCode === abbr ? hoverFill(bucket) : base
      const evv = getStateEvv(abbr)

      states[abbr] = {
        fill,
        stroke: '#0f172a',
        label: hideBuiltinLabel(code)
          ? { enabled: false }
          : {
              enabled: true,
              render: labelRender,
            },
        onHover: () => setHoverCode(abbr),
        onLeave: () => setHoverCode(null),
        onClick: () => {
          handleStateClick(abbr)
        },
        tooltip: {
          enabled: true,
          render: () => (
            <span className="map-tooltip-inner">
              <strong>{evv?.name ?? abbr}</strong>
              <br />
              {rollupLabel(bucket)}
            </span>
          ),
        },
      }
    }
    return states
  }, [hoverCode, handleStateClick, overrides, variant])

  const legend = useMemo(
    () => (
      <div className="legend-panel legend-below-map">
        <h2 className="legend-title">Map key</h2>
        <p className="legend-intro">
          Colors follow the &ldquo;State EVV Status&rdquo; definitions in the
          Ultimate Guide to EVV (unless you set a custom map status on the Edit
          States (beta) tab). Mixed guide rows use the amber band.
          {variant === 'beta' ? (
            <>
              {' '}
              On this beta map, crowded Northeast and mid-Atlantic states use
              separate hoverable label chips in a column along the right edge of the
              map (similar to classic US map layouts).
            </>
          ) : null}
        </p>
        <ul className="legend-list legend-grid">
          {LEGEND_ITEMS.map((item) => (
            <li key={item.bucket} className="legend-row">
              <span
                className="legend-swatch"
                style={{ background: MAP_FILL[item.bucket] }}
                aria-hidden
              />
              <div>
                <div className="legend-label">{item.label}</div>
                <div className="legend-desc">{item.description}</div>
              </div>
            </li>
          ))}
          <li className="legend-row">
            <span
              className="legend-swatch"
              style={{ background: MAP_FILL.unknown }}
              aria-hidden
            />
            <div>
              <div className="legend-label">No data</div>
              <div className="legend-desc">
                Not listed in the guide (should not appear for 50 states + DC).
              </div>
            </div>
          </li>
        </ul>
      </div>
    ),
    [variant]
  )

  const mapBlock = (
    <>
      <p id={MAP_SR_HINT_ID} className="sr-only">
        {variant === 'beta' ? (
          <>
            Most states show a two-letter abbreviation on the map.             Several Northeast and mid-Atlantic states use separate chips in a column
            on the right — hover or activate them for details. Full names and
            EVV status are also in the details panel and the summary table below.
          </>
        ) : (
          <>
            Each state shows a two-letter postal abbreviation. Full state name and
            rolled-up EVV status are available as a screen reader label on each
            abbreviation. Hover or click a state to open details in the panel beside
            the map, or use the state summary table below for a full list.
          </>
        )}
      </p>
      {variant === 'beta' ? (
        <div className="map-beta-stack">
          <USAMap
            defaultState={{
              stroke: '#0f172a',
              label: { enabled: true },
              tooltip: { enabled: false },
            }}
            customStates={customStates}
            mapSettings={{
              width: '100%',
              height: 'auto',
              title: 'United States map colored by AlayaCare EVV status per state',
            }}
            className="usa-map-evv"
          />
          <EastCoastLabelChipsOverlay
            overrides={overrides}
            hoverCode={hoverCode}
            setHoverCode={setHoverCode}
            onChipClick={handleStateClick}
          />
        </div>
      ) : (
        <USAMap
          defaultState={{
            stroke: '#0f172a',
            label: { enabled: true },
            tooltip: { enabled: false },
          }}
          customStates={customStates}
          mapSettings={{
            width: '100%',
            height: 'auto',
            title: 'United States map colored by AlayaCare EVV status per state',
          }}
          className="usa-map-evv"
        />
      )}
    </>
  )

  return (
    <div className="map-layout map-layout-stacked">
      <div className="map-and-details">
        <div
          className="map-wrap map-wrap-full map-wrap-a11y"
          role="region"
          aria-label="United States EVV status map"
          aria-describedby={MAP_SR_HINT_ID}
        >
          {mapBlock}
        </div>
        <DetailPanel
          state={activeState}
          displayBucket={activeDisplayBucket}
          userNotes={activeUser?.notes}
          userComments={activeUser?.comments}
          guideRollup={activeGuideRollup}
          pinned={pinnedCode}
          onClearPin={clearPin}
        />
      </div>
      {legend}
    </div>
  )
}
