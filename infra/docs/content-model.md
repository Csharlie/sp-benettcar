# Benettcar — Content Model Mapping

**Verzió:** P3.2 initial  
**Forrás:** `sp-benettcar/src/data/site.ts` + `sp-benettcar/src/sections/bc-*/bc-*.schema.ts`  
**Cél:** WP ACF field groups → REST API → frontend section props

> Ez a dokumentum a **canonical mapping contract**. Minden downstream lépés
> (P3.3 ACF field groups, P7 response builder, P8 wp-mapper.ts) ebből dolgozik.

---

## 1. Global Model

### 1.1. Site Meta

| TS mező | WP source | ACF field name | ACF type | Req | Fallback |
|---------|-----------|----------------|----------|-----|----------|
| `site.name` | Options page | `site_name` | text | ✔ | config.php `site_defaults.title` |
| `site.description` | Options page | `site_description` | textarea | ✔ | `""` |
| `site.url` | `home_url()` | — (WP native) | — | ✔ | WP `home_url()` |
| `site.locale` | `get_locale()` | — (WP native) | — | ✔ | config.php `site_defaults.lang` |

### 1.2. Navigation

| TS mező | WP source | ACF field name | ACF type | Req | Fallback |
|---------|-----------|----------------|----------|-----|----------|
| `navigation.primary` | WP nav menu | — (menu: `spektra-primary`) | — | ✔ | `[]` |
| `navigation.primary[].label` | menu item title | — | — | ✔ | — |
| `navigation.primary[].href` | menu item URL | — | — | ✔ | — |
| `navigation.primary[].external` | menu item target | — | — | ✗ | `false` |
| `navigation.primary[].children` | submenu | — | — | ✗ | `undefined` |
| `navigation.footer` | WP nav menu | — (menu: `spektra-footer`) | — | ✗ | `[]` |

> Navigation: WP natív menük, nem ACF. A plugin `wp_get_nav_menu_items()` -ből építi.

### 1.3. Pages

| TS mező | WP source | ACF field name | ACF type | Req | Fallback |
|---------|-----------|----------------|----------|-----|----------|
| `pages[].slug` | post_name | — (WP native) | — | ✔ | — |
| `pages[].title` | post_title | — (WP native) | — | ✗ | `undefined` |
| `pages[].meta.title` | ACF / Yoast | `page_meta_title` | text | ✗ | `post_title` |
| `pages[].meta.description` | ACF / Yoast | `page_meta_description` | textarea | ✗ | `""` |
| `pages[].meta.ogImage` | ACF | `page_og_image` | image | ✗ | `undefined` |
| `pages[].sections` | ACF field groups | — (assembled) | — | ✔ | `[]` |

### 1.4. Home Page Binding

| Policy | Érték |
|--------|-------|
| WP page | `slug: 'home'` — a WP "front page" (Settings → Reading) |
| Section order | `config.php` `sections[]` tömb sorrendje |
| Section→page binding | Jelenleg 1 page (home), minden section ide tartozik |
| Multi-page | Jövőbeli — a `sections` config page-enként bontható |

---

## 2. Section Mapping Table

### 2.1. bc-hero

**ACF field group:** `bc-hero` · **WP location:** front page  
**Schema:** `BcHeroData`

| TS mező | ACF field name | ACF type | Req | Normalization | If missing |
|---------|----------------|----------|-----|---------------|------------|
| `title` | `bc_hero_title` | text | ✔ | — | **skip section** |
| `subtitle` | `bc_hero_subtitle` | text | ✗ | empty → `undefined` | omit |
| `description` | `bc_hero_description` | textarea | ✔ | — | **skip section** |
| `primaryCTA.text` | `bc_hero_primary_cta_text` | text | ✗† | — | omit CTA |
| `primaryCTA.href` | `bc_hero_primary_cta_href` | text | ✗† | — | **omit CTA** |
| `secondaryCTA.text` | `bc_hero_secondary_cta_text` | text | ✗ | — | omit CTA |
| `secondaryCTA.href` | `bc_hero_secondary_cta_href` | text | ✗ | — | **omit CTA** |
| `backgroundImage` | `bc_hero_background_image` | image | ✗ | ACF image → `Media` | `undefined` |

> † `primaryCTA` optional at section level. CTA requires both `text` and `href` to be non-empty; if either is missing, the entire CTA is dropped by the normalizer.

