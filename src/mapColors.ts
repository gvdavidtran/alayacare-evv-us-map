import type { MapBucket } from './data/evvTypes'

/**
 * Color Hunt palette (exact hex):
 * https://colorhunt.co/palette/c44a3ad97a2bf2d4796faf4f
 *
 * Closed states use dark gray (not part of the palette) per product request.
 */
const red = '#c44a3a'
const orange = '#d97a2b'
const yellow = '#f2d479'
const green = '#6faf4f'
const closedGray = '#c9c9c9'

/** Map fill per rollup bucket. */
export const MAP_FILL: Record<MapBucket, string> = {
  in_production: green,
  in_production_partial: `${green}b8`,
  in_development: yellow,
  needs_certification: red,
  /** Semi-transparent green vs solid production — same hue, reads as alternate path. */
  sponsored: orange,
  closed: closedGray,
  unknown: `${yellow}bf`,
}

/** Contrast-aware label color on top of {@link MAP_FILL} (badges sit on light UI, so alpha fills read as pastel). */
export const MAP_BADGE_FOREGROUND: Record<MapBucket, string> = {
  in_production: '#ffffff',
  in_production_partial: '#1a3d18',
  in_development: '#3d3a26',
  needs_certification: '#ffffff',
  sponsored: '#2b1a0d',
  closed: '#1a1a1a',
  unknown: '#3d3a26',
}

export function hoverFill(bucket: MapBucket): string {
  switch (bucket) {
    case 'in_production':
      return '#7ebe5f'
    case 'in_production_partial':
      return `${green}d5`
    case 'in_development':
      return '#f5dc8f'
    case 'needs_certification':
      return '#d45a4a'
    case 'sponsored':
      return '#e88a3d'
    case 'closed':
      return '#b5b5b5'
    default:
      return `${yellow}f0`
  }
}
