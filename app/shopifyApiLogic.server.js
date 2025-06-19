// app/shopifyApiLogic.server.js
// Service file for Shopify API logic: get cart value, get shipping pin, etc.

const SHOPIFY_STOREFRONT_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2023-10/graphql.json`;
const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_ADMIN_API_URL = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2023-10`;
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

/**
 * Fetches the cart value from Shopify Storefront API.
 * @param {string} cartId - The Shopify cart ID (gid format).
 * @returns {Promise<number>} - The total cart value.
 */
export async function getCartValue(cartId) {
    const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
    }
  `;
    const response = await fetch(SHOPIFY_STOREFRONT_API_URL, {
        method: 'POST',
        headers: {
            'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: { cartId },
        }),
    });
    const data = await response.json();
    if (data.errors || !data.data.cart) {
        throw new Error('Failed to fetch cart value');
    }
    return data.data.cart.cost.totalAmount.amount;
}

/**
 * Fetches the shipping pin (postal code) from Shopify Admin API for an order.
 * @param {string} orderId - The Shopify order ID (number).
 * @returns {Promise<string>} - The shipping postal code.
 */
export async function getShippingPin(orderId) {
    const response = await fetch(
        `${SHOPIFY_ADMIN_API_URL}/orders/${orderId}.json`,
        {
            headers: {
                'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
                'Content-Type': 'application/json',
            },
        }
    );
    const data = await response.json();
    if (!data.order || !data.order.shipping_address) {
        throw new Error('Failed to fetch shipping pin');
    }
    return data.order.shipping_address.zip;
}

// Add more Shopify API logic functions as needed for your app. 