import {
    Page,
    Card,
    Box,
    InlineStack,
    BlockStack,
    Text,
    TextField,
    Button,
    Checkbox,
    Select,
    Badge,
    Icon,
} from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";
import { title } from "process";
import { useState } from "react";

export default function CreateRulePage() {
    console.log("[app.quickSetup.jsx] Component: Render");
    const [templateRules, setTemplateRules] = useState([
        "Hide COD when cart total reaches",
        "Hide COD for Internation Customers",
        "Welcome to my youtube channel",
        "Hide Express Checkout Option",
        "xyz",
        "zzz",
    ]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const [customRule, setCustomRule] = useState({
        title: "whoremember",
        action: "Hide",
        conditionField: "cart total amount",
        conditionOperator: "equal or greater than",
        conditionValue: "$300",
        thenAction: "Hide specific payment method",
    });

    const handleTemplateToggle = (label) => {
        console.log(`[app.quickSetup.jsx] handleTemplateToggle: label = ${label}`);
        setSelectedTemplates((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label]
        );
    };

    return (
        <Page title="Create New Rule">
            <BlockStack gap="500">
                <InlineStack gap="300" wrap={false}>

                    <Button variant="secondary" url="/app" >Dashboard</Button>
                </InlineStack>

                <Card>
                    <Box padding="400">
                        <BlockStack gap="400">
                            <Text variant="headingLg" as="h2">
                                Premade Template
                            </Text>

                            {templateRules.map((label, idx) => (
                                <Checkbox
                                    key={idx}
                                    label={label}
                                    checked={selectedTemplates.includes(label)}
                                    onChange={() => handleTemplateToggle(label)}
                                />
                            ))}

                            <Button variant="secondary" onClick={() => console.log("[app.quickSetup.jsx] Button: Apply clicked")}>Apply</Button>
                        </BlockStack>
                    </Box>
                </Card>

                <Card>
                    <Box padding="400">
                        <BlockStack gap="400">
                            <Text variant="headingLg" as="h2">
                                Custom tailored Rules
                            </Text>

                            <TextField
                                label="Title..."
                                value={customRule.title}
                                onChange={(val) => setCustomRule({ ...customRule, title: val })}
                                autoComplete="off"
                            />

                            <Select
                                label="Choose..."
                                options={["Hide", "Show"]}
                                value={customRule.action}
                                onChange={(val) => setCustomRule({ ...customRule, action: val })}
                            />

                            <InlineStack gap="200">
                                <Select
                                    label="When..."
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
                                    value={customRule.conditionField}
                                    onChange={(val) => setCustomRule({ ...customRule, conditionField: val })}
                                />

                                <Select
                                    label="is"
                                    options={[
                                        "equal or greater than",
                                        "less than",
                                        "equal to",
                                    ]}
                                    value={customRule.conditionOperator}
                                    onChange={(val) =>
                                        setCustomRule({ ...customRule, conditionOperator: val })
                                    }
                                />
                            </InlineStack>

                            <TextField
                                label=""
                                value={customRule.conditionValue}
                                onChange={(val) =>
                                    setCustomRule({ ...customRule, conditionValue: val })
                                }
                            />

                            <InlineStack gap="200">
                                <Button icon={PlusIcon}>Add AND condition</Button>
                                <Button icon={PlusIcon}>Add OR condition</Button>
                            </InlineStack>

                            <Select
                                label="Then..."
                                options={[
                                    "Hide specific payment method",
                                    "Show specific payment method",
                                    "Redirect to another page",
                                ]}
                                value={customRule.thenAction}
                                onChange={(val) =>
                                    setCustomRule({ ...customRule, thenAction: val })
                                }
                            />

                            <Button icon={PlusIcon}>Add Action</Button>
                        </BlockStack>
                    </Box>
                </Card>

                <InlineStack align="end">
                    <Button variant="primary" onClick={() => console.log("[app.quickSetup.jsx] Button: CREATE RULE clicked")}>CREATE RULE</Button>
                </InlineStack>

                <Button variant="tertiary">Back</Button>
            </BlockStack>
        </Page>
    );
}
