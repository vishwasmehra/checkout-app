// app/routes/template.new-rules.jsx
// Page for creating and managing payment rules in the app.

// Import UI components from Shopify Polaris for layout, forms, and modals
import {
    Page,
    Card,
    TextField,
    Button,
    BlockStack,
    InlineStack,
    Select,
    Text,
    Box,
    Modal,
} from "@shopify/polaris";
// Import React's useState for local state management
import { useState } from "react";

console.log('[app.createPaymentRules.jsx] Component: Render start');

// Main component for the Create Payment Rules page
export default function NewRulePage() {
    console.log("[app.createPaymentRules.jsx] Component: Render");
    // State for form visibility and rule fields
    const [formVisible, setFormVisible] = useState(null); // 'Hide', 'Rename', 'Sort' or null
    const [title, setTitle] = useState("");
    const [action, setAction] = useState("Hide");
    const [condition, setCondition] = useState("cart total amount");
    const [operator, setOperator] = useState("equal or greater than");
    const [value, setValue] = useState("");
    const [thenAction, setThenAction] = useState("Hide specific payment method");
    const [modalActive, setModalActive] = useState(false);
    const [rules, setRules] = useState([]);

    // Handle form submission to create a new rule
    const handleCreateRule = (e) => {
        e.preventDefault();
        const newRule = {
            title,
            action,
            condition,
            operator,
            value,
            thenAction,
        };
        setRules([...rules, newRule]);
        setModalActive(true);
        setFormVisible(null);
        setTitle("");
        setAction("Hide");
        setCondition("cart total amount");
        setOperator("equal or greater than");
        setValue("");
        setThenAction("Hide specific payment method");
    };

    // Options for select dropdowns in the form
    const actionOptions = [
        { label: "Hide", value: "Hide" },
        { label: "Rename", value: "Rename" },
        { label: "Sort", value: "Sort" }
    ];
    const operatorOptions = [
        { label: "equal or greater than", value: "equal or greater than" },
        { label: "equal or less than", value: "equal or less than" },
        { label: "equal to", value: "equal to" }
    ];
    const thenActionOptions = [
        { label: "Hide specific payment method", value: "Hide specific payment method" },
        { label: "Show specific payment method", value: "Show specific payment method" }
    ];

    // Render the form for creating a rule of a given type
    function renderForm(type) {
        console.log(`[app.createPaymentRules.jsx] renderForm: type = ${type}`);
        return (
            <Card>
                <Box padding="400">
                    <form onSubmit={handleCreateRule}>
                        <BlockStack gap="400">
                            <TextField
                                label="Title..."
                                name="title"
                                value={title}
                                onChange={(value) => setTitle(value)}
                                placeholder="Enter rule title"
                                required
                            />
                            <Select
                                label="Choose..."
                                name="action"
                                options={actionOptions}
                                value={type}
                                onChange={(value) => { }}
                                disabled
                            />
                            <InlineStack gap="300" align="start">
                                <Box minWidth="200px">
                                    <Select
                                        label="When..."
                                        name="condition"
                                        options={[
                                            {
                                                title: "Cart Details",
                                                options: [
                                                    { label: "Total Amount", value: "total_amount" },
                                                    { label: "SubTotal Amount", value: "subtotal_amount" },
                                                    { label: "Total Weight", value: "total_weight" },
                                                    { label: "Total Quantity", value: "total_quantity" },
                                                    { label: "Total Discount", value: "total_discount" },
                                                    { label: "Discount Rate", value: "discount_rate" },
                                                    { label: "Shipping Cost", value: "shipping_cost" },
                                                ],
                                            },
                                            {
                                                title: "Cart Items",
                                                options: [
                                                    { label: "Sku", value: "sku" },
                                                    { label: "Choose Collection", value: "choose_collection" },
                                                ],
                                            },
                                            {
                                                title: "Address",
                                                options: [
                                                    { label: "Country", value: "country" },
                                                    { label: "Currency Code", value: "currency_code" },
                                                    { label: "Province Code / State Code", value: "province_code" },
                                                    { label: "Zip Code / Postal Code", value: "zip_code" },
                                                    { label: "City", value: "city" },
                                                ],
                                            },
                                            {
                                                title: "Customer",
                                                options: [
                                                    { label: "Total Spent", value: "total_spent" },
                                                    { label: "Customer Tag", value: "customer_tag" }
                                                ]
                                            },
                                            {
                                                title: "Delivery/Shipping",
                                                options: [
                                                    { label: "Title", value: "title" }
                                                ]
                                            }
                                        ]}
                                        value={condition}
                                        onChange={(value) => setCondition(value)}
                                    />
                                </Box>
                                <Box minWidth="200px">
                                    <Select
                                        label=""
                                        name="operator"
                                        options={operatorOptions}
                                        value={operator}
                                        onChange={(value) => setOperator(value)}
                                    />
                                </Box>
                            </InlineStack>
                            <TextField
                                name="value"
                                value={value}
                                onChange={(value) => setValue(value)}
                                placeholder="$300"
                                required
                            />
                            <InlineStack gap="200">
                                <Button variant="tertiary" size="slim" type="button">
                                    + Add AND condition
                                </Button>
                                <Button variant="tertiary" size="slim" type="button">
                                    + Add OR condition
                                </Button>
                            </InlineStack>
                            <Select
                                label="Then..."
                                name="thenAction"
                                options={thenActionOptions}
                                value={thenAction}
                                onChange={(value) => setThenAction(value)}
                            />
                            <Box>
                                <Button variant="tertiary" size="slim" type="button">
                                    + Add Action
                                </Button>
                            </Box>
                            <Box paddingBlockStart="400">
                                <Button variant="primary" size="large" fullWidth type="submit">
                                    CREATE RULE
                                </Button>
                            </Box>
                        </BlockStack>
                    </form>
                </Box>
            </Card>
        );
    }

    console.log('[app.createPaymentRules.jsx] Loader data:', loaderData);

    // Main layout: sections for Hide, Rename, and Sort rules, each with a form
    return (
        <Page
            backAction={{ content: "Back", url: "/app" }}
            title="Choose Your Customization"
            primaryAction={{ content: "Dashboard", url: "/app" }}
        >
            <BlockStack gap="500">
                {/* Hide Section: create and list Hide rules */}
                <Card>
                    <Box padding="400">
                        <InlineStack align="space-between">
                            <Text variant="headingMd" as="h3">Hide</Text>
                            <Button onClick={() => setFormVisible(formVisible === 'Hide' ? null : 'Hide')}>
                                Create Customization
                            </Button>
                        </InlineStack>
                        <Box paddingBlockStart="200">
                            <Text variant="bodyMd" color="subdued">
                                Total Amount, Subtotal Amount, Total Weight, Total Quantity, Sku, Collections, Country,
                                Zipcode, City, Total Spend, State/Province Code, Customer Tags, Delivery/Shipping Title,
                                Total Discount, Discount Rate, Shipping Cost, Currency Code
                            </Text>
                        </Box>
                    </Box>
                </Card>
                {formVisible === 'Hide' && renderForm('Hide')}

                {/* Rename Section: create and list Rename rules */}
                <Card>
                    <Box padding="400">
                        <InlineStack align="space-between">
                            <Text variant="headingMd" as="h3">Rename</Text>
                            <Button onClick={() => setFormVisible(formVisible === 'Rename' ? null : 'Rename')}>
                                Create Customization
                            </Button>
                        </InlineStack>
                        <Box paddingBlockStart="200">
                            <Text variant="bodyMd" color="subdued">
                                Always, Country, Language, Customer Tags
                            </Text>
                        </Box>
                    </Box>
                </Card>
                {formVisible === 'Rename' && renderForm('Rename')}

                {/* Sort Section: create and list Sort rules */}
                <Card>
                    <Box padding="400">
                        <InlineStack align="space-between">
                            <Text variant="headingMd" as="h3">Sort</Text>
                            <Button onClick={() => setFormVisible(formVisible === 'Sort' ? null : 'Sort')}>
                                Create Customization
                            </Button>
                        </InlineStack>
                        <Box paddingBlockStart="200">
                            <Text variant="bodyMd" color="subdued">
                                Country, Shipping Title
                            </Text>
                        </Box>
                    </Box>
                </Card>
                {formVisible === 'Sort' && renderForm('Sort')}
            </BlockStack>
            <Modal
                open={modalActive}
                onClose={() => setModalActive(false)}
                title="Rule Saved"
                primaryAction={{ content: "OK", onAction: () => setModalActive(false) }}
            >
                <Modal.Section>
                    <Text variant="bodyMd">Rule has been saved. You can now manually activate it.</Text>
                </Modal.Section>
            </Modal>
            console.log('[app.createPaymentRules.jsx] Returning main JSX');
        </Page>
    );
}