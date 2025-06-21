import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
    // Authenticate the admin request using Shopify's authentication
    const { session } = await authenticate.admin(request);

    if (!session) {
        return json({ error: "Not authenticated" }, { status: 401 });
    }

    const shop = session.shop;
    const accessToken = session.accessToken;

    // Fetch products from Shopify REST API
    const response = await fetch(
        `https://${shop}/admin/api/2024-07/products.json`,
        {
            headers: {
                "X-Shopify-Access-Token": accessToken,
                "Content-Type": "application/json",
            },
        }
    );
    const data = await response.json();

    return json(data);
};

export default function Products() {
    // You can use useLoaderData() to display products in the UI
    return <div>Check the network tab for product data!</div>;
}