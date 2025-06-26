import { useState, useMemo } from "react";
import {
  Page,
  Card,
  Layout,
  TextField,
  Select,
  FormLayout,
} from "@shopify/polaris";

export default function StoreSetup() {
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [language, setLanguage] = useState("english");
  const [currency, setCurrency] = useState("usd");
  const [businessField, setBusinessField] = useState("fashion");

  const languageOptions = useMemo(
    () => [
      { label: "English", value: "english" },
      { label: "Spanish", value: "spanish" },
      { label: "French", value: "french" },
      { label: "German", value: "german" },
      { label: "Italian", value: "italian" },
      { label: "Japanese", value: "japanese" },
      { label: "Chinese", value: "chinese" },
      { label: "Arabic", value: "arabic" },
      { label: "Hindi", value: "hindi" },
      { label: "Bengali", value: "bengali" },
      { label: "Portuguese", value: "portuguese" },
    ],
    []
  );

  const currencyOptions = useMemo(
    () => [
      { label: "US Dollar", value: "usd" },
      { label: "Euro", value: "euro" },
      { label: "British Pound", value: "gbp" },
      { label: "Japanese Yen", value: "jpy" },
      { label: "Canadian Dollar", value: "cad" },
      { label: "Australian Dollar", value: "aud" },
      { label: "Indian Rupee", value: "inr" },
      { label: "Brazilian Real", value: "brl" },
      { label: "Chinese Yuan", value: "cny" },
      { label: "Singapore Dollar", value: "sgd" },
    ],
    []
  );

  const businessFieldOptions = useMemo(
    () => [
      { label: "Fashion & Apparel", value: "fashion" },
      { label: "Electronics", value: "electronics" },
      { label: "Home & Garden", value: "home_garden" },
      { label: "Health & Beauty", value: "health_beauty" },
      { label: "Food & Beverages", value: "food_beverages" },
      { label: "Books & Media", value: "books_media" },
      { label: "Sports & Outdoors", value: "sports_outdoors" },
      { label: "Toys & Hobbies", value: "toys_hobbies" },
      { label: "Automotive", value: "automotive" },
      { label: "Jewelry & Accessories", value: "jewelry_accessories" },
      { label: "Craft Supplies", value: "craft_supplies" },
      { label: "Digital Products", value: "digital_products" },
      { label: "Services", value: "services" },
      { label: "Other", value: "other" },
    ],
    []
  );

  return (
    <Page fullWidth title="Store Setup">
      <Layout>
        <Layout.Section>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Card sectioned>
              <FormLayout>
                <TextField
                  label="Store Name"
                  value={storeName}
                  onChange={setStoreName}
                  placeholder="My Online Store"
                  helpText="Enter the name of your store"
                  autoComplete="off"
                />
                <TextField
                  label="Store URL"
                  value={storeUrl}
                  onChange={setStoreUrl}
                  placeholder="https://example.myshopify.com"
                  helpText="Enter your Shopify store URL"
                  autoComplete="off"
                />
                <Select
                  label="Choose Language"
                  options={languageOptions}
                  value={language}
                  onChange={setLanguage}
                  helpText="Select your store's primary language"
                />
                <Select
                  label="Choose Currency"
                  options={currencyOptions}
                  value={currency}
                  onChange={setCurrency}
                  helpText="Select the default currency for your store"
                />
                <Select
                  label="Choose Business Field"
                  options={businessFieldOptions}
                  value={businessField}
                  onChange={setBusinessField}
                  helpText="Select your primary business category"
                />
              </FormLayout>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
