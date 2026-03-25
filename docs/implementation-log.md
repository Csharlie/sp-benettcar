# Benettcar – Implementation Log

**Remote:** https://github.com/Csharlie/sp-client-benettcar

---

## Commit napló

| # | Hash | Üzenet | Lépés |
|---|------|--------|-------|
| 1 | 48edab5 | chore: scaffold benettcar client structure | #1 Scaffold |
| 2 | 574522d | chore: add package.json, tsconfig.json, vite.config.ts (#2-#4) | #2 package.json, #3 tsconfig, #4 vite |

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
**Commit:** #2 – `574522d`

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
**Commit:** #2 – `574522d`

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
**Commit:** #2 – `574522d`

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