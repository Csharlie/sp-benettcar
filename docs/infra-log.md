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
| `sections` | 10 db bc-* slug (hero, brand, services, why-us, fleet, reviews, faq, blog, contact, footer) |

**Miért:**
- v4 roadmap P3.1: CORS origins, site defaults, plugin config
- Port 5174 — sp-benettcar/vite.config.ts explicit port override
- Return-array pattern — a plugin `$config = require config.php` -val olvassa

**Kapcsolódó sp-infra commit:**
- `36626be` — plugin loader átírva: `require_once` → `require` + `SPEKTRA_CLIENT_CONFIG` constant
