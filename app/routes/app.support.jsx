// app/routes/app.support.jsx
// Support page for providing help and resources to users.

// Import UI components from Shopify Polaris for layout, tables, and actions
import { Page, Card, BlockStack, InlineStack, Text, Box, DataTable, Button, ButtonGroup, TextField, Checkbox } from "@shopify/polaris";
// Import React's useState for local state management
import { useState } from "react";
// Import Remix Link for navigation
import { Link } from "@remix-run/react";

// Main component for the Support page
export default function SupportPage() {
    console.log('[app.support.jsx] Component: Render start');
    // State for rules, search, and filter
    const [rules, setRules] = useState([
        { id: 1, title: "aaa", ruleSetType: "Hide", status: false },
        { id: 2, title: "aaa", ruleSetType: "Rename", status: false },
        { id: 3, title: "zzz", ruleSetType: "Sort", status: false },
    ]);
    const [searchValue, setSearchValue] = useState("");
    const [showActive, setShowActive] = useState(false);

    // Card counts for different rule types
    const ruleTypes = [
        { label: "Hide", count: rules.filter(r => r.ruleSetType === "Hide").length, total: 1, link: "/app/create-rule/hide" },
        { label: "Sort", count: rules.filter(r => r.ruleSetType === "Sort").length, total: 1, link: "/app/create-rule/sort" },
        { label: "Rename", count: rules.filter(r => r.ruleSetType === "Rename").length, total: 1, link: "/app/create-rule/rename" },
    ];

    // Delete a rule by its ID
    const deleteRule = (ruleId) => {
        console.log(`[app.support.jsx] deleteRule: ruleId = ${ruleId}`);
        setRules(prevRules => prevRules.filter(rule => rule.id !== ruleId));
    };

    // Prepare table rows for displaying rules and their actions
    const tableRows = rules.map(rule => [
        rule.title,
        rule.ruleSetType,
        <Checkbox key={`status-${rule.id}`} checked={rule.status} disabled />,
        <ButtonGroup key={`actions-${rule.id}`}>
            <Button plain><span role="img" aria-label="edit">✏️</span></Button>
            <Button plain onClick={() => deleteRule(rule.id)}>
                <span role="img" aria-label="delete">🗑️</span>
            </Button>
        </ButtonGroup>
    ]);

    // Main layout: support cards, rules table, and navigation
    return (
        <Page title="Support">
            <BlockStack gap="500">
                {/* Support cards for different rule types */}
                <InlineStack gap="400" align="start">
                    {ruleTypes.map(type => (
                        <Card key={type.label}>
                            <Box padding="400">
                                <BlockStack gap="200">
                                    <Text variant="bodyMd" color="subdued">{type.label} Rules:</Text>
                                    <Text variant="headingMd">{type.count} of {type.total}</Text>
                                </BlockStack>
                            </Box>
                        </Card>
                    ))}
                </InlineStack>

                {/* Table of rules with actions */}
                <Card>
                    <Box padding="400">
                        {/* DataTable or list of rules with actions would go here */}
                    </Box>
                </Card>
            </BlockStack>
        </Page>
    );
}