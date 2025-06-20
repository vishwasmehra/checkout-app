// app/routes/_index.jsx or app/routes/dashboard.jsx
// Main dashboard page for the app. Shows navigation, status, and rules table.

// Import core UI components from Shopify Polaris for layout, buttons, cards, and icons
import {
  Page, Card, Button, BlockStack, InlineStack, Text, Box, Badge, DataTable, ButtonGroup, Icon, Select, Modal, TextField, Checkbox
} from "@shopify/polaris";
// Import specific icons for use in action buttons
import { PlusIcon, EditIcon, DeleteIcon } from "@shopify/polaris-icons";
// Import React's useState for managing local component state
import { useState, useEffect, useRef } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import { parse } from "cookie";
import prisma from "~/db.server";
import RuleForm from "../RuleForm";
import { authenticate } from "../shopify.server";
import { t, translations } from "../translations";
import ToggleSwitch from "../components/ToggleSwitch";

// Loader to get language from session or cookie
export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  let language = "en";
  let dbSession = null;
  if (session) {
    dbSession = await prisma.session.findUnique({ where: { id: session.id } });
    if (dbSession && dbSession.language) language = dbSession.language;
  }
  if (!language) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const { parse } = await import("cookie");
    const cookies = parse(cookieHeader);
    language = cookies.language || "en";
  }
  console.log("LOADER: session.language", dbSession?.language, "cookie", language);
  // Fetch rules from the database
  const rules = await prisma.rule.findMany({ orderBy: { createdAt: "desc" } });
  return json({ language, rules });
}

export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log("ACTION: intent", intent, "language", formData.get("language"));
  if (intent === "updateLanguage") {
    const { session } = await authenticate.admin(request);
    if (session) {
      await prisma.session.update({
        where: { id: session.id },
        data: { language: formData.get("language") },
      });
      return json({ success: true });
    }
    return json({ success: false });
  }
  if (intent === "delete") {
    const id = formData.get("id");
    await prisma.rule.delete({ where: { id: String(id) } });
    return json({ success: true });
  }
  if (intent === "edit") {
    const id = formData.get("id");
    await prisma.rule.update({
      where: { id: String(id) },
      data: {
        title: formData.get("title"),
        ruleSetType: formData.get("action"),
        condition: formData.get("condition"),
        operator: formData.get("operator"),
        value: formData.get("value"),
        thenAction: formData.get("thenAction")
      }
    });
    return json({ success: true });
  }
  if (intent === "toggle") {
    const id = formData.get("id");
    const status = formData.get("status") === 'true';
    await prisma.rule.update({
      where: { id: String(id) },
      data: { status }
    });
    return json({ success: true });
  }
  return json({});
}

