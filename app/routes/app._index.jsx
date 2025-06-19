// app/routes/_index.jsx or app/routes/dashboard.jsx
// Main dashboard page for the app. Shows navigation, status, and rules table.

// Import core UI components from Shopify Polaris for layout, buttons, cards, and icons
import {
  Page, Card, Button, BlockStack, InlineStack, Text, Box, Badge, DataTable, ButtonGroup, Icon
} from "@shopify/polaris";
// Import specific icons for use in action buttons
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";
// Import React's useState for managing local component state
import { useState } from "react";

// Main dashboard component
export default function DashboardPage() {
  console.log('[app._index.jsx] Component: Render start');
  // State for rules displayed in the table
  const [rules, setRules] = useState([
    {
      id: 1,
      title: "ertetr",
      ruleSetType: "Hide",
      status: true
    },
    {
      id: 2,
      title: "alpha",
      ruleSetType: "Sort",
      status: false
    },
    {
      id: 3,
      title: "beta",
      ruleSetType: "Rename",
      status: true
    },
    {
      id: 4,
      title: "gamma",
      ruleSetType: "Hide",
      status: false
    },
    {
      id: 5,
      title: "delta",
      ruleSetType: "Sort",
      status: true
    },
  ]);

  // Toggle the enabled/disabled status of a rule by its ID
  const toggleRuleStatus = (ruleId) => {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, status: !rule.status } : rule
      )
    );
  };

  // Delete a rule by its ID
  const deleteRule = (ruleId) => {
    setRules(prevRules => prevRules.filter(rule => rule.id !== ruleId));
  };

  // Prepare table rows for displaying rules and their actions
  const tableRows = rules.map(rule => [
    rule.title,
    rule.ruleSetType,
    <Button
      key={`toggle-${rule.id}`}
      variant={rule.status ? "primary" : "tertiary"}
      size="slim"
      onClick={() => toggleRuleStatus(rule.id)}
    >
      {rule.status ? "Enabled" : "Disabled"}
    </Button>,
    <InlineStack key={`actions-${rule.id}`} gap="200">
      <Button
        variant="tertiary"
        size="slim"
        icon={EditIcon}
        onClick={() => console.log(`Edit rule ${rule.id}`)}
        accessibilityLabel="Edit rule"
      />
      <Button
        variant="tertiary"
        size="slim"
        tone="critical"
        icon={DeleteIcon}
        onClick={() => deleteRule(rule.id)}
        accessibilityLabel="Delete rule"
      />
    </InlineStack>
  ]);

  // Calculate dynamic counts for each rule type
  const hideCount = rules.filter(r => r.ruleSetType === "Hide").length;
  const sortCount = rules.filter(r => r.ruleSetType === "Sort").length;
  const renameCount = rules.filter(r => r.ruleSetType === "Rename").length;

  // Main dashboard layout with navigation, status cards, and rules table
  return (
    <Page
      title="Landing Page/ Homepage"
      titleMetadata={<Badge tone="info">Dashboard</Badge>}
    >
      <BlockStack gap="500">
        {/* Navigation buttons for quick access to other pages */}
        <Card>
          <Box padding="400">
            <InlineStack gap="300" wrap={false}>
              <Button
                variant="secondary"
                url="/app/quickSetup"
              >
                Quick Setup Wizard</Button>
              <Button
                variant="primary"
                icon={PlusIcon}
                url="/app/createPaymentRules"
              >
                Create Payment Customization
              </Button>

              <Button variant="tertiary">Settings</Button>
              <Button variant="tertiary">Help Docs</Button>
              <Button variant="tertiary">Support</Button>
            </InlineStack>
          </Box>
        </Card>

        {/* Summary cards at the top (replacing status cards) */}
        <InlineStack gap="400" align="start" blockAlign="center" justify="space-between">
          <Card>
            <Box padding="400" minWidth="260px">
              <Text variant="bodyMd" color="subdued">Active Payment Customizations</Text>
              <Box paddingBlockStart="200">
                <Text variant="headingLg" as="span">0</Text>
                <Text variant="bodyMd" as="span"> /5 Our App active delivery rule(s)</Text>
              </Box>
            </Box>
          </Card>
          <div style={{ flex: 1 }} />
          <Card>
            <Box padding="400" minWidth="260px">
              <Text variant="bodyMd" color="subdued">Your activated / created rules count.</Text>
              <InlineStack gap="200" align="center" blockAlign="center">
                <Box textAlign="center">
                  <Text variant="bodySm" color="subdued" as="div">Hide</Text>
                  <Box>
                    <Text variant="headingMd" as="span">{hideCount}</Text>
                    <Text variant="bodySm" as="span" color="subdued"> /2</Text>
                  </Box>
                </Box>
                <Box textAlign="center">
                  <Text variant="bodySm" color="subdued" as="div">Sort</Text>
                  <Box>
                    <Text variant="headingMd" as="span">{sortCount}</Text>
                    <Text variant="bodySm" as="span" color="subdued"> /2</Text>
                  </Box>
                </Box>
                <Box textAlign="center">
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

        {/* Table of rules with actions */}
        <Card>
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingLg" as="h2">Active Rules Summary</Text>

              {rules.length > 0 ? (
                <DataTable
                  columnContentTypes={['text', 'text', 'text', 'text']}
                  headings={['Title', 'Rule Set Type', 'Status', 'Action']}
                  rows={tableRows}
                />
              ) : (
                <Box padding="800" textAlign="center">
                  <Text variant="bodyMd" color="subdued">
                    No active rules found. Create your first payment customization rule.
                  </Text>
                  <Box paddingBlockStart="400">
                    <Button
                      variant="primary"
                      icon={PlusIcon}
                      url="/app/new-rules"
                    >
                      Create Payment Customization
                    </Button>
                  </Box>
                </Box>
              )}
            </BlockStack>
          </Box>
        </Card>

        {/* Limitations Section */}
        <Card>
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3">Limitations</Text>
              <BlockStack gap="200">
                <Text variant="bodyMd">
                  • The Payment Customization API doesn't currently support draft orders.
                </Text>
                <Text variant="bodyMd">
                  • You can't rename payment methods that have logos.
                </Text>
                <Text variant="bodyMd">
                  • Payment customizations aren't compatible with Shop Pay (Mobile App).
                </Text>
                <Text variant="bodyMd">
                  • You can activate only 5 Payment customization methods at a time.
                </Text>
                <Text variant="bodyMd">
                  • APP do not hide express checkout button, you have to disable it from Shopify's settings.
                </Text>
                <Text variant="bodyMd" color="subdued">
                  Once Shopify will launch the update, we will update our app accordingly.
                </Text>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
      console.log('[app._index.jsx] Returning main JSX');
    </Page>
  );
}