import { describe, it, expect } from 'vitest'
import { mapWordPressSiteData } from './wp-mapper'
import { normalizeSiteData } from './normalize-site-data'

// ── Helpers ───────────────────────────────────────────────────────────────

/** Wrap sections into a valid raw WP payload for mapper + normalizer chain. */
function rawWithSections(sections: Record<string, unknown>[]) {
  return {
    site: { name: 'Test' },
    navigation: { primary: [{ label: 'Home', href: '/' }] },
    pages: [{ slug: 'home', sections }],
  }
}

/** Run the full mapper → normalizer pipeline and return resulting sections. */
function pipelineSections(sections: Record<string, unknown>[]) {
  const mapped = mapWordPressSiteData(rawWithSections(sections))
  const normalized = normalizeSiteData(mapped)
  return normalized.pages[0]!.sections
}

// ── bc-hero render-safety ─────────────────────────────────────────────────

describe('normalize — bc-hero render-safety', () => {
  it('drops hero with empty title + description + no CTA + no bg', () => {
    const sections = pipelineSections([
      { id: 'h1', type: 'bc-hero', data: { title: '', description: '' } },
    ])
    expect(sections).toHaveLength(0)
  })

  it('drops hero with whitespace-only title + description', () => {
    const sections = pipelineSections([
      { id: 'h2', type: 'bc-hero', data: { title: '   ', description: '  ' } },
    ])
    expect(sections).toHaveLength(0)
  })

  it('keeps hero with non-empty title', () => {
    const sections = pipelineSections([
      { id: 'h3', type: 'bc-hero', data: { title: 'Welcome', description: '' } },
    ])
    expect(sections).toHaveLength(1)
    expect(sections[0]!.type).toBe('bc-hero')
  })

  it('keeps hero with non-empty description only', () => {
    const sections = pipelineSections([
      { id: 'h4', type: 'bc-hero', data: { title: '', description: 'Some text' } },
    ])
    expect(sections).toHaveLength(1)
  })

  it('keeps hero with CTA only', () => {
    const sections = pipelineSections([
      {
        id: 'h5',
        type: 'bc-hero',
        data: {
          title: '',
          description: '',
          primaryCTA: { text: 'Click me', href: '/go' },
        },
      },
    ])
    expect(sections).toHaveLength(1)
  })

  it('keeps hero with backgroundImage only', () => {
    const sections = pipelineSections([
      {
        id: 'h6',
        type: 'bc-hero',
        data: {
          title: '',
          description: '',
          backgroundImage: { src: '/img/bg.jpg', alt: 'bg' },
        },
      },
    ])
    expect(sections).toHaveLength(1)
  })
})

// ── bc-gallery render-safety ──────────────────────────────────────────────

describe('normalize — bc-gallery render-safety', () => {
  it('drops gallery with no valid image src', () => {
    const sections = pipelineSections([
      {
        id: 'g1',
        type: 'bc-gallery',
        data: {
          title: 'Gallery',
          images: [
            { src: '', alt: 'empty' },
            { src: '   ', alt: 'whitespace' },
          ],
        },
      },
    ])
    expect(sections).toHaveLength(0)
  })

  it('keeps gallery with at least one valid image', () => {
    const sections = pipelineSections([
      {
        id: 'g2',
        type: 'bc-gallery',
        data: {
          title: 'Gallery',
          images: [
            { src: '/ok.jpg', alt: 'ok' },
            { src: '', alt: 'bad' },
          ],
        },
      },
    ])
    expect(sections).toHaveLength(1)
    expect((sections[0]!.data as Record<string, unknown>).images).toHaveLength(1)
  })
})

// ── bc-team render-safety ─────────────────────────────────────────────────

describe('normalize — bc-team render-safety', () => {
  it('drops team with no named members', () => {
    const sections = pipelineSections([
      {
        id: 't1',
        type: 'bc-team',
        data: {
          title: 'Team',
          members: [
            { name: '', role: 'Dev' },
            { name: '   ', role: 'PM' },
          ],
        },
      },
    ])
    expect(sections).toHaveLength(0)
  })

  it('keeps team with at least one named member', () => {
    const sections = pipelineSections([
      {
        id: 't2',
        type: 'bc-team',
        data: {
          title: 'Team',
          members: [
            { name: 'Alice', role: 'Dev' },
            { name: '', role: 'PM' },
          ],
        },
      },
    ])
    expect(sections).toHaveLength(1)
    expect((sections[0]!.data as Record<string, unknown>).members).toHaveLength(1)
  })
})

