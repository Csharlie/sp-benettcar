/**
 * SiteData normalizer — consumer-safety cleanup pass (P8.2)
 *
 * Input/output: SiteData → SiteData
 * This is NOT a mapper — it does not touch raw WP payloads.
 * It cleans up the already-mapped SiteData for frontend consumption:
 *
 * - Whitespace-only optional strings → undefined
 * - Empty/unusable CTA objects → removed
 * - Non-renderable array items → filtered out
 * - Section-aware targeted cleanup
 * - Sections that would only produce hollow UI shells → dropped
 *
 * Policy:
 * - Items with explicit UI fallback (e.g. logoless brand → name) are KEPT
 * - Required strings are NOT touched (even if empty)
 * - No schema changes, no contract reinterpretation
 *
 * @module normalize-site-data
 */

import type { SiteData, Page, Section, NavItem, CallToAction } from '@spektra/types'

// ── Public API ────────────────────────────────────────────────────────────

export function normalizeSiteData(data: SiteData): SiteData {
  return {
    site: normalizeSiteMeta(data.site),
    navigation: normalizeNavigation(data.navigation),
    pages: data.pages.map(normalizePage),
  }
}

// ── Site meta ─────────────────────────────────────────────────────────────

function normalizeSiteMeta(
  site: SiteData['site'],
): SiteData['site'] {
  return {
    name: site.name,
    description: cleanOptional(site.description),
    url: cleanOptional(site.url),
    locale: cleanOptional(site.locale),
  }
}

// ── Navigation ────────────────────────────────────────────────────────────

function normalizeNavigation(
  nav: SiteData['navigation'],
): SiteData['navigation'] {
  return {
    primary: nav.primary.filter(isRenderableNavItem),
    footer: nav.footer?.filter(isRenderableNavItem),
  }
}

function isRenderableNavItem(item: NavItem): boolean {
  return item.label.trim().length > 0 && item.href.trim().length > 0
}

// ── Pages ─────────────────────────────────────────────────────────────────

function normalizePage(page: Page): Page {
  return {
    ...page,
    title: cleanOptional(page.title),
    sections: normalizeSections(page.sections),
  }
}

// ── Sections ──────────────────────────────────────────────────────────────

function normalizeSections(sections: Section[]): Section[] {
  return sections.map(normalizeSection).filter(isDefined)
}

function normalizeSection(section: Section): Section | undefined {
  const result = normalizeSectionData(
    section.type,
    section.data as Record<string, unknown>,
  )
  if (result === undefined) return undefined
  return { ...section, data: result }
}

function normalizeSectionData(
  type: string,
  data: Record<string, unknown>,
): Record<string, unknown> | undefined {
  switch (type) {
    case 'bc-hero':
      // TODO: bc-hero render-safety skip rule requires component-aware review.
      // Hero is a high-visibility layout-driving section — defer until
      // we can audit the component's actual minimum content rendering behavior.
      return normalizeBcHero(data)
    case 'bc-brand':
      return normalizeBcBrand(data)
    case 'bc-gallery':
      return normalizeBcGallery(data)
    case 'bc-services':
      return normalizeBcServices(data)
    case 'bc-service':
      return normalizeBcService(data)
    case 'bc-about':
      return normalizeBcAbout(data)
    case 'bc-team':
      return normalizeBcTeam(data)
    case 'bc-assistance':
      return normalizeBcAssistance(data)
    case 'bc-contact':
      return normalizeBcContact(data)
    case 'bc-map':
      return normalizeBcMap(data)
    default:
      return data
  }
}

// ── Per-section normalizers ───────────────────────────────────────────────

function normalizeBcHero(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...data }
  result.subtitle = cleanOptional(result.subtitle)
  result.primaryCTA = cleanCta(result.primaryCTA)
  result.secondaryCTA = cleanCta(result.secondaryCTA)
  return result
}

function normalizeBcBrand(
  data: Record<string, unknown>,
): Record<string, unknown> | undefined {
  // Brand items are NOT filtered — logoless brands render as name text (UI fallback)
  const brands = asTypedArray(data.brands)
  // Only drop the whole section if zero renderable brand items exist
  const renderableBrands = brands.filter(
    (b) => typeof b.name === 'string' && b.name.trim().length > 0,
  )
  if (renderableBrands.length === 0) return undefined
  return {
    ...data,
    title: cleanOptional(data.title),
    description: cleanOptional(data.description),
  }
}

