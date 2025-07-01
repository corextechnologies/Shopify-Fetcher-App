import { useState } from "react";
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

export default function ProductDetailsFetcher() {
  // ✅ Full list of all supported backend fields
  const validAttributes = [
  { label: "Title", value: "title" },
  { label: "Description", value: "description" },
  { label: "Vendor", value: "vendor" },
  { label: "Product Type", value: "productType" },
  { label: "Handle", value: "handle" },
  { label: "Tags", value: "tags" },
  { label: "Status", value: "status" },
  { label: "Total Inventory", value: "totalInventory" },
  { label: "Created At", value: "createdAt" },
  { label: "Updated At", value: "updatedAt" },
  { label: "Published At", value: "publishedAt" },

  // Variants
  { label: "Variant: Title", value: "variant_title" },
  { label: "Variant: Price", value: "variant_price" },
  { label: "Variant: SKU", value: "variant_sku" },
  { label: "Variant: Size", value: "variant_size" },
  { label: "Variant: Color", value: "variant_color" },

  // Images
  { label: "Images (All)", value: "images" },
  { label: "Image Src", value: "image_src" },
  { label: "Image Alt", value: "image_alt" },
];


  const [selectedTab, setSelectedTab] = useState(0);
  const [rows, setRows] = useState([{ attribute: "", fieldValue: "" }]);
  const [format, setFormat] = useState("JSON");
  const [imageSize, setImageSize] = useState("original");
  const [isAppEnabled, setIsAppEnabled] = useState(true);
  const [autoUpdateInterval, setAutoUpdateInterval] = useState("disabled");
  const [apiToken, setApiToken] = useState("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");

  const [storeSetupData, setStoreSetupData] = useState({
    storeName: "Pitchertech",
    storeUrl: "https://pitchertech.myshopify.com",
    language: "english",
    currency: "usd",
    businessField: "fashion",
  });

  const [apiResponse, setApiResponse] = useState(null);
  const [showApiResponse, setShowApiResponse] = useState(false);

  const handleAttributeChange = (value, index) => {
    const newRows = [...rows];
    newRows[index] = { attribute: value, fieldValue: value };
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

  const handleExport = async () => {
    const selectedFields = rows
      .map(row => row.attribute)
      .filter(attr => attr && attr !== "")
      .join(",");

    if (!selectedFields) {
      alert("Please select at least one valid product attribute before exporting.");
      return;
    }

    try {
      const res = await fetch(`/api/export-products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: selectedFields,
          storeSetup: storeSetupData,
        }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();

      const filteredProducts = data.products.map(product => {
        const filtered = {};
        rows.forEach(row => {
          const key = row.attribute;
          if (product[key] !== undefined) {
            filtered[key] = product[key];
          }
        });
        return filtered;
      });

      const exportData = {
        storeSetup: storeSetupData,
        imageSize,
        format,
        selectedAttributes: rows.filter(row => row.attribute && row.fieldValue),
        exportedAt: new Date().toISOString(),
        products: filteredProducts,
      };

      const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(jsonBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "pitchertech-product-export.json";
      a.click();
      URL.revokeObjectURL(url);

      setApiResponse({ ...data, products: filteredProducts });
      setShowApiResponse(true);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to fetch live product data. Export cancelled.");
    }
  };

  const tabs = [
    { id: "basic-setup", content: "Basic Setup", panelID: "basic-setup-content" },
    { id: "store-setup", content: "Store Setup", panelID: "store-setup-content" },
    { id: "data-selection", content: "Data Selection", panelID: "data-selection-content" },
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
    { label: "English", value: "english" }, { label: "Spanish", value: "spanish" },
    { label: "French", value: "french" }, { label: "German", value: "german" },
    { label: "Italian", value: "italian" }, { label: "Japanese", value: "japanese" },
    { label: "Chinese", value: "chinese" }, { label: "Arabic", value: "arabic" },
    { label: "Hindi", value: "hindi" }, { label: "Bengali", value: "bengali" },
    { label: "Portuguese", value: "portuguese" },
  ];

  const currencyOptions = [
    { label: "US Dollar", value: "usd" }, { label: "Euro", value: "euro" },
    { label: "British Pound", value: "gbp" }, { label: "Japanese Yen", value: "jpy" },
    { label: "Canadian Dollar", value: "cad" }, { label: "Australian Dollar", value: "aud" },
    { label: "Indian Rupee", value: "inr" }, { label: "Brazilian Real", value: "brl" },
    { label: "Chinese Yuan", value: "cny" }, { label: "Singapore Dollar", value: "sgd" },
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

  return (
    <Page fullWidth title="Pitchertech Product Export">
      <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />

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
            <Card sectioned>
              <FormLayout>
                <Text variant="headingMd" as="h2">API Token</Text>
                <TextField
                  label="Admin API Token"
                  value={apiToken}
                  onChange={setApiToken}
                />
              </FormLayout>
            </Card>
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
                />
                <TextField
                  label="Store URL"
                  value={storeSetupData.storeUrl}
                  onChange={(value) => setStoreSetupData(prev => ({ ...prev, storeUrl: value }))}
                />
                <Select
                  label="Language"
                  options={languageOptions}
                  value={storeSetupData.language}
                  onChange={(value) => setStoreSetupData(prev => ({ ...prev, language: value }))}
                />
                <Select
                  label="Currency"
                  options={currencyOptions}
                  value={storeSetupData.currency}
                  onChange={(value) => setStoreSetupData(prev => ({ ...prev, currency: value }))}
                />
                <Select
                  label="Business Field"
                  options={businessFieldOptions}
                  value={storeSetupData.businessField}
                  onChange={(value) => setStoreSetupData(prev => ({ ...prev, businessField: value }))}
                />
              </FormLayout>
            </Card>
          </Layout.Section>
        </Layout>
      )}

      {selectedTab === 2 && (
        <Layout>
          <Layout.Section oneHalf>
            <Card sectioned>
              <FormLayout>
                <Text variant="headingMd" as="h2">Image Sizes</Text>
                <Select
                  label="Export Image Size"
                  options={imageSizeOptions}
                  value={imageSize}
                  onChange={setImageSize}
                />
              </FormLayout>
            </Card>

            <Card sectioned>
              <Text variant="headingMd" as="h2">Product Attributes</Text>
              <Divider />
              <FormLayout>
                {rows.map((row, idx) => (
                  <FormLayout.Group key={idx} condensed>
                    <Select
  label="Attribute"
  options={[{ label: "Select attribute...", value: "" }, ...validAttributes]}
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
                        <Button icon={<Icon source={CirclePlusMinor} />} onClick={handleAddRow} />
                      ) : (
                        <Button icon={<Icon source={DeleteMinor} />} onClick={() => handleDeleteRow(idx)} destructive />
                      )}
                    </div>
                  </FormLayout.Group>
                ))}
              </FormLayout>
            </Card>

            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              <Button primary onClick={handleExport}>Export JSON File (Live)</Button>
              {apiResponse && (
                <Button onClick={() => setShowApiResponse(prev => !prev)}>
                  {showApiResponse ? "Hide Response" : "Show Response"}
                </Button>
              )}
            </div>
          </Layout.Section>

          {showApiResponse && (
            <Layout.Section oneHalf>
              <Card title="Live API Response" sectioned>
                <pre style={{ maxHeight: 400, overflowY: "auto", background: "#f6f6f7", padding: 10 }}>
                  {apiResponse ? JSON.stringify(apiResponse, null, 2) : "Export to view data"}
                </pre>
              </Card>
            </Layout.Section>
          )}
        </Layout>
      )}
    </Page>
  );
}
