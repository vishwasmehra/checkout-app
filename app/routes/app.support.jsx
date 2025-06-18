import { Page, Card, BlockStack, InlineStack, Text, Box, DataTable, Button, ButtonGroup, TextField, Checkbox } from "@shopify/polaris";
import { useState } from "react";
import { Link } from "@remix-run/react";

export default function SupportPage() {
    console.log("[app.support.jsx] Component: Render");
    // Make rules state mutable
    const [rules, setRules] = useState([
        { id: 1, title: "aaa", ruleSetType: "Hide", status: false },
        { id: 2, title: "aaa", ruleSetType: "Rename", status: false },
        { id: 3, title: "zzz", ruleSetType: "Sort", status: false },
    ]);
    const [searchValue, setSearchValue] = useState("");
    const [showActive, setShowActive] = useState(false);

    // Card counts - now dynamic
    const ruleTypes = [
        { label: "Hide", count: rules.filter(r => r.ruleSetType === "Hide").length, total: 1, link: "/app/create-rule/hide" },
        { label: "Sort", count: rules.filter(r => r.ruleSetType === "Sort").length, total: 1, link: "/app/create-rule/sort" },
        { label: "Rename", count: rules.filter(r => r.ruleSetType === "Rename").length, total: 1, link: "/app/create-rule/rename" },
    ];

    // Delete rule handler
    const deleteRule = (ruleId) => {
        console.log(`[app.support.jsx] deleteRule: ruleId = ${ruleId}`);
        setRules(prevRules => prevRules.filter(rule => rule.id !== ruleId));
    };

    // Table rows
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

    return (
        <Page title="Dashboard">
            <BlockStack gap="500">
                {/* Top summary cards */}
                <InlineStack gap="400" align="start">
                    {/* Active Payment Customizations */}
                    <Card>
                        <Box padding="400" minWidth="220px">
                            <Text variant="bodyMd" color="subdued">Active Payment Customizations</Text>
                            <Box paddingBlockStart="200">
                                <Text variant="headingLg" as="span">0</Text>
                                <Text variant="bodyMd" as="span"> /5 Our App active delivery rule(s)</Text>
                            </Box>
                        </Box>
                    </Card>
                    {/* Add new customization */}
                    <Card>
                        <Box padding="400" minWidth="220px">
                            <Text variant="bodyMd" color="subdued">Add new customization</Text>
                            <Box paddingBlockStart="200">
                                <Button variant="primary" onClick={() => console.log("[app.support.jsx] Button: Create Payment Customization clicked")}>Create Payment Customization</Button>
                            </Box>
                        </Box>
                    </Card>
                    {/* Rules Count Card */}
                    <Card>
                        <Box padding="400" minWidth="220px">
                            <Text variant="bodyMd" color="subdued">Your activated / created rules count.</Text>
                            <InlineStack gap="200" align="center" blockAlign="center">
                                {ruleTypes.map(rule => (
                                    <Box key={rule.label} textAlign="center">
                                        <Link to={rule.link} style={{ textDecoration: 'none' }}>
                                            <Text variant="bodySm" color="subdued" as="div" style={{ cursor: 'pointer' }}>{rule.label}</Text>
                                            <Box>
                                                <Text variant="headingMd" as="span">{rule.count}</Text>
                                                <Text variant="bodySm" as="span" color="subdued"> /{rule.total}</Text>
                                            </Box>
                                        </Link>
                                    </Box>
                                ))}
                            </InlineStack>
                        </Box>
                    </Card>
                </InlineStack>

                {/* Search and toggle */}
                <Box paddingBlockStart="400">
                    <InlineStack gap="400" align="center">
                        <TextField
                            prefix={<span role="img" aria-label="search">🔍</span>}
                            placeholder="Search"
                            value={searchValue}
                            onChange={setSearchValue}
                            autoComplete="off"
                            style={{ maxWidth: 300 }}
                        />
                        <InlineStack gap="100" align="center">
                            <Text as="span" variant="bodySm">All</Text>
                            <Checkbox
                                label="Active"
                                checked={showActive}
                                onChange={setShowActive}
                            />
                        </InlineStack>
                    </InlineStack>
                </Box>

                {/* Table */}
                <Box paddingBlockStart="200">
                    <DataTable
                        columnContentTypes={["text", "text", "text", "text"]}
                        headings={["Title", "Rule Set Type", "Status", "Action"]}
                        rows={tableRows}
                        footerContent={`Showing ${rules.length} of ${rules.length} results`}
                    />
                </Box>
            </BlockStack>
        </Page>
    );
}