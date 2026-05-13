# BenettCar — Ügyfél Feedback Tracker (P14.2)

> **Státusz:** ✅ Lezárva — P14.3 Content & Media Freeze triggerelhető  
> **Fázis:** P14.2 — Frontend Feedback Implementation  
> **Lezárva:** 2026-05-12  
> **Forrás:** Ügyfél visszajelzés, kézbesítve P14.2 indításakor  
> **Módosítás szabálya:** Minden item = külön prompt az agentnek. Agent commitol, kihúzza.

---

## Függőben lévő módosítások

| # | Szekció | Leírás | Típus | Státusz | Commit |
|---|---------|--------|-------|---------|--------|
| 25 | `site.ts` bc-team | Kovács Péter + Nagy Benett placeholder | Csak László Béla (Értékesítés és ügyfélkapcsolat), kép eltávolítva | pending |
| 26 | `site.ts` phone | `+36 30 123 4567` placeholder | `+36 20 240 1601` (László Béla) — bc-service, bc-team, bc-contact, bc-assistance mind | pending |
| 27 | `site.ts` address | `Cegléd, Magyarország` placeholder | `Cegléd, Kőrösi út 01144/14, 2700` | pending |
| 28 | `bc-map` zoom | Nincs zoom paraméter (Maps default) | `zoom: 13` — városnegyed szintű nézet; `zoom?: number` schema mező + komponens URL param | pending |
| 29 | `bc-team` layout | `grid md:grid-cols-2` — egy tagnál balra igazított | `flex justify-center` + `items-center` — centrált, profil kép közepénél igazított szöveg | pending |
| 30 | `bc-contact` | contact-info-grid blokk a form alatt | Eltávolítva — telefon/email/cím csak a footerben és a team szekcióban | pending |
| 31 | `Header.tsx` logo | Szöveges logo (`Benett Car`) | `bc-logo-128.png` természetes méretben; kattintásra smooth scroll az oldal tetejére | pending |
| 32 | `Footer.tsx` brand col | Site name szöveg, nincs logo | `Benett Car Business Kft.` cím + `bc-logo-128.png` középre igazítva + description + Facebook | pending |
| 33 | `Footer.tsx` Facebook | Brand col alján | Kapcsolat col aljára áthelyezve | pending |
| 34 | `vite.config.ts` | Nincs resolve alias, platform dist-ből tölt | `@spektra/components`, `layouts`, `types` → platform forrás TS — build nélküli hot reload | pending |
| 35 | `NavigationBar.tsx` | `h-8` hardcoded logo méret; azonnali mobil menü megjelenés | `logoClassName` prop (default: `h-8`); mobil menü `max-height` CSS slide animáció (300ms) | pending |
| 36 | `Footer.tsx` credit link | `href="#"` placeholder | `https://pspro.hu/` + `target="_blank"` + `rel="noopener noreferrer"` | pending |
| 37 | `bc-gallery` | Minden kép egyszerre látható, lightbox csak bezárható | Lapozó (`perPage?: number`, default 8); lightbox ← → navigáció + számlálő + billentyű (←→ Esc) | pending |

---

## Lezárt módosítások

| # | Szekció | Volt | Lett | Commit |
|---|---------|------|------|--------|
| 1 | `site.description` | "Autószerviz, felvásárlás és útmenti segítség Cegléden." | "Autókereskedés és útmenti segítség Cegléden." | — |
| 2 | `nav.primary` | Galéria / Szolgáltatások / **Szerviz** / Rólunk / Útmenti segítség | Galéria / Szolgáltatások / Rólunk / Útmenti segítség | — |
| 3 | `nav.footer` | **Autószerviz** / Útmenti segítség / Rólunk / Kapcsolat / … | Útmenti segítség / Rólunk / Kapcsolat / … | — |
| 4 | `meta.title` | "Benett Car Business \| Autószerviz Cegléd" | "Benett Car Business \| Autókereskedés Cegléd" | — |
| 5 | `meta.description` | "…Autószerviz, felvásárlás…VW Konszern és Audi szakszerviz." | "…Autókereskedés és útmenti segítség…Prémium VW Konszern és Audi járművek." | — |
| 6 | `bc-hero` subtitle | "VW Konszern és Audi járművekre specializált **műhely**" | "Volkswagen Konszern és Audi járművek **szakértői**" | — |
| 7 | `bc-hero` primaryCTA | "Szerviz egyeztetés" → `#car-service` | "Autók megtekintése" → `#gallery` | — |
| 8 | `bc-brand` title | "…járművek **karbantartása és javítása**" | "…**prémium járművek**" | — |
| 9 | `bc-gallery` képek | kategóriák: Karbantartás / Diagnosztika / Szerviz / Javítás | kategóriák: Értékesítés / Ellenőrzés / Autópark / Telephely | — |
| 10 | `bc-services` | 3 card: Autószerviz + Értékesítés + Útmenti segítség | 2 card: Értékesítés + Útmenti segítség (Autószerviz card eltávolítva) | — |
| 11 | `bc-service` blokk | Részletes szerviz oldal: 5 szolgáltatás + márkalista + időpontfoglalás | **Teljes blokk eltávolítva** | — |
| 12 | `bc-about` title | "Kiszámítható szakértelem, valódi **műhely**" | "Kiszámítható szakértelem, megbízható **partner**" | — |
| 13 | `bc-about` content | "…helyi **autószerviz**…nem általános **szerelők**…" | "…helyi **kereskedés**…nem általános hozzáállás…" | — |
| 14 | `bc-about` stat | "Helyi **Műhely**" | "Helyi **Kereskedés**" | — |
| 15 | `bc-team` Kovács Péter role | "**Diagnosztikai** Szakértő" | "**Értékesítési** Szakértő" | — |
| 16 | `bc-assistance` description | "…meglévő **szervizügyfeleink** számára…" | "…**ügyfeleink** számára…" | — |
| 17 | `bc-contact` title | "**Időpont vagy árajánlat** kérése" | "**Érdeklődés vagy ajánlatkérés**" | — |
| 18 | `Footer.tsx` | `FooterBlock`-alapú, `#car-service` dead filter, fix copyright | 4 oszlopos custom footer: Szolgáltatások (×4, → `#services`), Információ (Rólunk/Galéria/Kapcsolat), Kapcsolat (tel/email/cím), jogi linkek + Facebook + PSPro bottom barban | — |
| 19 | `bc-service` schema + komponens | Hardkódolt: "Miért a Benett Car?", "Támogatott márkák", opening hours template | `serviceListTitle`, `brandsTitle`, `hoursNote` — mind szerkeszthetők `site.ts`-ből | — |
| 20 | `site.ts` meta title | "Benett Car Business \| Autókereskedés Cegléd" | "Benett Car Business Kft. \| Autókereskedés, állapotfelmérés, autóbérlés – Cegléd" | — |
| 21 | `site.ts` meta description | "…Prémium VW Konszern és Audi járművek." | "…Volkswagen-konszern modellek szakértői háttérrel." | — |
| 22 | `site.ts` site.description | "Autókereskedés és útmenti segítség Cegléden." | "Volkswagen-konszern modellek szakértői háttérrel Cegléden." | — |
| 23 | `bc-assistance` requestHref | `#contact` (form scroll) | `tel:+36301234567` (közvetlen hívás) | — |
| 24 | `navigation.footer` | `#roadside` + about + contact + privacy + terms | about + **gallery** + contact + privacy + terms (`#roadside` kivéve, `#gallery` hozzáadva) | — |

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
