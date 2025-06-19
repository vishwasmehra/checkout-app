## Version g0.2 (Unreleased)

### Major Changes Since Last Push

- **Dashboard & Rule Management**
  - The dashboard now displays only one edit icon per rule row (no duplicates).
  - Edit modal uses a single, shared `RuleForm` component for editing rules, with proper validation and field mapping.
  - Edit modal no longer causes nested form warnings; all hidden fields are handled inside `RuleForm`.
  - The "Create Payment Customization" button on the dashboard now redirects to `/app/createPaymentRules` instead of opening an inline form.

- **RuleForm Refactor**
  - Extracted a shared `RuleForm.jsx` component, used for both creating and editing rules.
  - Added client-side validation (title required) and ensured all form fields are correctly named for Remix actions.
  - `RuleForm` now accepts `editId` and `editIntent` props for hidden fields, preventing nested forms.

- **Prisma & Database**
  - Updated `prisma/schema.prisma` to add missing fields (`condition`, `operator`, `value`, `thenAction`) to the `Rule` model.
  - Added and ran new migrations:
    - `20250619090053_add_rule_model/`
    - `20250619094347_add_rule_fields/`
    - `migration_lock.toml`

- **Bug Fixes & Robustness**
  - Fixed hydration and server/client import errors in Remix route files.
  - Ensured server-only code (like Prisma) is only imported inside loaders/actions.
  - Fixed 405 errors by ensuring all form submissions use Remix `<Form>` and not fetch.
  - Removed duplicate edit icons and ensured only one edit button per row.
  - Fixed edit modal so that edits persist and update the database correctly.

- **UI/UX Improvements**
  - Edit modal's save button is now small and says "Save" (not "Create Rule").
  - All dashboard actions (edit, enable/disable, delete) are now interactive and robust.
  - Cleaned up dashboard logic for rule counts and summary cards.

- **New/Changed Files**
  - `app/RuleForm.jsx` (new shared form component)
  - `prisma/migrations/20250619090053_add_rule_model/`
  - `prisma/migrations/20250619094347_add_rule_fields/`
  - `prisma/migrations/migration_lock.toml`

---

## Version g0.1 (Unreleased)

### New Features & Improvements

- **Language Dropdown:**
  - Added a language selector (15 languages, default English) to the dashboard navigation, right of the Support button.
  - All dashboard text is now dynamically translated based on the selected language.

- **API Logic for Shopify Data:**
  - Created `shopifyApiLogic.server.js` with:
    - `getCartValue(cartId)`: Fetches cart value from Shopify Storefront API.
    - `getShippingPin(orderId)`: Fetches shipping postal code from Shopify Admin API.
  - These functions are used server-side for secure data access.

- **Cart & Shipping Info Page:**
  - Added `/app/cartShippingInfo` page.
  - Allows user to input Cart ID and Order ID, fetches and displays cart value and shipping pin using the new API logic.

- **Navigation Improvements:**
  - Added navigation button to Cart & Shipping Info page (if not already present).
  - Cleaned up dashboard navigation and UI for better usability.

- **Internationalization (i18n) Foundation:**
  - Translation logic is component-based and ready for extension to other pages.

- **Project Configuration:**
  - Added `jsconfig.json` and updated `vite.config.js` to support `~` alias for root-relative imports from the `app` directory.

---

## How to Use

- **Language Selector:**
  - Use the dropdown in the dashboard navigation to change the app language instantly.
- **Cart & Shipping Info:**
  - Go to `/app/cartShippingInfo`, enter a Cart ID or Order ID, and fetch live data from Shopify.
- **API Logic:**
  - Use `getCartValue` and `getShippingPin` in server-side code (loaders, actions, webhooks, etc.).

---

## Next Steps
- Extend language support to all pages.
- Add persistence for language selection (e.g., via cookies or session).
- Further integrate API logic for automation and rule engine features.

---

**Version:** g0.1
