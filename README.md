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
