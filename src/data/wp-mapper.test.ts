import { describe, it, expect } from 'vitest'
import { mapWordPressSiteData } from './wp-mapper'

// ── Fixtures ──────────────────────────────────────────────────────────────

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    site: { name: 'Test Site', url: 'https://test.local' },
    navigation: {
      primary: [{ label: 'Home', href: '/' }],
    },
    pages: [
      {
        slug: 'home',
        title: 'Home',
        sections: [
          {
            id: 'hero-1',
            type: 'bc-hero',
            data: {
              title: 'Welcome',
              description: 'Hello world',
              backgroundImage: {
                src: '/img/hero.jpg',
                alt: 'Hero background',
              },
            },
          },
          {
            id: 'services-1',
            type: 'bc-services',
            data: {
              title: 'Services',
              services: [
                { title: 'Service A', icon: 'wrench', description: 'Desc A' },
              ],
            },
          },
          {
            id: 'contact-1',
            type: 'bc-contact',
            data: {
              title: 'Contact',
              contactInfo: { phone: '+36 1 234 5678', email: 'info@test.com' },
            },
          },
        ],
      },
    ],
    ...overrides,
  }
}

// ── Top-level payload strictness ──────────────────────────────────────────

describe('mapWordPressSiteData — top-level strictness', () => {
  it('throws on null', () => {
    expect(() => mapWordPressSiteData(null)).toThrow('expected object')
  })

  it('throws on string', () => {
    expect(() => mapWordPressSiteData('bad')).toThrow('expected object')
  })

  it('throws on number', () => {
    expect(() => mapWordPressSiteData(42)).toThrow('expected object')
  })

  it('throws when site is missing', () => {
    expect(() =>
      mapWordPressSiteData({ navigation: { primary: [] }, pages: [] }),
    ).toThrow('missing site')
  })

  it('throws when navigation is missing', () => {
    expect(() =>
      mapWordPressSiteData({ site: { name: 'x' }, pages: [] }),
    ).toThrow('missing navigation')
  })

  it('throws when pages is missing', () => {
    expect(() =>
      mapWordPressSiteData({ site: { name: 'x' }, navigation: { primary: [] } }),
    ).toThrow('missing pages')
  })

  it('throws when pages is not an array', () => {
    expect(() =>
      mapWordPressSiteData({
        site: { name: 'x' },
        navigation: { primary: [] },
        pages: 'not-array',
      }),
    ).toThrow('missing pages')
  })

  it('throws when pages array has no valid pages', () => {
    expect(() =>
      mapWordPressSiteData({
        site: { name: 'x' },
        navigation: { primary: [] },
        pages: [],
      }),
    ).toThrow('no valid pages')
  })
})

// ── Media.variants fidelity ───────────────────────────────────────────────

describe('mapWordPressSiteData — Media.variants', () => {
  it('preserves canonical variants', () => {
    const raw = validPayload()
    ;(raw.pages[0]!.sections[0]!.data as Record<string, unknown>).backgroundImage = {
      src: '/img/hero.jpg',
      alt: 'Hero',
      variants: [
        {
          name: 'thumbnail',
          source: { url: '/img/hero-thumb.jpg', width: 150, height: 150, format: 'jpeg' },
        },
        {
          name: 'medium',
          source: { url: '/img/hero-med.jpg', width: 800 },
        },
      ],
    }

    const result = mapWordPressSiteData(raw)
    const bg = (result.pages[0]!.sections[0]!.data as Record<string, unknown>).backgroundImage as Record<string, unknown>
    const variants = bg.variants as Array<Record<string, unknown>>

    expect(variants).toHaveLength(2)
    expect(variants[0]!.name).toBe('thumbnail')
    expect((variants[0]!.source as Record<string, unknown>).url).toBe('/img/hero-thumb.jpg')
  })

  it('skips invalid variant items fail-soft', () => {
    const raw = validPayload()
    ;(raw.pages[0]!.sections[0]!.data as Record<string, unknown>).backgroundImage = {
      src: '/img/hero.jpg',
      alt: 'Hero',
      variants: [
        { name: 'good', source: { url: '/ok.jpg' } },
        { name: 'no-source' },
        { source: { url: '/no-name.jpg' } },
        'not-object',
        null,
      ],
    }

    const result = mapWordPressSiteData(raw)
    const bg = (result.pages[0]!.sections[0]!.data as Record<string, unknown>).backgroundImage as Record<string, unknown>
    const variants = bg.variants as Array<Record<string, unknown>>

    expect(variants).toHaveLength(1)
    expect(variants[0]!.name).toBe('good')
  })

  it('returns undefined for missing variants', () => {
    const raw = validPayload()
    const result = mapWordPressSiteData(raw)
    const bg = (result.pages[0]!.sections[0]!.data as Record<string, unknown>).backgroundImage as Record<string, unknown>
    expect(bg.variants).toBeUndefined()
  })

  it('returns undefined for empty variants array', () => {
    const raw = validPayload()
    ;(raw.pages[0]!.sections[0]!.data as Record<string, unknown>).backgroundImage = {
      src: '/img/hero.jpg',
      alt: 'Hero',
      variants: [],
    }

    const result = mapWordPressSiteData(raw)
    const bg = (result.pages[0]!.sections[0]!.data as Record<string, unknown>).backgroundImage as Record<string, unknown>
    expect(bg.variants).toBeUndefined()
  })
})

// ── Section-level fail-soft ───────────────────────────────────────────────

describe('mapWordPressSiteData — section-level fail-soft', () => {
  it('skips unknown section types', () => {
    const raw = validPayload()
    raw.pages[0]!.sections.push({
      id: 'x-1',
      type: 'unknown-type',
      data: { foo: 'bar' },
    } as never)

    const result = mapWordPressSiteData(raw)
    expect(result.pages[0]!.sections.every((s) => s.type !== 'unknown-type')).toBe(true)
  })
})

// ── Happy-path smoke ──────────────────────────────────────────────────────

describe('mapWordPressSiteData — happy path', () => {
  it('maps a valid payload into usable SiteData', () => {
    const result = mapWordPressSiteData(validPayload())

    expect(result.site.name).toBe('Test Site')
    expect(result.navigation.primary).toHaveLength(1)
    expect(result.pages).toHaveLength(1)
    expect(result.pages[0]!.slug).toBe('home')
    expect(result.pages[0]!.sections).toHaveLength(3)

    const types = result.pages[0]!.sections.map((s) => s.type)
    expect(types).toContain('bc-hero')
    expect(types).toContain('bc-services')
    expect(types).toContain('bc-contact')
  })
})
