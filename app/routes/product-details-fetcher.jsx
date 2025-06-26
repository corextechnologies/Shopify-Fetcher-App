import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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

export default function SelectAttributes() {
  const { productAttributes } = useLoaderData();

  const [selectedTab, setSelectedTab] = useState(0);

  // Data Selection State
  const [rows, setRows] = useState([{ attribute: "", fieldValue: "" }]);
  const [note, setNote] = useState("");
  const [format, setFormat] = useState("JSON");
  const [imageSize, setImageSize] = useState("original");

  // Basic Setup State
  const [isAppEnabled, setIsAppEnabled] = useState(true);
  const [autoUpdateInterval, setAutoUpdateInterval] = useState("disabled");
  const [apiToken, setApiToken] = useState(generateToken());

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
    const incomplete = rows.some(r => !r.attribute || !r.fieldValue);
    if (incomplete) {
      alert("Please fill out all attribute rows before exporting.");
      return;
    }

    const processed = rows.map(r => {
      if (r.attribute === "images") {
        return {
          ...r,
          resized: imageSize === "original"
            ? "{image.src}"
            : `{image.src}?width=${imageSize.split("x")[0]}`
        };
      }
      return r;
    });

    const exportData = {
      note,
      format,
      imageSize,
      rows: processed,
    };

    console.log("Exported Data:", exportData);
    alert("Export successful. Check console.");
  };

  const tabs = [
    {
      id: "basic-setup",
      content: "Basic Setup",
      panelID: "basic-setup-content",
    },
    {
      id: "data-selection",
      content: "Data Selection",
      panelID: "data-selection-content",
    },
  ];

  return (
    <Page fullWidth title="App Configuration">
      <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab}>
        <div>
          {selectedTab === 0 && (
            <Layout>
              <Layout.Section>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
                </div>
              </Layout.Section>

              <Layout.Section>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                  <Card sectioned>
                    <FormLayout>
                      <Text variant="headingMd" as="h2">API Token Management</Text>
                      <TextField
                        label="Current API Token"
                        value={apiToken}
                        readOnly
                        disabled
                      />
                      <Button onClick={() => setApiToken(generateToken())}>
                        Regenerate Token
                      </Button>
                    </FormLayout>
                  </Card>
                </div>
              </Layout.Section>
            </Layout>
          )}

          {selectedTab === 1 && (
            <Layout>
              <Layout.Section>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
                </div>
              </Layout.Section>

              <Layout.Section>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
                </div>
              </Layout.Section>

              <Layout.Section>
                <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                  <Card sectioned>
                    <FormLayout>
                      <Text variant="headingMd" as="h2">Export Configuration</Text>
                      <TextField
                        label="Export Note"
                        value={note}
                        onChange={setNote}
                        placeholder="Optional description"
                      />
                      <Select
                        label="Format"
                        options={formatOptions}
                        onChange={setFormat}
                        value={format}
                      />
                      <Button primary onClick={handleExport}>Export Attributes</Button>
                    </FormLayout>
                  </Card>
                </div>
              </Layout.Section>
            </Layout>
          )}
        </div>
      </Tabs>
    </Page>
  );
}
