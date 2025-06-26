import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "@shopify/polaris/build/esm/styles.css";
import en from "@shopify/polaris/locales/en.json";

// ✅ Correct CommonJS interop fix for Vite
import * as Polaris from "@shopify/polaris";
const { AppProvider } = Polaris;

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider i18n={en}>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </AppProvider>
      </body>
    </html>
  );
}
