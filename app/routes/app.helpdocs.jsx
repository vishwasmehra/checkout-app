import { Page, Card, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function HelpDocsPage() {
    return (
        <Page>
            <TitleBar title="Help Docs" />
            <Layout>
                <Layout.Section>
                    <Card>
                        <h1>Help Docs</h1>
                        <p>This is the help documentation page.</p>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
} 