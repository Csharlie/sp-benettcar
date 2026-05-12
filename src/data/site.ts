import type { SiteData } from '@spektra/types'
import vwLogo from '../assets/brands/vw-logo.jpg'
import audiLogo from '../assets/brands/audi-logo.png'
import skodaLogo from '../assets/brands/skoda-logo.png'
import porscheLogo from '../assets/brands/porsche-logo.png'
import lamborghiniLogo from '../assets/brands/lamborghini-logo-white.png'
import bugattiLogo from '../assets/brands/bugatti-logo-white.png'

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
    description: 'Volkswagen-konszern modellek szakértői háttérrel Cegléden.',
    url: 'https://benettcar.hu',
    locale: 'hu',
  },

  navigation: {
    primary: [
      { label: 'Galéria', href: '#gallery' },
      { label: 'Szolgáltatások', href: '#services' },
      { label: 'Rólunk', href: '#about' },
      { label: 'Útmenti segítség', href: '#roadside' },
    ],
    footer: [
      { label: 'Rólunk', href: '#about' },
      { label: 'Galéria', href: '#gallery' },
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
        title: 'Benett Car Business Kft. | Autókereskedés, állapotfelmérés, autóbérlés – Cegléd',
        description:
          'Benett Car Business Kft. – Ellenőrzött járműbeszerzés, műszaki állapotfelmérés, diagnosztika, autóbérlés és útmenti segítség Cegléden. Volkswagen-konszern modellek szakértői háttérrel.',
      },
      sections: [
        // ---------------------------------------------------------------
        // 1. bc-hero
        // ---------------------------------------------------------------
        {
          id: 'hero-1',
          type: 'bc-hero',
          data: {
            eyebrow: 'AUDI · VW · ŠKODA · PORSCHE · LAMBORGHINI · BUGATTI',
            title: 'Átfogó típusismeret. Műszaki biztonság.',
            subtitle: '',
            description:
              'A Volkswagen-konszern márkáira specializálódva biztosítjuk a járművek beszerzését, a folyamatos mobilitást és a szakértői állapotfelmérést.',
            primaryCTA: { text: 'Szolgáltatásaink', href: '#services' },
            secondaryCTA: { text: 'Kapcsolat', href: '#contact' },
            backgroundImage: {
              src: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&auto=format&fit=crop&q=80',
              alt: 'Benett Car prémium autók',
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
            title: 'Volkswagen-konszern modellek szakértői háttérrel',
            description:
              'Típusismeret és gyári megoldások azokhoz az autókhoz, amelyekkel nap mint nap dolgozunk.',
            brands: [
              { name: 'Volkswagen', logo: vwLogo, alt: 'Volkswagen logó', invert: true },
              { name: 'Audi', logo: audiLogo, alt: 'Audi logó' },
              { name: 'Škoda', logo: skodaLogo, alt: 'Škoda logó', invert: true },
              { name: 'Porsche', logo: porscheLogo, alt: 'Porsche logó', invert: true },
              { name: 'Bugatti', logo: bugattiLogo, alt: 'Bugatti logó' },
              { name: 'Lamborghini', logo: lamborghiniLogo, alt: 'Lamborghini logó' },
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
                category: 'Értékesítés',
                caption: 'Átadás előtti ellenőrzés',
              },
              {
                src: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&auto=format&fit=crop&q=80',
                alt: 'Műszaki állapot ellenőrzés',
                category: 'Ellenőrzés',
                caption: 'Műszaki állapot ellenőrzés',
              },
              {
                src: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80',
                alt: 'Prémium jármű',
                category: 'Autópark',
                caption: 'Prémium jármű',
              },
              {
                src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
                alt: 'Prémium autó',
                category: 'Autópark',
                caption: 'Prémium jármű',
              },
              {
                src: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&auto=format&fit=crop&q=80',
                alt: 'Prémium autó részletei',
                category: 'Autópark',
                caption: 'Prémium autó részletei',
              },
              {
                src: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&auto=format&fit=crop&q=80',
                alt: 'Benett Car telephely',
                category: 'Telephely',
                caption: 'Benett Car telephely',
              },
              {
                src: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop&q=80',
                alt: 'Prémium jármű értékesítés',
                category: 'Értékesítés',
                caption: 'Prémium jármű értékesítés',
              },
              {
                src: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80',
                alt: 'Porsche jármű',
                category: 'Autópark',
                caption: 'Porsche jármű',
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
            title: 'Biztonság és mobilitás szakértői háttérrel',
            subtitle: 'Szolgáltatások',
            services: [
              {
                title: 'Ellenőrzött járműbeszerzés',
                icon: 'DollarSign',
                description:
                  'Kizárólag igazolt előéletű, műszakilag auditált modellek közvetítése és értékesítése. Dokumentált múlt és a kifogástalan állapot.',
              },
              {
                title: 'Műszaki állapotfelmérés',
                icon: 'CheckCircle',
                description:
                  'Átfogó ellenőrzés és diagnosztikai vizsgálat. Segítünk, hogy járműve állapotával kapcsolatban ne megérzésekre, hanem valós adatokra alapozhasson.',
              },
              {
                title: 'Rugalmas mobilitás',
                icon: 'Car',
                description:
                  'Autóbérlési lehetőségek meglévő ügyfeleink zavartalan mozgástere érdekében. Megoldások, hogy Ön egy pillanatra se maradjon autó nélkül.',
              },
              {
                title: 'Útmenti segítségnyújtás',
                icon: 'AlertCircle',
                description:
                  'Biztonság minden helyzetben. Segélyszolgálatunkkal kiemelt figyelmet és támogatást nyújtunk partnereinknek a váratlan helyzetekben is.',
              },
            ],
          },
        },

        // ---------------------------------------------------------------
        // 5. bc-service — Értékesítés részletei
        // ---------------------------------------------------------------
        {
          id: 'service-1',
          type: 'bc-service',
          data: {
            title: 'Személyre szabott megoldások',
            subtitle: 'Megoldásaink',
            description: '',
            serviceListTitle: 'Miért a Benett Car?',
            brandsTitle: 'Támogatott márkák',
            services: [
              { label: 'Ellenőrzött járműbeszerzés és értékesítés' },
              { label: 'Kizárólag igazolt előéletű modellek' },
              { label: 'Állapotfelmérés valós műszaki képpel' },
              { label: 'Átfogó diagnosztikai vizsgálat' },
              { label: 'Bérautó szolgáltatás partnereink számára' },
              { label: 'Partneri segítségnyújtás váratlan helyzetekben' },
            ],
            brands: [
              'Volkswagen',
              'Audi',
              'Škoda',
              'Porsche',
              'Bugatti',
              'Lamborghini',
            ],
            contact: {
              title: 'Tervezhető és rendezett ügyintézés',
              description:
                'Annak érdekében, hogy minden járműre és megkeresésre kellő figyelmet fordíthassunk, kérjük egyeztessen velünk időpontot — kérjen visszahívást vagy küldjön üzenetet.',
              phone: '+36301234567',
              messageCta: { text: 'Üzenet küldése', href: '#contact' },
              bookingNote:
                'Járműbeszerzéssel és értékesítéssel, állapotfelméréssel, diagnosztikával, autóbérléssel vagy partneri segítségnyújtással kapcsolatban is szívesen tájékoztatjuk.',
              hours: '8:00–16:00',
              weekendHours: 'Zárva',
              hoursNote: 'Munkatársaink minden hétköznap {hours} óra között állnak rendelkezésre.',
            },
          },
        },

        // ---------------------------------------------------------------
        // 6. bc-about
        // ---------------------------------------------------------------
        {
          id: 'about-1',
          type: 'bc-about',
          data: {
            title: 'Kiszámítható szakértelem, megbízható partner',
            subtitle: 'Benett Car Business Kft.',
            content: [
              'A Benett Car járműbeszerzésben, értékesítési támogatásban, állapotfelmérésben, diagnosztikában és mobilitási megoldásokban segít ügyfeleinek.',
              'Mély típusismerettel és szakértői szemlélettel, átlátható kommunikációval és személyes egyeztetéssel dolgozunk, hogy minden döntés valós műszaki képre és rendezett ügyintézésre épülhessen.',
            ],
            image: {
              src: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop',
              alt: 'Benett Car telephely',
            },
            imagePosition: 'right' as const,
            stats: [
              {
                value: 'Típusismeret',
                label: 'Volkswagen · Audi · Škoda\nPorsche · Bugatti · Lamborghini',
              },
              { value: 'Helyi jelenlét', label: 'Cegléd és környéke' },
              { value: '10+ év', label: 'Gyakorlati tapasztalat' },
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
                role: 'Értékesítési Szakértő',
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
            title: 'Útmenti segítség, amikor szükséges',
            subtitle: 'Kiegészítő szolgáltatás',
            description:
              'Kiegészítő szolgáltatás ügyfeleink számára, váratlan helyzetekben.',
            requestLabel: 'Útmenti segítség igénylése',
            requestHref: 'tel:+36301234567',
            serviceArea: '30 km-es körzetben',
          },
        },

        // ---------------------------------------------------------------
        // 9. bc-contact
        // ---------------------------------------------------------------
        {
          id: 'contact-1',
          type: 'bc-contact',
          data: {
            title: 'Érdeklődés vagy ajánlatkérés',
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
