# Mappa-struktúra átnevezés — `sp-` prefix konvenció

**Dátum:** 2026-03-27
**Érintett repók:** sp-platform, sp-clients/sp-benettcar, spektra-dev (referencia)

---

## Összefoglaló

A gyökér-szintű mappák átnevezése `sp-` prefixre:

| Régi név | Új név |
|----------|--------|
| `platform/` | `sp-platform/` |
| `clients/` | `sp-clients/` |

## Motiváció

1. **Egységes naming konvenció** — az `sp-` prefix egyértelműen jelöli a Spektra ökoszisztéma mappáit.
2. **Jövőbeli bővíthetőség** — `sp-infra/`, `sp-docs/`, `sp-modules/` azonnal illeszkedik.
3. **WP infra előkészítés** — a rename a WP REST integráció előtt történt, a `sp-infra/` mappa közvetlenül használható lesz.

## Módosított fájlok

### Kódfájlok

| Fájl | Típus | Cserék |
|------|-------|--------|
| `sp-clients/sp-benettcar/package.json` | `link:` paths + overrides | 19 |
| `sp-clients/sp-benettcar/tailwind.config.ts` | content paths | 2 |
| `sp-clients/sp-benettcar/pnpm-lock.yaml` | regenerált | — |
| `sp-platform/pnpm-lock.yaml` | regenerált | — |

### Dokumentáció

| Fájl | Cserék |
|------|--------|
| `sp-clients/sp-benettcar/docs/implementation-log.md` | 12 |
| `sp-platform/docs/bootstrap-platform-log.md` | 3 |
| `sp-clients/sp-benettcar/docs/bc-migration-plan.md` | 6 |
| `spektra-dev/spektra-bootstrap-prompt.md` | 5 |
| `spektra-dev/spektra-architecture-layers.md` | 4 |
| **Összesen** | **30 csere** |

## Végrehajtás lépései

1. **Grep audit** — minden `../../platform/`, `clients/benettcar` hivatkozás felderítése (29+ sor, 5+ fájl)
2. **Kódfájl frissítés** — package.json, tailwind.config.ts path-ok átírása
3. **node_modules törlés** — Windows file lock workaround (robocopy empty-dir trick + rmdir)
4. **platform/ → sp-platform/** — Move-Item, részleges hiba long paths miatt, `git checkout -- packages/` helyreállítás
5. **clients/ → sp-clients/** — manuális átnevezés File Explorer-ből (VS Code lock)
6. **pnpm install** — mindkét repo link-validáció OK (sp-platform: 423 csomag, sp-clients: 134 csomag)
7. **Build validáció** — sp-platform: 8 task PASS, sp-clients/sp-benettcar: 2872 module PASS
8. **Dokumentáció frissítés** — 5 fájlban összesen 30 path-csere
9. **Végső grep ellenőrzés** — 0 régi hivatkozás maradt

## Struktúra (rename után)

```
D:\Projects\spektra\
├── sp-platform/              ← volt: platform/
│   ├── packages/
│   │   ├── core/
│   │   ├── data/
│   │   ├── engine/
│   │   ├── layout/
│   │   ├── registry/
│   │   ├── sections/
│   │   └── ui/
│   ├── docs/
│   ├── turbo.json
│   └── package.json
├── sp-clients/               ← volt: clients/
│   └── benettcar/
│       ├── src/
│       ├── docs/
│       ├── package.json
│       ├── tailwind.config.ts
│       └── vite.config.ts
└── (tervezett)
    ├── sp-infra/
    ├── sp-docs/
    └── sp-modules/
```

## Tanulságok

- **Windows long paths**: a `node_modules` törlése Move-Item előtt kötelező, robocopy empty-dir trick szükséges a mélyen nested csomagokhoz.
- **VS Code file lock**: ha a VS Code nyitva tartja a mappát, a PowerShell Move-Item nem tud átnevezni — File Explorer-ből működik.
- **Lock fájl regenerálás**: `pnpm-lock.yaml` teljes regenerálás (`pnpm install`) biztosabb, mint kézi szerkesztés.
- **Grep végső futtatás**: a rename után kötelező az egész repo grep-audit a maradék hivatkozások kiszűréséhez.
