# Benettcar – Infra Overlay Log

**Remote:** https://github.com/Csharlie/sp-benettcar
**Scope:** `infra/` overlay + v4 WP-integráció előkészítés

> A frontend implementation log: [implementation-log.md](implementation-log.md)

---

## Commit napló

| # | Hash | Üzenet | Lépés |
|---|------|--------|-------|
| 30 | ce61bc9 | chore: scaffold benettcar infra overlay | #32 infra overlay scaffold |
| 31 | f3170f0 | chore: extend .gitignore — .local/ + .env rules | #33 gitignore boundary |
| 32 | 79c7c37 | feat: real config.php — CORS, site defaults, sections | #34 config.php (P3.1) |
| 33 | 4dcf025 | feat: content-model.md + fix section slugs | #35 content model (P3.2) |
| 34 | 507dfab | feat: 10 bc-* ACF field groups + registry | #36 ACF field groups (P3.3) |
| 35 | fa73f8b | feat: .env.example + overlay docs | #37 env template + overlay docs (P3.4) |
| 36 | e4aa10f | config: add curated navigation block | #38 navigation block (P7.2.0) |
| 37 | 48d8596 | feat(P8.1): wp-mapper.ts | #39 WP boundary mapper (P8.1) |
| 38 | fc2d62d | feat(P8.2): normalize-site-data.ts | #40 consumer-safety normalizer (P8.2) |
| 39 | ba52c9f | feat(P8.3): adapter factory + env switch | #41 adapter factory (P8.3) |
| 40 | 2e16b35 | fix(P8H): Media.variants + render-safety | #42 boundary hardening (P8H) |
| 41 | 5bda0ba | fix(P8H2): contact safety + mapper strict + lint | #43 boundary + tooling hardening (P8H2) |
| 42 | 753b172 | P8F: bc-hero render-safety + Vitest boundary tests | #44 Phase 8 close (P8F) |
| 43 | a1f2c97 | fix: CTA renderability + services render-safety | #45 residual consistency patch |
| 44 | d9a9f57 | fix: bc-services/bc-service contract alignment | #46 Codex P2 finding fix |

---

## #32 — Infra overlay scaffold (2026-04-05) · `ce61bc9`

**Commit:** `chore: scaffold benettcar infra overlay`

**Mi jött létre:**
```
infra/
├── config.php       ← Kliens-specifikus WP config placeholder (Phase 3 tölti ki)
├── acf/
│   └── README.md    ← Jövőbeli bc-* ACF field group definíciók helye
├── env/
│   └── README.md    ← Jövőbeli runtime env fájlok helye
└── docs/
    └── README.md    ← Jövőbeli overlay dokumentáció helye
```

**Miért:**
- v4 roadmap P1.3: kliens infra overlay scaffold
- Az overlay a kliens repo része (`sp-benettcar/infra/`), de nem futtatható önmagában
- A runtime-ba symlink-kel kerül be (Phase 4)

**Döntések:**
1. Minimum scaffold — csak struktúra, tartalom Phase 3-ban jön
2. `config.php` placeholder — real CORS + plugin config P3.1-ben
3. `acf/` — bc-* field groups P3.3/P6.2-ben
4. PHP fájlok — a WP plugin PHP-t vár, az overlay is PHP

**Boundary szabályok:**
- `infra/` ≠ runtime → nem indítható, nem WP mappa
- `infra/` = verziózott → git-ben követve
- `infra/` = kliens-specifikus → soha nem kerül sp-infra-ba

---

## #33 — Gitignore boundary rules (2026-04-05) · `f3170f0`

**Commit:** `chore: extend .gitignore — .local/ + .env rules`

**Változás:**
```
.gitignore  ← bővítés: .local/, .env, .env.local, .env.*.local
```

**Miért:**
- v4 roadmap P1.4: .gitignore + boundary rules
- `.local/` = assembled WP runtime helye → SOHA nem commitolható
- `.env` fájlok = lokális environment → nem commitolható

**Kapcsolódó sp-infra commit:**
- `75c7cb7` — sp-infra: .gitignore + BOUNDARY.md létrehozás (azonos P1.4 todo)

---

## #34 — config.php valós tartalom (2026-04-05) · `79c7c37`

**Commit:** `feat: real config.php -- client identity, CORS origins (5174), site defaults, 10 sections (P3.1)`

**Változás:**
```
infra/config.php  ← placeholder → return [] konfiguráció
```

