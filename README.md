# Payment Customization App

## Version: g0.3

### Changelog (since last push)

- **Centralized Translation System**
  - Added `app/translations.js` with a `translations` object and `t(language, key)` helper for all UI text.
  - All main app pages now use the translation helper for UI text.
  - Added and completed translations for 15 languages, including Turkish, Korean, Dutch, and Polish.

- **Language Persistence**
  - Language preference is now stored in the session and persists across all pages and sessions.
  - All loaders for main app pages fetch the language from the session or cookie.

- **UI Updates**
  - Language selector dropdown now matches the supported languages in `translations.js`.
  - All UI text, table headings, field names, and example rules are sourced from the translation object.
  - Improved language switching and debugging for missing translations.

- **Database and Schema**
  - Updated `prisma/schema.prisma` to support session language.
  - Added new migration for session language support.

- **Other Affected Files**
  - `app/routes/app._index.jsx`
  - `app/routes/app.createPaymentRules.jsx`
  - `app/routes/app.jsx`
  - `app/routes/app.quickSetup.jsx`
  - `app/routes/app.support.jsx`
  - `prisma/schema.prisma`
  - `shopify.app.toml`
  - `app/translations.js` (new)

---

## How to Use
- Select your preferred language from the dropdown. The UI will update and remember your choice.
- All payment customization features are now available in 15 languages.

---

## How to Contribute
- To add or improve translations, edit `app/translations.js`.
- For new features, update the relevant route/component and ensure all UI text uses the translation helper.

---

## Setup
- See `prisma/schema.prisma` for database schema.
- Run migrations as needed for new session language support.

---

## License
MIT
