# env/

Benettcar client runtime environment configuration.

## Fájlok és prioritás

A kliens gyökerében (`sp-benettcar/`):

| Fájl | Git | Prioritás | Cél |
|------|-----|-----------|-----|
| `.env` | tracked | alacsony | Csapat-szintű default értékek |
| `.env.local` | **gitignored** | **MAGAS — felülírja a `.env`-et** | Lokális developer override |
| `.env.example` (ebben a mappában) | tracked | — | Template, másold át `.env`-re |

> ⚠️ **Gotcha**: Ha `.env`-ben átállítasz egy `VITE_*` változót de a böngészőben nem érvényesül, ellenőrizd az `.env.local`-t — Vite azt magasabb prioritással kezeli. Részletek: [`sp-docs/knowledge/troubleshooting/data-source-env-override.md`](../../../../sp-docs/knowledge/troubleshooting/data-source-env-override.md).

## Setup

```powershell
cp infra/env/.env.example .env
# Töltsd ki SPEKTRA_CLIENT_CONFIG-ot és WAMP_VHOST_DIR-t
```

## Változók

### Vite frontend (`VITE_` prefix kötelező, böngészőben elérhetők)

| Változó | Kötelező | Leírás |
|---------|----------|--------|
| `VITE_DATA_SOURCE` | igen | Adatforrás: `wordpress` (WP REST) vagy `json` (site.ts mock) |
| `VITE_WP_API_BASE` | ha `wordpress` | WordPress site URL (pl. `http://benettcar.local`) |
| `VITE_DEV_ORIGIN` | igen | Vite dev origin, egyeznie kell a `config.php` `allowed_origins`-szel |

### WordPress / seed pipeline (PowerShell / WP-CLI olvassa)

| Változó | Kötelező | Leírás |
|---------|----------|--------|
| `SPEKTRA_CLIENT_CONFIG` | igen | Abszolút útvonal a kliens `infra/config.php`-jához |
| `WAMP_WWW` | Phase 4 | WAMP www root (pl. `C:\wamp64\www`) |
| `WAMP_VHOST_DIR` | Phase 4 | WAMP vhost konfig könyvtár |
| `SPEKTRA_WP_DEBUG` | nem | WordPress debug mode (`true`/`false`) |
| `SPEKTRA_DEBUG` | nem | Spektra plugin debug log (`true`/`false`) |

## Adatforrás váltás (JSON ↔ WordPress)

A `VITE_DATA_SOURCE` dönti el honnan jön a `siteData`:

| Érték | Forrás | Mikor |
|-------|--------|-------|
| `wordpress` | `http://benettcar.local/wp-json/spektra/v1/site` (REST) | P14.4 után — éles WP runtime ellen fejlesztés, parity check |
| `json` | `src/data/site.ts` (mock) | P14.1 alatt — frontend változtatások WP nélkül |

**Váltás menete:**

1. Állítsd át a `VITE_DATA_SOURCE`-ot a megfelelő fájlban (`.env` VAGY `.env.local`)
2. Ellenőrizd hogy a **másik fájl** nem írja-e felül (`.env.local` mindig nyer)
3. **Indítsd újra a Vite dev servert** (`Ctrl+C` → `npm run dev`) — Vite nem mindig veszi fel auto a változást
4. Hard refresh a böngészőben (`Ctrl+Shift+R`)
5. Verifikáció: Network tab → ha `wordpress` mode, látszania kell a `benettcar.local/wp-json/spektra/v1/site` requestnek

## Hogyan kerülnek felhasználásra

- `scripts/setup-env.ps1` olvassa az `.env`-et a lokális WordPress környezet beállításához
- `SPEKTRA_CLIENT_CONFIG` környezeti változóként megy át a WP-nek, hogy a plugin megtalálja a `config.php`-t
- `VITE_DEV_ORIGIN` referenciaérték; a tényleges CORS allowlist a `config.php` `allowed_origins`-ben él
- `import.meta.env.VITE_DATA_SOURCE` a frontend `create-adapter.ts`-ben dönti el a JSON vs WP útat