**Config kulcsok:**
| Kulcs | Érték |
|---|---|
| `client_slug` | `'benettcar'` |
| `client_name` | `'Benett Car'` |
| `allowed_origins` | `['http://localhost:5174']` |
| `site_defaults` | `['lang' => 'hu', 'title' => 'Benett Car']` |
| `sections` | 10 db bc-* slug (hero, brand, gallery, services, service, about, team, assistance, contact, map) |

**Miért:**
- v4 roadmap P3.1: CORS origins, site defaults, plugin config
- Port 5174 — sp-benettcar/vite.config.ts explicit port override
- Return-array pattern — a plugin `$config = require config.php` -val olvassa

**Kapcsolódó sp-infra commit:**
- `36626be` — plugin loader átírva: `require_once` → `require` + `SPEKTRA_CLIENT_CONFIG` constant

---

## #35 — Content model mapping contract (2026-04-05) · `4dcf025`

**Commit:** `feat: content-model.md mapping contract + fix config.php section slugs to match site.ts (P3.2)`

**Mi jött létre:**
```
infra/docs/content-model.md  ← canonical mapping contract (320+ sor)
infra/config.php             ← sections[] javítva: site.ts-hez igazítva
```

**Tartalom:**
1. **Global model** — site meta, navigation (WP native menus), pages, home binding
2. **10 section mapping tábla** — TS mező → ACF field name → ACF type → req/opt → normalization → if missing
3. **Policy layer** — skip/omit/fallback szabályok required/optional/repeater/CTA/Media-ra
4. **ACF naming convention** — `{section_slug}_{field_name}` prefix pattern
5. **Type reference** — Media, CallToAction, NavItem

**Section slug javítás:**
```
config.php sections[] RÉGI: bc-why-us, bc-fleet, bc-reviews, bc-faq, bc-blog, bc-footer
config.php sections[] ÚJ:  bc-gallery, bc-service, bc-about, bc-team, bc-assistance, bc-map
```
A 4 helyes slug (bc-hero, bc-brand, bc-services, bc-contact) maradt.

---

## #37 — .env.example + overlay docs (2026-04-05) · `fa73f8b`

**Commit:** `feat: .env.example + overlay docs -- SPEKTRA_ namespace, setup guide (P3.4)`

**Mi jott letre / valtozot:**

1. `infra/env/.env.example` -- uj fajl, 7 valtozo:
   - `SPEKTRA_WP_URL`, `SPEKTRA_CLIENT_CONFIG`, `VITE_DEV_ORIGIN`
   - `WAMP_WWW`, `WAMP_VHOST_DIR` (Phase 4)
   - `SPEKTRA_WP_DEBUG`, `SPEKTRA_DEBUG`
2. `infra/env/README.md` -- placeholder lecserelve: valtozotabla, setup lepes, hasznalati leiras
3. `infra/docs/README.md` -- placeholder lecserelve: overlay guide (mi az overlay, konyvtarstruktura, plugin connection, Phase 4 setup lepesek, key contracts)

**Architekturalis dontes:**
- Minden env valtozo `SPEKTRA_` prefix -- namespace elkeruli a WP konstans utkozest
- `SPEKTRA_CLIENT_CONFIG` ures alapertelmezett -- fejleszto tolti ki local absolute path-ra
- `WP_HOME` / `WP_SITEURL` szandekosan kihagyva (WP nativ konstans utkozes)

### Statusz

✅ Pusholva. Phase 3 kesz.

---

## #46 — Codex P2 finding fix (2026-04-06) · `d9a9f57`

**Commit:** `fix: bc-services/bc-service contract alignment (Codex P2 findings)`

**Típus:** Codex audit finding javítás — normalizer ↔ component contract alignment.

**Mi változott:**

### 1. bc-services contract alignment (`normalize-site-data.ts`)
- Section title kötelező (komponens mindig rendereli heading-ként)
- Service item: **title kötelező** (heading + React key), description-only → drop
- Korábban: description-only item átcsúszott → blank heading + üres/duplikált React key

### 2. bc-service contract alignment (`normalize-site-data.ts`)
- Section title kötelező (mindig renderelt heading)
- description-only / messageCta-only section → drop (title nélkül hollow shell)
- `services[].label` filter: üres label → kiesik (bullet text + React key)
- `brands[]` filter: üres string → kiesik (chip text + React key)

### 3. Tesztek
- 3 teszt korrigálva (description-only / messageCta-only → most drop)
- 3 új teszt: bc-services empty title → drop, empty labels filter, empty brands filter
- 47/47 PASS

**Ellenőrzés:** 47/47 teszt PASS. tsc clean. ESLint clean. vite build OK.

### Státusz

✅ Commitolva.

---

## #45 — Residual consistency patch (2026-04-06) · `a1f2c97`

