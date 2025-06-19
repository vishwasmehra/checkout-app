import { json } from "@remix-run/node";
import { getCartValue, getShippingPin } from "~/shopifyApiLogic.server";
import { useLoaderData, Form } from "@remix-run/react";
import { Page, Card, Text, BlockStack, TextField, Button } from "@shopify/polaris";
import { useState } from "react";

export async function loader({ request }) {
    const url = new URL(request.url);
    const cartId = url.searchParams.get("cartId") || "";
    const orderId = url.searchParams.get("orderId") || "";

    let cartValue = null;
    let shippingPin = null;
    let error = null;

    try {
        if (cartId) cartValue = await getCartValue(cartId);
        if (orderId) shippingPin = await getShippingPin(orderId);
    } catch (e) {
        error = e.message;
    }

    return json({ cartValue, shippingPin, error, cartId, orderId });
}

export default function CartShippingInfoPage() {
    const { cartValue, shippingPin, error, cartId, orderId } = useLoaderData();
    const [cartInput, setCartInput] = useState(cartId);
    const [orderInput, setOrderInput] = useState(orderId);

    return (
        <Page title="Cart & Shipping Info">
            <BlockStack gap="400">
                <Card>
                    <Form method="get">
                        <BlockStack gap="200">
                            <TextField
                                label="Cart ID"
                                value={cartInput}
                                onChange={setCartInput}
                                name="cartId"
                                autoComplete="off"
                            />
                            <TextField
                                label="Order ID"
                                value={orderInput}
                                onChange={setOrderInput}
                                name="orderId"
                                autoComplete="off"
                            />
                            <Button submit primary>
                                Fetch Info
                            </Button>
                        </BlockStack>
                    </Form>
                </Card>
                <Card>
                    <Text variant="headingMd">Cart Value</Text>
                    <Text>{cartValue ? `$${cartValue}` : "Not available"}</Text>
                </Card>
                <Card>
                    <Text variant="headingMd">Shipping Pin</Text>
                    <Text>{shippingPin || "Not available"}</Text>
                </Card>
                {error && (
                    <Card>
                        <Text color="critical">Error: {error}</Text>
                    </Card>
                )}
            </BlockStack>
        </Page>
    );
} 