# Benett Car — Kliens Migráció & Platform CVA Refactor Terv

> **Utolsó frissítés**: 2026-03-21
> **Állapot**: Tervezés kész, implementáció NEM kezdődött el
> **Platform repo**: `D:\Projects\spektra\sp-platform` (branch: `main`, utolsó commit: `#28 9fb4581`)
> **Kliens cél**: `D:\Projects\spektra\sp-clients\benettcar\`
> **Legacy referencia**: `D:\Projects\spektra-dev\spektra-home\spektra\sp-benettcar-consumer\`

---

## 1. Kontextus

### 1.1 Hol tartunk

A Spektra platform 9 fázisban felépült (Phase 1–9), + 8 post-phase hotfix (#22–#28).
A platform csomagok (`@spektra/*`) stabilak, 8/8 build + lint PASS.

**Commit történet**:
| # | Hash | Leírás |
|---|------|--------|
| Phase 1 | `1f57f01` | Monorepo skeleton |
| Phase 2 | `7dc87ca` | @spektra/types |
| Phase 3 | `ca114e2` | @spektra/data |
| Phase 4 | `5538d1e` | @spektra/runtime |
| Phase 5 | `bf5598a` | @spektra/components |
| Phase 6 | `9602207` | @spektra/sections |
| Phase 7 | `4f45cfe` | @spektra/themes |
| Phase 8 | `5f8b585` | @spektra/templates |
| Phase 9 | `e3f2fbb` | @spektra/starter |
| #22 | `30bd7e3` | Build stability audit |
| #23 | `21ac257` | Serializable CTA + templates publish surface |
| #24 | `712034c` | Media model unification |
| #25 | `3ff2b65` | Bootstrap-log docs (3.1–3.4) |
| #26 | `2dfdb17` | Type erasure boundaries |
| #27 | `0e2057b` | Runtime SiteData validation |
| #28 | `9fb4581` | Validation gaps fix |

### 1.2 Mi a probléma

A platform komponensek (`HeroBlock`, `AboutBlock`, `GalleryBlock`, `FeaturesBlock`, `ContactBlock`) **hardcoded Tailwind osztályokkal** dolgoznak:

```tsx
// HeroBlock.tsx — JELENLEG
<section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700">
  <p className="text-primary-200">...</p>
  <a className="bg-white text-primary-700 hover:bg-gray-100">...</a>
</section>

// AboutBlock.tsx — JELENLEG
<section className="py-20 bg-white">
  <h2 className="text-4xl font-bold text-gray-900">...</h2>
  <p className="text-primary-600">...</p>
</section>

// GalleryBlock.tsx — JELENLEG
<section className="py-20 md:py-32 bg-white">
  <p className="text-primary-600">subtitle</p>
  <h2 className="text-gray-900">title</h2>
  <button className="bg-primary-600 text-white">active filter</button>
  <button className="bg-gray-200 text-gray-700">inactive filter</button>
</section>

// FeaturesBlock.tsx — JELENLEG
<section className="py-20 bg-gray-50">
  <p className="text-primary-600">subtitle</p>
  <h2 className="text-gray-900">title</h2>
</section>

// ContactBlock.tsx — JELENLEG
<section className="py-20 bg-gray-50">
  <div className="bg-white rounded-2xl shadow-lg p-8">...</div>
  <div className="bg-primary-100"><Mail className="text-primary-600" /></div>
</section>
```

Ez azt jelenti, hogy egy új kliens (pl. benettcar: sötét téma, graphite háttér, neon-blue akcentek) **nem tudja a platform section-öket használni** pusztán téma cserével — az eredmény vizuálisan helytelen lenne.

### 1.3 A megoldás: CVA + Design Tokenek

Két lépés:
1. **Platform refactor** — hardcoded stílusokat CVA variánsokra + design tokenekre cseréljük
2. **Benettcar kliens** — a platform section-öket használja variánsokkal, ahol lehet; egyedi section-öket ír, ahol kell

---

## 2. Platform CVA Refactor (Phase 10a)

### 2.1 Szükséges változások

#### 2.1.1 CVA telepítése

```bash
cd packages/components
pnpm add class-variance-authority
```

A `cn()` utility (`clsx` + `tailwind-merge`) megmarad — a CVA kimenetét is `cn()`-nel kombináljuk.

#### 2.1.2 Design token rendszer

A Tailwind config-ban szemantikus tokeneket definiálunk. Minden platform komponens ezeket használja a konkrét színek helyett.

**Tokenek**:
| Token | Light (starter) | Dark (benettcar) |
|-------|-----------------|-------------------|
| `background` | `#ffffff` | `#0f0f14` (graphite-950) |
| `foreground` | `#111827` (gray-900) | `#ffffff` |
| `muted` | `#f9fafb` (gray-50) | graphite-900 |
| `muted-foreground` | `#6b7280` (gray-500) | gray-400 |
| `surface` | `#ffffff` | graphite-800 |
| `border` | `#e5e7eb` (gray-200) | graphite-700 |
| `primary-*` | blue skála (meglévő) | neon-blue skála |
| `secondary-*` | purple skála (meglévő) | red-accent skála |
| `accent` | `primary-600` | neon-blue DEFAULT |
| `accent-foreground` | `#ffffff` | graphite-950 |

#### 2.1.3 CVA variánsok a platformon

Minden platform modul (HeroBlock, AboutBlock, stb.) CVA variánsokat kap:

```tsx
// Példa: HeroBlock.tsx — CVA-VAL
import { cva, type VariantProps } from 'class-variance-authority'

const heroVariants = cva(
  'relative min-h-[600px] flex items-center justify-center', // base
  {
    variants: {
      colorScheme: {
        light: 'bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white',
        dark: 'bg-background text-foreground',
      },
      layout: {
        centered: 'text-center',
        split: '', // jövőbeli: grid layout
      },
      size: {
        default: 'py-20 md:py-32',
        compact: 'py-12 md:py-20',
        full: 'min-h-screen',
      },
    },
    defaultVariants: {
      colorScheme: 'light',
      layout: 'centered',
      size: 'default',
    },
  }
)

export interface HeroBlockProps extends VariantProps<typeof heroVariants> {
  title: string
  subtitle?: string
  description: string
  primaryCTA?: CallToAction
  secondaryCTA?: CallToAction
  backgroundImage?: Media
  className?: string
}
```

**Variánsok section-önként:**

| Section | Variánsok |
|---------|-----------|
| `HeroBlock` | `colorScheme: light/dark`, `layout: centered/split`, `size: default/compact/full` |
| `AboutBlock` | `colorScheme: light/dark`, `imagePosition: left/right` (meglévő) |
| `FeaturesBlock` | `colorScheme: light/dark`, `columns: 2/3/4` (meglévő) |
| `GalleryBlock` | `colorScheme: light/dark`, `showCategories` (meglévő) |
| `ContactBlock` | `colorScheme: light/dark` |
| `NavigationBar` | `variant: light/dark/transparent` |
| `FooterBlock` | `colorScheme: light/dark` |

#### 2.1.4 Érintett fájlok

Platform:
- `packages/components/package.json` — `class-variance-authority` dep hozzáadása
- `packages/components/src/modules/HeroBlock.tsx` — CVA refactor
- `packages/components/src/modules/AboutBlock.tsx` — CVA refactor
- `packages/components/src/modules/FeaturesBlock.tsx` — CVA refactor
- `packages/components/src/modules/GalleryBlock.tsx` — CVA refactor
- `packages/components/src/modules/ContactBlock.tsx` — CVA refactor
- `packages/components/src/modules/NavigationBar.tsx` — CVA refactor
- `packages/components/src/modules/FooterBlock.tsx` — CVA refactor
- `packages/components/src/basics/Button.tsx` — CVA variánsok (size, variant)
- `packages/components/src/elements/FeatureCard.tsx` — token-izálás
- `packages/themes/src/base.ts` — szemantikus token layer hozzáadása
- `packages/themes/src/corporate.ts` — frissítés
- `packages/themes/src/starter.ts` — frissítés
- `apps/starter/src/data.ts` — section data kiegészítés variáns propokkal (opcionális)
- `apps/starter/tailwind.config.js` — token import

#### 2.1.5 Ami NEM változik

- Type-ok (`@spektra/types`) — section.data generic marad, variáns propok a data-ban jönnek
- Runtime (`@spektra/runtime`) — registry, renderer, context érintetlen
- Data (`@spektra/data`) — adapterek, validáció érintetlen
- Sections (`@spektra/sections`) — definition-ök érintetlenek (a props interface bővül, de backward compatible)
- Templates (`@spektra/templates`) — LandingTemplate érintetlen

### 2.2 Implementációs sorrend

1. CVA dep hozzáadása
2. `@spektra/themes/base.ts` — szemantikus token layer
3. Button CVA refactor (legkisebb, teszt)
4. FeatureCard token-izálás
5. Module komponensek egyesével: Hero → About → Features → Gallery → Contact → Nav → Footer
6. Starter app frissítése + tailwind config
7. Build + lint

---

## 3. Benett Car Kliens (Phase 10b)

### 3.1 Architektúra döntések

| Döntés | Válasz |
|--------|--------|
| **Hol él?** | `D:\Projects\spektra\sp-clients\benettcar\` — külön, nem a platform monorepo-ban |
| **Platform guardrail** | "A platform soha semmilyen formában ne tudhasson a kliensekről" |
| **Dependenák** | `file:` protocol: `"@spektra/types": "file:../../sp-platform/packages/types"` stb. |
| **Platformból mit használ?** | types, data, runtime, templates (contract + DI) |
| **Platformból mit NEM használ?** | components (a CVA refactor után: igenis használja, variánsokkal!), themes (saját dark theme) |
| **Dev workflow** | 1) build platform, 2) pnpm install kliens, 3) pnpm dev |

### 3.2 Section stratégia (CVA refactor UTÁN)

| Section type | Platform/Egyedi | Megjegyzés |
|--------------|----------------|------------|
| `hero` | **Platform** `HeroBlock` | `colorScheme: 'dark'` variáns |
| `features` | **Platform** `FeaturesBlock` | `colorScheme: 'dark'` — a "services" szekció features type-ként fut |
| `about` | **Platform** `AboutBlock` | `colorScheme: 'dark'` variáns |
| `gallery` | **Platform** `GalleryBlock` | `colorScheme: 'dark'` variáns |
| `contact` | **Platform** `ContactBlock` | `colorScheme: 'dark'` variáns |
| `bc-brand` | **Egyedi** | Benettcar-specifikus VW/Audi brand logók — nincs platform megfelelő |
| `bc-service` | **Egyedi** | Car service részletek, supported brands lista |
| `bc-assistance` | **Egyedi** | Útmenti segítség, emergency phone |
| `bc-team` | **Egyedi** | Csapattagok kártyák |
| `bc-map` | **Egyedi** | Google Maps iframe beágyazás |

**Tehát**: 5 platform section (variánsokkal) + 5 egyedi benettcar section.

### 3.3 Fájlstruktúra

```
D:\Projects\spektra\sp-clients\benettcar\
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── registry.ts
    │
    ├── data/
    │   └── site.ts                          # mock SiteData (legacy loadSiteData-ból)
    │
    ├── shell/
    │   ├── Header.tsx                       # AppHeader — DI shell, SiteData → NavigationBar props
    │   └── Footer.tsx                       # AppFooter — DI shell, SiteData → FooterBlock props
    │
    ├── theme/
    │   └── bc-theme.ts                      # Benettcar Tailwind preset (graphite, neon-blue, red-accent)
    │
    ├── assets/                              # Logók, képek
    │
    └── sections/                            # Csak az 5 egyedi bc-* section
        ├── bc-brand/
        │   ├── bc-brand.tsx
        │   ├── bc-brand.types.ts
        │   └── index.ts
        ├── bc-service/
        │   ├── bc-service.tsx
        │   ├── bc-service.types.ts
        │   └── index.ts
        ├── bc-assistance/
        │   ├── bc-assistance.tsx
        │   ├── bc-assistance.types.ts
        │   └── index.ts
        ├── bc-team/
        │   ├── bc-team.tsx
        │   ├── bc-team.types.ts
        │   └── index.ts
        └── bc-map/
            ├── bc-map.tsx
            ├── bc-map.types.ts
            └── index.ts
```

**Fájl elnevezési konvenció**: kebab-case (pl. `bc-hero.tsx`, `bc-hero.types.ts`), mert:
- Tab-okon egyértelmű: `bc-hero.tsx` vs `bc-about.tsx`
- Az `index.ts` a definition + barrel export

### 3.4 Benettcar téma

```ts
// src/theme/bc-theme.ts
import type { Config } from 'tailwindcss'
import { basePreset } from '@spektra/themes'

const bcColors = {
  // Szemantikus tokenek (a platform komponensek ezeket használják)
  background: '#0f0f14',         // graphite-950
  foreground: '#ffffff',
  muted: '#1a1a24',              // graphite-900
  'muted-foreground': '#adaeb3', // graphite-300
  surface: '#40404f',            // graphite-800
  border: '#4a4a5e',             // graphite-700
  accent: '#00D4E0',             // neon-blue DEFAULT
  'accent-foreground': '#0f0f14', // graphite-950

  // Szín skálák
  primary: {
    50: '#e0f7fa', 100: '#b2ebf2', 200: '#80deea',
    300: '#4dd0e1', 400: '#26c6da', 500: '#00D4E0',
    600: '#00ACC1', 700: '#00A8B8', 800: '#00838F',
    900: '#006064', 950: '#004D40',
  },
  secondary: {
    DEFAULT: '#8B1C1C',
    light: '#A52A2A',
    dark: '#6B0F0F',
  },
  // Utility skálák
  graphite: {
    50: '#f5f5f6', 100: '#e6e6e7', 200: '#cfcfd2',
    300: '#adaeb3', 400: '#84858c', 500: '#696a72',
    600: '#59596f', 700: '#4a4a5e', 800: '#40404f',
    900: '#1a1a24', 950: '#0f0f14',
  },
  'neon-blue': {
    DEFAULT: '#00D4E0',
    light: '#00E5FF',
    dark: '#00A8B8',
  },
  'red-accent': {
    DEFAULT: '#8B1C1C',
    light: '#A52A2A',
    dark: '#6B0F0F',
  },
}

const bcTypography = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Lexend', 'system-ui', 'sans-serif'],
}

export const bcPreset = {
  presets: [basePreset],
  theme: {
    extend: {
      colors: bcColors,
      fontFamily: bcTypography,
    },
  },
  plugins: [],
} satisfies Partial<Config>
```

### 3.5 Key fájlok tartalma (vázlat)

#### `package.json`
```json
{
  "name": "@benettcar/web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@spektra/types": "file:../../sp-platform/packages/types",
    "@spektra/data": "file:../../sp-platform/packages/data",
    "@spektra/runtime": "file:../../sp-platform/packages/runtime",
    "@spektra/components": "file:../../sp-platform/packages/components",
    "@spektra/sections": "file:../../sp-platform/packages/sections",
    "@spektra/themes": "file:../../sp-platform/packages/themes",
    "@spektra/templates": "file:../../sp-platform/packages/templates",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "lucide-react": "^0.460.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.9.0",
    "vite": "^5.4.0"
  }
}
```

#### `App.tsx` (vázlat)
```tsx
import { createJsonAdapter } from '@spektra/data'
import { SiteDataProvider } from '@spektra/runtime'
import { LandingTemplate } from '@spektra/templates'
import { registry } from './registry'
import { Header } from './shell/Header'
import { Footer } from './shell/Footer'
import { siteData } from './data/site'

const adapter = createJsonAdapter({ data: siteData })

export default function App() {
  return (
    <SiteDataProvider adapter={adapter}>
      <LandingTemplate
        registry={registry}
        header={Header}
        footer={Footer}
        fallback={(type) => (
          <div className="p-8 text-center text-muted-foreground">
            Ismeretlen szekció: {type}
          </div>
        )}
      />
    </SiteDataProvider>
  )
}
```

#### `registry.ts` (vázlat)
```tsx
import { createSectionRegistry, registerSections } from '@spektra/runtime'
import { platformSections } from '@spektra/sections'
// Egyedi bc-* section-ök
import { bcBrandDefinition } from './sections/bc-brand'
import { bcServiceDefinition } from './sections/bc-service'
import { bcAssistanceDefinition } from './sections/bc-assistance'
import { bcTeamDefinition } from './sections/bc-team'
import { bcMapDefinition } from './sections/bc-map'

export const registry = createSectionRegistry()

// Platform section-ök (hero, features, about, gallery, contact)
registerSections(registry, platformSections)

// Benettcar egyedi section-ök
registerSections(registry, [
  bcBrandDefinition,
  bcServiceDefinition,
  bcAssistanceDefinition,
  bcTeamDefinition,
  bcMapDefinition,
])
```

#### `data/site.ts` — section type-ok CMS-kompatibilis formátum
```ts
sections: [
  { id: 'hero',     type: 'hero',     data: { colorScheme: 'dark', title: '...', ... } },
  { id: 'brand',    type: 'bc-brand', data: { ... } },
  { id: 'gallery',  type: 'gallery',  data: { colorScheme: 'dark', ... } },
  { id: 'services', type: 'features', data: { colorScheme: 'dark', ... } },
  { id: 'service',  type: 'bc-service', data: { ... } },
  { id: 'about',    type: 'about',    data: { colorScheme: 'dark', ... } },
  { id: 'team',     type: 'bc-team',  data: { ... } },
  { id: 'assistance', type: 'bc-assistance', data: { ... } },
  { id: 'contact',  type: 'contact',  data: { colorScheme: 'dark', ... } },
  { id: 'map',      type: 'bc-map',   data: { ... } },
]
```

### 3.6 WordPress integráció (jövő)

A WordPress NEM kerül a repóba. A kliens `App.tsx`-ben env alapján választjuk:

```ts
const adapter = import.meta.env.VITE_WP_API_URL
  ? createWordPressAdapter({
      apiBase: import.meta.env.VITE_WP_API_URL,
      endpoint: '/wp-json/benettcar/v1/site',
      mapResponse: (raw) => { /* WP → SiteData konverzió */ },
    })
  : createJsonAdapter({ data: siteData })