**Commit:** `fix: CTA renderability (text+href) + bc-services/bc-service render-safety`

**Típus:** Residual consistency patch — NEM phase rewrite, NEM scope expansion.

**Mi változott:**

### 1. CTA renderability hardening (`normalize-site-data.ts`)
- `cleanCta()` immár **mindkét** mezőt megköveteli: non-empty `text` ÉS non-empty `href`
- Korábban: text-only CTA átengedődött, a frontend dead `<a>` linket renderelt belőle
- Hatás: bc-hero, bc-about, bc-service contactInfo — mind az új `cleanCta()` policy-t kapják

### 2. Hero CTA anchor fix (`normalize-site-data.ts`)
- `hasRenderableHero()` CTA ellenőrzés egyszerűsítve: ha a CTA túlélte `cleanCta()`-t, garantáltan valid (text+href)
- Korábban: text-only CTA valid hero anchor volt → hero hollow shell-ként megmaradhatott
- Most: text-only CTA → dropped by cleanCta → hero sem marad meg rajta

### 3. bc-services render-safety (`normalize-site-data.ts`)
- Új helper: `hasRenderableServiceItem()` — title VAGY description kell
- Service itemek filter: icon-only (title+description nélkül) → kiesik
- 0 renderable service item → teljes section drop

### 4. bc-service render-safety (`normalize-site-data.ts`)
- Új helper: `hasRenderableService()` — title VAGY description VAGY valid contact.messageCta kell
- Section drop ha semmi meaningful anchor nincs

### 5. Tesztek
- 11 új teszt case (44/44 összesen):
  - text-only CTA → dropped
  - href-only CTA → dropped
  - hero nem marad meg dead CTA-n
  - bc-services empty items → section drop
  - bc-services empty array → drop
  - bc-services valid item → keep (filter hollows)
  - bc-service empty → drop
  - bc-service title → keep
  - bc-service description → keep
  - bc-service valid messageCta → keep
  - bc-service dead messageCta → drop

**Ellenőrzés:** 44/44 teszt PASS. tsc clean. ESLint clean. vite build OK.

### Státusz

✅ Pusholva.

---

## #44 — Phase 8 close: bc-hero safety + Vitest tests (2026-04-06) · `753b172`

**Commit:** `P8F: bc-hero render-safety + Vitest boundary tests (33/33)`

**Mi változott:**

### 1. bc-hero render-safety (`normalize-site-data.ts`)
- `normalizeBcHero()` most `Section | undefined`-et ad vissza
- Új helper: `hasRenderableHero(data)` — ellenőrzi: `title` VAGY `description` VAGY `primaryCTA.text` VAGY `backgroundImage.src` legyen non-empty
- Teljes section drop, ha egyik sem teljesül
- A #42-es logban jelölt **TODO** ezzel lezárva

### 2. Vitest boundary test suite
- `vitest@^2` telepítve (Vite 5 kompatibilis; v4 Vite 6+-t igényel)
- `package.json` scripts: `"test": "vitest run"`, `"test:watch": "vitest"`

### 3. `wp-mapper.test.ts` — 14 teszt
- **Top-level strictness** (8): null/string/number → throw; missing site/nav/pages → throw; non-array pages → throw; empty pages → throw
- **Media.variants fidelity** (4): canonical variants preserved; invalid items fail-soft skipped; missing → undefined; empty → undefined
- **Section fail-soft** (1): unknown section type silently skipped
- **Happy path** (1): valid payload maps into usable SiteData

### 4. `normalize-site-data.test.ts` — 19 teszt
- **bc-hero** (6): empty drop, whitespace drop, title-only keep, description-only keep, CTA-only keep, backgroundImage-only keep
- **bc-gallery** (2): no valid src → drop; valid src → keep (filters bad images)
- **bc-team** (2): no named member → drop; at least one → keep (filters empty)
- **bc-contact** (4): no contactInfo → drop; all-empty fields → drop; phone → keep; email → keep
- **bc-brand** (2): named but logoless → keep; zero renderable → drop
- **bc-about** (2): empty stats → undefined (section kept); valid stats preserved
- **Full pipeline smoke** (1): raw WP payload → mapper → normalizer → 4 sections intact

**Ellenőrzés:** 33/33 teszt PASS. `tsc --noEmit` clean. ESLint clean. `vite build` OK.

### Státusz

✅ Commitolva. Phase 8 lezárva.

---

## #43 — Boundary + tooling hardening (2026-04-06) · `5bda0ba`

**Commit:** `fix(P8H2): boundary + tooling hardening — contact safety, mapper strictness, lint`

**Mi változott:**

