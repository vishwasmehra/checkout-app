# Payment Customization App

## Version: g0.5

### Changelog (since last push)

- **Navigation and Routing**
  - Fixed broken navigation links for "Settings" and "Help Docs".
  - Created new pages and routes for `app/routes/app.settings.jsx` and `app/routes/app.helpdocs.jsx`.
  - Corrected an issue where the app would incorrectly display the dashboard for settings and help docs routes.
- **Authentication**
  - Fixed an authentication issue in `app/routes/app.products.jsx` by replacing a missing `session.server` import with the correct `authenticate.admin` method from Shopify's libraries.
  - Removed unused imports from `app/routes/app.products.jsx`.

- **Navigation & UI Improvements**
  - Cleaned up App Bridge NavMenu: now uses only plain text (no icons) for full compatibility and stability.
  - Removed unsupported or problematic icon imports from navigation and menu items.
  - Added guidance and support for using icons in custom navigation bars (outside App Bridge NavMenu).
  - Provided options and examples for colorful edit/delete actions using emojis and button tones.
- **Bug Fixes**
  - Fixed errors related to unsupported icon exports (e.g., HomeMajor, TemplateIcon, BlockquoteIcon, ListIcon, etc.).
  - Resolved App Bridge NavMenu rendering errors caused by custom React components or icons.
- **Pair Programming & Collaboration**
  - Added documentation and support for pair programming in Cursor, including Live Share/collaboration features.

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
- For pair programming, use Cursor's Live Share/collaboration features to work with others in real time.

---

## How to Contribute
- To add or improve translations, edit `app/translations.js`.
- For new features, update the relevant route/component and ensure all UI text uses the translation helper.
- For collaborative work, use Cursor's built-in sharing features.

---

## Setup
- See `prisma/schema.prisma` for database schema.
- Run migrations as needed for new session language support.

---

## License
MIT
