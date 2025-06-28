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
  const validAttributes = [
    "title", "description", "vendor", "productType", "handle", "tags", "status",
    "totalInventory", "createdAt", "updatedAt", "publishedAt", "variants", "images",
  ];

  const [selectedTab, setSelectedTab] = useState(0);
  const [rows, setRows] = useState([{ attribute: "", fieldValue: "" }]);
  const [note, setNote] = useState("");
  const [format, setFormat] = useState("JSON");
  const [imageSize, setImageSize] = useState("original");
  const [isAppEnabled, setIsAppEnabled] = useState(true);
  const [autoUpdateInterval, setAutoUpdateInterval] = useState("disabled");
  const [apiToken] = useState("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");

  const [storeSetupData, setStoreSetupData] = useState({
    storeName: "CoreX Tech Store",
    storeUrl: "https://corex-tech.myshopify.com",
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

  const handleApiFetch = async () => {
  const selectedFields = rows
    .map(row => row.attribute)
    .filter(attr => attr && attr !== "")
    .join(",");

  if (!selectedFields) {
    alert("Please select at least one valid product attribute.");
    return;
  }

  try {
    const res = await fetch(`/api/export-products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: selectedFields,
        storeSetup: storeSetupData, // ✅ Send manual store setup entered by user
      }),
    });

    const data = await res.json();

    const filtered = {
      ...data,
      products: data.products.map(product => {
        const filteredProduct = {};
        rows.forEach(row => {
          const key = row.attribute;
          if (product[key] !== undefined) {
            filteredProduct[key] = product[key];
          }
        });
        return filteredProduct;
      }),
    };

    console.log("Filtered Live API Response:", filtered);
    setApiResponse(filtered);
    setShowApiResponse(true);
  } catch (error) {
    console.error("Error fetching API data:", error);
    setApiResponse({ error: "Failed to fetch API data." });
    setShowApiResponse(true);
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
    <Page fullWidth title="App Configuration">
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
          </Layout.Section>
          <Layout.Section>
            <Card sectioned>
              <FormLayout>
                <Text variant="headingMd" as="h2">API Token Management</Text>
                <TextField label="Current API Token" value={apiToken} readOnly disabled />
                <Button disabled>Regenerate Token</Button>
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
                  helpText="Enter the name of your store"
                />
                <TextField
                  label="Store URL"
                  value={storeSetupData.storeUrl}
                  onChange={(value) => setStoreSetupData(prev => ({ ...prev, storeUrl: value }))}
                  helpText="Enter your Shopify store URL"
                />
                <Select
                  label="Choose Language"
                  options={languageOptions}
                  value={storeSetupData.language}
                  onChange={(value) => setStoreSetupData(prev => ({ ...prev, language: value }))}
                />
                <Select
                  label="Choose Currency"
                  options={currencyOptions}
                  value={storeSetupData.currency}
                  onChange={(value) => setStoreSetupData(prev => ({ ...prev, currency: value }))}
                />
                <Select
                  label="Choose Business Field"
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
                  label="Select image size for export"
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
                      options={[{ label: "Select attribute...", value: "" }, ...validAttributes.map(attr => ({ label: attr, value: attr }))]}
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

            <div style={{ margin: "20px 0", display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Button primary onClick={handleExport}>Export JSON File</Button>
              <Button onClick={handleApiFetch}>Get Live API Data - JSON</Button>
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
                  {apiResponse ? JSON.stringify(apiResponse, null, 2) : "Click 'Get Live Data' to view Shopify data"}
                </pre>
              </Card>
            </Layout.Section>
          )}
        </Layout>
      )}
    </Page>
  );
}
