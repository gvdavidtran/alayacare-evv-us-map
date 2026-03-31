/**
 * Anchor positions in the map SVG viewBox (0 0 959 593).
 * Chips sit in a right-hand column (New Signature–style) instead of on top of small states.
 */
export const MAP_VIEWBOX = { w: 959, h: 593 } as const

/** North-to-south tab / paint order in the side column. */
export const EAST_COAST_CHIP_STATES = [
  'VT',
  'NH',
  'MA',
  'RI',
  'CT',
  'NJ',
  'DE',
  'MD',
  'DC',
] as const

export type EastCoastChipState = (typeof EAST_COAST_CHIP_STATES)[number]

/** Right gutter — far enough past New England coastline to avoid overlap at typical scales. */
const CHIP_COLUMN_X = 932

/** Vertical gap between chip rectangles (viewBox units). */
const CHIP_MARGIN_VERTICAL = 6

/** Chip backing size in viewBox units (centered on anchor). */
export const CHIP_W = 46
export const CHIP_H = 28
export const CHIP_RX = 8

const CHIP_ROW_STEP = CHIP_H + CHIP_MARGIN_VERTICAL

const BASE_Y = 128

export const EAST_COAST_LABEL_POSITIONS: Record<
  EastCoastChipState,
  { x: number; y: number }
> = {
  VT: { x: CHIP_COLUMN_X, y: BASE_Y + CHIP_ROW_STEP * 0 },
  NH: { x: CHIP_COLUMN_X, y: BASE_Y + CHIP_ROW_STEP * 1 },
  MA: { x: CHIP_COLUMN_X, y: BASE_Y + CHIP_ROW_STEP * 2 },
  RI: { x: CHIP_COLUMN_X, y: BASE_Y + CHIP_ROW_STEP * 3 },
  CT: { x: CHIP_COLUMN_X, y: BASE_Y + CHIP_ROW_STEP * 4 },
  NJ: { x: CHIP_COLUMN_X, y: BASE_Y + CHIP_ROW_STEP * 5 },
  DE: { x: CHIP_COLUMN_X, y: BASE_Y + CHIP_ROW_STEP * 6 },
  MD: { x: CHIP_COLUMN_X, y: BASE_Y + CHIP_ROW_STEP * 7 },
  DC: { x: CHIP_COLUMN_X, y: BASE_Y + CHIP_ROW_STEP * 8 },
}

export const EAST_COAST_CHIP_SET: ReadonlySet<string> = new Set(EAST_COAST_CHIP_STATES)
