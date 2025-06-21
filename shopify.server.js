import { shopifyApi } from '@shopify/shopify-api';

const shopify = shopifyApi({
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    scopes: ['read_products'], // Add other scopes as needed
    HostName: 'pet-beyond-identify-obtain.trycloudflare.com/', // Replace with your app's public URL (no https://)
});

export default shopify;