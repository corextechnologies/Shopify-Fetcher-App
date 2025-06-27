import { useState } from "react";
import { json } from "@remix-run/node";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  Text,
  TextField,
  Select,
  Button,
  Divider,
  Tabs,
  Checkbox,
  Icon,
} from "@shopify/polaris";
import { CirclePlusMinor, DeleteMinor } from "@shopify/polaris-icons";

export const loader = async () => {
  const productAttributes = [
    "id", "title", "body_html", "vendor", "product_type", "tags",
    "created_at", "handle", "variants", "images", "status", "published_scope",
    "template_suffix", "published_at", "admin_graphql_api_id", "product_url",
    "price", "sku", "barcode", "weight", "compare_at_price",
    "inventory_quantity", "inventory_management"
  ];
  return json({ productAttributes });
};

export default function ProductDetailsFetcher() {
  const [productAttributes] = useState([
    "id", "title", "body_html", "vendor", "product_type", "tags",
    "created_at", "handle", "variants", "images", "status", "published_scope",
    "template_suffix", "published_at", "admin_graphql_api_id", "product_url",
    "price", "sku", "barcode", "weight", "compare_at_price",
    "inventory_quantity", "inventory_management"
  ]);

  const [selectedTab, setSelectedTab] = useState(0);

  // Data Selection
  const [rows, setRows] = useState([{ attribute: "", fieldValue: "" }]);
  const [note, setNote] = useState("");
  const [format, setFormat] = useState("JSON");
  const [imageSize, setImageSize] = useState("original");

  // Basic Setup
  const [isAppEnabled, setIsAppEnabled] = useState(true);
  const [autoUpdateInterval, setAutoUpdateInterval] = useState("disabled");
  const [apiToken, setApiToken] = useState(generateToken());

  // Store Setup
  const [storeSetupData, setStoreSetupData] = useState({
    storeName: "",
    storeUrl: "",
    language: "english",
    currency: "usd",
    businessField: "fashion",
  });

  function generateToken() {
    return Math.random().toString(36).substring(2, 16);
  }

  const handleAttributeChange = (value, index) => {
    const newRows = [...rows];
    newRows[index] = {
      attribute: value,
      fieldValue: value ? value.replace(/\s+/g, "_").toLowerCase() : "",
    };
    setRows(newRows);
  };

  const handleFieldChange = (value, index) => {
    const newRows = [...rows];
    newRows[index].fieldValue = value;
    setRows(newRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { attribute: "", fieldValue: "" }]);
  };

  const handleDeleteRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleExport = () => {
    const exportData = {
      apiToken,
      storeSetup: storeSetupData,
      selectedAttributes: rows.filter(row => row.attribute && row.fieldValue),
      imageSize,
      format,
      note,
    };

    const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatOptions = [
    { label: "JSON", value: "JSON" },
    { label: "CSV", value: "CSV" },
  ];

  const imageSizeOptions = [
    { label: "Original", value: "original" },
    { label: "Thumbnail", value: "100x100" },
    { label: "Medium", value: "300x300" },
    { label: "Medium Large", value: "600x600" },
    { label: "Large", value: "1024x1024" },
    { label: "1536x1536", value: "1536x1536" },
    { label: "2048x2048", value: "2048x2048" },
  ];

  const autoUpdateOptions = [
    { label: "Every 5 seconds", value: "5s" },
    { label: "Every 1 minute", value: "1m" },
    { label: "Every 5 minutes", value: "5m" },
    { label: "Hourly", value: "1h" },
    { label: "Daily", value: "1d" },
    { label: "Weekly", value: "1w" },
    { label: "Disable Auto-Update", value: "disabled" },
  ];

  const languageOptions = [
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
  ];

  const currencyOptions = [
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
  ];

  const businessFieldOptions = [
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
  ];

  const tabs = [
    { id: "basic-setup", content: "Basic Setup", panelID: "basic-setup-content" },
    { id: "store-setup", content: "Store Setup", panelID: "store-setup-content" },
    { id: "data-selection", content: "Data Selection", panelID: "data-selection-content" },
    
  ];

  return (
    <Page fullWidth title="App Configuration">
      <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
        <div>
          {selectedTab === 0 && (
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <FormLayout>
                    <Text variant="headingMd" as="h2">App Settings</Text>
                    <Checkbox
                      label="Enable App"
                      checked={isAppEnabled}
                      onChange={setIsAppEnabled}
                    />
                    <Select
                      label="Auto-update interval"
                      options={autoUpdateOptions}
                      value={autoUpdateInterval}
                      onChange={setAutoUpdateInterval}
                    />
                  </FormLayout>
                </Card>
              </Layout.Section>
              <Layout.Section>
                <Card sectioned>
                  <FormLayout>
                    <Text variant="headingMd" as="h2">API Token Management</Text>
                    <TextField label="Current API Token" value={apiToken} readOnly disabled />
                    <Button onClick={() => setApiToken(generateToken())}>
                      Regenerate Token
                    </Button>
                  </FormLayout>
                </Card>
              </Layout.Section>
            </Layout>
          )}

          {selectedTab === 2 && (
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <FormLayout>
                    <Text variant="headingMd" as="h2">Image Sizes</Text>
                    <Select
                      label="Select image size for export"
                      options={imageSizeOptions}
                      value={imageSize}
                      onChange={setImageSize}
                    />
                  </FormLayout>
                </Card>
              </Layout.Section>

              <Layout.Section>
                <Card sectioned>
                  <Text variant="headingMd" as="h2">Product Attributes</Text>
                  <Divider />
                  <div style={{ marginTop: 16 }} />
                  <FormLayout>
                    {rows.map((row, idx) => (
                      <FormLayout.Group key={idx} condensed>
                        <Select
                          label="Attribute"
                          options={[
                            { label: "Select attribute...", value: "" },
                            ...productAttributes.map(attr => ({
                              label: attr,
                              value: attr,
                            }))
                          ]}
                          value={row.attribute}
                          onChange={(value) => handleAttributeChange(value, idx)}
                        />
                        <TextField
                          label="Field Name"
                          value={row.fieldValue}
                          onChange={(value) => handleFieldChange(value, idx)}
                        />
                        <div style={{ display: "flex", alignItems: "center", paddingTop: "25px" }}>
                          {idx === rows.length - 1 ? (
                            <Button
                              icon={<Icon source={CirclePlusMinor} color="base" />}
                              onClick={handleAddRow}
                              accessibilityLabel="Add row"
                            />
                          ) : (
                            <Button
                              icon={<Icon source={DeleteMinor} color="base" />}
                              onClick={() => handleDeleteRow(idx)}
                              destructive
                              accessibilityLabel="Remove row"
                            />
                          )}
                        </div>
                      </FormLayout.Group>
                    ))}
                  </FormLayout>
                </Card>
                <div style={{ margin: "20px", textAlign: "center" }}>
                  <Button primary onClick={handleExport}>Export JSON</Button>
                </div>
              </Layout.Section>
            </Layout>
          )}

          {selectedTab === 1 && (
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <FormLayout>
                    <TextField
                      label="Store Name"
                      value={storeSetupData.storeName}
                      onChange={(value) => setStoreSetupData(prev => ({ ...prev, storeName: value }))}
                      placeholder="My Online Store"
                      helpText="Enter the name of your store"
                    />
                    <TextField
                      label="Store URL"
                      value={storeSetupData.storeUrl}
                      onChange={(value) => setStoreSetupData(prev => ({ ...prev, storeUrl: value }))}
                      placeholder="https://example.myshopify.com"
                      helpText="Enter your Shopify store URL"
                    />
                    <Select
                      label="Choose Language"
                      options={languageOptions}
                      value={storeSetupData.language}
                      onChange={(value) => setStoreSetupData(prev => ({ ...prev, language: value }))}
                      helpText="Select your store's primary language"
                    />
                    <Select
                      label="Choose Currency"
                      options={currencyOptions}
                      value={storeSetupData.currency}
                      onChange={(value) => setStoreSetupData(prev => ({ ...prev, currency: value }))}
                      helpText="Select the default currency for your store"
                    />
                    <Select
                      label="Choose Business Field"
                      options={businessFieldOptions}
                      value={storeSetupData.businessField}
                      onChange={(value) => setStoreSetupData(prev => ({ ...prev, businessField: value }))}
                      helpText="Select your primary business category"
                    />
                  </FormLayout>
                </Card>
              </Layout.Section>
            </Layout>
          )}
        </div>
      </Tabs>
    </Page>
  );
}
