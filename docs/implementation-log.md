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
| 14 | dfb5cd2 | feat: hero visual alignment with legacy PremiumHero (#17) | #17 hero visual |

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