// ── bc-contact render-safety ──────────────────────────────────────────────

describe('normalize — bc-contact render-safety', () => {
  it('drops contact with no contactInfo', () => {
    const sections = pipelineSections([
      { id: 'c1', type: 'bc-contact', data: { title: 'Contact' } },
    ])
    expect(sections).toHaveLength(0)
  })

  it('drops contact with all-empty contactInfo', () => {
    const sections = pipelineSections([
      {
        id: 'c2',
        type: 'bc-contact',
        data: {
          title: 'Contact',
          contactInfo: { phone: '', email: '   ', address: '' },
        },
      },
    ])
    expect(sections).toHaveLength(0)
  })

  it('keeps contact with phone', () => {
    const sections = pipelineSections([
      {
        id: 'c3',
        type: 'bc-contact',
        data: {
          title: 'Contact',
          contactInfo: { phone: '+36 1 234 5678' },
        },
      },
    ])
    expect(sections).toHaveLength(1)
  })

  it('keeps contact with email only', () => {
    const sections = pipelineSections([
      {
        id: 'c4',
        type: 'bc-contact',
        data: {
          title: 'Contact',
          contactInfo: { email: 'info@test.com' },
        },
      },
    ])
    expect(sections).toHaveLength(1)
  })
})

// ── bc-brand render-safety ────────────────────────────────────────────────

describe('normalize — bc-brand render-safety', () => {
  it('keeps brand with named but logoless item', () => {
    const sections = pipelineSections([
      {
        id: 'b1',
        type: 'bc-brand',
        data: { brands: [{ name: 'Acme', logo: '' }] },
      },
    ])
    expect(sections).toHaveLength(1)
  })

  it('drops brand with zero renderable items', () => {
    const sections = pipelineSections([
      {
        id: 'b2',
        type: 'bc-brand',
        data: { brands: [{ name: '', logo: '/x.png' }] },
      },
    ])
    expect(sections).toHaveLength(0)
  })
})

// ── bc-about stats ────────────────────────────────────────────────────────

describe('normalize — bc-about stats', () => {
  it('drops empty stats but keeps section', () => {
    const sections = pipelineSections([
      {
        id: 'a1',
        type: 'bc-about',
        data: {
          title: 'About',
          content: ['text'],
          stats: [{ value: '', label: '' }],
        },
      },
    ])
    expect(sections).toHaveLength(1)
    expect((sections[0]!.data as Record<string, unknown>).stats).toBeUndefined()
  })

  it('preserves valid stats', () => {
    const sections = pipelineSections([
      {
        id: 'a2',
        type: 'bc-about',
        data: {
          title: 'About',
          content: ['text'],
          stats: [{ value: '100+', label: 'Projects' }],
        },
      },
    ])
    expect(sections).toHaveLength(1)
    expect((sections[0]!.data as Record<string, unknown>).stats).toHaveLength(1)
  })
})

// ── Happy-path smoke ──────────────────────────────────────────────────────

describe('normalize — full pipeline happy path', () => {
  it('valid raw payload survives mapper + normalizer with key sections intact', () => {
    const raw = {
      site: { name: 'Benett Car', url: 'https://benettcar.local' },
      navigation: {
        primary: [
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
        ],
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
                title: 'Welcome to Benett Car',
                description: 'Premium automotive services',
                primaryCTA: { text: 'Contact Us', href: '#contact' },
              },
            },
            {
              id: 'services-1',
              type: 'bc-services',
              data: {
                title: 'Our Services',
                services: [{ title: 'Repair', icon: 'wrench', description: 'Full repair' }],
              },
            },
            {
              id: 'gallery-1',
              type: 'bc-gallery',
              data: {
                title: 'Gallery',
                images: [{ src: '/img/car1.jpg', alt: 'Car 1' }],
              },
            },
            {
              id: 'contact-1',
              type: 'bc-contact',
              data: {
                title: 'Contact',
                contactInfo: { phone: '+36 1 234 5678', email: 'info@benettcar.hu' },
              },
            },
          ],
        },
      ],
    }

    const mapped = mapWordPressSiteData(raw)
    const result = normalizeSiteData(mapped)

    expect(result.site.name).toBe('Benett Car')
    expect(result.navigation.primary).toHaveLength(2)
    expect(result.pages).toHaveLength(1)

    const types = result.pages[0]!.sections.map((s) => s.type)
    expect(types).toEqual(['bc-hero', 'bc-services', 'bc-gallery', 'bc-contact'])
  })
})