function normalizeBcGallery(
  data: Record<string, unknown>,
): Record<string, unknown> | undefined {
  const images = asTypedArray(data.images)
  // Filter out images with empty/missing src — not renderable
  const renderableImages = images.filter(
    (img) => typeof img.src === 'string' && img.src.trim().length > 0,
  )
  // Drop the whole section if no valid images remain
  if (renderableImages.length === 0) return undefined
  return {
    ...data,
    subtitle: cleanOptional(data.subtitle),
    images: renderableImages,
  }
}

function normalizeBcServices(
  data: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...data,
    subtitle: cleanOptional(data.subtitle),
  }
}

function normalizeBcService(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...data }
  result.subtitle = cleanOptional(result.subtitle)

  // Clean contact sub-object
  if (isRecord(result.contact)) {
    const contact = { ...result.contact } as Record<string, unknown>
    contact.phone = cleanOptional(contact.phone)
    contact.bookingNote = cleanOptional(contact.bookingNote)
    contact.hours = cleanOptional(contact.hours)
    contact.weekendHours = cleanOptional(contact.weekendHours)
    contact.messageCta = cleanCta(contact.messageCta)
    result.contact = contact
  }

  return result
}

function normalizeBcAbout(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...data }
  result.subtitle = cleanOptional(result.subtitle)
  result.cta = cleanCta(result.cta)

  // Filter stats with empty value or label
  const stats = asTypedArray(result.stats)
  const renderableStats = stats.filter(
    (s) =>
      typeof s.value === 'string' &&
      s.value.trim().length > 0 &&
      typeof s.label === 'string' &&
      s.label.trim().length > 0,
  )
  // Stats are optional sub-content of bc-about — empty stats don't drop the section
  result.stats = renderableStats.length > 0 ? renderableStats : undefined

  return result
}

function normalizeBcTeam(
  data: Record<string, unknown>,
): Record<string, unknown> | undefined {
  const members = asTypedArray(data.members)
  // Filter members without a name — not renderable
  const renderableMembers = members.filter(
    (m) => typeof m.name === 'string' && m.name.trim().length > 0,
  )
  // Drop the whole section if no renderable members remain
  if (renderableMembers.length === 0) return undefined
  return {
    ...data,
    subtitle: cleanOptional(data.subtitle),
    description: cleanOptional(data.description),
    members: renderableMembers,
  }
}

function normalizeBcAssistance(
  data: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...data,
    subtitle: cleanOptional(data.subtitle),
    description: cleanOptional(data.description),
    requestLabel: cleanOptional(data.requestLabel),
    requestHref: cleanOptional(data.requestHref),
    serviceArea: cleanOptional(data.serviceArea),
  }
}

function normalizeBcContact(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...data }
  result.subtitle = cleanOptional(result.subtitle)
  result.description = cleanOptional(result.description)

  if (isRecord(result.contactInfo)) {
    const ci = { ...result.contactInfo } as Record<string, unknown>
    ci.phone = cleanOptional(ci.phone)
    ci.email = cleanOptional(ci.email)
    ci.address = cleanOptional(ci.address)
    result.contactInfo = ci
  }

  return result
}

function normalizeBcMap(
  data: Record<string, unknown>,
): Record<string, unknown> {
  return {
    ...data,
    title: cleanOptional(data.title),
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Trim + empty check for optional strings.
 * Whitespace-only → undefined.
 */
function cleanOptional(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/**
 * Clean a CTA object: if text is empty/whitespace after trim, drop the entire CTA.
 */
function cleanCta(value: unknown): CallToAction | undefined {
  if (!isRecord(value)) return undefined
  const text = typeof value.text === 'string' ? value.text.trim() : ''
  if (text.length === 0) return undefined
  return {
    text,
    href: typeof value.href === 'string' ? value.href.trim() : undefined,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null
}

function asTypedArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value)
    ? (value.filter(isRecord) as Record<string, unknown>[])
    : []
}
