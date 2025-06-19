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
import { useState, useEffect } from "react";
import { useActionData, Form, useNavigation } from "@remix-run/react";
import RuleForm from "../RuleForm";

console.log('[app.createPaymentRules.jsx] Component: Render start');

export async function action({ request }) {
    console.log('ACTION CALLED');
    const { json, redirect } = await import("@remix-run/node");
    const prisma = (await import('~/db.server')).default;
    const formData = await request.formData();
    const title = formData.get("title");
    const ruleSetType = formData.get("action");
    const condition = formData.get("condition");
    const operator = formData.get("operator");
    const value = formData.get("value");
    const thenAction = formData.get("thenAction");
    // Save all fields to the rule
    const rule = await prisma.rule.create({
        data: {
            title: String(title),
            ruleSetType: String(ruleSetType),
            condition: condition ? String(condition) : null,
            operator: operator ? String(operator) : null,
            value: value ? String(value) : null,
            thenAction: thenAction ? String(thenAction) : null,
            status: false,
        },
    });
    return json({ success: true, rule });
}

// Main component for the Create Payment Rules page
export default function NewRulePage() {
    const actionData = useActionData();
    const navigation = useNavigation();
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

    useEffect(() => {
        if (actionData?.success) {
            setModalActive(true);
            setTitle("");
            setAction("Hide");
            setCondition("cart total amount");
            setOperator("equal or greater than");
            setValue("");
            setThenAction("Hide specific payment method");
            setFormVisible(null);
        }
    }, [actionData]);

    const handleCloseModal = () => {
        setModalActive(false);
    };

    // Metadata for each rule type
    const ruleMeta = {
        Hide: [
            "Total Amount", "Subtotal Amount", "Total Weight", "Total Quantity", "Sku", "Collections", "Country", "Zipcode", "City", "Total Spend", "State/Province Code", "Customer Tags", "Delivery/Shipping Title", "Total Discount", "Discount Rate", "Shipping Cost", "Currency Code"
        ],
        Rename: [
            "Always", "Country", "Language", "Customer Tags"
        ],
        Sort: [
            "Country", "Shipping Title"
        ]
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
        return (
            <Card>
                <Box padding="400">
                    <RuleForm
                        type={type}
                        title={title}
                        setTitle={setTitle}
                        action={action}
                        setAction={setAction}
                        condition={condition}
                        setCondition={setCondition}
                        operator={operator}
                        setOperator={setOperator}
                        value={value}
                        setValue={setValue}
                        thenAction={thenAction}
                        setThenAction={setThenAction}
                        navigation={navigation}
                    />
                </Box>
            </Card>
        );
    }

    // Main layout: sections for Hide, Rename, and Sort rules, each with a form
    return (
        <Page
            backAction={{ content: "Back", url: "/app" }}
            title="Choose Your Customization"
            primaryAction={{ content: "Dashboard", url: "/app" }}
        >
            <BlockStack gap="500">
                {/* Hide Rule Card */}
                <Card>
                    <Box padding="400">
                        <Text variant="headingMd">Hide</Text>
                        <Text>{ruleMeta.Hide.join(", ")}</Text>
                        <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" onClick={() => setFormVisible(formVisible === "Hide" ? null : "Hide")}>Create Customization</Button>
                        </Box>
                        {formVisible === "Hide" && renderForm("Hide")}
                    </Box>
                </Card>
                {/* Rename Rule Card */}
                <Card>
                    <Box padding="400">
                        <Text variant="headingMd">Rename</Text>
                        <Text>{ruleMeta.Rename.join(", ")}</Text>
                        <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" onClick={() => setFormVisible(formVisible === "Rename" ? null : "Rename")}>Create Customization</Button>
                        </Box>
                        {formVisible === "Rename" && renderForm("Rename")}
                    </Box>
                </Card>
                {/* Sort Rule Card */}
                <Card>
                    <Box padding="400">
                        <Text variant="headingMd">Sort</Text>
                        <Text>{ruleMeta.Sort.join(", ")}</Text>
                        <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" onClick={() => setFormVisible(formVisible === "Sort" ? null : "Sort")}>Create Customization</Button>
                        </Box>
                        {formVisible === "Sort" && renderForm("Sort")}
                    </Box>
                </Card>
            </BlockStack>
            <Modal
                open={modalActive}
                onClose={handleCloseModal}
                title="Rule Saved"
                primaryAction={{
                    content: "OK",
                    onAction: handleCloseModal
                }}
            >
                <Modal.Section>
                    <Text variant="bodyMd">Your rule has been saved and can be activated from the dashboard.</Text>
                </Modal.Section>
            </Modal>
        </Page>
    );
}