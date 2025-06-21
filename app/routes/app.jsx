// app/routes/app.jsx
// Main app layout and navigation for all /app/* routes.

// Import Remix and Shopify utilities for routing, navigation, and app context
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import * as indexRoute from "./app._index.jsx";
import { Icon } from "@shopify/polaris";
import { HomeIcon, PlusIcon, SettingsIcon, BookIcon, PhoneIcon, NoteIcon, PageIcon } from "@shopify/polaris-icons";

// Provide Polaris styles to the app
export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

// Loader to authenticate admin and provide Shopify API key to the app
export const loader = async ({ request }) => {
  console.log("[app.jsx] Loader: Start");
  await authenticate.admin(request);
  console.log("[app.jsx] Loader: After authenticate.admin");
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

// Main app layout component for all /app/* routes
export default function App() {
  console.log("[app.jsx] Component: Render");
  const { apiKey } = useLoaderData();

  // AppProvider wraps the app with Shopify context; NavMenu provides navigation links
  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        {/* Navigation links for all main app pages */}
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/quickSetup">
          Quick Template
        </Link>
        <Link to="/app/createPaymentRules">
          Create Payment Rule
        </Link>
        <Link to="/app/settings">
          Settings
        </Link>
        <Link to="/app/helpdocs">
          Help Docs
        </Link>
        <Link to="/app/support">
          Support
        </Link>
      </NavMenu>
      {/* Renders the matched child route */}
      <Outlet />
    </AppProvider>
  );
}

// Error boundary for catching thrown responses and rendering error UI
export function ErrorBoundary() {
  console.log("[app.jsx] ErrorBoundary: Render");
  return boundary.error(useRouteError());
}

// Set custom headers for Shopify requirements
export const headers = (headersArgs) => {
  console.log("[app.jsx] headers: Called");
  return boundary.headers(headersArgs);
};

export const action = indexRoute.action;
