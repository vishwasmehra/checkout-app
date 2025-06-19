import { Form } from "@remix-run/react";
import { BlockStack, TextField, Select, InlineStack, Box, Button } from "@shopify/polaris";
import { useState } from "react";

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

export default function RuleForm({
    type,
    title,
    setTitle,
    action,
    setAction,
    condition,
    setCondition,
    operator,
    setOperator,
    value,
    setValue,
    thenAction,
    setThenAction,
    navigation,
    isEdit = false,
    editId,
    editIntent
}) {
    const [error, setError] = useState("");
    function handleSubmit(e) {
        if (!title.trim()) {
            e.preventDefault();
            setError("Title is required.");
        } else {
            setError("");
        }
    }
    return (
        <Form method="post" onSubmit={handleSubmit}>
            {editIntent && <input type="hidden" name="intent" value={editIntent} />}
            {editId && <input type="hidden" name="id" value={editId} />}
            <input type="hidden" name="action" value={type} />
            <BlockStack gap="400">
                <TextField
                    label="Title..."
                    name="title"
                    value={title}
                    onChange={setTitle}
                    placeholder="Enter rule title"
                    required
                    error={error}
                />
                <Select
                    label="Choose..."
                    name="actionDisplay"
                    options={actionOptions}
                    value={type}
                    onChange={() => { }}
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
                            onChange={setCondition}
                        />
                    </Box>
                    <Box minWidth="200px">
                        <Select
                            label=""
                            name="operator"
                            options={operatorOptions}
                            value={operator}
                            onChange={setOperator}
                        />
                    </Box>
                </InlineStack>
                <TextField
                    name="value"
                    value={value}
                    onChange={setValue}
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
                    onChange={setThenAction}
                />
                <Box>
                    <Button variant="tertiary" size="slim" type="button">
                        + Add Action
                    </Button>
                </Box>
                <Box paddingBlockStart="400">
                    <Button
                        variant="primary"
                        size={isEdit ? "slim" : "large"}
                        fullWidth={!isEdit}
                        submit
                        loading={navigation.state === 'submitting'}
                    >
                        {isEdit ? "Save" : "Create Rule"}
                    </Button>
                </Box>
            </BlockStack>
        </Form>
    );
} 