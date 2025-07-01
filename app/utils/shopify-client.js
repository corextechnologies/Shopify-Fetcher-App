import createApp from "@shopify/app-bridge";
import { authenticatedFetch } from "@shopify/app-bridge-utils";

const getShopifyFetch = () => {
  const app = createApp({
    apiKey: process.env.SHOPIFY_API_KEY,
    shopOrigin: window?.Shopify?.shop, // Ensure you're inside the Shopify Admin
    host: new URLSearchParams(location.search).get("host"),
    forceRedirect: true,
  });

  return authenticatedFetch(app);
};

export default getShopifyFetch;
