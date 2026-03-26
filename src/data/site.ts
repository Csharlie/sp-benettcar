import type { SiteData } from '@spektra/types'

/**
 * Benettcar mock site data — WP-kompatibilis alakban.
 *
 * Később a createJsonAdapter({ data: siteData }) lecserélhető
 * createWordPressAdapter({ url: '...' })-ra — egy az egyben.
 *
 * A Section.data mezők PONTOSAN a bc-* section komponensek props-jai:
 * a SectionRenderer {...section.data} spread-del adja át őket.
 */
export const siteData: SiteData = {
  site: {
    name: 'Benett Car',
    description: 'Autószerviz, felvásárlás és útmenti segítség Cegléden.',
    url: 'https://benettcar.hu',
    locale: 'hu',
  },

  navigation: {
    primary: [
      { label: 'Galéria', href: '#gallery' },
      { label: 'Szolgáltatások', href: '#services' },
      { label: 'Szerviz', href: '#car-service' },
      { label: 'Rólunk', href: '#about' },
      { label: 'Útmenti segítség', href: '#roadside' },
    ],
    footer: [
      { label: 'Autószerviz', href: '#car-service' },
      { label: 'Útmenti segítség', href: '#roadside' },
      { label: 'Rólunk', href: '#about' },
      { label: 'Kapcsolat', href: '#contact' },
      { label: 'Adatvédelem', href: '#privacy' },
      { label: 'ÁSZF', href: '#terms' },
    ],
  },

  pages: [
    {
      slug: 'home',
      title: 'Főoldal',
      meta: {
        title: 'Benett Car Business | Autószerviz Cegléd',
        description:
          'Benett Car Business - Autószerviz, felvásárlás és útmenti segítség Cegléden. VW Konszern és Audi szakszerviz.',
      },
      sections: [
        // ---------------------------------------------------------------
        // 1. bc-hero
        // ---------------------------------------------------------------
        {
          id: 'hero-1',
          type: 'bc-hero',
          data: {
            title: 'Precíz munka. Valódi odafigyelés.',
            subtitle:
              'Volkswagen Konszern és Audi járművekre specializált műhely',
            description:
              'Minden munkát az adott autóra szabunk – személyes felelősséggel.',
            primaryCTA: { text: 'Szerviz egyeztetés', href: '#car-service' },
            secondaryCTA: { text: 'Kapcsolat', href: '#contact' },
            backgroundImage: {
              src: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&auto=format&fit=crop&q=80',
              alt: 'Autószerviz műhely',
            },
          },
        },

        // ---------------------------------------------------------------
        // 2. bc-brand
        // ---------------------------------------------------------------
        {
          id: 'brand-1',
          type: 'bc-brand',
          data: {
            brands: [
              { name: 'Volkswagen' },
              { name: 'Audi' },
              { name: 'Škoda' },
              { name: 'Porsche' },
              { name: 'Bugatti' },
              { name: 'Lamborghini' },
            ],
          },
        },

        // ---------------------------------------------------------------
        // 3. bc-gallery
        // ---------------------------------------------------------------
        {
          id: 'gallery-1',
          type: 'bc-gallery',
          data: {
            title: 'Galéria',
            subtitle: 'Valós autók, valós környezetben',
            showCategories: true,
            images: [
              {
                src: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop&q=80',
                alt: 'Átadás előtti ellenőrzés',
                category: 'Karbantartás',
                caption: 'Átadás előtti ellenőrzés',
              },
              {
                src: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&auto=format&fit=crop&q=80',
                alt: 'Diagnosztika munka közben',
                category: 'Diagnosztika',
                caption: 'Diagnosztika munka közben',
              },
              {
                src: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
                alt: 'Prémium autó szervízelés',
                category: 'Szerviz',
                caption: 'Prémium autó szervízelés',
              },
              {
                src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
                alt: 'Prémium autó',
                category: 'Karbantartás',
                caption: 'Karbantartott jármű',
              },
              {
                src: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop&q=80',
                alt: 'Szervizfolyamat – motorjavítás',
                category: 'Javítás',
                caption: 'Szervizfolyamat – motorjavítás',
              },
              {
                src: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&auto=format&fit=crop&q=80',
                alt: 'Szerviz épület',
                category: 'Szerviz',
                caption: 'Szerviz épület',
              },
              {
                src: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop&q=80',
                alt: 'BMW szakszervizelés',
                category: 'Javítás',
                caption: 'BMW szakszervizelés',
              },
              {
                src: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80',
                alt: 'Porsche karbantartás',
                category: 'Karbantartás',
                caption: 'Porsche karbantartás',
              },
            ],
          },
        },

        // ---------------------------------------------------------------
        // 4. bc-services
        // ---------------------------------------------------------------
        {
          id: 'services-1',
          type: 'bc-services',
          data: {
            title: 'Teljes körű szolgáltatások prémium autókhoz',
            subtitle: 'Szolgáltatások',
            services: [
              {
                title: 'Autószerviz',
                icon: 'Wrench',
                description:
                  'Amikor autója prémium márka-kompetenciát igényel. Volkswagen Konszern és Audi szakszervizelés.',
              },
              {
                title: 'Értékesítés',
                icon: 'DollarSign',
                description:
                  'Prémium kategóriás használt autók értékesítése. Átlátható árazás, valós műszaki állapot.',
              },
              {
                title: 'Útmenti segítség',
                icon: 'AlertCircle',
                description:
                  'Kiegészítő szolgáltatás meglévő szervizügyfeleink számára, váratlan helyzetekben.',
              },
            ],
          },
        },

        // ---------------------------------------------------------------
        // 5. bc-service
        // ---------------------------------------------------------------
        {
          id: 'service-1',
          type: 'bc-service',
          data: {
            title: 'Autószerviz',
            subtitle: 'Volkswagen Konszern specialista',
            description:
              'Gyári szintű diagnosztika és karbantartás. Eredeti alkatrészek, szakértő szerelők.',
            brands: [
              'Volkswagen',
              'Audi',
              'Škoda',
              'Porsche',
              'Bugatti',
              'Lamborghini',
            ],
            colorScheme: 'dark' as const,
          },
        },

        // ---------------------------------------------------------------
        // 6. bc-about
        // ---------------------------------------------------------------
        {
          id: 'about-1',
          type: 'bc-about',
          data: {
            title: 'Kiszámítható szakértelem, valódi műhely',
            subtitle: 'Benett Car Business Kft.',
            content: [
              'Három prémium márkára szakosodott helyi autószerviz. Tapasztalt szakértők, akik ismerik a Volkswagen Konszern és Audi rendszereket – nem általános szerelők, hanem specializált profi csapat.',
              'Pontos árajánlat, reális határidők, egyértelmű kommunikáció. Marketing ígéretek helyett mérhető eredmény.',
            ],
            image: {
              src: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop',
              alt: 'Benett Car műhely',
            },
            imagePosition: 'right' as const,
            stats: [
              {
                value: 'Prémium',
                label: 'Volkswagen · Audi · Škoda\nPorsche · Bugatti · Lamborghini',
              },
              { value: 'Helyi', label: 'Műhely' },
              { value: '10+', label: 'Év tapasztalat' },
            ],
            cta: { text: 'Kapcsolatfelvétel', href: '#contact' },
            colorScheme: 'dark' as const,
          },
        },

        // ---------------------------------------------------------------
        // 7. bc-team
        // ---------------------------------------------------------------
        {
          id: 'team-1',
          type: 'bc-team',
          data: {
            title: 'Kapcsolattartók',
            subtitle: 'Csapatunk',
            description:
              'Közvetlenül elérhető szakértőink állnak rendelkezésére.',
            members: [
              {
                name: 'Nagy Benett',
                role: 'Tulajdonos, Műszaki Vezető',
                image: {
                  src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80',
                  alt: 'Nagy Benett',
                },
                phone: '+36 30 123 4567',
                email: 'benett@example.com',
              },
              {
                name: 'Kovács Péter',
                role: 'Diagnosztikai Szakértő',
                image: {
                  src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&q=80',
                  alt: 'Kovács Péter',
                },
                phone: '+36 30 234 5678',
                email: 'peter@example.com',
              },
            ],
          },
        },

        // ---------------------------------------------------------------
        // 8. bc-assistance
        // ---------------------------------------------------------------
        {
          id: 'assistance-1',
          type: 'bc-assistance',
          data: {
            title: 'Útmenti segítség',
            subtitle: 'Váratlan helyzetekben is számíthat ránk',
            description:
              'Kiegészítő szolgáltatás meglévő szervizügyfeleink számára. Munkanapokon, a szerviz nyitvatartási idejében elérhető.',
            phone: '+36 30 123 4567',
            serviceArea: '30 km-es körzetben',
            colorScheme: 'dark' as const,
          },
        },

        // ---------------------------------------------------------------
        // 9. bc-contact
        // ---------------------------------------------------------------
        {
          id: 'contact-1',
          type: 'bc-contact',
          data: {
            title: 'Időpont vagy árajánlat kérése',
            subtitle: 'Kapcsolat',
            description: 'Írjon nekünk, és hamarosan jelentkezünk.',
            contactInfo: {
              phone: '+36 30 123 4567',
              email: 'info@benettcar.hu',
              address: 'Cegléd, Magyarország',
            },
            colorScheme: 'dark' as const,
          },
        },

        // ---------------------------------------------------------------
        // 10. bc-map
        // ---------------------------------------------------------------
        {
          id: 'map-1',
          type: 'bc-map',
          data: {
            title: 'Benett Car Business KFT - Cegléd',
            query: 'Benett Car Business KFT, Cegléd',
            height: 500,
          },
        },
      ],
    },
  ],
}
