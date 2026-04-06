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
 *   - Repeater fields: extract returns an array of row objects (sub-field keys = ACF sub-field names)
 *   - Group fields: extract returns a flat object (keys = ACF sub-field names)
 *   - Image fields: extract returns { url: string, alt: string }
 *   - Scalar fields: extract returns a string | number | boolean
 *   - Navigation is NOT exported (config-driven, out of parity scope)
 *
 * @package Spektra\Client\Benettcar
 */

// ── Types ────────────────────────────────────────────────────────

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

const bcBrand: SectionMapping = {
  sectionType: 'bc-brand',
  fields: [
    { acfKey: 'bc_brand_title', kind: 'scalar', extract: (d) => str(d.title) },
    {
      acfKey: 'bc_brand_description',
      kind: 'scalar',
      extract: (d) => str(d.description),
    },
    {
      acfKey: 'bc_brand_brands',
      kind: 'repeater',
      extract: (d) => {
        const brands = d.brands as Array<{
          name?: string
          logo?: string
          alt?: string
          invert?: boolean
        }>
        if (!Array.isArray(brands)) return []
        return brands.map((b) => ({
          name: str(b.name),
          logo: str(b.logo),
          alt: str(b.alt),
          invert: bool(b.invert) ? '1' : '0',
        }))
      },
    },
  ],
}

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
    {
      acfKey: 'bc_gallery_images',
      kind: 'repeater',
      extract: (d) => {
        const images = d.images as Array<{
          src?: string
          alt?: string
          category?: string
          caption?: string
        }>
        if (!Array.isArray(images)) return []
        return images.map((img) => ({
          src: str(img.src),
          alt: str(img.alt),
          category: str(img.category),
          caption: str(img.caption),
        }))
      },
    },
  ],
}

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
    {
      acfKey: 'bc_services_services',
      kind: 'repeater',
      extract: (d) => {
        const items = d.services as Array<{
          title?: string
          icon?: string
          description?: string
        }>
        if (!Array.isArray(items)) return []
        return items.map((s) => ({
          title: str(s.title),
          icon: str(s.icon),
          description: str(s.description),
        }))
      },
    },
  ],
}

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
      acfKey: 'bc_service_services',
      kind: 'repeater',
      extract: (d) => {
        const items = d.services as Array<{ label?: string }>
        if (!Array.isArray(items)) return []
        return items.map((s) => ({ label: str(s.label) }))
      },
    },
    {
      // site.ts: string[] → ACF repeater with {name} sub-field
      // PHP builder maps [{name}] → string[] in output
      acfKey: 'bc_service_brands',
      kind: 'repeater',
      extract: (d) => {
        const brands = d.brands as string[]
        if (!Array.isArray(brands)) return []
        return brands.map((name) => ({ name: str(name) }))
      },
    },
    {
      acfKey: 'bc_service_contact',
      kind: 'group',
      extract: (d) => {
        const c = d.contact as Record<string, unknown> | undefined
        if (!c) return null
        const cta = c.messageCta as { text?: string; href?: string } | undefined
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
      // site.ts: string[] → ACF repeater with {paragraph} sub-field
      // PHP builder maps [{paragraph}] → string[] in output
      acfKey: 'bc_about_content',
      kind: 'repeater',
      extract: (d) => {
        const lines = d.content as string[]
        if (!Array.isArray(lines)) return []
        return lines.map((text) => ({ paragraph: str(text) }))
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
    {
      acfKey: 'bc_about_stats',
      kind: 'repeater',
      extract: (d) => {
        const stats = d.stats as Array<{ value?: string; label?: string }>
        if (!Array.isArray(stats)) return []
        return stats.map((s) => ({ value: str(s.value), label: str(s.label) }))
      },
    },
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
    {
      acfKey: 'bc_team_members',
      kind: 'repeater',
      extract: (d) => {
        const members = d.members as Array<{
          name?: string
          role?: string
          image?: { src?: string; alt?: string }
          phone?: string
          email?: string
        }>
        if (!Array.isArray(members)) return []
        return members.map((m) => ({
          name: str(m.name),
          role: str(m.role),
          image: m.image?.src ?? '',
          image_alt: str(m.image?.alt),
          phone: str(m.phone),
          email: str(m.email),
        }))
      },
    },
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
