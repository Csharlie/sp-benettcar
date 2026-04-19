/**
 * Benettcar ACF field mapping — site.ts shape → seed.json fields.
 *
 * Canonical mapping for the bc-* section family.
 * Each entry describes one ACF field:
 *   - acfKey: the full ACF field name (used by update_field)
 *   - kind: scalar | repeater | group | image
 *   - extract: function that pulls the value from the section's data object
 *
 * The exporter calls extract(data) for each field and writes the result to seed.json.
 * The importer reads seed.json and calls update_field(acfKey, value, postId)
 * using the kind to determine how ACF should handle the value.
 *
 * Rules:
 *   - Slot fields: extract returns scalar / image for each individual slot key
 *   - Textarea fields: extract returns newline-joined text
 *   - Group fields: extract returns a flat object (keys = ACF sub-field names)
 *   - Image fields: extract returns { url: string, alt: string }
 *   - Scalar fields: extract returns a string | number | boolean
 *   - Navigation is NOT exported (config-driven, out of parity scope)
 *
 * P13.4: All 8 migrated repeatable fields now use slot-based or textarea mappings.
 * `kind: 'repeater'` retained in FieldKind for legacy/future compatibility only.
 *
 * @package Spektra\Client\Benettcar
 */

// ── Types ────────────────────────────────────────────────────────

/** `repeater` retained for legacy/future compatibility — not used in active mappings. */
export type FieldKind = 'scalar' | 'repeater' | 'group' | 'image'

export interface FieldMapping {
  acfKey: string
  kind: FieldKind
  extract: (data: Record<string, unknown>) => unknown
}

export interface SectionMapping {
  sectionType: string
  fields: FieldMapping[]
}

// ── Helpers ──────────────────────────────────────────────────────

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const num = (v: unknown, fallback = 0): number =>
  typeof v === 'number' ? v : fallback
const bool = (v: unknown): boolean => Boolean(v)

function extractCta(
  data: Record<string, unknown>,
  key: string,
): { text: string; href: string } | null {
  const cta = data[key] as { text?: string; href?: string } | undefined
  if (!cta || (!cta.text && !cta.href)) return null
  return { text: str(cta.text), href: str(cta.href) }
}

function extractMedia(
  data: Record<string, unknown>,
  key: string,
): { url: string; alt: string } | null {
  const img = data[key] as { src?: string; alt?: string } | undefined
  if (!img || !img.src) return null
  return { url: str(img.src), alt: str(img.alt) }
}

/** Join string items with newline for textarea seed fields. */
function joinLines(items: string[]): string {
  return items.join('\n')
}

/**
 * Generate scalar slot FieldMappings from an array property.
 * For each slot 1..max, the extract closure picks item[i-1] or returns ''.
 */
function makeSlotScalars<T>(
  prefix: string,
  suffix: string,
  max: number,
  getItems: (d: Record<string, unknown>) => T[],
  getValue: (item: T) => string,
): FieldMapping[] {
  const fields: FieldMapping[] = []
  for (let i = 1; i <= max; i++) {
    const idx = i - 1
    fields.push({
      acfKey: `${prefix}${i}${suffix}`,
      kind: 'scalar',
      extract: (d) => {
        const items = getItems(d)
        return idx < items.length ? getValue(items[idx]) : ''
      },
    })
  }
  return fields
}

/**
 * Generate image slot FieldMappings from an array property.
 * For each slot 1..max, the extract closure picks item[i-1] or returns null.
 */
function makeSlotImages<T>(
  prefix: string,
  suffix: string,
  max: number,
  getItems: (d: Record<string, unknown>) => T[],
  getMedia: (item: T) => { url: string; alt: string } | null,
): FieldMapping[] {
  const fields: FieldMapping[] = []
  for (let i = 1; i <= max; i++) {
    const idx = i - 1
    fields.push({
      acfKey: `${prefix}${i}${suffix}`,
      kind: 'image',
      extract: (d) => {
        const items = getItems(d)
        return idx < items.length ? getMedia(items[idx]) : null
      },
    })
  }
  return fields
}

// ── Typed array extractors ───────────────────────────────────────

type ServiceItem = { title?: string; icon?: string; description?: string }
type GalleryImage = {
  src?: string
  alt?: string
  category?: string
  caption?: string
}
type BrandItem = {
  name?: string
  logo?: string
  alt?: string
  invert?: boolean
}
type TeamMember = {
  name?: string
  role?: string
  image?: { src?: string; alt?: string }
  phone?: string
  email?: string
}
type StatItem = { value?: string; label?: string }

