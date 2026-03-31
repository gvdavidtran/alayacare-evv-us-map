/** Row-level status from the EVV guide. Map coloring may roll up to `in_production_partial`. */
export type EvvStatus =
  | 'in_production'
  | 'in_development'
  | 'sponsored'
  | 'closed'
  | 'needs_certification'

export type MapBucket =
  | 'in_production'
  | 'in_production_partial'
  | 'in_development'
  | 'sponsored'
  | 'closed'
  | 'needs_certification'
  | 'unknown'

export type AggregatorRow = {
  status: EvvStatus
  aggregator: string
  integrationType?: string
  notes?: string
  links?: { label: string; href: string }[]
}

export type StateEvv = {
  code: string
  name: string
  rows: AggregatorRow[]
}
