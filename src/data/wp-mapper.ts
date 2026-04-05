/**
 * WordPress → SiteData mapper (P8.1)
 *
 * Client-side boundary: converts the raw JSON from /wp-json/spektra/v1/site
 * into a typed SiteData structure that the Benettcar frontend can consume.
 *
 * Rules:
 * - Pure functions only, no side effects
 * - Explicit per-section mapping (no deep generic mapper)
 * - Fail-soft: malformed/unknown sections are skipped, not crashed
 * - Boundary type coercion: JSON null → undefined for optional fields
 * - NO schema changes, NO smart normalization (that's P8.2)
 * - Media fields stay Media, string exceptions stay string
 *
 * @module wp-mapper
 */

import type {
  SiteData,
  SiteMeta,
  Navigation,
  NavItem,
  Page,
  Section,
  Media,
  CallToAction,
} from '@spektra/types'

// ── Helpers ───────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined
}

function asBoolean(value: unknown): boolean {
  return value === true
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

/**
 * Convert a raw value to Media | undefined.
 * Accepts a valid Media shape (object with src + alt strings).
 * Returns undefined for null, non-objects, or malformed shapes.
 */
function maybeMedia(value: unknown): Media | undefined {
  if (!isRecord(value)) return undefined
  const src = asString(value.src)
  const alt = asString(value.alt)
  if (src === undefined || alt === undefined) return undefined
  return {
    src,
    alt,
    width: asNumber(value.width),
    height: asNumber(value.height),
    mimeType: asString(value.mimeType),
    // variants are optional; skip deep mapping for now
  }
}

/**
 * Convert a raw value to CallToAction | undefined.
 */
function maybeCta(value: unknown): CallToAction | undefined {
  if (!isRecord(value)) return undefined
  const text = asString(value.text)
  if (text === undefined) return undefined
  return { text, href: asString(value.href) }
}

/**
 * Coerce null → undefined for optional string fields.
 */
function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

// ── Top-level mapper ──────────────────────────────────────────────────────

/**
 * Maps the raw WordPress REST response into a typed SiteData.
 *
 * This is the single public entrypoint for P8.1.
 */
export function mapWordPressSiteData(raw: unknown): SiteData {
  if (!isRecord(raw)) {
    return emptySiteData()
  }

  return {
    site: mapSite(raw.site),
    navigation: mapNavigation(raw.navigation),
    pages: mapPages(raw.pages),
  }
}

// ── Site meta ─────────────────────────────────────────────────────────────

function mapSite(raw: unknown): SiteMeta {
  if (!isRecord(raw)) {
    return { name: '' }
  }
  return {
    name: asString(raw.name) ?? '',
    description: optionalString(raw.description),
    url: optionalString(raw.url),
    locale: optionalString(raw.locale),
  }
}

// ── Navigation ────────────────────────────────────────────────────────────

function mapNavigation(raw: unknown): Navigation {
  if (!isRecord(raw)) {
    return { primary: [] }
  }
  return {
    primary: asArray(raw.primary).map(mapNavItem).filter(isDefined),
    footer: raw.footer !== undefined
      ? asArray(raw.footer).map(mapNavItem).filter(isDefined)
      : undefined,
  }
}

function mapNavItem(raw: unknown): NavItem | undefined {
  if (!isRecord(raw)) return undefined
  const label = asString(raw.label)
  const href = asString(raw.href)
  if (label === undefined || href === undefined) return undefined

  const item: NavItem = { label, href }
  if (raw.external === true) item.external = true
  if (Array.isArray(raw.children)) {
    const children = raw.children.map(mapNavItem).filter(isDefined)
    if (children.length > 0) item.children = children
  }
  return item
}

// ── Pages ─────────────────────────────────────────────────────────────────

function mapPages(raw: unknown): Page[] {
  const arr = asArray(raw)
  const pages = arr.map(mapPage).filter(isDefined)
  // SiteData requires at least 1 page — provide empty fallback
  if (pages.length === 0) {
    return [{ slug: 'home', sections: [] }]
  }
  return pages
}

function mapPage(raw: unknown): Page | undefined {
  if (!isRecord(raw)) return undefined
  const slug = asString(raw.slug)
  if (slug === undefined) return undefined

  const page: Page = {
    slug,
    title: optionalString(raw.title),
    sections: mapSections(raw.sections),
  }

  if (isRecord(raw.meta)) {
    page.meta = {
      title: optionalString((raw.meta as Record<string, unknown>).title),
      description: optionalString(
        (raw.meta as Record<string, unknown>).description,
      ),
      canonical: optionalString(
        (raw.meta as Record<string, unknown>).canonical,
      ),
      ogImage: maybeMedia((raw.meta as Record<string, unknown>).ogImage),
    }
  }

  return page
}

// ── Sections ──────────────────────────────────────────────────────────────

function mapSections(raw: unknown): Section[] {
  return asArray(raw).map(mapSection).filter(isDefined)
}

function mapSection(raw: unknown): Section | undefined {
  if (!isRecord(raw)) return undefined
  const id = asString(raw.id)
  const type = asString(raw.type)
  if (id === undefined || type === undefined) return undefined
  if (!isRecord(raw.data)) return undefined

  const data = mapSectionData(type, raw.data as Record<string, unknown>)
  if (data === undefined) return undefined

  return { id, type, data }
}

/**
 * Dispatch to per-section mapper based on type.
 * Unknown sections are skipped (fail-soft).
 */
function mapSectionData(
  type: string,
  raw: Record<string, unknown>,
): Record<string, unknown> | undefined {
  switch (type) {
    case 'bc-hero':
      return mapBcHero(raw)
    case 'bc-brand':
      return mapBcBrand(raw)
    case 'bc-gallery':
      return mapBcGallery(raw)
    case 'bc-services':
      return mapBcServices(raw)
    case 'bc-service':
      return mapBcService(raw)
    case 'bc-about':
      return mapBcAbout(raw)
    case 'bc-team':
      return mapBcTeam(raw)
    case 'bc-assistance':
      return mapBcAssistance(raw)
    case 'bc-contact':
      return mapBcContact(raw)
    case 'bc-map':
      return mapBcMap(raw)
    default:
      // Unknown section type → skip
      return undefined
  }
}

// ── Per-section mappers ───────────────────────────────────────────────────

function mapBcHero(raw: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {
    title: asString(raw.title) ?? '',
    description: asString(raw.description) ?? '',
  }
  const subtitle = optionalString(raw.subtitle)
  if (subtitle !== undefined) data.subtitle = subtitle

  data.backgroundImage = maybeMedia(raw.backgroundImage)

  const primaryCTA = maybeCta(raw.primaryCTA)
  if (primaryCTA !== undefined) data.primaryCTA = primaryCTA

  const secondaryCTA = maybeCta(raw.secondaryCTA)
  if (secondaryCTA !== undefined) data.secondaryCTA = secondaryCTA

  return data
}

function mapBcBrand(raw: Record<string, unknown>): Record<string, unknown> {
  const brands = asArray(raw.brands)
    .filter(isRecord)
    .map((b) => {
      const item: Record<string, unknown> = {
        name: asString(b.name) ?? '',
        // logo stays string — P7.4.1 contract
        logo: asString(b.logo) ?? '',
      }
      const alt = optionalString(b.alt)
      if (alt !== undefined) item.alt = alt
      if (b.invert === true) item.invert = true
      return item
    })

  return {
    title: optionalString(raw.title),
    description: optionalString(raw.description),
    brands,
  }
}

function mapBcGallery(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const images = asArray(raw.images)
    .filter(isRecord)
    .map((img) => ({
      // src stays string — not normalized to Media (P8 mapper boundary)
      src: asString(img.src) ?? '',
      alt: asString(img.alt) ?? '',
      category: optionalString(img.category),
      caption: optionalString(img.caption),
    }))

  return {
    title: asString(raw.title) ?? '',
    subtitle: optionalString(raw.subtitle),
    showCategories: asBoolean(raw.showCategories),
    images,
  }
}

function mapBcServices(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const services = asArray(raw.services)
    .filter(isRecord)
    .map((s) => ({
      title: asString(s.title) ?? '',
      icon: asString(s.icon) ?? '',
      description: asString(s.description) ?? '',
    }))

  return {
    title: asString(raw.title) ?? '',
    subtitle: optionalString(raw.subtitle),
    services,
  }
}

function mapBcService(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const services = asArray(raw.services)
    .filter(isRecord)
    .map((s) => ({
      label: asString(s.label) ?? '',
    }))

  const brands = asArray(raw.brands)
    .map((b) => asString(b))
    .filter(isDefined)

  const data: Record<string, unknown> = {
    title: asString(raw.title) ?? '',
    subtitle: optionalString(raw.subtitle),
    description: asString(raw.description) ?? '',
    services,
    brands,
  }

  if (isRecord(raw.contact)) {
    const c = raw.contact as Record<string, unknown>
    const contact: Record<string, unknown> = {
      title: asString(c.title) ?? '',
      description: asString(c.description) ?? '',
    }
    const phone = optionalString(c.phone)
    if (phone !== undefined) contact.phone = phone
    const messageCta = maybeCta(c.messageCta)
    if (messageCta !== undefined) contact.messageCta = messageCta
    const bookingNote = optionalString(c.bookingNote)
    if (bookingNote !== undefined) contact.bookingNote = bookingNote
    const hours = optionalString(c.hours)
    if (hours !== undefined) contact.hours = hours
    const weekendHours = optionalString(c.weekendHours)
    if (weekendHours !== undefined) contact.weekendHours = weekendHours
    data.contact = contact
  }

  return data
}

function mapBcAbout(raw: Record<string, unknown>): Record<string, unknown> {
  const content = asArray(raw.content)
    .map((c) => asString(c))
    .filter(isDefined)

  const data: Record<string, unknown> = {
    title: asString(raw.title) ?? '',
    subtitle: optionalString(raw.subtitle),
    content,
    image: maybeMedia(raw.image),
    imagePosition: optionalString(raw.imagePosition),
    colorScheme: optionalString(raw.colorScheme),
  }

  const stats = asArray(raw.stats)
    .filter(isRecord)
    .map((s) => ({
      value: asString(s.value) ?? '',
      label: asString(s.label) ?? '',
    }))
  if (stats.length > 0) data.stats = stats

  const cta = maybeCta(raw.cta)
  if (cta !== undefined) data.cta = cta

  return data
}

function mapBcTeam(raw: Record<string, unknown>): Record<string, unknown> {
  const members = asArray(raw.members)
    .filter(isRecord)
    .map((m) => {
      const member: Record<string, unknown> = {
        name: asString(m.name) ?? '',
        role: asString(m.role) ?? '',
        image: maybeMedia(m.image),
      }
      const phone = optionalString(m.phone)
      if (phone !== undefined) member.phone = phone
      const email = optionalString(m.email)
      if (email !== undefined) member.email = email
      return member
    })

  return {
    title: asString(raw.title) ?? '',
    subtitle: optionalString(raw.subtitle),
    description: optionalString(raw.description),
    members,
  }
}

function mapBcAssistance(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  return {
    title: asString(raw.title) ?? '',
    subtitle: optionalString(raw.subtitle),
    description: optionalString(raw.description),
    requestLabel: optionalString(raw.requestLabel),
    requestHref: optionalString(raw.requestHref),
    serviceArea: optionalString(raw.serviceArea),
  }
}

function mapBcContact(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const data: Record<string, unknown> = {
    title: asString(raw.title) ?? '',
    subtitle: optionalString(raw.subtitle),
    description: optionalString(raw.description),
    colorScheme: optionalString(raw.colorScheme),
  }

  if (isRecord(raw.contactInfo)) {
    const ci = raw.contactInfo as Record<string, unknown>
    data.contactInfo = {
      phone: optionalString(ci.phone),
      email: optionalString(ci.email),
      address: optionalString(ci.address),
    }
  }

  return data
}

function mapBcMap(raw: Record<string, unknown>): Record<string, unknown> {
  return {
    title: optionalString(raw.title),
    query: asString(raw.query) ?? '',
    height: asNumber(raw.height),
  }
}

// ── Utility ───────────────────────────────────────────────────────────────

function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

function emptySiteData(): SiteData {
  return {
    site: { name: '' },
    navigation: { primary: [] },
    pages: [{ slug: 'home', sections: [] }],
  }
}
