# Benettcar – Implementation Log

**Remote:** https://github.com/Csharlie/sp-client-benettcar

---

## Commit napló

| # | Hash | Üzenet | Lépés |
|---|------|--------|-------|
| 1 | 48edab5 | chore: scaffold benettcar client structure | #1 Scaffold |

---

## 1. Scaffold: könyvtárstruktúra létrehozása

**Dátum:** 2025-03-25
**Commit:** #1 – `48edab5`

**Cél:** A kliens projekt könyvtárstruktúrájának létrehozása a `clients/benettcar/` alatt, a platform monorepo-tól teljesen függetlenül.

**Döntések:**
- A kliens a `d:\Projects\spektra\clients\benettcar\` útvonalon él, a platform (`d:\Projects\spektra\platform\`) mellett, de attól teljesen elválasztva.
- A platform kód semmilyen szinten nem hivatkozik a kliensre — zero coupling.
- Minden section `bc-*` prefixű, egyedi definition — platform sectionök NEM kerülnek a registry-be.
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

**Cél:** A kliens projekt dependency-jeinek definiálása úgy, hogy a platform csomagokra `file:` protokollal hivatkozunk — a platform monorepo-t NEM módosítjuk.

**Döntések:**
- `file:../../platform/packages/*` — a 7 `@spektra/*` csomag relatív útvonallal, nem `workspace:*` (az a monorepo belső protokollja, a kliens kívül van).
- `lucide-react` — a `bc-services` section ikonjai miatt kell (Wrench, DollarSign, AlertCircle).
- `typescript` explicit devDep — nincs monorepo hoist, a kliens önálló projekt, saját `node_modules`.
- Starter app mintáját követi: React 18, Vite 5, Tailwind 3.4, autoprefixer, postcss.
- Scripts: `dev`, `build` (tsc -b + vite build), `preview`, `lint`.

**Fájl:** `package.json`

**Státusz:** ✅ Kész