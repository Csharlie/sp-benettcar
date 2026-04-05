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

## #36 — ACF field groups (2026-04-05) · `507dfab`

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
