// app/routes/_index.jsx or app/routes/dashboard.jsx

import { Page, Card, Button, BlockStack, InlineStack, Text, Box, Badge, DataTable, ButtonGroup, Icon, } from "@shopify/polaris";
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";
import { useState } from "react";

export default function DashboardPage() {
  console.log("[app._index.jsx] Component: Render");
  const [rules, setRules] = useState([
    {
      id: 1,
      title: "ertetr",
      ruleSetType: "Hide",
      status: true
    }
  ]);

  const toggleRuleStatus = (ruleId) => {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule.id === ruleId ? { ...rule, status: !rule.status } : rule
      )
    );
  };

  const deleteRule = (ruleId) => {
    setRules(prevRules => prevRules.filter(rule => rule.id !== ruleId));
  };

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

  return (
    <Page
      title="Landing Page/ Homepage"
      titleMetadata={<Badge tone="info">Dashboard</Badge>}
    >
      <BlockStack gap="500">
        {/* Top Navigation Buttons */}
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

        {/* Status Cards */}
        <InlineStack gap="400" align="start">
          <Card>
            <Box padding="400">
              <BlockStack gap="200">
                <Text variant="bodyMd" color="subdued">Real-Time Sync :</Text>
                <Badge tone="success">Enabled</Badge>
                <Text variant="bodyMd" color="subdued">Shopify Functions:</Text>
                <Badge tone="success">Installed</Badge>
              </BlockStack>
            </Box>
          </Card>

          <Card>
            <Box padding="400">
              <BlockStack gap="200">
                <Text variant="bodyMd" color="subdued">Payment Method Rules:</Text>
                <Text variant="headingMd">2 rules</Text>
                <Text variant="bodyMd" color="subdued">Shipping Method Rules :</Text>
                <Text variant="headingMd">8 rules</Text>
              </BlockStack>
            </Box>
          </Card>
        </InlineStack>

        {/* Active Rules Summary */}
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
    </Page>
  );
}