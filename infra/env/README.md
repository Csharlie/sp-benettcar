# env/

Benettcar client runtime environment configuration.

## Files

| File | Tracked | Purpose |
|------|---------|--------|
| `.env.example` | yes | Template with all variables and defaults |
| `.env` | **no** (gitignored) | Your local overrides |

## Setup

```powershell
cp .env.example .env
# Edit .env — fill in SPEKTRA_CLIENT_CONFIG and WAMP_VHOST_DIR
```

## Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SPEKTRA_WP_URL` | yes | WordPress local site URL (e.g. `http://benettcar.local`) |
| `SPEKTRA_CLIENT_CONFIG` | yes | Absolute path to `infra/config.php` on your machine |
| `VITE_DEV_ORIGIN` | yes | Vite dev server origin, must match `config.php` `allowed_origins` |
| `WAMP_WWW` | Phase 4 | WAMP www root (e.g. `C:\wamp64\www`) |
| `WAMP_VHOST_DIR` | Phase 4 | WAMP vhost config directory |
| `SPEKTRA_WP_DEBUG` | no | Enable WordPress debug mode (`true`/`false`) |
| `SPEKTRA_DEBUG` | no | Enable Spektra plugin debug logging (`true`/`false`) |

## How it's used

- `scripts/setup-env.ps1` reads `.env` to configure the local WordPress environment
- `SPEKTRA_CLIENT_CONFIG` is passed as an environment variable to WordPress so the plugin can locate `config.php`
- `VITE_DEV_ORIGIN` is a reference value; the actual CORS allowlist lives in `config.php` `allowed_origins`