### 2.2. bc-brand

**ACF field group:** `bc-brand` · **WP location:** front page  
**Schema:** `BcBrandData`

| TS mező | ACF field name | ACF type | Req | Normalization | If missing |
|---------|----------------|----------|-----|---------------|------------|
| `title` | `bc_brand_title` | text | ✗ | empty → `undefined` | omit |
| `description` | `bc_brand_description` | textarea | ✗ | empty → `undefined` | omit |
| `brands` | `bc_brand_brands` | repeater | ✔ | — | **skip section** |
| `brands[].name` | `bc_brand_brands_name` | text | ✔ | — | skip item |
| `brands[].logo` | `bc_brand_brands_logo` | image | ✗ | ACF image → URL string | `undefined` |
| `brands[].alt` | `bc_brand_brands_alt` | text | ✗ | empty → `undefined` | `undefined` |
| `brands[].invert` | `bc_brand_brands_invert` | true_false | ✗ | — | `false` |

### 2.3. bc-gallery

**ACF field group:** `bc-gallery` · **WP location:** front page  
**Schema:** `BcGalleryData`

| TS mező | ACF field name | ACF type | Req | Normalization | If missing |
|---------|----------------|----------|-----|---------------|------------|
| `title` | `bc_gallery_title` | text | ✔ | — | **skip section** |
| `subtitle` | `bc_gallery_subtitle` | text | ✗ | empty → `undefined` | omit |
| `showCategories` | `bc_gallery_show_categories` | true_false | ✗ | — | `false` |
| `images` | `bc_gallery_images` | repeater | ✔ | — | **skip section** |
| `images[].src` | `bc_gallery_images_src` | image | ✔ | ACF image → URL string | skip item |
| `images[].alt` | `bc_gallery_images_alt` | text | ✔ | — | skip item |
| `images[].category` | `bc_gallery_images_category` | text | ✗ | empty → `undefined` | omit |
| `images[].caption` | `bc_gallery_images_caption` | text | ✗ | empty → `undefined` | omit |

### 2.4. bc-services

**ACF field group:** `bc-services` · **WP location:** front page  
**Schema:** `BcServicesData`

| TS mező | ACF field name | ACF type | Req | Normalization | If missing |
|---------|----------------|----------|-----|---------------|------------|
| `title` | `bc_services_title` | text | ✔ | — | **skip section** |
| `subtitle` | `bc_services_subtitle` | text | ✗ | empty → `undefined` | omit |
| `services` | `bc_services_services` | repeater | ✔ | — | **skip section** |
| `services[].title` | `bc_services_services_title` | text | ✔ | — | skip item |
| `services[].icon` | `bc_services_services_icon` | text | ✔ | Lucide icon name | skip item |
| `services[].description` | `bc_services_services_description` | textarea | ✔ | — | skip item |

### 2.5. bc-service

**ACF field group:** `bc-service` · **WP location:** front page  
**Schema:** `BcServiceData`

| TS mező | ACF field name | ACF type | Req | Normalization | If missing |
|---------|----------------|----------|-----|---------------|------------|
| `title` | `bc_service_title` | text | ✔ | — | **skip section** |
| `subtitle` | `bc_service_subtitle` | text | ✗ | empty → `undefined` | omit |
| `description` | `bc_service_description` | textarea | ✔ | — | **skip section** |
| `services` | `bc_service_services` | repeater | ✔ | — | **skip section** |
| `services[].label` | `bc_service_services_label` | text | ✔ | — | skip item |
| `brands` | `bc_service_brands` | repeater | ✔ | → `string[]` | **skip section** |
| `brands[]` | `bc_service_brands_name` | text | ✔ | — | skip item |
| `contact` | `bc_service_contact` | group | ✗ | — | omit |
| `contact.title` | `bc_service_contact_title` | text | ✔‡ | — | omit group |
| `contact.description` | `bc_service_contact_description` | textarea | ✔‡ | — | omit group |
| `contact.phone` | `bc_service_contact_phone` | text | ✗ | — | omit |
| `contact.messageCta.text` | `bc_service_contact_message_cta_text` | text | ✗ | — | omit CTA |
| `contact.messageCta.href` | `bc_service_contact_message_cta_href` | text | ✗ | — | **omit CTA** |
| `contact.bookingNote` | `bc_service_contact_booking_note` | text | ✗ | empty → `undefined` | omit |
| `contact.hours` | `bc_service_contact_hours` | text | ✗ | — | omit |
| `contact.weekendHours` | `bc_service_contact_weekend_hours` | text | ✗ | — | omit |

