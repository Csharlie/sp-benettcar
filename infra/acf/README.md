# acf/

Benettcar client ACF field group definitions.

## Structure

```
acf/
├── field-groups.php        ← Registry/loader — hooks into acf/init
└── sections/
    ├── bc-hero.php          ← Hero section (§2.1)
    ├── bc-brand.php         ← Brand logos (§2.2)
    ├── bc-gallery.php       ← Image gallery (§2.3)
    ├── bc-services.php      ← Services overview (§2.4)
    ├── bc-service.php       ← Service detail (§2.5)
    ├── bc-about.php         ← About (§2.6)
    ├── bc-team.php          ← Team members (§2.7)
    ├── bc-assistance.php    ← Roadside assistance (§2.8)
    ├── bc-contact.php       ← Contact (§2.9)
    └── bc-map.php           ← Map embed (§2.10)
```

## How it works

1. `field-groups.php` is loaded by the Spektra API plugin (via client overlay symlink)
2. On `acf/init`, it requires each `sections/*.php` file
3. Each section file returns a `acf_add_local_field_group()` config array
4. Field names follow the `{section_slug}_{field_name}` convention from `content-model.md`

## Contract

All field names and types are derived from `infra/docs/content-model.md` (P3.2).
Do not rename fields without updating the contract first.