### 1. bc-contact render-safety (`normalize-site-data.ts`)
- `normalizeBcContact()` most `Section | undefined`-et ad vissza
- Új helper: `hasRenderableContactInfo(ci)` — ellenőrzi, hogy van-e legalább egy renderable mező (phone / email / address)
- Hiányzó/null/üres `contactInfo` → teljes section drop
- Cél: a component soha nem kaphat crashelő `contactInfo` nélküli section-t

### 2. Top-level mapper strictness (`wp-mapper.ts`)
- Invalid top-level payload (non-object) → `throw Error` (korábban: `emptySiteData()`)
- Hiányzó `site` / `navigation` / `pages` → explicit throw descriptive üzenettel
- Üres `pages[]` → throw (nem synthesizál fake home page-et)
- `emptySiteData()` helper törölve (dead code)
- Section-level fail-soft **marad** (unknown/malformed itemek skipelődnek)

### 3. Lint tooling
- `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` devDependency telepítve
- `eslint.config.js` — ESLint flat config (Vite + React + TS standard)
- `bc-gallery.component.tsx` — `useCallback` deps fix (React Compiler finding: `setSelectedImage` hozzáadva a dependency array-hoz)
- `npm run lint` immár ténylegesen fut és zöld

**Ellenőrzés:** 16/16 PASS (p8h2-verify.mjs). TS clean. Lint clean. Vite build OK.

### Státusz

✅ Pusholva.

---

## #42 — Boundary hardening (2026-04-06) · `2e16b35`

**Commit:** `fix(P8H): boundary hardening — Media.variants fidelity + section render-safety`

**Mi változott:**

### 1. Media.variants fidelity (`wp-mapper.ts`)
- `MediaVariant`, `MediaSource` importálva `@spektra/types`-ból
- Új helperek: `mapMediaSource()`, `mapMediaVariant()`, `mapMediaVariants()`
- `maybeMedia()` bővítve: a canonical `Media.variants` mezőt most megőrzi
- Invalid variant itemek fail-soft kiesnek, üres/hiányzó variants → `undefined`
- String kivételek változatlanok (bc-brand.logo, bc-gallery.src)

### 2. Section render-safety (`normalize-site-data.ts`)
- `normalizeSection()` visszatérési típusa `Section | undefined` lett
- Új `normalizeSections()` helper: `.map(normalizeSection).filter(isDefined)` → `Section[]`
- `isDefined<T>()` helper hozzáadva
- `normalizePage()` a `normalizeSections()`-t használja

**Section-aware skip szabályok:**
- `bc-gallery`: drop ha 0 valid image src normalizálás után
- `bc-team`: drop ha 0 named member normalizálás után
- `bc-about` stats: empty stats → `undefined` (section maga marad)
- `bc-brand`: drop **csak** ha 0 renderable brand item (logoless de named → marad)
- `bc-hero`: ~~**TODO** — skip rule deferred~~ → **DONE** in #44 (P8F)

**Ellenőrzés:** 25/25 PASS (p8h-verify.mjs). TS clean. Vite build OK.

### Státusz

✅ Pusholva.

---

## #41 — Adapter factory (2026-04-06) · `ba52c9f`

**Commit:** `feat(P8.3): adapter factory + env-based source switch`

**Mi jött létre / változott:**

### 1. `.env` (új, committed)
```
VITE_DATA_SOURCE=json
```
Committed default — csak ez az egy sor. WP config `.env.local`-ba megy (gitignored).

### 2. `.gitignore` módosítás
- `.env` most **tracked** (committed default)
- `.env.local` / `.env.*.local` marad gitignored (overrides)

### 3. `src/data/create-adapter.ts` (új)
- `createAdapter(): SiteDataAdapter` — adapter factory
- `import.meta.env.VITE_DATA_SOURCE` alapján switchel:
  - `'json'` (default) → `createJsonAdapter({ data: siteData })`
  - `'wordpress'` → `createWordPressAdapter({ apiBase, mapResponse })` — pipeline: `normalizeSiteData(mapWordPressSiteData(raw))`
  - ismeretlen érték → `console.warn` + json fallback
- `VITE_DATA_SOURCE=wordpress` + hiányzó `VITE_WP_API_BASE` → `throw Error` (fail-fast)
- Validation: a platform `createWordPressAdapter` belül kezeli (`validateSiteData`)

### 4. `src/App.tsx` módosítás
- Hardcoded `createJsonAdapter({ data: siteData })` lecserélve → `createAdapter()`
- `@spektra/data` és `./data/site` importok eltávolítva az App-ból
- App most deklaratívan tiszta: csak `createAdapter()` + `SiteDataProvider` + `LandingTemplate`