> ‡ Required within the group — if `contact.title` is empty, the whole `contact` group is omitted.

### 2.6. bc-about

**ACF field group:** `bc-about` · **WP location:** front page  
**Schema:** `BcAboutData`

| TS mező | ACF field name | ACF type | Req | Normalization | If missing |
|---------|----------------|----------|-----|---------------|------------|
| `title` | `bc_about_title` | text | ✔ | — | **skip section** |
| `subtitle` | `bc_about_subtitle` | text | ✗ | empty → `undefined` | omit |
| `content` | `bc_about_content` | repeater | ✔ | → `string[]` | **skip section** |
| `content[]` | `bc_about_content_paragraph` | textarea | ✔ | — | skip item |
| `image` | `bc_about_image` | image | ✗ | ACF image → `Media` | `undefined` |
| `imagePosition` | `bc_about_image_position` | select | ✗ | `'left'` \| `'right'` | `'right'` |
| `stats` | `bc_about_stats` | repeater | ✗ | — | `undefined` |
| `stats[].value` | `bc_about_stats_value` | text | ✔ | — | skip item |
| `stats[].label` | `bc_about_stats_label` | text | ✔ | — | skip item |
| `cta` | — | — | ✗ | CTA group | `undefined` |
| `cta.text` | `bc_about_cta_text` | text | ✗† | — | omit CTA |
| `cta.href` | `bc_about_cta_href` | text | ✗† | — | **omit CTA** |
| `colorScheme` | `bc_about_color_scheme` | select | ✗ | `'light'` \| `'dark'` | `'light'` |

### 2.7. bc-team

**ACF field group:** `bc-team` · **WP location:** front page  
**Schema:** `BcTeamData`

| TS mező | ACF field name | ACF type | Req | Normalization | If missing |
|---------|----------------|----------|-----|---------------|------------|
| `title` | `bc_team_title` | text | ✔ | — | **skip section** |
| `subtitle` | `bc_team_subtitle` | text | ✗ | empty → `undefined` | omit |
| `description` | `bc_team_description` | textarea | ✗ | empty → `undefined` | omit |
| `members` | `bc_team_members` | repeater | ✔ | — | **skip section** |
| `members[].name` | `bc_team_members_name` | text | ✔ | — | skip item |
| `members[].role` | `bc_team_members_role` | text | ✔ | — | skip item |
| `members[].image` | `bc_team_members_image` | image | ✗ | ACF image → `Media` | `undefined` |
| `members[].phone` | `bc_team_members_phone` | text | ✗ | empty → `undefined` | omit |
| `members[].email` | `bc_team_members_email` | text | ✗ | empty → `undefined` | omit |

### 2.8. bc-assistance

**ACF field group:** `bc-assistance` · **WP location:** front page  
**Schema:** `BcAssistanceData`

| TS mező | ACF field name | ACF type | Req | Normalization | If missing |
|---------|----------------|----------|-----|---------------|------------|
| `title` | `bc_assistance_title` | text | ✔ | — | **skip section** |
| `subtitle` | `bc_assistance_subtitle` | text | ✗ | empty → `undefined` | omit |
| `description` | `bc_assistance_description` | textarea | ✗ | empty → `undefined` | omit |
| `requestLabel` | `bc_assistance_request_label` | text | ✗ | — | omit |
| `requestHref` | `bc_assistance_request_href` | text | ✗ | — | `"#"` |
| `serviceArea` | `bc_assistance_service_area` | text | ✗ | — | omit |

### 2.9. bc-contact

**ACF field group:** `bc-contact` · **WP location:** front page  
**Schema:** `BcContactData`

