import type { AggregatorRow, MapBucket, StateEvv } from './evvTypes'

export const EVV_LAST_UPDATED = '2025-12-31'
export const EVV_CONFLUENCE_URL =
  'https://alayacare.atlassian.net/wiki/spaces/PM/pages/5621088257/EVV+Ultimate+Guide+to+EVV'

const sandataPortal =
  'https://sandata.zendesk.com/hc/en-us/articles/22226970338195-EVV-Provider-Self-Registration-Portal'

function row(
  status: AggregatorRow['status'],
  aggregator: string,
  opts?: Omit<AggregatorRow, 'status' | 'aggregator'>
): AggregatorRow {
  return { status, aggregator, ...opts }
}

/** Rollup for map fill: worst / most attention-grabbing first, except mixed prod + sponsored → partial. */
export function computeMapBucket(rows: AggregatorRow[]): MapBucket {
  const statuses = rows.map((r) => r.status)
  if (statuses.some((s) => s === 'closed')) return 'closed'
  if (statuses.some((s) => s === 'needs_certification')) return 'needs_certification'
  if (statuses.some((s) => s === 'in_development')) return 'in_development'
  const hasProd = statuses.some((s) => s === 'in_production')
  const hasSponsored = statuses.some((s) => s === 'sponsored')
  if (hasProd && hasSponsored) return 'in_production_partial'
  if (statuses.every((s) => s === 'sponsored')) return 'sponsored'
  if (hasProd) return 'in_production'
  return 'sponsored'
}

