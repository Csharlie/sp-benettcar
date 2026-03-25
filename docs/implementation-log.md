# Benettcar – Implementation Log

**Remote:** https://github.com/Csharlie/sp-client-benettcar

---

## Commit napló

| # | Hash | Üzenet | Lépés |
|---|------|--------|-------|
| 1 | 48edab5 | chore: scaffold benettcar client structure | #1 Scaffold |
| 2 | 7f4cb82 | chore: add package.json, tsconfig.json, vite.config.ts (#2-#4) | #2 package.json, #3 tsconfig, #4 vite |
| 3 | 9baf655 | chore: add postcss.config.js (#5) | #5 postcss |

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