| TS mező | ACF field name | ACF type | Req | Normalization | If missing |
|---------|----------------|----------|-----|---------------|------------|
| `title` | `bc_contact_title` | text | ✔ | — | **skip section** |
| `subtitle` | `bc_contact_subtitle` | text | ✗ | empty → `undefined` | omit |
| `description` | `bc_contact_description` | textarea | ✗ | empty → `undefined` | omit |
| `contactInfo` | `bc_contact_info` | group | ✔ | — | **skip section** |
| `contactInfo.phone` | `bc_contact_info_phone` | text | ✗ | — | omit |
| `contactInfo.email` | `bc_contact_info_email` | text | ✗ | — | omit |
| `contactInfo.address` | `bc_contact_info_address` | textarea | ✗ | — | omit |
| `colorScheme` | `bc_contact_color_scheme` | select | ✗ | `'light'` \| `'dark'` | `'light'` |

### 2.10. bc-map

**ACF field group:** `bc-map` · **WP location:** front page  
**Schema:** `BcMapData`

| TS mező | ACF field name | ACF type | Req | Normalization | If missing |
|---------|----------------|----------|-----|---------------|------------|
| `title` | `bc_map_title` | text | ✗ | empty → `undefined` | omit |
| `query` | `bc_map_query` | text | ✔ | — | **skip section** |
| `height` | `bc_map_height` | number | ✗ | — | `400` |

---

## 3. Policy Layer

### 3.1. Missing Field Policies

| Helyzet | Policy | Implementáció |
|---------|--------|---------------|
| Required mező üres | **skip section** | Response builder nem adja hozzá a `sections[]` tömbhöz |
| Required repeater üres (`[]`) | **skip section** | Üres tömb = hiányzó tartalom |
| Optional mező üres string | `undefined` | Normalization: `'' → undefined` (wp-mapper.ts) |
| Optional mező `null` | `undefined` | Normalization: `null → undefined` |
| Optional boolean hiányzik | `false` | ACF true_false default |
| Optional select hiányzik | default érték | Egyedi per mező (lásd táblák) |

### 3.2. Repeater Policies

| Helyzet | Policy |
|---------|--------|
| Repeater üres | skip section (ha required) / `[]` (ha optional) |
| Repeater item required mező üres | skip item (az adott item kihagyva) |
| Repeater minden item invalid | = üres repeater → skip section |

### 3.3. CTA Policies

| Helyzet | Policy |
|---------|--------|
| `cta.text` üres | omit egész CTA (nem emit `{ text: "", href: ... }`) |
| `cta.href` üres | **omit egész CTA** — text-only CTA dead anchor lenne |
| `cta.text` + `cta.href` mindkettő non-empty | emit `{ text: "...", href: "..." }` |

### 3.4. Media / Image Policies

| Helyzet | Policy |
|---------|--------|
| ACF image field üres | `undefined` (optional) vagy skip (required) |
| ACF image → `Media` | `spektra_acf_image_to_media()` helper |
| ACF image → URL string | `$image['url']` (bc-brand, bc-gallery) |
| Variants | `spektra_acf_image_to_media()` generálja WP registered image sizes-ból |

### 3.5. Section Order Policy

| Policy | Érték |
|--------|-------|
| Order source | `config.php` `sections[]` tömb |
| Missing section | skip (nem hiba) |
| Extra ACF group | ignore (nem kerül a sections[]-be) |
| Duplicate type | nem támogatott (1 section type = 1 instance per page) |

---

## 4. ACF Field Name Convention

```
{section_slug}_{field_name}

Prefix:    bc_hero_, bc_brand_, bc_gallery_, ...
Separator: _ (underscore)
Nesting:   bc_service_contact_phone (group field)
Repeater:  bc_brand_brands (repeater), bc_brand_brands_name (sub-field)
```

| Pattern | Példa |
|---------|-------|
| Simple field | `bc_hero_title` |
| Nested group | `bc_service_contact_phone` |
| Repeater | `bc_brand_brands` → sub: `bc_brand_brands_name` |
| CTA pair | `bc_hero_primary_cta_text` + `bc_hero_primary_cta_href` |
| Boolean | `bc_gallery_show_categories` |
| Select | `bc_about_image_position` (`left` \| `right`) |
| Image → URL | `bc_brand_brands_logo` |
| Image → Media | `bc_hero_background_image` |

---

## 5. Type Reference

### Media (platform)
```ts
{ src: string, alt: string, width?: number, height?: number, variants?: MediaVariant[], mimeType?: string }
```

### CallToAction (platform)
```ts
{ text: string, href: string }
```

### NavItem (platform)
```ts
{ label: string, href: string, children?: NavItem[], external?: boolean }
```