const getServiceItems = (d: Record<string, unknown>): ServiceItem[] => {
  const items = d.services as ServiceItem[]
  return Array.isArray(items) ? items : []
}

const getGalleryImages = (d: Record<string, unknown>): GalleryImage[] => {
  const images = d.images as GalleryImage[]
  return Array.isArray(images) ? images : []
}

const getBrandItems = (d: Record<string, unknown>): BrandItem[] => {
  const brands = d.brands as BrandItem[]
  return Array.isArray(brands) ? brands : []
}

const getTeamMembers = (d: Record<string, unknown>): TeamMember[] => {
  const members = d.members as TeamMember[]
  return Array.isArray(members) ? members : []
}

const getAboutStats = (d: Record<string, unknown>): StatItem[] => {
  const stats = d.stats as StatItem[]
  return Array.isArray(stats) ? stats : []
}

// ── Section mappings ─────────────────────────────────────────────

const bcHero: SectionMapping = {
  sectionType: 'bc-hero',
  fields: [
    { acfKey: 'bc_hero_title', kind: 'scalar', extract: (d) => str(d.title) },
    {
      acfKey: 'bc_hero_subtitle',
      kind: 'scalar',
      extract: (d) => str(d.subtitle),
    },
    {
      acfKey: 'bc_hero_description',
      kind: 'scalar',
      extract: (d) => str(d.description),
    },
    {
      acfKey: 'bc_hero_primary_cta_text',
      kind: 'scalar',
      extract: (d) => extractCta(d, 'primaryCTA')?.text ?? '',
    },
    {
      acfKey: 'bc_hero_primary_cta_href',
      kind: 'scalar',
      extract: (d) => extractCta(d, 'primaryCTA')?.href ?? '',
    },
    {
      acfKey: 'bc_hero_secondary_cta_text',
      kind: 'scalar',
      extract: (d) => extractCta(d, 'secondaryCTA')?.text ?? '',
    },
    {
      acfKey: 'bc_hero_secondary_cta_href',
      kind: 'scalar',
      extract: (d) => extractCta(d, 'secondaryCTA')?.href ?? '',
    },
    {
      acfKey: 'bc_hero_background_image',
      kind: 'image',
      extract: (d) => extractMedia(d, 'backgroundImage'),
    },
    {
      acfKey: 'bc_hero_background_image_alt',
      kind: 'scalar',
      extract: (d) => {
        const img = d.backgroundImage as { alt?: string } | undefined
        return str(img?.alt)
      },
    },
  ],
}

// P13.4: bc-brand — 10 brand slots (name/logo/alt/invert).
const bcBrand: SectionMapping = {
  sectionType: 'bc-brand',
  fields: [
    { acfKey: 'bc_brand_title', kind: 'scalar', extract: (d) => str(d.title) },
    {
      acfKey: 'bc_brand_description',
      kind: 'scalar',
      extract: (d) => str(d.description),
    },
    ...makeSlotScalars('bc_brand_brand_', '_name', 10, getBrandItems, (b) =>
      str(b.name),
    ),
    ...makeSlotImages('bc_brand_brand_', '_logo', 10, getBrandItems, (b) =>
      b.logo ? { url: str(b.logo), alt: str(b.alt) } : null,
    ),
    ...makeSlotScalars('bc_brand_brand_', '_alt', 10, getBrandItems, (b) =>
      str(b.alt),
    ),
    ...makeSlotScalars('bc_brand_brand_', '_invert', 10, getBrandItems, (b) =>
      bool(b.invert) ? '1' : '0',
    ),
  ],
}

// P13.4: bc-gallery — 10 image slots (src/alt/category/caption).
const bcGallery: SectionMapping = {
  sectionType: 'bc-gallery',
  fields: [
    {
      acfKey: 'bc_gallery_title',
      kind: 'scalar',
      extract: (d) => str(d.title),
    },
    {
      acfKey: 'bc_gallery_subtitle',
      kind: 'scalar',
      extract: (d) => str(d.subtitle),
    },
    {
      acfKey: 'bc_gallery_show_categories',
      kind: 'scalar',
      extract: (d) => (bool(d.showCategories) ? '1' : '0'),
    },
    ...makeSlotImages(
      'bc_gallery_image_',
      '_src',
      10,
      getGalleryImages,
      (img) => (img.src ? { url: str(img.src), alt: str(img.alt) } : null),
    ),
    ...makeSlotScalars(
      'bc_gallery_image_',
      '_alt',
      10,
      getGalleryImages,
      (img) => str(img.alt),
    ),
    ...makeSlotScalars(
      'bc_gallery_image_',
      '_category',
      10,
      getGalleryImages,
      (img) => str(img.category),
    ),
    ...makeSlotScalars(
      'bc_gallery_image_',
      '_caption',
      10,
      getGalleryImages,
      (img) => str(img.caption),
    ),
  ],
}

