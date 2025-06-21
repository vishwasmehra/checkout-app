import { Page, Card, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function SettingsPage() {
    return (
        <Page>
            <TitleBar title="Settings" />
            <Layout>
                <Layout.Section>
                    <Card>
                        <h1>Settings</h1>
                        <p>This is the settings page.</p>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
} 