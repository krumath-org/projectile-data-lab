# Babel Khmer string files (vendored copy)

These are copies of the Khmer translations applied into the sibling `babel/` checkout:

- `babel/projectile-data-lab/projectile-data-lab-strings_km.json`
- `babel/joist/joist-strings_km.json`
- `babel/scenery-phet/scenery-phet-strings_km.json`

PhET loads translations from the sibling `babel` repo at runtime. This folder keeps the
translations versioned with this fork (upstream `phetsims/babel` is not writable from here).

To restore after a fresh clone of deps:

```
copy doc\i18n\babel-km\projectile-data-lab-strings_km.json ..\babel\projectile-data-lab\
copy doc\i18n\babel-km\joist-strings_km.json ..\babel\joist\
copy doc\i18n\babel-km\scenery-phet-strings_km.json ..\babel\scenery-phet\
```

Then regenerate development conglomerates if needed (`grunt generate-development-strings` from chipper / perennial tooling), or re-run `doc/i18n/apply-km-workbook.mjs`.
