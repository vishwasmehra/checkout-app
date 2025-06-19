// app/routes/app.support.jsx
// Support page for providing help and resources to users.

// Import UI components from Shopify Polaris for layout, tables, and actions
import { Page, Card, BlockStack, InlineStack, Text, Box, DataTable, Button, ButtonGroup, TextField, Checkbox } from "@shopify/polaris";
// Import React's useState for local state management
import { useState, useEffect } from "react";
// Import Remix Link for navigation
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import prisma from "~/db.server";
import { t } from "../translations";

export async function loader({ request }) {
    const { session } = await authenticate.admin(request);
    let language = "en";
    if (session) {
        const dbSession = await prisma.session.findUnique({ where: { id: session.id } });
        if (dbSession && dbSession.language) language = dbSession.language;
    }
    if (!language) {
        const cookieHeader = request.headers.get("Cookie") || "";
        const { parse } = await import("cookie");
        const cookies = parse(cookieHeader);
        language = cookies.language || "en";
    }
    // Also fetch rules as before
    const rules = await prisma.rule.findMany({ orderBy: { createdAt: "desc" } });
    return { language, rules };
}

// Main component for the Support page
export default function SupportPage() {
    console.log('[app.support.jsx] Component: Render start');
    // Only use useLoaderData and client-safe hooks in the component
    const { language, rules } = useLoaderData();
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
        <Page title={t(language, "support")}>
            <BlockStack gap="500">
                {/* Summary cards at the top */}
                <InlineStack gap="400" align="start">
                    <Card>
                        <Box padding="400" minWidth="260px">
                            <Text variant="bodyMd" color="subdued">{t(language, "activePaymentCustomizations")}</Text>
                            <Box paddingBlockStart="200">
                                <Text variant="headingLg" as="span">0</Text>
                                <Text variant="bodyMd" as="span"> /5 {t(language, "ourAppActiveDeliveryRule")}(s)</Text>
                            </Box>
                        </Box>
                    </Card>
                    <Card>
                        <Box padding="400" minWidth="260px">
                            <Text variant="bodyMd" color="subdued">{t(language, "addNewCustomization")}</Text>
                            <Box paddingBlockStart="200">
                                <Button variant="primary" url="/app/createPaymentRules">{t(language, "createPaymentCustomization")}</Button>
                            </Box>
                        </Box>
                    </Card>
                    <Card>
                        <Box padding="400" minWidth="260px">
                            <Text variant="bodyMd" color="subdued">{t(language, "yourActivatedCreatedRulesCount")}</Text>
                            <InlineStack gap="200" align="center" blockAlign="center">
                                <Box style={{ textAlign: "center" }}>
                                    <Text variant="bodySm" color="subdued" as="div">{t(language, "hide")}</Text>
                                    <Box>
                                        <Text variant="headingMd" as="span">{hideCount}</Text>
                                        <Text variant="bodySm" as="span" color="subdued"> /2</Text>
                                    </Box>
                                </Box>
                                <Box style={{ textAlign: "center" }}>
                                    <Text variant="bodySm" color="subdued" as="div">{t(language, "sort")}</Text>
                                    <Box>
                                        <Text variant="headingMd" as="span">{sortCount}</Text>
                                        <Text variant="bodySm" as="span" color="subdued"> /2</Text>
                                    </Box>
                                </Box>
                                <Box style={{ textAlign: "center" }}>
                                    <Text variant="bodySm" color="subdued" as="div">{t(language, "rename")}</Text>
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
                        placeholder={t(language, "search")}
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
                        footerContent={`${t(language, "showing")} ${displayedRules.length} ${t(language, "of")} ${rules.length} ${t(language, "results")}`}
                    />
                </Box>

                {/* Limitations/info card at the bottom */}
                <Card>
                    <Box padding="400">
                        <Text variant="headingMd">{t(language, "limitations")}</Text>
                        <ul style={{ marginTop: 16, marginBottom: 0, paddingLeft: 20 }}>
                            <li>{t(language, "paymentCustomizationAPIDoesntCurrentlySupportDraftOrders")}</li>
                            <li>{t(language, "youCantRenamePaymentMethodsThatHaveLogos")}</li>
                            <li>{t(language, "paymentCustomizationsArentCompatibleWithShopPayMobileApp")}</li>
                            <li>{t(language, "youCanActivateOnly5PaymentCustomizationMethodsAtATime")}</li>
                            <li>{t(language, "appDoNotHideExpressCheckoutButtonYouHaveToDisableItFromShopifySSettings")}</li>
                        </ul>
                        <Text variant="bodyMd" color="subdued" style={{ marginTop: 16, display: 'block' }}>
                            {t(language, "onceShopifyWillLaunchTheUpdateWeWillUpdateOurAppAccordingly")}
                        </Text>
                    </Box>
                </Card>
            </BlockStack>
        </Page>
    );
}