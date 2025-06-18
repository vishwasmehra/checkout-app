import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";


export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  console.log("[app.jsx] Loader: Start");
  await authenticate.admin(request);
  console.log("[app.jsx] Loader: After authenticate.admin");
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  console.log("[app.jsx] Component: Render");
  const { apiKey } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <NavMenu>
        <Link to="/app" rel="home">
          Home
        </Link>
        <Link to="/app/additional">Additional page</Link>
        <Link to="/app/quickSetup">Quic Setup Wizard</Link>
        <Link to="/app/createPaymentRules">Create Payment Rule</Link>
        <Link to="/app/support">Support</Link>

      </NavMenu>
      <Outlet />
    </AppProvider>



  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  console.log("[app.jsx] ErrorBoundary: Render");
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  console.log("[app.jsx] headers: Called");
  return boundary.headers(headersArgs);
};