```

---

## 4. Legacy referencia — meglévő benettcar section-ök

A `sp-benettcar-consumer` az alábbi 10 section-nel rendelkezik. Mindegyikhez a legacy kód vizuális referenciául szolgál.

### 4.1 Platform section-ökre cserélhető (CVA variánsokkal)

| Legacy type | Platform type | Megjegyzés |
|-------------|--------------|------------|
| `bc-hero` | `hero` | Dark variáns, fullscreen bg image, neon-blue CTA |
| `bc-gallery` | `gallery` | Dark variáns (graphite-950 bg, neon-blue subtitle, white title) |
| `bc-services-overview` | `features` | Dark variáns (graphite-900 bg, neon-blue subtitle, icon kártyák) |
| `bc-about` | `about` | Dark variáns (graphite-900 bg, neon-blue stats, kép jobb oldalt) |
| `bc-contact` | `contact` | Dark variáns (graphite-900/950 bg, neon-blue submit button) |

### 4.2 Egyedi section-ök (nincs platform megfelelő)

| Legacy type | Leírás | Legacy fájl |
|-------------|--------|-------------|
| `bc-brand` | VW/Audi/Škoda/Porsche brand logók → hardcoded, nem prop-driven |
| `bc-service` | Car service részletes bemutató, supported brands lista |
| `bc-assistance` | Útmenti segítség — emergency phone, service area |
| `bc-team` | Csapattagok kártya grid (név, szerep, telefon, email, kép) |
| `bc-map` | Google Maps iframe beágyazás query alapján |

### 4.3 Mock data forrás

A legacy `src/data/loadSiteData.ts` tartalmaz egy teljes mock SiteData-t. Ezt kell `data/site.ts`-be konvertálni a platform `SiteData` típusra.

---

## 5. Implementációs sorrend

### Lépés 1: Platform CVA refactor (Phase 10a)

1. `cva` dep hozzáadása `@spektra/components`-hoz
2. `@spektra/themes/base.ts` — szemantikus token layer (`background`, `foreground`, `muted`, `surface`, `border`, `accent`)
3. Platform komponensek CVA-ra migrálása (Button → FeatureCard → Hero → About → Features → Gallery → Contact → Nav → Footer)
4. Starter app frissítése (tailwind config token import, adatok)
5. Build + lint (8/8 PASS)
6. Commit + push

### Lépés 2: Benettcar kliens scaffold (Phase 10b)

1. `sp-clients/sp-benettcar/` könyvtár létrehozása
2. Config fájlok (package.json, vite.config.ts, tsconfig.json, tailwind.config.ts, postcss.config.js)
3. `src/theme/bc-theme.ts` — benettcar Tailwind preset
4. `src/main.tsx`, `src/App.tsx`, `src/index.css`
5. `src/data/site.ts` — legacy mock data konverzió
6. `src/registry.ts` — platform + bc-* section-ök
7. `src/shell/Header.tsx` + `src/shell/Footer.tsx`

### Lépés 3: Egyedi section-ök (Phase 10b folytatás)

1. `bc-brand` — clean rebuild (legacy vizuális referenciából)
2. `bc-service` — clean rebuild
3. `bc-assistance` — clean rebuild
4. `bc-team` — clean rebuild
5. `bc-map` — clean rebuild

### Lépés 4: Integráció

1. `pnpm install`
2. `pnpm dev`
3. Vizuális ellenőrzés a legacy verzióval összevetve
4. Build ellenőrzés (`pnpm build`)

---

## 6. Technikai stack

| Elem | Verzió |
|------|--------|
| React | 18.3.x |
| Vite | 5.4.x |
| TypeScript | 5.9.x |
| Tailwind CSS | 3.4.x |
| pnpm | 9.15.x |
| Turborepo | 2.8.x |
| ESLint | 9.39.x (flat config) |
| CVA | latest (class-variance-authority) |
| clsx + tailwind-merge | meglévő (`cn()` utility) |

---

## 7. Fontos architekturális szabályok

1. **A platform soha semmilyen formában ne tudhasson a kliensekről** — zero kliens referencia a platform kódban
2. **A kliens fogyasztja a platformot, nem módosítja** — `file:` protocol dependenciák
3. **Section.data belső shape-je platform szinten nem validált** — szándékos, mert section-specifikus lehet
4. **Type erasure határ** — `AnySectionDefinition` a runtime-ban, `SectionDefinition<T>` a regisztrációnál
5. **Runtime validáció** — `validateSiteData()` mindkét adapterben (json + wordpress), fail-fast
6. **Fájl elnevezés**: section mappák és fájlok kebab-case (`bc-hero/bc-hero.tsx`), barrel `index.ts`

---

## 8. Meglévő platform export surface

### @spektra/types
`CallToAction`, `PlatformSectionType`, `SectionType<>`, `SectionMeta`, `Section<T>`, `isPlatformSectionType()`, `Media`, `MediaVariant`, `MediaSource`, `Navigation`, `NavItem`, `Page`, `PageMeta`, `SiteData`, `SiteMeta`, `SiteDataAdapter`, `ThemeConfig`, `ThemeColors`, `ThemeFonts`

### @spektra/data
`createJsonAdapter`, `JsonAdapterConfig`, `createWordPressAdapter`, `WordPressAdapterConfig`, `validateSiteData`, `SiteDataValidationResult`

### @spektra/runtime
`SiteDataProvider`, `SiteDataProviderProps`, `useSiteData`, `createSectionRegistry`, `SectionRegistry`, `registerSections`, `SectionRenderer`, `SectionRendererProps`, `SectionDefinition<T>`, `AnySectionDefinition`

### @spektra/components
Basics: `Button`, `Card`, `Input`, `Textarea`
Elements: `FeatureCard`, `ContactFormField`, `Logo`
Modules: `HeroBlock`, `FeaturesBlock`, `AboutBlock`, `ContactBlock`, `GalleryBlock`, `FooterBlock`, `NavigationBar`
Wrappers: `Container`, `Section`
Utility: `cn`

### @spektra/sections
`heroDefinition`, `featuresDefinition`, `aboutDefinition`, `contactDefinition`, `galleryDefinition`, `platformSections`

### @spektra/themes
`basePreset`, `baseColors`, `baseTypography`, `corporatePreset`, `starterPreset`

### @spektra/templates
`LandingTemplate`, `LandingTemplateProps`, `TemplateShellProps`

---

## 9. Nem megoldott / későbbi feladatok

- [ ] `@spektra/themes` — dark mode preset (a CVA refactorban az alap szemantikus tokenek bekerülnek, de teljes dark preset később)
- [ ] npm publish pipeline (changesets)
- [ ] `packages/config/` — eslint + ts config csomag (deferred)
- [ ] FAQ + CTA section komponensek a platformon
- [ ] check-boundaries script (deferred)
- [ ] Bootstrap-log frissítés (Update 3.5: type erasure, Update 3.6: runtime validation, Update 3.7: validation gaps fix — ezek NEM dokumentáltak a bootstrap-log-ban)
