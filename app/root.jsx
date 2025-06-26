import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "@remix-run/react";

import "@shopify/polaris/build/esm/styles.css";
import en from "@shopify/polaris/locales/en.json";

import {
  AppProvider,
  Frame,
  Navigation,
  TopBar,
} from "@shopify/polaris";
import {
  ProductsMajor,
  SettingsMajor,
} from "@shopify/polaris-icons";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: "Product Details",
      icon: ProductsMajor,
      url: "/product-details-fetcher",
      onClick: () => navigate("/product-details-fetcher"),
      selected: location.pathname === "/product-details-fetcher",
    },
    {
      label: "Store Setup",
      icon: SettingsMajor,
      url: "/store-setup",
      onClick: () => navigate("/store-setup"),
      selected: location.pathname === "/store-setup",
    },
  ];

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
          <Frame
            navigation={
              <Navigation location={location.pathname}>
                <Navigation.Section
                  title="App Pages"
                  items={navigationItems}
                />
              </Navigation>
            }
          >
            <Outlet />
          </Frame>
          <ScrollRestoration />
          <Scripts />
        </AppProvider>
      </body>
    </html>
  );
}