const STATES: StateEvv[] = [
  {
    code: 'AL',
    name: 'Alabama',
    rows: [
      row('in_production', 'HHAX', {
        integrationType: 'API',
        links: [
          {
            label: 'Attestation form',
            href: 'https://www.cognitoforms.com/HHAeXchange1/thirdpartyevvattestational',
          },
          {
            label: 'AL state page (Confluence)',
            href: 'https://alayacare.atlassian.net/wiki/spaces/PM/pages/3226272937',
          },
        ],
      }),
    ],
  },
  {
    code: 'AK',
    name: 'Alaska',
    rows: [
      row('in_production', 'Therap', {
        integrationType: 'API',
        links: [
          {
            label: 'Attestation form',
            href: 'https://help.therapservices.net/s/article/4058',
          },
          {
            label: 'AK state page (Confluence)',
            href: 'https://alayacare.atlassian.net/wiki/spaces/PM/pages/3244359813',
          },
        ],
      }),
    ],
  },
  {
    code: 'AZ',
    name: 'Arizona',
    rows: [
      row('in_production', 'Sandata', {
        integrationType: 'API',
        links: [
          { label: 'Sandata self-registration', href: sandataPortal },
          {
            label: 'AZ state page (Confluence)',
            href: 'https://alayacare.atlassian.net/wiki/spaces/PM/pages/3244392560',
          },
        ],
      }),
    ],
  },
  {
    code: 'AR',
    name: 'Arkansas',
    rows: [
      row('sponsored', 'Authenticare'),
      row('sponsored', 'HHAX V5', {
        links: [
          {
            label: 'HHAX attestation',
            href: 'https://www.cognitoforms.com/HHAeXchange1/ArkansasHHAeXchangeProviderPortalQuestionnaire',
          },
          {
            label: 'HHAX info hub',
            href: 'https://www.hhaexchange.com/info-hub/arkansas-state-medicaid-passe',
          },
        ],
      }),
      row('sponsored', 'CareBridge', {
        integrationType: 'SFTP',
        links: [
          {
            label: 'CareBridge third-party EVV form',
            href: 'http://evvintegrationeform.carebridgehealth.com',
          },
        ],
      }),
    ],
  },
  {
    code: 'CA',
    name: 'California',
    rows: [
      row('in_production', 'Sandata', {
        integrationType: 'API',
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'CO',
    name: 'Colorado',
    rows: [
      row('in_production', 'Sandata', {
        integrationType: 'API',
        links: [
          { label: 'Sandata self-registration', href: sandataPortal },
          {
            label: 'CO state page (Confluence)',
            href: 'https://alayacare.atlassian.net/wiki/spaces/PM/pages/3244392588',
          },
        ],
      }),
    ],
  },
  {
    code: 'CT',
    name: 'Connecticut',
    rows: [
      row('sponsored', 'Sandata', {
        integrationType: 'API',
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'DC',
    name: 'District of Columbia',
    rows: [
      row('sponsored', 'Sandata', {
        integrationType: 'API',
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'DE',
    name: 'Delaware',
    rows: [
      row('in_production', 'Sandata', {
        integrationType: 'API',
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'FL',
    name: 'Florida',
    rows: [
      row('in_production', 'HHAX', {
        integrationType: 'SFTP',
        links: [
          {
            label: 'HHAX attestation',
            href: 'https://www.cognitoforms.com/HHAeXchange1/FLHHAeXchangeProviderPortalAgencyRegistration',
          },
          {
            label: 'HHAX info hub',
            href: 'https://www.hhaexchange.com/info-hub/florida',
          },
          {
            label: 'FL state page (Confluence)',
            href: 'https://alayacare.atlassian.net/wiki/spaces/PM/pages/3244392608',
          },
        ],
      }),
      row('in_production', 'Netsmart', {
        links: [
          {
            label: 'Netsmart Aetna EVV form',
            href: 'https://mobilecaregiverplus.com/aetna-fl/registration/',
          },
        ],
      }),
    ],
  },
  {
    code: 'GA',
    name: 'Georgia',
    rows: [
      row('in_production', 'Netsmart', {
        links: [
          {
            label: 'Netsmart EVV registration',
            href: 'https://mobilecaregiverplus.com/ga-dch/registration/',
          },
        ],
      }),
    ],
  },
  {
    code: 'HI',
    name: 'Hawaii',
    rows: [
      row('sponsored', 'Sandata', {
        links: [
          { label: 'Sandata self-registration', href: sandataPortal },
          {
            label: 'Hawaii Medicaid EVV',
            href: 'https://medquest.hawaii.gov/en/plans-providers/electronic-visit-verification.html',
          },
        ],
      }),
      row('sponsored', 'HHAeXchange', { integrationType: 'N/A' }),
    ],
  },
  {
    code: 'ID',
    name: 'Idaho',
    rows: [
      row('sponsored', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'IL',
    name: 'Illinois',
    rows: [
      row('in_production', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
      row('in_production', 'HHAeXchange', {
        links: [
          {
            label: 'HHAX attestation',
            href: 'https://www.cognitoforms.com/HHAeXchange1/ThirdPartyEVVAttestationIL',
          },
          {
            label: 'HHAX Illinois hub',
            href: 'https://www.hhaexchange.com/info-hub/illinois',
          },
        ],
      }),
    ],
  },
  {
    code: 'IN',
    name: 'Indiana',
    rows: [
      row('in_production', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'IA',
    name: 'Iowa',
    rows: [
      row('in_production', 'CareBridge', {
        links: [
          {
            label: 'CareBridge third-party EVV form',
            href: 'http://evvintegrationeform.carebridgehealth.com',
          },
        ],
      }),
    ],
  },
  {
    code: 'KS',
    name: 'Kansas',
    rows: [row('in_production', 'Authenticare')],
  },
  {
    code: 'KY',
    name: 'Kentucky',
    rows: [
      row('in_production', 'Therap', {
        notes: 'Choose “Non-current Therap User - will use 3rd party EVV vendor/Therap aggregator” on Therap request form.',
        links: [
          {
            label: 'Therap KY implementation request',
            href: 'https://www.therapservices.net/kentucky-evv-aggregator-implementation-request-form/',
          },
        ],
      }),
      row('sponsored', 'Netsmart', {
        links: [
          {
            label: 'Netsmart CHFS EVV form',
            href: 'https://mobilecaregiverplus.com/ky-chfs-registration/',
          },
        ],
      }),
    ],
  },
  {
    code: 'LA',
    name: 'Louisiana',
    rows: [
      row('sponsored', 'LaSRS (SRI)', {
        links: [
          {
            label: 'LA SRS Confluence',
            href: 'https://alayacare.atlassian.net/wiki/spaces/PM/pages/3185934846',
          },
        ],
      }),
    ],
  },
  {
    code: 'ME',
    name: 'Maine',
    rows: [
      row('sponsored', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'MD',
    name: 'Maryland',
    rows: [
      row('closed', '—', {
        notes: 'Maryland (CLOSED) per EVV guide.',
      }),
    ],
  },
  {
    code: 'MA',
    name: 'Massachusetts',
    rows: [
      row('in_production', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'MI',
    name: 'Michigan',
    rows: [
      row('in_production', 'HHAX', {
        integrationType: 'API',
        links: [
          {
            label: 'HHAX attestation',
            href: 'https://www.cognitoforms.com/HHAeXchange1/ThirdPartyEVVAttestationMI',
          },
          {
            label: 'HHAX Michigan hub',
            href: 'https://www.hhaexchange.com/info-hub/michigan-information-center',
          },
        ],
      }),
    ],
  },
  {
    code: 'MN',
    name: 'Minnesota',
    rows: [
      row('in_production', 'HHAX', {
        integrationType: 'API',
        notes: 'Guide links align with HHAX Minnesota hub.',
        links: [
          {
            label: 'HHAX attestation (verify state on form)',
            href: 'https://www.cognitoforms.com/HHAeXchange1/ThirdPartyEVVAttestationMI',
          },
          {
            label: 'HHAX Minnesota hub',
            href: 'https://www.hhaexchange.com/info-hub/minnesota',
          },
        ],
      }),
    ],
  },
  {
    code: 'MS',
    name: 'Mississippi',
    rows: [
      row('closed', 'HHAX', {
        notes: 'Mississippi (CLOSED) per EVV guide.',
        links: [
          {
            label: 'HHAX Mississippi hub',
            href: 'https://www.hhaexchange.com/info-hub/mississippi',
          },
        ],
      }),
    ],
  },
  {
    code: 'MO',
    name: 'Missouri',
    rows: [
      row('in_production', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'MT',
    name: 'Montana',
    rows: [
      row('sponsored', 'Netsmart', {
        links: [
          {
            label: 'Netsmart DPHHS EVV form',
            href: 'https://mobilecaregiverplus.com/mt-dphhs/mt-dphhs-registration/',
          },
        ],
      }),
    ],
  },
  {
    code: 'NE',
    name: 'Nebraska',
    rows: [
      row('in_production', 'Netsmart', {
        links: [
          {
            label: 'Netsmart DHHS EVV form',
            href: 'https://mobilecaregiverplus.com/ne-dhhs-registration/',
          },
        ],
      }),
      row('sponsored', 'Therap'),
      row('sponsored', 'Authenticare', { notes: 'Status unclear in guide (??).' }),
    ],
  },
  {
    code: 'NV',
    name: 'Nevada',
    rows: [
      row('sponsored', 'Sandata', {
        integrationType: 'API',
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'NH',
    name: 'New Hampshire',
    rows: [
      row('sponsored', 'Authenticare', {
        links: [
          {
            label: 'NH third-party attestation (DOCX)',
            href: 'https://www.dhhs.nh.gov/sites/g/files/ehbemt476/files/documents2/nh-evv-thirdparty-guidanceandattestation-form.docx',
          },
          {
            label: 'NH DHHS EVV',
            href: 'https://www.dhhs.nh.gov/programs-services/adult-aging-care/electronic-visit-verification',
          },
        ],
      }),
    ],
  },
  {
    code: 'NJ',
    name: 'New Jersey',
    rows: [
      row('in_production', 'HHAX', {
        integrationType: 'API',
        links: [
          {
            label: 'HHAX attestation',
            href: 'https://www.cognitoforms.com/HHAeXchange1/ThirdPartyEVVAttestationNJ',
          },
          {
            label: 'HHAX NJ hub',
            href: 'https://www.hhaexchange.com/info-hub/new-jersey-dmahs-personal-care-services',
          },
        ],
      }),
      row('in_production', 'CareBridge', {
        integrationType: 'API',
        links: [
          {
            label: 'CareBridge third-party EVV form',
            href: 'http://evvintegrationeform.carebridgehealth.com',
          },
        ],
      }),
    ],
  },
  {
    code: 'NM',
    name: 'New Mexico',
    rows: [
      row('closed', 'Authenticare', {
        notes: 'New Mexico (CLOSED) per EVV guide.',
      }),
    ],
  },
  {
    code: 'NY',
    name: 'New York',
    rows: [
      row('in_production', 'eMedNY'),
      row('in_production', 'HHAX', { integrationType: 'V5' }),
    ],
  },
  {
    code: 'NC',
    name: 'North Carolina',
    rows: [
      row('in_production', 'Sandata', {
        integrationType: 'V1.7',
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
      row('in_production', 'HHAX', {
        integrationType: 'V5',
        links: [
          {
            label: 'HHAX NC enrollment',
            href: 'https://www.cognitoforms.com/HHAeXchange1/NorthCarolinaHomeHealthHHAeXchangeProviderEnrollmentForm',
          },
        ],
      }),
      row('in_production', 'CareBridge', {
        links: [
          {
            label: 'CareBridge third-party EVV form',
            href: 'http://evvintegrationeform.carebridgehealth.com',
          },
        ],
      }),
    ],
  },
  {
    code: 'ND',
    name: 'North Dakota',
    rows: [
      row('in_production', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'OH',
    name: 'Ohio',
    rows: [
      row('in_production', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'OK',
    name: 'Oklahoma',
    rows: [
      row('in_production', 'Authenticare'),
      row('sponsored', 'HHAX', {
        notes: 'Dev work done — missing certification (see EVV-5357 in guide).',
        links: [
          {
            label: 'HHAX attestation',
            href: 'https://www.cognitoforms.com/HHAeXchange1/ThirdPartyEVVAttestationOK',
          },
          {
            label: 'EVV-5357',
            href: 'https://alayacare.atlassian.net/browse/EVV-5357',
          },
        ],
      }),
    ],
  },
  {
    code: 'OR',
    name: 'Oregon',
    rows: [row('in_production', 'In-house (XPRS)')],
  },
  {
    code: 'PA',
    name: 'Pennsylvania',
    rows: [
      row('in_production', 'Sandata', {
        integrationType: 'Sandata 7.1',
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
      row('in_production', 'HHAX', {
        integrationType: 'V5',
        links: [
          {
            label: 'HHAX PA enrollment',
            href: 'https://www.cognitoforms.com/HHAeXchange1/PennsylvaniaHomeHealthHHAeXchangeProviderEnrollmentForm',
          },
        ],
      }),
      row('in_production', 'Netsmart', {
        links: [
          {
            label: 'Netsmart Highmark / Wholecare',
            href: 'https://mobilecaregiverplus.com/pa-highmark-wholecare/pa-highmark-wholecare-registration/',
          },
        ],
      }),
    ],
  },
  {
    code: 'RI',
    name: 'Rhode Island',
    rows: [
      row('sponsored', 'Sandata', {
        integrationType: 'Sandata 7.9',
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'SC',
    name: 'South Carolina',
    rows: [
      row('closed', 'Authenticare', {
        notes: 'South Carolina (CLOSED) per EVV guide.',
      }),
    ],
  },
  {
    code: 'SD',
    name: 'South Dakota',
    rows: [row('sponsored', 'Therap')],
  },
  {
    code: 'TN',
    name: 'Tennessee',
    rows: [
      row('in_production', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
      row('in_production', 'CareBridge', {
        links: [
          {
            label: 'CareBridge third-party EVV form',
            href: 'http://evvintegrationeform.carebridgehealth.com',
          },
        ],
      }),
      row('sponsored', 'Therap'),
    ],
  },
  {
    code: 'TX',
    name: 'Texas',
    rows: [row('in_production', 'TMHP')],
  },
  {
    code: 'UT',
    name: 'Utah',
    rows: [
      row('needs_certification', 'Proprietary UTEVV', {
        notes: 'Guide: previously in production; needs final certification.',
      }),
    ],
  },
  {
    code: 'VT',
    name: 'Vermont',
    rows: [
      row('sponsored', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'VA',
    name: 'Virginia',
    rows: [
      row('in_production', 'Netsmart', {
        links: [
          {
            label: 'Netsmart Anthem registration',
            href: 'https://netsmart.az1.qualtrics.com/jfe/form/SV_0I2BlUtuWleJxH0',
          },
        ],
      }),
      row('sponsored', 'HHAX', {
        integrationType: 'SFTP',
        links: [
          {
            label: 'HHAX enrollment (Humana Healthy Horizons)',
            href: 'https://www.cognitoforms.com/hhaexchange1/humanahealthyhorizonsinvirginiaproviderportalregistrationform',
          },
        ],
      }),
    ],
  },
  {
    code: 'WA',
    name: 'Washington',
    rows: [row('in_production', 'Provider One')],
  },
  {
    code: 'WV',
    name: 'West Virginia',
    rows: [
      row('in_production', 'HHAX', {
        integrationType: 'API',
        links: [
          {
            label: 'HHAX attestation',
            href: 'https://www.cognitoforms.com/HHAeXchange1/ThirdPartyEVVAttestationWV',
          },
          {
            label: 'HHAX WV hub',
            href: 'https://www.hhaexchange.com/info-hub/west-virginia',
          },
        ],
      }),
    ],
  },
  {
    code: 'WI',
    name: 'Wisconsin',
    rows: [
      row('sponsored', 'Sandata', {
        links: [{ label: 'Sandata self-registration', href: sandataPortal }],
      }),
    ],
  },
  {
    code: 'WY',
    name: 'Wyoming',
    rows: [
      row('in_production', 'CareBridge', {
        links: [
          {
            label: 'CareBridge third-party EVV form',
            href: 'http://evvintegrationeform.carebridgehealth.com',
          },
        ],
      }),
    ],
  },
]

/** Count of guide jurisdictions (50 states + DC) per rollup map bucket from {@link computeMapBucket}. */
export const GUIDE_ROLLUP_BUCKET_COUNTS: Record<MapBucket, number> = (() => {
  const counts: Record<MapBucket, number> = {
    in_production: 0,
    in_production_partial: 0,
    in_development: 0,
    needs_certification: 0,
    sponsored: 0,
    closed: 0,
    unknown: 0,
  }
  for (const s of STATES) {
    counts[computeMapBucket(s.rows)]++
  }
  return counts
})()

export const EVV_BY_CODE: Record<string, StateEvv> = Object.fromEntries(
  STATES.map((s) => [s.code, s])
)

/** All jurisdictions in the guide, A–Z by state name (for tables and exports). */
export const ALL_STATES_EVV: StateEvv[] = [...STATES].sort((a, b) =>
  a.name.localeCompare(b.name)
)

export function getStateEvv(code: string | undefined): StateEvv | undefined {
  if (!code) return undefined
  return EVV_BY_CODE[code]
}

export function mapBucketForState(code: string | undefined): MapBucket {
  const s = getStateEvv(code)
  if (!s) return 'unknown'
  return computeMapBucket(s.rows)
}

export const LEGEND_ITEMS: {
  bucket: Exclude<MapBucket, 'unknown'>
  label: string
  description: string
}[] = [
  {
    bucket: 'in_production',
    label: 'In production',
    description:
      'Development and certification are complete for the listed aggregator(s) in that state.',
  },
  {
    bucket: 'in_production_partial',
    label: 'In production + other paths',
    description:
      'In production for at least one aggregator while other paths are still sponsored or pending (similar to “1 of many” in the guide).',
  },
  {
    bucket: 'in_development',
    label: 'In development',
    description: 'Development and/or certification in progress.',
  },
  {
    bucket: 'needs_certification',
    label: 'Needs final certification',
    description: 'Implementation exists but final certification is still required.',
  },
  {
    bucket: 'sponsored',
    label: 'Sponsored',
    description:
      'AlayaCare has been sponsored; development and/or certification has not yet started for the listed path(s).',
  },
  {
    bucket: 'closed',
    label: 'Closed',
    description: 'Closed state per the EVV guide.',
  },
]

export function rollupLabel(bucket: MapBucket): string {
  if (bucket === 'unknown') return 'No data in guide'
  const item = LEGEND_ITEMS.find((l) => l.bucket === bucket)
  return item?.label ?? bucket
}