// P13.4: bc-services — 6 service slots (title/icon/description).
const bcServices: SectionMapping = {
  sectionType: 'bc-services',
  fields: [
    {
      acfKey: 'bc_services_title',
      kind: 'scalar',
      extract: (d) => str(d.title),
    },
    {
      acfKey: 'bc_services_subtitle',
      kind: 'scalar',
      extract: (d) => str(d.subtitle),
    },
    ...makeSlotScalars(
      'bc_services_service_',
      '_title',
      6,
      getServiceItems,
      (s) => str(s.title),
    ),
    ...makeSlotScalars(
      'bc_services_service_',
      '_icon',
      6,
      getServiceItems,
      (s) => str(s.icon),
    ),
    ...makeSlotScalars(
      'bc_services_service_',
      '_description',
      6,
      getServiceItems,
      (s) => str(s.description),
    ),
  ],
}

// P13.4: bc-service — services/brands as textarea, contact as group.
const bcService: SectionMapping = {
  sectionType: 'bc-service',
  fields: [
    {
      acfKey: 'bc_service_title',
      kind: 'scalar',
      extract: (d) => str(d.title),
    },
    {
      acfKey: 'bc_service_subtitle',
      kind: 'scalar',
      extract: (d) => str(d.subtitle),
    },
    {
      acfKey: 'bc_service_description',
      kind: 'scalar',
      extract: (d) => str(d.description),
    },
    {
      // P13.2: services[].label → newline-joined textarea.
      acfKey: 'bc_service_services_text',
      kind: 'scalar',
      extract: (d) => {
        const items = d.services as Array<{ label?: string }>
        if (!Array.isArray(items)) return ''
        return joinLines(items.map((s) => str(s.label)).filter(Boolean))
      },
    },
    {
      // P13.2: brands[] (string[]) → newline-joined textarea.
      acfKey: 'bc_service_brands_text',
      kind: 'scalar',
      extract: (d) => {
        const brands = d.brands as string[]
        if (!Array.isArray(brands)) return ''
        return joinLines(brands.filter(Boolean))
      },
    },
    {
      acfKey: 'bc_service_contact',
      kind: 'group',
      extract: (d) => {
        const c = d.contact as Record<string, unknown> | undefined
        if (!c) return null
        const cta = c.messageCta as
          | { text?: string; href?: string }
          | undefined
        return {
          title: str(c.title),
          description: str(c.description),
          phone: str(c.phone),
          message_cta_text: str(cta?.text),
          message_cta_href: str(cta?.href),
          booking_note: str(c.bookingNote),
          hours: str(c.hours),
          weekend_hours: str(c.weekendHours),
        }
      },
    },
  ],
}

// P13.4: bc-about — content as textarea, stats as 6 slots.
const bcAbout: SectionMapping = {
  sectionType: 'bc-about',
  fields: [
    { acfKey: 'bc_about_title', kind: 'scalar', extract: (d) => str(d.title) },
    {
      acfKey: 'bc_about_subtitle',
      kind: 'scalar',
      extract: (d) => str(d.subtitle),
    },
    {
      // P13.2: content[] (string[]) → newline-joined textarea.
      acfKey: 'bc_about_content_text',
      kind: 'scalar',
      extract: (d) => {
        const lines = d.content as string[]
        if (!Array.isArray(lines)) return ''
        return joinLines(lines)
      },
    },
    {
      acfKey: 'bc_about_image',
      kind: 'image',
      extract: (d) => extractMedia(d, 'image'),
    },
    {
      acfKey: 'bc_about_image_alt',
      kind: 'scalar',
      extract: (d) => {
        const img = d.image as { alt?: string } | undefined
        return str(img?.alt)
      },
    },
    {
      acfKey: 'bc_about_image_position',
      kind: 'scalar',
      extract: (d) => str(d.imagePosition) || 'right',
    },
    {
      acfKey: 'bc_about_color_scheme',
      kind: 'scalar',
      extract: (d) => str(d.colorScheme) || 'light',
    },
    // P13.2: stats as 6 slot pairs (value/label).
    ...makeSlotScalars('bc_about_stat_', '_value', 6, getAboutStats, (s) =>
      str(s.value),
    ),
    ...makeSlotScalars('bc_about_stat_', '_label', 6, getAboutStats, (s) =>
      str(s.label),
    ),
    {
      acfKey: 'bc_about_cta_text',
      kind: 'scalar',
      extract: (d) => extractCta(d, 'cta')?.text ?? '',
    },
    {
      acfKey: 'bc_about_cta_href',
      kind: 'scalar',
      extract: (d) => extractCta(d, 'cta')?.href ?? '',
    },
  ],
}