// Main dashboard component
export default function DashboardPage() {
  const { language, rules } = useLoaderData();
  console.log("Current language:", language);
  console.log("Current translations:", translations[language]);
  const navigation = useNavigation();
  const [editModalActive, setEditModalActive] = useState(false);
  const [editRule, setEditRule] = useState(null);
  const [editFields, setEditFields] = useState({ title: '', ruleSetType: '', condition: '', operator: '', value: '', thenAction: '' });
  const formRef = useRef();
  const langInputRef = useRef();

  // Language options
  const languageOptions = [
    { label: t(language, "home"), value: "en" },
    { label: "Français", value: "fr" },
    { label: "Deutsch", value: "de" },
    { label: "Русский", value: "ru" },
    { label: "हिन्दी", value: "hi" },
    { label: "Español", value: "es" },
    { label: "Italiano", value: "it" },
    { label: "中文", value: "zh" },
    { label: "日本語", value: "ja" },
    { label: "العربية", value: "ar" },
    { label: "Português", value: "pt" },
    { label: "Türkçe", value: "tr" },
    { label: "한국어", value: "ko" },
    { label: "Nederlands", value: "nl" },
    { label: "Polski", value: "pl" }
  ];

  // Handler to open edit modal
  const handleEdit = (rule) => {
    setEditRule(rule);
    setEditFields({
      title: rule.title || '',
      ruleSetType: rule.ruleSetType || '',
      condition: rule.condition || '',
      operator: rule.operator || '',
      value: rule.value || '',
      thenAction: rule.thenAction || ''
    });
    setEditModalActive(true);
  };

  // Handler to toggle status
  const handleToggleStatus = async (rule) => {
    await fetch(`/app?_data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        intent: 'toggle',
        id: rule.id,
        status: (!rule.status).toString()
      })
    });
    window.location.reload();
  };

  // Use rules from loader for table and counts
  const hideTotal = rules.filter(r => r.ruleSetType === "Hide").length;
  const hideActive = rules.filter(r => r.ruleSetType === "Hide" && r.status).length;
  const sortTotal = rules.filter(r => r.ruleSetType === "Sort").length;
  const sortActive = rules.filter(r => r.ruleSetType === "Sort" && r.status).length;
  const renameTotal = rules.filter(r => r.ruleSetType === "Rename").length;
  const renameActive = rules.filter(r => r.ruleSetType === "Rename" && r.status).length;

  // Prepare table rows for displaying rules and their actions
  const tableRows = rules.map(rule => {
    let formRef = null;
    return [
      rule.title,
      rule.ruleSetType,
      <Form method="post" ref={el => (formRef = el)}>
        <input type="hidden" name="intent" value="toggle" />
        <input type="hidden" name="id" value={rule.id} />
        <input type="hidden" name="status" value={!rule.status} />
        <ToggleSwitch
          checked={rule.status}
          onChange={() => {
            if (formRef) formRef.requestSubmit();
          }}
        />
      </Form>,
      <ButtonGroup key={`actions-${rule.id}`}>
        <Button plain icon={EditIcon} onClick={() => handleEdit(rule)} />
        <Form method="post">
          <input type="hidden" name="id" value={rule.id} />
          <input type="hidden" name="intent" value="delete" />
          <Button
            variant="tertiary"
            size="slim"
            tone="critical"
            accessibilityLabel="Delete rule"
            submit
            loading={navigation.state === 'submitting'}
          >
            🗑️
          </Button>
        </Form>
      </ButtonGroup>
    ];
  });

  // On language change, update cookie and state
  async function handleLanguageChange(newLang) {
    document.cookie = `language=${newLang}; path=/;`;
    if (formRef.current && langInputRef.current) {
      langInputRef.current.value = newLang;
      formRef.current.requestSubmit();
    }
  }

  // Main dashboard layout with navigation, status cards, and rules table
  return (
    <Page
      title={t(language, "appTitle")}
      titleMetadata={<Badge tone="info">{t(language, "dashboard")}</Badge>}
    >
      <BlockStack gap="500">
        {/* Navigation buttons for quick access to other pages */}
        <Card>
          <Box padding="400">
            <InlineStack gap="300" wrap={false}>
              <Button variant="primary" url="/app">{t(language, "home")}</Button>
              <Button variant="tertiary" url="/app/quickSetup">{t(language, "quickTemplate")}</Button>
              <Button variant="secondary" url="/app/createPaymentRules">{t(language, "createNewRule")}</Button>
              <Button variant="tertiary">{t(language, "settings")}</Button>
              <Button variant="tertiary">{t(language, "helpDocs")}</Button>
              <Button variant="tertiary" url="/app/support">{t(language, "support")}</Button>
              <Box minWidth="180px">
                <Select
                  label="Language"
                  labelHidden
                  options={languageOptions}
                  value={language}
                  onChange={handleLanguageChange}
                />
              </Box>
            </InlineStack>
          </Box>
        </Card>

        {/* Summary cards at the top (replacing status cards) */}
        <InlineStack gap="400" align="start" blockAlign="center" justify="space-between">
          <Card>
            <Box padding="400" minWidth="260px">
              <Text variant="bodyMd" color="subdued">{t(language, "activePayment")}</Text>
              <Box paddingBlockStart="200">
                <Text variant="headingLg" as="span">0</Text>
                <Text variant="bodyMd" as="span"> /5 {t(language, "ourAppActive")}</Text>
              </Box>
            </Box>
          </Card>
          <div style={{ flex: 1 }} />
          <Card>
            <Box padding="400" minWidth="260px">
              <Text variant="bodyMd" color="subdued">{t(language, "yourRules")}</Text>
              <InlineStack gap="200" align="center" blockAlign="center">
                <Box style={{ textAlign: "center" }}>
                  <Text variant="bodySm" color="subdued" as="div">{t(language, "hide")}</Text>
                  <Box>
                    <Text variant="headingMd" as="span">{hideActive}/{hideTotal}</Text>
                  </Box>
                </Box>
                <Box style={{ textAlign: "center" }}>
                  <Text variant="bodySm" color="subdued" as="div">{t(language, "sort")}</Text>
                  <Box>
                    <Text variant="headingMd" as="span">{sortActive}/{sortTotal}</Text>
                  </Box>
                </Box>
                <Box style={{ textAlign: "center" }}>
                  <Text variant="bodySm" color="subdued" as="div">{t(language, "rename")}</Text>
                  <Box>
                    <Text variant="headingMd" as="span">{renameActive}/{renameTotal}</Text>
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
              <Text variant="headingLg" as="h2">{t(language, "activeRulesSummary")}</Text>
              {rules.length > 0 ? (
                <DataTable
                  columnContentTypes={['text', 'text', 'text', 'text']}
                  headings={[t(language, "title"), t(language, "ruleSetType"), t(language, "status"), t(language, "action")]}
                  rows={tableRows}
                />
              ) : (
                <Box padding="800" style={{ textAlign: 'center' }}>
                  <Text variant="bodyMd" color="subdued">
                    {t(language, "noActiveRules")}
                  </Text>
                </Box>
              )}
            </BlockStack>
          </Box>
        </Card>

        {/* Limitations Section */}
        <Card>
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h3">{t(language, "limitations")}</Text>
              <BlockStack gap="200">
                <Text variant="bodyMd">{t(language, "limitation1")}</Text>
                <Text variant="bodyMd">{t(language, "limitation2")}</Text>
                <Text variant="bodyMd">{t(language, "limitation3")}</Text>
                <Text variant="bodyMd">{t(language, "limitation4")}</Text>
                <Text variant="bodyMd">{t(language, "limitation5")}</Text>
                <Text variant="bodyMd" color="subdued">
                  {t(language, "limitation6")}
                </Text>
              </BlockStack>
            </BlockStack>
          </Box>
        </Card>
      </BlockStack>
      <Modal
        open={editModalActive}
        onClose={() => setEditModalActive(false)}
        title="Edit Rule"
        primaryAction={undefined}
      >
        <Modal.Section>
          {editRule && (
            <RuleForm
              type={editFields.ruleSetType}
              title={editFields.title}
              setTitle={v => setEditFields(f => ({ ...f, title: v }))}
              action={editFields.ruleSetType}
              setAction={v => setEditFields(f => ({ ...f, ruleSetType: v }))}
              condition={editFields.condition}
              setCondition={v => setEditFields(f => ({ ...f, condition: v }))}
              operator={editFields.operator}
              setOperator={v => setEditFields(f => ({ ...f, operator: v }))}
              value={editFields.value}
              setValue={v => setEditFields(f => ({ ...f, value: v }))}
              thenAction={editFields.thenAction}
              setThenAction={v => setEditFields(f => ({ ...f, thenAction: v }))}
              navigation={navigation}
              isEdit={true}
              editId={editRule.id}
              editIntent="edit"
            />
          )}
        </Modal.Section>
      </Modal>
      <Form method="post" action="/app?_data" ref={formRef} style={{ display: 'none' }}>
        <input type="hidden" name="intent" value="updateLanguage" />
        <input type="hidden" name="language" ref={langInputRef} defaultValue={language} />
      </Form>
    </Page>
  );
}