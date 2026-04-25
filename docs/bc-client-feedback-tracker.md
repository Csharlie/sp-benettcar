# BenettCar — Ügyfél Feedback Tracker (P14.2)

> **Státusz:** 🟡 Nyitott — feedback lista feltöltése folyamatban  
> **Fázis:** P14.2 — Frontend Feedback Implementation  
> **Freeze trigger:** Minden sor ✅ → P14.3 tartalomzár  
> **Forrás:** Ügyfél visszajelzés, kézbesítve P14.2 indításakor  
> **Módosítás szabálya:** Minden item = külön prompt az agentnek. Agent commitol, kihúzza.

---

## Függőben lévő módosítások

| # | Szekció | Leírás | Típus | Státusz | Commit |
|---|---------|--------|-------|---------|--------|
| — | — | *Feedback lista feltöltésre vár* | — | ⬜ Várakozás | — |

---

## Lezárt módosítások

| # | Szekció | Leírás | Commit |
|---|---------|--------|--------|
| — | — | — | — |

---

## Szabályok

- **Tartalommódosítás** (szöveg, szín, kép): `site.ts` → reseed P14.4-ben
- **Platformmódosítás** (layout, komponens, stílus): sp-benettcar-ban, sp-platform érintése tilos
- **Új szekciótípus**: P14 scope-on kívül — új fázisba kerül
- **Design döntés szükséges**: leállítja az implementációt, döntés előbb
- Ha egy item befolyásolja a seed-et → P14.4 előtt kell lezárni

---

## Megjegyzések

<!-- Ide kerülnek a P14.2 során keletkező döntések, kérdések, észrevételek -->
