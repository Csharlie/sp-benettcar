# Benettcar – Implementation Log

**Remote:** https://github.com/Csharlie/sp-client-benettcar

---

## Commit napló

| # | Hash | Üzenet | Lépés |
|---|------|--------|-------|
| 1 | 48edab5 | chore: scaffold benettcar client structure | #1 Scaffold |
| 2 | 7f4cb82 | chore: add package.json, tsconfig.json, vite.config.ts (#2-#4) | #2 package.json, #3 tsconfig, #4 vite |
| 3 | 9baf655 | chore: add postcss.config.js (#5) | #5 postcss |
| 8 | be28099 | feat: add registry.ts — 10 bc-* section registry (#10) | #10 registry |
| 9 | 3891000 | feat: add data/site.ts — SiteData mock, WP-kompatibilis (#11) | #11 site data |
| 10 | 54efbac | feat: add shell/Header.tsx + Footer.tsx — DI shell (#12) | #12 shell |
| 11 | 8501202 | feat: add App.tsx — adapter + provider + template (#13) | #13 App |
| 12 | 619cec1 | feat: add 10 bc-* sections with data-ui compliance (#14-#15) | #14 sections + #15 audit |
| 13 | add8e3e | fix: switch file: to link: protocol + pnpm overrides (#16) | #16 link protocol |
| 14 | d4a00b1 | feat: hero visual alignment with legacy PremiumHero (#17) | #17 hero visual |
| 15 | f62218b | fix: hero viewport + CTA fix (#18) | #18 hero viewport |
| 16 | ea9ac11 | feat: nav transparent + backdrop-blur (#19) | #19 nav visual |
| 17 | d4f19f1 | feat: brand-bar logo images + grayscale (#20) | #20 brand-bar |
| 18 | 0e6f570 | feat: data-ui content element roles (#21) | #21 data-ui audit |
| 19 | ddbedb5 | feat: subtitle neon-blue pattern (#22) | #22 subtitle styling |
| 20 | aa5b4d6 | feat: car-service 2-col grid + schema (#23) | #23 car-service |
| 21 | 737dcd1 | feat: section bg alternation graphite-950/900 (#24) | #24 section bg |
| 22 | 57c117d | feat: assistance CTA card layout (#25) | #25 assistance CTA |
| 23 | 1fced19 | feat: CTA hierarchy accent → neon-blue (#26) | #26 CTA audit |
| 24 | e5f186c | feat: gallery lightbox + team dual layout (#27) | #27 gallery + team |
| 25 | 8d452dc | feat: services card redesign (#28) | #28 services cards |
| 26 | a2a379a | feat: contact section redesign (#29) | #29 contact section |

---

## 1. Scaffold: könyvtárstruktúra létrehozása

**Dátum:** 2025-03-25
**Commit:** #1 – `48edab5`

**Cél:** A kliens projekt könyvtárstruktúrájának létrehozása a `clients/benettcar/` alatt, a platform monorepo-tól teljesen függetlenül.

**Miért:**
- A kliens és a platform teljesen szeparált Git repók — a platform semmilyen szinten nem tud a kliensről.
- Minden section `bc-*` prefixű egyedi definition lesz, a platform sectionök NEM kerülnek a registry-be.
- A struktúra a platform starter app mintáját követi (src/, sections/, shell/, data/, theme/).

**Hogyan:**
- PowerShell `New-Item -ItemType Directory` paranccsal hoztuk létre a teljes fát.
- 10 section könyvtár a meglévő `sp-benettcar-consumer` alapján.

**Döntések:**
- A kliens a `d:\Projects\spektra\clients\benettcar\` útvonalon él, a platform (`d:\Projects\spektra\platform\`) mellett, de attól teljesen elválasztva.
- A platform kód semmilyen szinten nem hivatkozik a kliensre — zero coupling.
- 10 section könyvtár: bc-hero, bc-brand, bc-gallery, bc-services, bc-service, bc-about, bc-team, bc-assistance, bc-contact, bc-map.

**Létrehozott struktúra:**
```
clients/benettcar/
└── src/
    ├── assets/
    ├── data/
    ├── shell/
    ├── theme/
    └── sections/
        ├── bc-hero/
        ├── bc-brand/
        ├── bc-gallery/
        ├── bc-services/
        ├── bc-service/
        ├── bc-about/
        ├── bc-team/
        ├── bc-assistance/
        ├── bc-contact/
        └── bc-map/
```

**Státusz:** ✅ Kész

---

## 2. package.json (file: protokoll)

**Dátum:** 2025-03-25
**Commit:** #2 – `7f4cb82`

**Cél:** A kliens projekt dependency-jeinek definiálása úgy, hogy a platform csomagokra `file:` protokollal hivatkozunk — a platform monorepo-t NEM módosítjuk.

**Miért:**
- A kliens a platform monorepo-n kívül él (`clients/benettcar/`), ezért `workspace:*` nem használható — az csak pnpm workspace-en belül működik.
- `file:` protokollal a kliens közvetlenül a platform csomagjainak forráskódjára mutat fejlesztés alatt, publish nélkül.
- A platform kódban ZERO módosítás történik — a kliens egyoldalúan hivatkozik.

**Hogyan:**
- A starter app `package.json`-ját vettük alapul (scripts, React/Vite/TS/Tailwind verziók).
- A `workspace:*` hivatkozásokat lecseréltük `file:../../platform/packages/*` relatív útvonalakra.
- `lucide-react` hozzáadva a `bc-services` section ikonjai miatt (Wrench, DollarSign, AlertCircle).
- `typescript` explicit devDep — nincs monorepo hoist, a kliens önálló projekt, saját `node_modules`.

**Döntések:**
- 7 `@spektra/*` csomag: types, data, runtime, components, sections, themes, templates.
- Scripts: `dev`, `build` (tsc -b + vite build), `preview`, `lint`.
- `"type": "module"` — ESM mód, összhangban a platformmal.

**Fájl:** `package.json`

**Státusz:** ✅ Kész

---

## 3. tsconfig.json

**Dátum:** 2025-03-25
**Commit:** #2 – `7f4cb82`

**Cél:** TypeScript compiler konfiguráció a kliens projekthez.

**Miért:**
- A kliens önálló TS projekt, nem örökli a platform `tsconfig.base.json`-ját — saját config kell.
- Strict mode és az összes biztonsági flag kötelező, a platformmal megegyezően.

**Hogyan:**
- 1:1 másolat a platform starter app `tsconfig.json`-jából — ugyanaz a target, module, jsx, strict beállítás.
- Nincs path alias — a `file:` protokollon keresztül a `@spektra/*` importok natívan feloldódnak.
- `include: ["src"]` — csak a kliens forráskódja.

**Döntések:**
- `target: ES2020`, `module: ESNext`, `moduleResolution: bundler` — Vite kompatibilis.
- `jsx: react-jsx` — React 18 JSX transform.
- `strict: true` + `noUnusedLocals` + `noUnusedParameters` + `noUncheckedIndexedAccess` — teljes szigor.
- `skipLibCheck: true` — gyorsabb build, a platform típusait a `file:` linken keresztül kapjuk.

**Fájl:** `tsconfig.json`

**Státusz:** ✅ Kész

---

## 4. vite.config.ts

**Dátum:** 2025-03-25
**Commit:** #2 – `7f4cb82`

**Cél:** Vite dev server és build konfiguráció a kliens projekthez.

**Miért:**
- A kliens önálló Vite projekt — saját config kell, nem a platform monorepo Vite beállításait örökli.
- Külön port (5174), hogy a platform starter (5173) és a kliens párhuzamosan futhasson fejlesztés közben.

**Hogyan:**
- A starter app `vite.config.ts`-jét vettük alapul — minimális config, csak a React plugin.
- `server.port: 5174` hozzáadva a port ütközés elkerülésére.

**Döntések:**
- Nincs alias — a `file:` protokoll és a `moduleResolution: bundler` megoldja az importokat.
- Nincs egyedi build target — a default Vite build (ESM, modern browsers) megfelel.
- Nincs proxy — a mock adatok lokálisak, WP adapter majd később.

**Fájl:** `vite.config.ts`

**Státusz:** ✅ Kész

---

## 5. postcss.config.js

**Dátum:** 2025-03-25
**Commit:** #3 – `9baf655`

**Cél:** PostCSS plugin chain a Tailwind CSS feldolgozáshoz.

**Miért:**
- A Vite a PostCSS-en keresztül dolgozza fel a CSS-t — a `tailwindcss` és `autoprefixer` plugineket itt kell regisztrálni.
- Tailwind nélkül a semantic token utility classok (`bg-background`, `text-foreground`) nem generálódnak.

**Hogyan:**
- 1:1 másolat a starter app `postcss.config.js`-éből — standard Tailwind + autoprefixer setup.
- ESM export (`export default`) a `"type": "module"` összhangban.

**Döntések:**
- Csak 2 plugin: `tailwindcss` (utility generálás) + `autoprefixer` (vendor prefix).
- Nincs egyedi PostCSS plugin — a platform tokenek a Tailwind preseten és CSS custom property-ken keresztül jönnek.

**Fájl:** `postcss.config.js`

**Státusz:** ✅ Kész

---

## 6. bc-theme.ts (basePreset extend)

**Dátum:** 2025-03-25
**Commit:** #4 – `9c29a01`

**Cél:** Benettcar-specifikus Tailwind preset létrehozása, amely a platform `basePreset`-et bővíti a kliens saját színpalettájával.

**Miért:**
- A platform `basePreset` adja a semantic token bridge-et (background, foreground, accent, stb. → CSS custom properties) és az alap tipográfiát.
- A kliens erre építi rá a saját palettát — a graphite, neon-blue, red-accent színek a Benettcar vizuális identitásához kellenek.
- Nem írjuk felül a semantic tokeneket (azok CSS custom property-ken keresztül jönnek az `index.css`-ből), csak kiegészítő utility színeket adunk hozzá.

**Hogyan:**
- A `starterPreset` mintáját követtük: `presets: [basePreset]` → extend colors.
- A meglévő `sp-benettcar-consumer/tailwind.config.js`-ből vettük át a pontos színkódokat:
  - `graphite` 50–950 skála (dark theme alap)
  - `neon-blue` DEFAULT/light/dark (#00D4E0 központi)
  - `red-accent` DEFAULT/light/dark (#8B1C1C központi)
- A `primary` és `secondary` palettákat NEM duplikáljuk — azok a `basePreset`-ből jönnek.

**Döntések:**
- `satisfies Partial<Config>` — típusbiztos Tailwind config, a platform mintáját követve.
- A preset fájl a `src/theme/bc-theme.ts`-ben él, a `tailwind.config.ts` innen importálja.
- Csak kiegészítő színek — a semantic tokenek (bg-background, text-foreground) a `basePreset`-ből jönnek, az értékeket az `index.css` CSS custom property-k adják.

**Fájl:** `src/theme/bc-theme.ts`

**Státusz:** ✅ Kész

---

## 7. tailwind.config.ts (bcPreset + helyes útvonalak)

**Dátum:** 2025-03-25
**Commit:** #5 – `8ad4e82`

**Cél:** Tailwind konfiguráció a Benettcar preset-tel és a platform csomagok content path-jaival.

**Miért:**
- A Tailwind-nek tudnia kell, hol keresse a utility classokat. Ha a platform komponensek (`NavigationBar`, `FooterBlock`, `LandingTemplate` stb.) forráskódját nem látja, nem generálja a szükséges osztályokat.
- A kliens a `clients/benettcar/` alatt van, a platform a `platform/` alatt — a relatív utak `../../platform/packages/...` formátumúak.

**Hogyan:**
- A starter app `tailwind.config.ts` mintáját követtük, de:
  - `starterPreset` → `bcPreset` (a saját theme preset)
  - `../../packages/...` → `../../platform/packages/...` (A kliens a platform mellett van, nem benne.)
- Content paths:
  - `./index.html` + `./src/**/*.{ts,tsx}` — kliens saját fájlok
  - `../../platform/packages/components/src/**/*.{ts,tsx}` — platform UI komponensek
  - `../../platform/packages/templates/src/**/*.{ts,tsx}` — platform template-ek

**Döntések:**
- A `sections` csomag NEM kell a content path-ba, mert minden section `bc-*` prefixű és a kliens `src/sections/` alatt él (azt a `./src/**` már lefedi).
- `satisfies Config` — típusbiztos, a platform mintáját követve.
- A `bcPreset` importja relatív (`./src/theme/bc-theme`) — nem `@spektra/*`, ez kliens kód.

**Fájl:** `tailwind.config.ts`

**Státusz:** ✅ Kész

---

## 8. index.css (semantic token CSS vars + dark)

**Dátum:** 2025-03-25
**Commit:** #6 – `ef71956`

**Cél:** CSS custom property-k definiálása a platform semantic token rendszerhez, a Benettcar dark theme konkrét HSL értékeivel.

**Miért:**
- A platform `basePreset`-ben a semantic tokenek (`bg-background`, `text-foreground`, `text-accent` stb.) CSS custom property-kre mutatnak: `hsl(var(--background) / <alpha-value>)`.
- A konkrét HSL értékeket a kliens `index.css`-ében kell megadni — ez a kliens vizuális identitásának "becsatlakozási pontja" a platformba.
- A Benettcar eleve dark theme → a `:root` IS a dark értékeket kapja (graphite-950 háttér, neon-blue accent).

**Hogyan:**
- A starter app `index.css` struktúráját követtük (`:root` + `[data-color-scheme="dark"]` override).
- A Benettcar hex színeit (#0f0f14, #1a1a24, #40404f, #adaeb3, #00D4E0, #8B1C1C) HSL-re konvertáltuk.
- Token mapping:
  - `--background` → graphite-950 (240 14% 7%)
  - `--foreground` → fehér (0 0% 100%)
  - `--muted` / `--surface` → graphite-900 (240 16% 12%)
  - `--muted-foreground` → graphite-300 (230 4% 69%)
  - `--border` → graphite-800 (240 10% 28%)
  - `--accent` → neon-blue (183 100% 44%)
  - `--accent-foreground` → graphite-950 (sötét szöveg világos accenten)
  - `--destructive` → red-accent (0 65% 33%)

**Döntések:**
- A `:root` és `[data-color-scheme="dark"]` értékei megegyeznek — a Benettcar mindig dark, de a platform `data-color-scheme` szelektort is ki kell szolgálni a komponensek kompatibilitása miatt.
- Nincs light mode override — a Benettcar brand identitás kizárólag dark.
- Nem használunk `@apply` hack-eket vagy direkt color class-okat a CSS-ben — a platform standardot követjük.

**Fájl:** `src/index.css`

**Státusz:** ✅ Kész

---

## 9. index.html + vite-env.d.ts + main.tsx

**Dátum:** 2025-03-25
**Commit:** #7 – `0f8aa00`

**Cél:** Az alkalmazás belépési pontjainak létrehozása — HTML shell, Vite típusdefiníció, React root mount.

**Miért:**
- `index.html` — a Vite dev server és build belépési pontja; itt töltjük be a Google Fonts-ot (Inter + Lexend) `<link>` taggel, mert ez nem blokkolja a renderelést (szemben a CSS `@import`-tal).
- `vite-env.d.ts` — Vite client típusdefiníciók (import.meta.env, asset importok stb.).
- `main.tsx` — React 18 `createRoot` mount, `StrictMode` wrapper, CSS import.

**Hogyan:**
- A starter app `index.html` és `main.tsx` mintáját követtük.
- `index.html` módosítások:
  - `<title>`: "Benett Car Business | Autószerviz Cegléd"
  - `<meta name="description">`: VW Konszern specialist leírás
  - Google Fonts: Inter (300–800) + Lexend (400–700), `display=swap`, `preconnect`
- `main.tsx`: 1:1 a starter mintára — `StrictMode` + `createRoot` + `App` import + `index.css` import.
- `vite-env.d.ts`: standard Vite triple-slash reference.

**Döntések:**
- `lang="hu"` — magyar nyelvű oldal, SEO és a11y szempontból fontos.
- A fontokat NEM az `index.css`-ben töltjük — az kizárólag a semantic token CSS custom property-k helye.
- Nincs favicon egyelőre — az `assets/` mappába kerül később.

**Fájlok:** `index.html`, `src/vite-env.d.ts`, `src/main.tsx`

**Státusz:** ✅ Kész

---

## 10. registry.ts (10 bc-* section)

**Dátum:** 2025-03-25
**Commit:** #8 – `be28099`

**Cél:** Section registry létrehozása a 10 Benettcar-specifikus section definition-nel, platform section-ök NÉLKÜL.

**Miért:**
- A platform `SectionRegistry` az a mechanizmus, ami a CMS-ből érkező `Section.type` stringet (pl. `"bc-hero"`) leképezi a megfelelő React komponensre.
- A Benettcar kliens KIZÁRÓLAG saját `bc-*` prefixű section-öket regisztrál — a platform `platformSections` barrel-t NEM importáljuk. Ez biztosítja a teljes szeparációt.
- A registry-nek a `site.ts` section sorrendjét kell tükröznie vizuális konzisztencia miatt.

**Hogyan:**
- A platform starter app `registry.ts` mintáját követtük: `createSectionRegistry()` + `registerSections()` az `@spektra/runtime`-ból.
- 10 `bc-*` definition import (bc-hero → bc-brand → bc-gallery → bc-services → bc-service → bc-about → bc-team → bc-assistance → bc-contact → bc-map).
- `bcSections: readonly AnySectionDefinition[]` — típustörlési határ, a platform mintája szerint.
- Az importok a `./sections/bc-*` könyvtárakra mutatnak, amelyek a #14–#23 lépésekben jönnek létre. Addig TS error várható — ez szándékos, fokozatosan oldódik.

**Döntések:**
- `platformSections` import NINCS — zero platform section reuse, a Benettcar minden section-je egyedi `bc-*` definition.
- A `bcSections` tömb sorrendje megegyezik a mock `site.ts` section sorrendjével (hero → map), vizuális konzisztencia.
- `registerSections()` convenience function — nem kézi `registry.register()` hívások, a platform idiómát követjük.
- A registry exportált (`export const registry`) — az `App.tsx` fogja importálni és átadni a `LandingTemplate`-nek.

**Fájl:** `src/registry.ts`

**Státusz:** ✅ Kész

---

## 11. data/site.ts (SiteData mock, WP-kompatibilis)

**Dátum:** 2025-03-25
**Commit:** #9 – `3891000`

**Cél:** Teljes SiteData mock objektum létrehozása a `@spektra/types` `SiteData` típusnak megfelelően, az összes Benettcar tartalommal.

**Miért:**
- A `createJsonAdapter({ data: siteData })` ezen az objektumon dolgozik — ez az egyetlen adatforrás, amíg nincs WP adapter.
- A `Section.data` mező **közvetlenül** a section komponens props-jaivá válik (`SectionRenderer` `{...section.data}` spread) — a kulcsoknak pontosan egyezniük kell a komponens props-jaival.
- WP-kompatibilis: a struktúra (`SiteData → pages → sections → data`) megegyezik azzal, amit egy WordPress adapter is produkálna — az adapter cseréje nem igényel adatstruktúra változtatást.

**Hogyan:**
- A platform `SiteData` típust követtük: `site` (SiteMeta) + `navigation` (Navigation) + `pages` (Page[]).
- Egyetlen page (`slug: 'home'`) 10 section-nel, a registry sorrendjében.
- Minden szöveges tartalom a régi `sp-benettcar-consumer`-ből származik.
- Unsplash placeholder képek az eredeti URL-ekkel.

**Döntések:**
- **CTA mezőnevek:** `primaryCTA` / `secondaryCTA` — a platform `CallToAction` típus + a `HeroBlock` props minta szerint (camelCase, nagybetűs rövidítés).
- **Footer navigation:** Flat `NavItem[]` — 6 link csoportosítás nélkül. A csoportosítás a Footer komponens feladata, nem az adaté.
- **Navigation primary:** 5 link (Galéria → Útmenti segítség). A "Kapcsolat" CTA NEM nav item — az a Header komponens DI-jaként jelenik meg.
- **Gallery images:** Kiterjesztett Media-szerű objektumok `category` és `caption` mezőkkel — a bc-gallery saját props típusa fogja ezeket definiálni.
- **About content:** `string[]` tömb (2 bekezdés), nem egyetlen string — a komponens `<p>` tagenként rendereli.
- **About stats:** `{ value: string, label: string }[]` — a legacy mintát követve, `value` lehet szám vagy szó (pl. "Prémium", "Helyi", "10+").
- **Services icon:** String név (`'Wrench'`, `'DollarSign'`, `'AlertCircle'`) — a bc-services komponens a `lucide-react`-ból importálja név alapján.
- **Assistance:** Saját `phone` és `serviceArea` mezők — nem a contactInfo-t használja, mert ez más jellegű section.
- **Map height:** `number` (500) — a komponens px-re fordítja.
- **colorScheme:** Ahol releváns (`'dark' as const`) — a Benettcar mindig dark, de a platform komponensek kezelhetik a `data-color-scheme` attribútumot.

**10 section sorrend:** hero → brand → gallery → services → service → about → team → assistance → contact → map

**Fájl:** `src/data/site.ts`

**Státusz:** ✅ Kész

---

## 12. shell/Header.tsx + shell/Footer.tsx (DI)

**Dátum:** 2025-03-25
**Commit:** #10 – `54efbac`

**Cél:** A LandingTemplate header/footer dependency injection komponenseinek létrehozása.

**Miért:**
- A `LandingTemplate` nem importálhat közvetlenül `@spektra/components`-ből (boundary rule) — a header/footer ComponentType<TemplateShellProps> prop-ként érkezik.
- A shell komponensek a DI bridge: a template `siteData`-t injektál, a shell leképezi a `NavigationBar` / `FooterBlock` props-jaira.
- A kliens dönti el, milyen navigációt, logót, CTA-t és footer struktúrát használ — nem a platform.

**Hogyan:**
- A starter app `shell.tsx` mintáját követtük, de Benettcar-specifikus testreszabással:
- **Header:** `NavigationBar` dark variánssal + "Kapcsolat" CTA gomb (smooth scroll `#contact`-ra). A navigációs linkek a `siteData.navigation.primary`-ból jönnek.
- **Footer:** `FooterBlock` dark colorScheme + a flat `NavItem[]` footer linkeket 3 csoportba szervezzük (Szolgáltatások / Információ / Jogi) — a csoportosítás itt történik, nem az adatban.
- **Barrel:** `shell/index.ts` — `AppHeader` és `AppFooter` exportok az `App.tsx` számára.

**Döntések:**
- `variant="dark"` a Header-en — a Benettcar mindig dark theme, a `transparent` vagy `light` variáns nem releváns.
- A CTA gomb szövege hardcoded "Kapcsolat" — ez nem a `siteData`-ból jön, hanem a kliens design döntése (az 5 nav link mellett külön kiemelés).
- A footer csoportosítás href-alapú filter — egyszerű, de ha a footer linkek változnak a `site.ts`-ben, a filtert is frissíteni kell. Ez tudatos trade-off: a footer struktúra ritkán változik.
- `\u00a9` (©) escape a copyright-ban — encoding-biztos.

**Fájlok:** `src/shell/Header.tsx`, `src/shell/Footer.tsx`, `src/shell/index.ts`

**Státusz:** ✅ Kész

---

## 13. App.tsx (adapter + provider + template)

**Dátum:** 2025-03-25
**Commit:** #11 – `8501202`

**Cél:** Az alkalmazás gyökér komponensének létrehozása — adapter inicializálás, provider wrapper, template renderelés.

**Miért:**
- Az `App.tsx` az alkalmazás összeállítási pontja: adatforrás (adapter) → kontextus (SiteDataProvider) → layout (LandingTemplate) → DI (header/footer/registry).
- A `createJsonAdapter({ data: siteData })` a mock adatokból dolgozik — később ez egyetlen sor cseréjével WordPress adapterre váltható.

**Hogyan:**
- A starter app `App.tsx` mintáját követtük 1:1.
- `createJsonAdapter({ data: siteData })` — modul szinten inicializálva (nem renderenként).
- `SiteDataProvider` wrapper → `LandingTemplate` props: registry, header, footer, fallback, loading.
- Fallback: "Ismeretlen szekció: {type}" — debug segítség fejlesztés közben.
- Loading: "Betöltés…" — bg-background a dark theme-hez.

**Döntések:**
- Az adapter modul szinten él (`const adapter = ...`), nem a komponensben — a `SiteDataProvider` `useEffect`-je referencia-stabilitást vár.
- Nincs `error` prop — az alapértelmezett `role="alert"` + `error.message` megfelel fejlesztés alatt.
- Nincs `pageSlug` — egyetlen page (`home`) van, a template az elsőt veszi automatikusan.

**Fájl:** `src/App.tsx`

**Státusz:** ✅ Kész

---

## 14. 10 bc-* section (40 fájl)

**Dátum:** 2026-03-26
**Commit:** #12 – `619cec1`

**Cél:** Mind a 10 Benettcar section teljes implementációja — schema, component, definition, index barrel — a platform `SectionDefinition<T>` rendszerrel kompatibilisen.

**Miért:**
- A `registry.ts` (#10) már importálja a 10 `bcXxxDefinition`-t — most ezek mögé kerül a tényleges kód.
- Minden section kliensoldali (`bc-*` prefix), a platform ZERO ismerettel bír róluk.
- A `site.ts` (#11) mock adat ↔ schema prop-ok 1:1 leképezése biztosítja a WP-adapter kompatibilitást.

**Hogyan:**
- Batch módszerrel: 10 schema → 10 component → 10 definition → 10 index barrel = 40 fájl.
- Fájlminta szekciónként:
  - `bc-<name>.schema.ts` — `BcXxxData` interface (+ támogató típusok: `BcXxxItem`, stb.)
  - `bc-<name>.component.tsx` — function component (nem React.FC), props = BcXxxData
  - `bc-<name>.definition.ts` — `SectionDefinition<BcXxxData>` export
  - `index.ts` — barrel re-export (type + component + definition)

**10 section:**

| # | Szekció | Schema | Role | Főbb jellemzők |
|---|---------|--------|------|-----------------|
| 1 | bc-hero | BcHeroData | hero | Full-width bg overlay, 2 CTA (ArrowRight), h1 |
| 2 | bc-brand | BcBrandData | brand-bar | Uppercase text badges, flex wrap |
| 3 | bc-gallery | BcGalleryData | gallery | useState filter, 4-col grid, hover caption |
| 4 | bc-services | BcServicesData | service-list | Lucide icon map, 3-col card grid |
| 5 | bc-service | BcServiceData | service-detail | Centered text + brand name badges |
| 6 | bc-about | BcAboutData | about | Split layout (text+image), stats grid, CTA |
| 7 | bc-team | BcTeamData | team | Member cards, Phone/Mail icons, tel/mailto |
| 8 | bc-assistance | BcAssistanceData | cta | Phone CTA, service area info |
| 9 | bc-contact | BcContactData | contact | Form (4 mező) + info sidebar, submitted state |
| 10 | bc-map | BcMapData | map | Google Maps iframe, encodeURIComponent |

**Konvenciók:**
- `BcXxxData` (nem Props) — az adat sémát tükrözi, nem React-specifikus
- Function component (nem React.FC) — egyszerűbb, forward ref kompatibilis
- `cn()` utility `@spektra/components`-ból
- Semantic HTML: `<section>`, `<h2>`, `<figure>/<figcaption>`, `aria-label`
- `lucide-react` ikonok: ArrowRight, Phone, Mail, MapPin, Wrench, DollarSign, AlertCircle

**Státusz:** ✅ Kész

---

## 15. data-ui standard compliance audit

**Dátum:** 2026-03-26
**Commit:** #12 – `619cec1` (közös commit a #14-gyel)

**Cél:** A 10 section data-ui attribútumainak teljes §5.1–§5.4 compliance-re hozása, és a standard bővítése ahol szükséges.

**Miért:**
- A §5.1 kötelezővé teszi: `data-ui-id` + `data-ui-role` + `data-ui-component` minden section root-on.
- A `call`, `email`, `reset` action-ök nem voltak a kanonikus §7 listában, de szemantikailag indokoltak.
- A `data-ui-role` generikus `region` értéke nem fejezi ki az egyes szekciók tényleges funkcióját.
- A bc-contact `<form>` és input mezői nem feleltek meg a §5.3/§5.4 szabályoknak.

**Javítások:**

1. **Section root `data-ui-id`** — mind a 10 section: `section-bc-*` minta
2. **`data-ui-role` specifikus értékek** — §5.7 kanonikus lista felvétele:
   - ARIA landmark: banner, navigation, main, complementary, contentinfo, region
   - Section semantic: hero, brand-bar, gallery, service-list, service-detail, about, team, cta, contact, map
3. **Standard bővítés (§7)** — 3 új kanonikus action: `call`, `email`, `reset`
4. **bc-contact form compliance:**
   - `<form>`: `data-ui-id` + `type="form"` + `action="submit-form"` + `trigger="submit"`
   - Submit button: `action="submit"` → `action="submit-form"`
   - Textarea: `type="input"` → `type="textarea"`
   - Minden input: `data-ui-format` hozzáadva (text/tel/email)

**Frissített fájlok:**
- `platform/docs/data-ui-standard.md` — §5.7 + §7 bővítés
- `spektra-dev/data-ui-standard.md` — §5.6 + §7 bővítés
- 10 section component fájl

**Státusz:** ✅ Kész

---

## 16. link: protokoll + pnpm overrides

**Dátum:** 2026-03-26
**Commit:** #13 – `add8e3e`

**Cél:** A `file:` protokoll lecserélése `link:` protokollra, és `pnpm.overrides` bevezetése a @spektra/* csomagok helyes feloldásához.

**Miért:**
- A `file:` protokoll a csomagot másolja a `node_modules`-ba — ezért a platform forráskód módosításai nem látszanak azonnal a kliens dev szerveren.
- A `link:` protokoll szimlinket hoz létre — a platform forráskódra közvetlenül mutat, hot reload működik.
- A `pnpm.overrides` biztosítja, hogy a @spektra/* csomagok tranzitív dependencia-i (pl. a runtime-nak kell a types) is a lokális linkelt verzióra oldódjanak fel, ne a registry-re.

**Hogyan:**
- `package.json`: minden `file:../../platform/packages/*` → `link:../../platform/packages/*`.
- `pnpm.overrides` blokk hozzáadva: 7 @spektra/* csomag → `link:../../platform/packages/*`.
- `pnpm install` újrafuttatva a szimlink struktúra felépítéséhez.

**Döntések:**
- A `link:` protokoll fejlesztési idejű megoldás — publish után `workspace:*` vagy npm verziószám lesz.
- Az overrides CSAK a kliens `package.json`-jében van — a platform kódbázisban ZERO módosítás.

**Fájl:** `package.json`

**Státusz:** ✅ Kész

---

## 17. Hero vizuális igazítás a legacy PremiumHero-hoz

**Dátum:** 2026-03-26
**Commit:** #14 – `d4a00b1`

**Cél:** A `bc-hero` section vizuális összehangolása a legacy `sp-benettcar-consumer` PremiumHero komponensével: gradient overlay, neon-blue CTA-k, teljes viewport hero.

**Miért:**
- A Phase 1 hero funkcionálisan kész volt (adatkötés, SectionRenderer, data-ui), de vizuálisan nem egyezett a legacy dizájnnal.
- A legacy hero: sötét gradient overlay a háttérkép felett, neon-blue elsődleges CTA, graphite másodlagos CTA, min-h-screen, fejléc alatti padding.

**Hogyan:**
- `min-h-screen` a section root-ra — teljes viewport magasság.
- Gradient overlay: `bg-gradient-to-t from-graphite-950 via-graphite-950/70 to-transparent`.
- Elsődleges CTA: `bg-neon-blue text-graphite-950 hover:bg-neon-blue-light` + ArrowRight ikon.
- Másodlagos CTA: `bg-graphite-700/50 text-white border-graphite-600 hover:bg-graphite-700`.
- `pt-24` a fejléc alatti padding, `pb-20` az alsó.

**Fájl:** `src/sections/bc-hero/bc-hero.component.tsx`

**Státusz:** ✅ Kész

---
---

# Phase 2 — Vizuális igazítás a legacy sp-benettcar-consumer-hez

**Dátum:** 2026-03-27
**Cél:** Az összes section pixel-szintű vizuális összehangolása a legacy `sp-benettcar-consumer` alkalmazással.

**Kiindulás:** Phase 1 lezárva (17 lépés, 14 commit). Minden section funkcionálisan kész, data-ui compliant, WP-adapter-kompatibilis mock adattal. A vizuális megjelenés alapszintű — most a legacy dizájn pontos replikálása következik.

**Módszer:** A legacy fejlesztői konzoljából és forráskódjából kinyert class-ok, spacing-ek, színkódok 1:1 alkalmazása. Minden section összehasonlítása screenshot és DOM audit alapján.

**Érintett fájlok (22 fájl, +838 / -354 sor):**

---

## 18. Hero viewport + CTA javítás

**Dátum:** 2026-03-27
**Commit:** #15 – `f62218b`

**Cél:** A hero section viewport magasságának és CTA gomb elrendezésének finomhangolása a legacy-vel való pontos egyezéshez.

**Miért:**
- A #17 lépésben bevezetett hero vizuális igazítás jó alapot adott, de a fejlesztői screenshot összehasonlítás két eltérést mutatott:
  1. A tartalom túl magasan ült — a legacy-ben a szöveg a viewport alsó harmadában van.
  2. A másodlagos CTA gomb nem volt középre igazítva az elsődlegessel.
- A `-mt-[7.5rem]` negatív margin hack-et a Phase 1 shell hozta be a fejléc kompenzálására — ez a transparent nav-val feleslegessé vált.

**Hogyan:**
- `min-h-screen` megtartva, `pt-24 pb-20` — a tartalom a viewport közepébe-aljára kerül.
- `-mt-[7.5rem]` eltávolítva — nem kell margin hack, a transparent nav a hero fölé rétegződik.
- Másodlagos CTA: `inline-flex items-center justify-center` — pontos középre igazítás az elsődlegessel.

**Fájl:** `src/sections/bc-hero/bc-hero.component.tsx`

**Státusz:** ✅ Kész

---

## 19. Nav: transparent + backdrop-blur

**Dátum:** 2026-03-27
**Commit:** #16 – `ea9ac11`

**Cél:** A navigációs sáv vizuális igazítása: átlátszó háttér, blur effekt, és a mobil toggle + breakpoint a legacy mintára.

**Miért:**
- A platform `NavigationBar` `variant="dark"` opaque hátteret adott — a legacy-ben a nav a hero képre rétegződik, átlátszó háttérrel és blur-rel.
- A platform nav `md` (768px) breakpoint-nál vált hamburger → teljes menüre — a legacy-ben `lg` (1024px) a váltás.
- A mobil hamburger toggle a platform alapértelmezett színeit használta, a Benettcar-ban neon-blue kell.

**Hogyan:**
- `Header.tsx`: `variant="transparent"` + `className="bg-black/60 backdrop-blur-md border-transparent"` — kliens felülírás a platform variánson felül.
- `index.css` CSS override-ok:
  - `.sp-nav-toggle svg`: `color: #00D4E0` — neon-blue hamburger ikon.
  - `@media (min-width: 1024px)`: mobil menü elrejtése, desktop menü megjelenítése — `md` → `lg` breakpoint felülírás.
  - `.sp-nav-menu` háttér: `bg-graphite-950/95 backdrop-blur-md` mobilon.

**Döntések:**
- CSS override a breakpoint-ra, nem platform fork — a platform `NavigationBar` megtartja a `md` breakpoint-ot, a kliens CSS-ből felülírja `lg`-re. Ez biztosítja, hogy a platform kódbázis érintetlen marad.
- A `variant="transparent"` a platform támogatott API-ja — a `className` kiegészítés felülírja a variant alapértelmezett háttérszínét.

**Fájlok:** `src/shell/Header.tsx`, `src/index.css`

**Státusz:** ✅ Kész

---

## 20. Brand-bar: logo képek + grayscale

**Dátum:** 2026-03-27
**Commit:** #17 – `d4f19f1`

**Cél:** A brand-bar section átalakítása szöveges badge-ekről valódi logo képekre, a legacy grayscale + hover effekttel.

**Miért:**
- A Phase 1 brand-bar egyszerű szöveges badge-eket renderelt (`<span>` a márkanévvel) — a legacy-ben valódi logo képek vannak, szürkeskálás alapállapotban, hover-re színesre váltva.
- A logo képek vizuálisan sokkal erősebbek, és a prémium autószerviz identitáshoz illeszkednek.

**Hogyan:**
- **Schema bővítés** (`bc-brand.schema.ts`): `logo?: string`, `alt?: string`, `invert?: boolean` mezők hozzáadva a `BcBrandItem`-hez.
- **Komponens újraírás** (`bc-brand.component.tsx`):
  - `<img>` elemek `grayscale brightness-75` filter-rel alapállapotban.
  - `hover:grayscale-0 hover:brightness-100` transition a színes állapotba.
  - `invert` flag: `style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}` — a fehér logókat (Lamborghini, Bugatti) dark háttéren jeleníti meg.
  - Fallback: ha nincs logo, szöveges badge marad.
- **Logo fájlok** (`src/assets/brands/`): 6 logó a legacy projektből áthozva:
  - `vw-logo.jpg`, `audi-logo.png`, `skoda-logo.png`, `porsche-logo.png`
  - `lamborghini-logo-white.png`, `bugatti-logo-white.png`
- **Mock adat** (`site.ts`): Vite static asset import-ok a logókhoz, `invert: true` a fehér logókra.

**Döntések:**
- Vite asset import (`import vwLogo from '../assets/brands/vw-logo.jpg'`) — build-time hash-elt URL, nem runtime string. Ez biztosítja a helyes hivatkozást prod build-ben is.
- A `mixBlendMode: 'screen'` a fehér logókon eltünteti a fekete hátteret anélkül, hogy PNG átlátszóságra lenne szükség.
- A section háttere: `bg-graphite-900 py-20 border-t border-graphite-800` — megegyezik a legacy-vel.

**Fájlok:** `src/sections/bc-brand/bc-brand.component.tsx`, `src/sections/bc-brand/bc-brand.schema.ts`, `src/data/site.ts`, `src/assets/brands/*` (6 fájl)

**Státusz:** ✅ Kész

---

## 21. data-ui audit: content element roles

**Dátum:** 2026-03-27
**Commit:** #18 – `0e6f570`

**Cél:** Minden non-hero section címeinek és alcímeinek ellátása `data-ui-id` és `data-ui-role` attribútumokkal a platform standard §5.7 szerint.

**Miért:**
- A Phase 1 data-ui audit (#15) a section root és form elemek compliance-ét biztosította, de a belső tartalom-elemek (címek, alcímek, leírások) nem kaptak data-ui jelölést.
- A CMS szerkesztők és automatizált tesztek számára a tartalom-elemek azonosíthatósága is szükséges.

**Hogyan:**
- 9 non-hero section (brand, gallery, services, service, about, team, assistance, contact, map): `data-ui-id` és `data-ui-role` hozzáadva a `<h2>` és subtitle elemekhez.
- Platform standard bővítés (`platform/docs/data-ui-standard.md`): §5.7 „Content element roles" szekció hozzáadva — kanonikus role-ok: `section-title`, `section-subtitle`, `section-description`, `item-title`, `item-description`, `feedback-title`, `feedback-description`, `meta`, `scroll-indicator`, `logo`.

**Döntések:**
- A hero section NEM kapott újabb data-ui-t — a hero struktúra egyedi (gradient overlay, CTA-k), nem illik a standard content element pattern-be.
- A role-ok generikusak — nem tartalmaznak `bc-*` prefixet, mert a platform standard minden kliensre érvényes.

**Fájlok:** 9 section component + `platform/docs/data-ui-standard.md`

**Státusz:** ✅ Kész

---

## 22. Subtitle neon-blue pattern

**Dátum:** 2026-03-27
**Commit:** #19 – `ddbedb5`

**Cél:** Az alcímek egységes vizuális stílusának bevezetése: neon-blue szín, uppercase, wide tracking — a legacy minta szerint.

**Miért:**
- A Phase 1 alcímek `text-muted-foreground` (graphite-300) színt használtak — ez a platform alapértelmezés, de a Benettcar legacy-ben az alcímek neon-blue kiemeltek, uppercase formázásúak.
- A legacy konzisztens vizuális hierarchiát alkalmaz: neon-blue alcím → fehér főcím → gray-400 leírás.

**Hogyan:**
- 7 section (gallery, services, service, about, team, assistance, contact): `text-muted-foreground` → `text-neon-blue`.
- Hozzáadva: `uppercase tracking-[0.2em]` — a legacy karaktertávolság és nagybetűs formázás.

**Döntések:**
- A hero és brand section NEM érintett — a hero-ban nincs klasszikus alcím, a brand-bar-ban a section jelleg más (logo strip).
- A `tracking-[0.2em]` arbitrary value, nem Tailwind preset token — a legacy pontosan ezt az értéket használja.

**Fájlok:** 7 section component

**Státusz:** ✅ Kész

---

## 23. Car-service 2-col grid + schema bővítés

**Dátum:** 2026-03-27
**Commit:** #20 – `aa5b4d6`

**Cél:** A `bc-service` section teljes újraírása: 2 oszlopos elrendezés (szolgáltatáslista + kapcsolatfelvételi panel), a legacy mintára.

**Miért:**
- A Phase 1 `bc-service` centered szöveges layout volt brand badge-ekkel — a legacy-ben ez egy komplex 2 oszlopos grid: bal oldalon a konkrét szolgáltatások listája (VW konszern márkánként csoportosítva), jobb oldalon telefonos/email CTA-k, nyitvatartás, foglalási megjegyzés.
- A schema is bővítésre szorult: a Phase 1 adatmodell nem tartalmazta a szolgáltatás-tételeket és kapcsolatfelvételi adatokat.

**Hogyan:**
- **Schema bővítés** (`bc-service.schema.ts`):
  - `BcServiceItem` interface: `brand`, `services: string[]`, `chipColor?` — márkánkénti szolgáltatáslista.
  - `BcServiceContact` interface: `phone`, `messageCta` (label + href), `bookingNote`, `hours`, `weekendHours` — kapcsolatfelvételi adatok.
  - `BcServiceData` bővítve: `services: BcServiceItem[]`, `contact: BcServiceContact`.
- **Komponens újraírás** (`bc-service.component.tsx`):
  - `lg:grid-cols-2 gap-16` grid layout.
  - Bal oldal: szolgáltatáslista `CheckCircle` ikonokkal, márka chip-ek (`bg-neon-blue/10 text-neon-blue` vagy egyedi `chipColor`).
  - Jobb oldal: kapcsolatfelvételi panel — neon-blue telefonos CTA (`Phone` ikon), graphite üzenet CTA, foglalási megjegyzés (`text-yellow-500` kiemelés), nyitvatartás kártya.
- **Mock adat** (`site.ts`): 3 márka (VW, Audi, Škoda) részletes szolgáltatáslistával és kapcsolatfelvételi adatokkal.

**Döntések:**
- A `chipColor` opcionális — ha nincs megadva, az alapértelmezett neon-blue/10 háttér érvényesül. Ez lehetővé teszi a márkánkénti színezést (pl. Audi ezüst).
- A telefonszám `tel:` link + `data-ui-action="call"` — a standard §7 kanonikus action.
- Az email CTA `mailto:` link — a Phase 1 `data-ui-action="email"` standard-del.

**Fájlok:** `src/sections/bc-service/bc-service.component.tsx`, `src/sections/bc-service/bc-service.schema.ts`, `src/data/site.ts`

**Státusz:** ✅ Kész

---

## 24. Section bg alternation

**Dátum:** 2026-03-27
**Commit:** #21 – `737dcd1`

**Cél:** A section háttérszínek váltakozó mintázatának bevezetése (graphite-950 / graphite-900), a legacy vizuális ritmus szerint.

**Miért:**
- A Phase 1-ben minden section `bg-background` semantic tokent használt — ez egységesen graphite-950, nincs vizuális szeparáció a szekciók között.
- A legacy-ben a szekciók váltakozva használnak graphite-950 és graphite-900 hátteret — ez finom, de fontos vizuális ritmust ad.

**Hogyan:**
- 7 section háttérszínének módosítása a legacy sorrendnek megfelelően:
  - `bg-graphite-950`: gallery, service, assistance, map
  - `bg-graphite-900`: services (overview), about, team, contact

**Döntések:**
- A `bg-background` semantic tokent lecseréltük hardcoded graphite értékekre — ez tudatos trade-off: a Benettcar mindig dark theme, a váltakozó minta fontosabb, mint a token absztrakció.
- A hero és brand section NEM érintett — a hero teljes viewport overlay-t használ, a brand-bar már a #20 lépésben `bg-graphite-900`-ra állt.

**Fájlok:** 7 section component

**Státusz:** ✅ Kész

---

## 25. Assistance CTA card layout

**Dátum:** 2026-03-27
**Commit:** #22 – `57c117d`

**Cél:** Az `bc-assistance` section átírása a legacy CTA kártya mintára: központi elrendezés, kártya háttérrel, telefonos + szöveges CTA.

**Miért:**
- A Phase 1 assistance section egyszerű centered szöveg volt phone CTA-val — a legacy-ben ez egy vizuálisan kiemelt kártya: `bg-graphite-900 border border-graphite-700 p-10 rounded-lg`, centered a section-ön belül.
- A schema is módosításra szorult: a `phone` és `colorScheme` mezők helyett `requestLabel` + `requestHref` kellett a flexibilisebb CTA modellhez.

**Hogyan:**
- **Schema módosítás** (`bc-assistance.schema.ts`): `phone`, `colorScheme` eltávolítva → `requestLabel`, `requestHref` hozzáadva.
- **Komponens újraírás** (`bc-assistance.component.tsx`):
  - `py-16` section padding (kisebb, mint a standard `py-24` — a legacy-ben ez tömörebb).
  - Centered header: alcím + főcím + leírás.
  - CTA kártya: `bg-graphite-900 border border-graphite-700 p-10 rounded-lg max-w-2xl mx-auto`.
  - Elsődleges CTA: neon-blue, `Phone` ikon, `requestHref` (`tel:` link).
  - Másodlagos CTA: graphite, szöveges CTA.
  - `serviceArea` meta szöveg: `text-gray-500 text-sm` — kiszolgálási terület info.
- **Mock adat** (`site.ts`): `requestLabel: "Hívjon most"`, `requestHref: "tel:+36301234567"`.

**Döntések:**
- A `requestHref` lehet `tel:` vagy bármilyen URL — a komponens nem feltételez sémát, a `<a>` tag natívan kezeli.
- A CTA kártya max-w-2xl — a legacy-ben a kártya nem tölti ki a teljes szélességet, centered.

**Fájlok:** `src/sections/bc-assistance/bc-assistance.component.tsx`, `src/sections/bc-assistance/bc-assistance.schema.ts`, `src/data/site.ts`

**Státusz:** ✅ Kész

---

## 26. CTA hierarchy audit: accent → neon-blue

**Dátum:** 2026-03-27
**Commit:** #23 – `1fced19`

**Cél:** Az összes megmaradt `text-accent` / `bg-accent` / `border-accent` semantic token lecserélése a Benettcar-specifikus neon-blue / graphite értékekre.

**Miért:**
- A Phase 1-ben a CTA gombok a platform semantic tokeneket használták (`bg-accent`, `text-accent`, `text-accent-foreground`) — ezek a platform `basePreset` alapértelmezéseire mutatnak.
- A Benettcar brand identity neon-blue-t (#00D4E0) használ elsődleges CTA-hoz, és graphite-700-at másodlagoshoz — a semantic token indirekcióra nincs szükség, mert a kliens mindig dark theme, és a színek rögzítettek.

**Hogyan:**
- 4 section érintett: contact, gallery, services, team.
- Lecserélt tokenek:
  - `bg-accent` → `bg-neon-blue`
  - `text-accent` → `text-neon-blue`
  - `text-accent-foreground` → `text-graphite-950`
  - `hover:bg-accent/90` → `hover:bg-neon-blue-light`
  - `border-accent` → `border-neon-blue`
  - `focus:ring-accent` → `focus:ring-neon-blue`

**Döntések:**
- A semantic tokenek teljes lecserélése hardcoded értékekre tudatos döntés — a Benettcar kliens NEM használ light/dark mode váltást, a neon-blue a fix brand szín. A token absztrakció itt overhead lenne, nem érték.
- A hero, service, assistance, about section-ök már a #17–#25 lépésekben kaptak neon-blue CTA-kat — ez az audit a maradék 4 section-t fedte le.

**Fájlok:** `src/sections/bc-contact/bc-contact.component.tsx`, `src/sections/bc-gallery/bc-gallery.component.tsx`, `src/sections/bc-services/bc-services.component.tsx`, `src/sections/bc-team/bc-team.component.tsx`

**Státusz:** ✅ Kész

---

## 27. Gallery lightbox + Team dual layout

**Dátum:** 2026-03-27
**Commit:** #24 – `e5f186c`

**Cél:** A gallery section lightbox modal hozzáadása és a team section teljes újraírása mobil-first dual layout-ra.

**Miért:**
- **Gallery:** A Phase 1 gallery egyszerű hover caption-t használt — a legacy-ben kattintásra full-screen lightbox nyílik (`fixed inset-0 bg-black/95 z-50`), Escape-re záródik, a képen kívüli kattintás is zár.
- **Team:** A Phase 1 team egyszerű card grid volt — a legacy-ben komplex dual layout van: mobil nézetben a kontakt info az első (név, szerep, CTA gombok, kis avatar), desktop-on nagy avatar + horizontális elrendezés.

**Hogyan:**
- **Gallery lightbox** (`bc-gallery.component.tsx`):
  - `useState<number | null>` a kiválasztott kép indexéhez.
  - Modal: `fixed inset-0 bg-black/95 z-50 flex items-center justify-center`.
  - Close: X gomb (jobb felső) + Escape key (`useEffect` + `keydown` listener) + háttér kattintás.
  - Legacy grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1` — szűk rések, nem `gap-4`.
  - Hover overlay: `opacity-0 group-hover:opacity-100 transition-opacity` + `bg-gradient-to-t from-black/80`.
  - `aspect-square object-cover` — egységes kártya arány.
- **Team dual layout** (`bc-team.component.tsx`):
  - Mobil: contact-first sorrend — név + szerep → neon-blue "Hívás" CTA + graphite "Email" CTA → `w-20 h-20 rounded-full` kis avatar.
  - Desktop (`md:` breakpoint): `w-56 h-56 rounded-full border-2 border-graphite-700` nagy avatar + horizontális info blokk.
  - Grid: `grid md:grid-cols-2 gap-12 max-w-5xl mx-auto` — 2 tag egymás mellett, desktop-on.
  - CTA gombok: Tel = `bg-neon-blue text-graphite-950`, Email = `bg-graphite-700 text-white`.

**Döntések:**
- A lightbox NEM használ portal-t (ReactDOM.createPortal) — egyszerű `fixed` positioning, a section DOM-jában marad. A `z-50` biztosítja a nav fölé rétegződést.
- Escape key cleanup: `useEffect` return-ben `removeEventListener` — memory leak prevention.
- A team mobil layout a CTA-kat az avatar FÖ LÉ helyezi — ez a legacy UX döntés; mobil-on a hívás/email az elsődleges akció, nem a kép.

**Fájlok:** `src/sections/bc-gallery/bc-gallery.component.tsx`, `src/sections/bc-team/bc-team.component.tsx`

**Státusz:** ✅ Kész

---

## 28. Services card redesign

**Dátum:** 2026-03-27
**Commit:** #25 – `8d452dc`

**Cél:** A `bc-services` (overview) section kártyáinak újratervezése: háttér ikon dekoráció, legacy card stílus, hover effekt.

**Miért:**
- A Phase 1 services kártyák centered ikon dobozokkal dolgoztak (`bg-accent/10 rounded-lg p-3`) — a legacy-ben az ikon egy nagy, halványított háttér dekoráció: abszolút pozicionált, bal felső sarokba tolva, `opacity-10`, hover-re `opacity-15`.
- A kártyák stílusa is eltért: a legacy `bg-graphite-850 border-graphite-800 rounded-lg hover:border-neon-blue/30` mintát használ.

**Hogyan:**
- **Ikon dekoráció**: `absolute -top-4 -left-4 w-32 h-32 opacity-10 text-neon-blue group-hover:opacity-15 transition-opacity` — nagy, átlátszó ikon a kártya bal felső sarkában.
- **Kártya stílus**: `bg-graphite-850 border border-graphite-800 rounded-lg p-8 relative overflow-hidden group hover:border-neon-blue/30 transition-colors`.
- **Tartalom**: `relative z-10` — a szöveg az ikon dekoráció fölé rétegződik.
- **Grid**: `grid md:grid-cols-2 lg:grid-cols-3 gap-8` — 3 oszlop desktop-on, 2 tablet-on, 1 mobilon.
- **data-ui**: grid-re `data-ui-id="services-grid"`, kártyákra `data-ui-id="service-card-{i}"` + `data-ui-role="card"`.

**Döntések:**
- `overflow-hidden` a kártyán — az abszolút pozicionált nagy ikon ne lógjon ki a kártyából.
- `relative z-10` a tartalomra — biztosítja, hogy a szöveg mindig az ikon dekoráció felett legyen, a click/hover is a tartalomra reagáljon.
- `graphite-850` nincs a Tailwind preset-ben — `bg-[#1f1f2e]` arbitrary value, a legacy pontos értéke.

**Fájl:** `src/sections/bc-services/bc-services.component.tsx`

**Státusz:** ✅ Kész

---

## 29. Contact section redesign

**Dátum:** 2026-03-27
**Commit:** #26 – `a2a379a`

**Cél:** A `bc-contact` section teljes újraírása a legacy 1-oszlopos form kártya elrendezésre, contact info grid-del.

**Miért:**
- A Phase 1 contact section 2-oszlopos volt (form + info sidebar) — a legacy-ben ez 1-oszlopos centered layout: `max-w-4xl` form kártya felül, alatta contact info grid `border-t` elválasztóval.
- A form stílus is eltért: a legacy `<label>` elemeket használ, a név+telefon egymás mellett van, és a focus `ring-red-accent`.

**Hogyan:**
- **Form kártya**: `max-w-4xl mx-auto bg-graphite-900 border border-graphite-800 p-4 md:p-10 rounded-lg`.
- **Labels**: explicit `<label>` elemek minden mezőhöz — a11y compliance + vizuális jelölés.
- **Név + Telefon egymás mellett**: `grid md:grid-cols-2 gap-6` — mobilon stackelt, desktop-on egymás mellett.
- **Input stílus**: `bg-graphite-950 border-graphite-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-accent focus:border-red-accent`.
- **Submit gomb**: `bg-neon-blue text-graphite-950 hover:bg-neon-blue-light` — a legacy CTA hierarchy.
- **Contact info grid**: a form kártya ALATT, `border-t border-graphite-800` elválasztóval, `grid md:grid-cols-3 text-center gap-8 pt-12` layout — 3 oszlop: telefon, email, cím. Mindegyik `text-neon-blue` ikonnal és `text-gray-400` szöveggel.

**Döntések:**
- 1-oszlopos layout (nem 2-oszlopos) — a legacy-t követjük, a kontakt info a form ALATTI szekció, nem mellette.
- `focus:ring-red-accent` — a vörös fokusz gyűrű a Benettcar brand szín, a legacy pontos stílusa. A neon-blue nem használatos inputokon, csak CTA-kon.
- A `<form>` onSubmit továbbra is `e.preventDefault()` + `setSubmitted(true)` — mock viselkedés, WP adapter majd post-olni fog.
- `md:p-10` padding a form kártyán — mobilon `p-4` a kisebb kijelzőhöz.

**Fájl:** `src/sections/bc-contact/bc-contact.component.tsx`

**Státusz:** ✅ Kész

---

## Phase 2 összefoglaló

**12 commit** (f62218b → a2a379a), **22 fájl érintett**, **+838 / -354 sor**.

### Vizuális igazítás checklist:

| # | Elem | Lépés | Státusz |
|---|------|-------|---------|
| 1 | Hero viewport + CTA | #18 | ✅ |
| 2 | Nav transparent + blur | #19 | ✅ |
| 3 | Brand-bar logo képek | #20 | ✅ |
| 4 | data-ui content roles | #21 | ✅ |
| 5 | Subtitle neon-blue | #22 | ✅ |
| 6 | Car-service 2-col | #23 | ✅ |
| 7 | Section bg alternation | #24 | ✅ |
| 8 | Assistance CTA card | #25 | ✅ |
| 9 | CTA hierarchy audit | #26 | ✅ |
| 10 | Gallery lightbox + Team | #27 | ✅ |
| 11 | Services card redesign | #28 | ✅ |
| 12 | Contact section redesign | #29 | ✅ |

### Keresztmetszeti változások:

- **Semantic token → hardcoded**: `bg-accent/text-accent` → `bg-neon-blue/text-neon-blue` minden section-ben — a Benettcar kliens fix dark theme, a token indirrekcióra nincs szükség.
- **Platform standard bővítés**: `data-ui-standard.md` §5.7 content element roles — generikus, NEM kliens-specifikus.
- **Schema bővítések**: brand (logo/alt/invert), service (services[]/contact{}), assistance (requestLabel/requestHref).
- **CSS override stratégia**: a platform komponensek (NavigationBar) viselkedését CSS-ből írjuk felül, nem platform forkkal — zero platform módosítás.