# Benettcar — Infra Overlay Guide

## What is an overlay?

The Spektra WordPress integration uses a **two-layer architecture**:

| Layer | Repo | Contains |
|-------|------|----------|
| **Shared** | `sp-infra` | Plugin core, reusable ACF helpers, Docker base, scripts |
| **Client** | `sp-benettcar/infra/` | Client config, ACF field groups, env, docs |

The shared layer never references a specific client. The client overlay provides everything that is site-specific: field definitions, CORS origins, section list, environment paths.

## Directory structure

```
infra/
├── config.php              Client identity, CORS, site defaults, section list
├── acf/
│   ├── field-groups.php    ACF registry — hooks into acf/init
│   └── sections/           10 bc-* field group definitions
├── env/
│   ├── .env.example        Environment variable template
│   └── .env                Local overrides (gitignored)
└── docs/
    ├── README.md           This file
    └── content-model.md    Canonical field mapping contract (P3.2)
```

## How the overlay connects to the plugin

1. `SPEKTRA_CLIENT_CONFIG` env var points to `infra/config.php`
2. `spektra-api.php` does `$config = require $path` and stores it as the `SPEKTRA_CLIENT_CONFIG` constant
3. The plugin loads `infra/acf/field-groups.php` via symlink into the WP plugins directory
4. ACF field groups register on the `acf/init` hook

## Setup steps (Phase 4)

1. Copy `infra/env/.env.example` to `infra/env/.env` and fill in local paths
2. Run `sp-infra/scripts/setup-env.ps1` to configure WAMP vhost
3. Run `sp-infra/scripts/link-plugin.ps1` to symlink the plugin into WP
4. Run `sp-infra/scripts/link-overlay.ps1` to symlink the client overlay
5. Install ACF Free via WP admin
6. Verify field groups appear under Custom Fields

## Key contracts

- **Field names and types**: defined in `docs/content-model.md` (single source of truth)
- **Section order**: `config.php` `sections[]` array matches `site.ts` rendering order
- **ACF naming**: `{section_slug}_{field_name}` prefix convention (see content-model.md §4)