**Ellenőrzés:** TS clean. Vite build OK (json mode).

### Státusz

✅ Pusholva.

---

## #40 — Consumer-safety normalizer (2026-04-06) · `fc2d62d`

**Commit:** `feat(P8.2): normalize-site-data.ts — consumer-safety cleanup pass`

**Mi jött létre:**

1. `src/data/normalize-site-data.ts` — SiteData → SiteData normalizer (285 sor)

**Funkció:**
- Gallery images `src` nélkül → kiszűrve
- Team members `name` nélkül → kiszűrve
- Stats `value`/`label` nélkül → kiszűrve
- Üres CTA-k (text trim után üres) → undefined-ra
- Whitespace-only optional stringek → undefined
- Brand items logo nélkül → **megtartva** (UI-ban name fallback van)
- Navigation items label/href nélkül → kiszűrve
- Per-section normalizer mind a 10 bc-* típusra

**Helperek:** `cleanOptional()`, `cleanCta()`, `isRecord()`, `asTypedArray()`

**Ellenőrzés:** 11/11 PASS (p82-verify.mjs)

### Státusz

✅ Pusholva.

---

## #39 — WP boundary mapper (2026-04-06) · `48d8596`

**Commit:** `feat(P8.1): wp-mapper.ts — WordPress REST → SiteData boundary mapper`

**Mi jött létre:**

1. `src/data/wp-mapper.ts` — raw WP JSON → typed SiteData mapper (475 sor)

**Funkció:**
- `mapWordPressSiteData(raw: unknown): SiteData` — teljes boundary conversion
- 10 explicit section mapper: `mapBcHero`, `mapBcBrand`, `mapBcGallery`, `mapBcServices`, `mapBcService`, `mapBcAbout`, `mapBcTeam`, `mapBcAssistance`, `mapBcContact`, `mapBcMap`
- null → undefined coercion minden optional mezőnél (TS `?:` kompatibilitás)
- String kivételek: bc-brand.logo és bc-gallery.src marad string
- Fail-soft: ismeretlen section-ök kihagyva, malformed data kihagyva, üres input → `emptySiteData()`

**Helperek:** `isRecord()`, `asString()`, `asNumber()`, `asBoolean()`, `asArray()`, `maybeMedia()`, `maybeCta()`, `optionalString()`, `isDefined()`

**Ellenőrzés:** 23/23 PASS (p81-verify.mjs)

### Státusz

✅ Pusholva.

---

## #38 — Navigation block (2026-04-06) · `e4aa10f`

**Commit:** `config: add curated navigation block (P7.2.0)`

**Mi változott:**

- `src/data/site.ts` mock SiteData-ba bekerült a kurált navigation blokk (`primary: NavItem[]`)

**Kontextus:** P7.2 (response builder navigation) előkészítés — a kliens-oldali mock adat frissítése, hogy az infra-oldali nav struktúrával szinkronban legyen.

### Státusz

✅ Pusholva.

---

## #37 — .env.example + overlay docs (2026-04-05) · `fa73f8b`

**Commit:** `feat: 10 bc-* ACF field groups + registry loader -- code-defined schema from content-model contract (P3.3)`

**Mi jott letre:**
```
infra/acf/
├── field-groups.php          ← Registry: acf/init hook, explicit file list
└── sections/
    ├── bc-hero.php            (8 fields: title*, desc*, 2x CTA pair, bg image)
    ├── bc-brand.php           (2 fields + brands repeater: name*, logo, alt, invert)
    ├── bc-gallery.php         (3 fields + images repeater: src*, alt*, category, caption)
    ├── bc-services.php        (2 fields + services repeater: title*, icon*, desc*)
    ├── bc-service.php         (3 fields + services repeater + brands repeater + contact group)
    ├── bc-about.php           (content repeater + image + stats repeater + CTA pair + selects)
    ├── bc-team.php            (3 fields + members repeater: name*, role*, image, phone, email)
    ├── bc-assistance.php      (6 flat fields: title*, subtitle, desc, label, href, area)
    ├── bc-contact.php         (3 fields + contactInfo group: phone, email, address + select)
    └── bc-map.php             (3 fields: title, query*, height)
```

**Pattern:**
- Minden `sections/*.php` `return [...]` array-t ad (deklarativ)
- `field-groups.php` = egyetlen regisztracios hook
- Mezonevek pontosan a `content-model.md` P3.2 contractbol
- `menu_order` 0-9: config.php sections[] sorrenddel megegyezik
- Location: `page_type == front_page` mindenhol
