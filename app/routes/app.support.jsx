// app/routes/app.support.jsx
// Support page for providing help and resources to users.

// Import UI components from Shopify Polaris for layout, tables, and actions
import { Page, Card, BlockStack, InlineStack, Text, Box, DataTable, Button, ButtonGroup, TextField, Checkbox } from "@shopify/polaris";
// Import React's useState for local state management
import { useState, useEffect } from "react";
// Import Remix Link for navigation
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";

// Server-only imports
// Only used in the loader, not in the component
// Do NOT import these in the component body or any file imported by the component
import { json } from "@remix-run/node";
import prisma from "~/db.server";

export async function loader() {
    const rules = await prisma.rule.findMany({ orderBy: { createdAt: "desc" } });
    return json({ rules });
}

// Main component for the Support page
export default function SupportPage() {
    console.log('[app.support.jsx] Component: Render start');
    // Only use useLoaderData and client-safe hooks in the component
    const { rules } = useLoaderData();
    const [searchValue, setSearchValue] = useState("");
    const [showActive, setShowActive] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => setIsHydrated(true), []);

    // Hydration-safe filtering
    let displayedRules = rules;
    if (isHydrated) {
        displayedRules = rules.filter(rule =>
            rule.title.toLowerCase().includes(searchValue.toLowerCase()) &&
            (!showActive || rule.status)
        );
    }

    // Use displayedRules for table and counts
    const hideCount = displayedRules.filter(r => r.ruleSetType === "Hide").length;
    const sortCount = displayedRules.filter(r => r.ruleSetType === "Sort").length;
    const renameCount = displayedRules.filter(r => r.ruleSetType === "Rename").length;

    // Delete a rule by its ID
    const deleteRule = (ruleId) => {
        console.log(`[app.support.jsx] deleteRule: ruleId = ${ruleId}`);
        // This function needs to be updated to use the rules from the loader
    };

    // Prepare table rows for displaying rules and their actions
    const tableRows = displayedRules.map(rule => [
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
                {/* Summary cards at the top */}
                <InlineStack gap="400" align="start">
                    <Card>
                        <Box padding="400" minWidth="260px">
                            <Text variant="bodyMd" color="subdued">Active Payment Customizations</Text>
                            <Box paddingBlockStart="200">
                                <Text variant="headingLg" as="span">0</Text>
                                <Text variant="bodyMd" as="span"> /5 Our App active delivery rule(s)</Text>
                            </Box>
                        </Box>
                    </Card>
                    <Card>
                        <Box padding="400" minWidth="260px">
                            <Text variant="bodyMd" color="subdued">Add new customization</Text>
                            <Box paddingBlockStart="200">
                                <Button variant="primary" url="/app/createPaymentRules">Create Payment Customization</Button>
                            </Box>
                        </Box>
                    </Card>
                    <Card>
                        <Box padding="400" minWidth="260px">
                            <Text variant="bodyMd" color="subdued">Your activated / created rules count.</Text>
                            <InlineStack gap="200" align="center" blockAlign="center">
                                <Box style={{ textAlign: "center" }}>
                                    <Text variant="bodySm" color="subdued" as="div">Hide</Text>
                                    <Box>
                                        <Text variant="headingMd" as="span">{hideCount}</Text>
                                        <Text variant="bodySm" as="span" color="subdued"> /2</Text>
                                    </Box>
                                </Box>
                                <Box style={{ textAlign: "center" }}>
                                    <Text variant="bodySm" color="subdued" as="div">Sort</Text>
                                    <Box>
                                        <Text variant="headingMd" as="span">{sortCount}</Text>
                                        <Text variant="bodySm" as="span" color="subdued"> /2</Text>
                                    </Box>
                                </Box>
                                <Box style={{ textAlign: "center" }}>
                                    <Text variant="bodySm" color="subdued" as="div">Rename</Text>
                                    <Box>
                                        <Text variant="headingMd" as="span">{renameCount}</Text>
                                        <Text variant="bodySm" as="span" color="subdued"> /2</Text>
                                    </Box>
                                </Box>
                            </InlineStack>
                        </Box>
                    </Card>
                </InlineStack>

                {/* Search bar and rules table */}
                <Box paddingBlockStart="400">
                    <TextField
                        prefix={<span role="img" aria-label="search">🔍</span>}
                        placeholder="Search"
                        value={searchValue}
                        onChange={setSearchValue}
                        autoComplete="off"
                        style={{ maxWidth: 300 }}
                    />
                </Box>
                <Box paddingBlockStart="200">
                    <DataTable
                        columnContentTypes={["text", "text", "text", "text"]}
                        headings={["Title", "Rule Set Type", "Status", "Action"]}
                        rows={tableRows}
                        footerContent={`Showing ${displayedRules.length} of ${rules.length} results`}
                    />
                </Box>

                {/* Limitations/info card at the bottom */}
                <Card>
                    <Box padding="400">
                        <Text variant="headingMd">Limitations</Text>
                        <ul style={{ marginTop: 16, marginBottom: 0, paddingLeft: 20 }}>
                            <li>The Payment Customization API doesn't currently support draft orders.</li>
                            <li>You can't rename payment methods that have logos.</li>
                            <li>Payment customizations aren't compatible with Shop Pay (Mobile App).</li>
                            <li>You can activate only 5 Payment customization methods at a time.</li>
                            <li>APP do not hide express checkout button, you have to disable it from Shopify's settings.</li>
                        </ul>
                        <Text variant="bodyMd" color="subdued" style={{ marginTop: 16, display: 'block' }}>
                            Once Shopify will launch the update, we will update our app accordingly.
                        </Text>
                    </Box>
                </Card>
            </BlockStack>
        </Page>
    );
}