// P13.4: bc-team — 8 member slots (name/role/image/image_alt/phone/email).
const bcTeam: SectionMapping = {
  sectionType: 'bc-team',
  fields: [
    { acfKey: 'bc_team_title', kind: 'scalar', extract: (d) => str(d.title) },
    {
      acfKey: 'bc_team_subtitle',
      kind: 'scalar',
      extract: (d) => str(d.subtitle),
    },
    {
      acfKey: 'bc_team_description',
      kind: 'scalar',
      extract: (d) => str(d.description),
    },
    ...makeSlotScalars('bc_team_member_', '_name', 8, getTeamMembers, (m) =>
      str(m.name),
    ),
    ...makeSlotScalars('bc_team_member_', '_role', 8, getTeamMembers, (m) =>
      str(m.role),
    ),
    ...makeSlotImages('bc_team_member_', '_image', 8, getTeamMembers, (m) =>
      m.image?.src ? { url: str(m.image.src), alt: str(m.image?.alt) } : null,
    ),
    ...makeSlotScalars(
      'bc_team_member_',
      '_image_alt',
      8,
      getTeamMembers,
      (m) => str(m.image?.alt),
    ),
    ...makeSlotScalars('bc_team_member_', '_phone', 8, getTeamMembers, (m) =>
      str(m.phone),
    ),
    ...makeSlotScalars('bc_team_member_', '_email', 8, getTeamMembers, (m) =>
      str(m.email),
    ),
  ],
}

const bcAssistance: SectionMapping = {
  sectionType: 'bc-assistance',
  fields: [
    {
      acfKey: 'bc_assistance_title',
      kind: 'scalar',
      extract: (d) => str(d.title),
    },
    {
      acfKey: 'bc_assistance_subtitle',
      kind: 'scalar',
      extract: (d) => str(d.subtitle),
    },
    {
      acfKey: 'bc_assistance_description',
      kind: 'scalar',
      extract: (d) => str(d.description),
    },
    {
      acfKey: 'bc_assistance_request_label',
      kind: 'scalar',
      extract: (d) => str(d.requestLabel),
    },
    {
      acfKey: 'bc_assistance_request_href',
      kind: 'scalar',
      extract: (d) => str(d.requestHref),
    },
    {
      acfKey: 'bc_assistance_service_area',
      kind: 'scalar',
      extract: (d) => str(d.serviceArea),
    },
  ],
}

const bcContact: SectionMapping = {
  sectionType: 'bc-contact',
  fields: [
    {
      acfKey: 'bc_contact_title',
      kind: 'scalar',
      extract: (d) => str(d.title),
    },
    {
      acfKey: 'bc_contact_subtitle',
      kind: 'scalar',
      extract: (d) => str(d.subtitle),
    },
    {
      acfKey: 'bc_contact_description',
      kind: 'scalar',
      extract: (d) => str(d.description),
    },
    {
      acfKey: 'bc_contact_color_scheme',
      kind: 'scalar',
      extract: (d) => str(d.colorScheme) || 'light',
    },
    {
      acfKey: 'bc_contact_info',
      kind: 'group',
      extract: (d) => {
        const info = d.contactInfo as Record<string, unknown> | undefined
        if (!info) return null
        return {
          phone: str(info.phone),
          email: str(info.email),
          address: str(info.address),
        }
      },
    },
  ],
}

const bcMap: SectionMapping = {
  sectionType: 'bc-map',
  fields: [
    { acfKey: 'bc_map_title', kind: 'scalar', extract: (d) => str(d.title) },
    { acfKey: 'bc_map_query', kind: 'scalar', extract: (d) => str(d.query) },
    {
      acfKey: 'bc_map_height',
      kind: 'scalar',
      extract: (d) => num(d.height, 400),
    },
  ],
}

// ── Export ────────────────────────────────────────────────────────

export const sectionMappings: SectionMapping[] = [
  bcHero,
  bcBrand,
  bcGallery,
  bcServices,
  bcService,
  bcAbout,
  bcTeam,
  bcAssistance,
  bcContact,
  bcMap,
]
