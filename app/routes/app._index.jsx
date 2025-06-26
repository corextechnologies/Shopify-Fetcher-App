import { useEffect } from "react";
import { useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];

  const response = await admin.graphql(
    `#graphql
     mutation populateProduct($product: ProductCreateInput!) {
       productCreate(product: $product) {
         product {
           id
           title
           handle
           status
           variants(first: 10) {
             edges {
               node {
                 id
                 price
                 barcode
                 createdAt
               }
             }
           }
         }
       }
     }`,
    {
      variables: {
        product: {
          title: `${color} Snowboard`,
        },
      },
    }
  );

  const data = await response.json();
  const product = data.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;

  const variantResponse = await admin.graphql(
    `#graphql
     mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
       productVariantsBulkUpdate(productId: $productId, variants: $variants) {
         productVariants {
           id
           price
           barcode
           createdAt
         }
       }
     }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    }
  );

  const variantData = await variantResponse.json();

  return {
    product,
    variant: variantData.data.productVariantsBulkUpdate.productVariants,
  };
};

export default function Index() {
  const fetcher = useFetcher();
  const app = useAppBridge();
  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";

  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    ""
  );

  useEffect(() => {
    if (productId) {
      app.toast.show("Product created");
    }
  }, [productId, app]);

  const generateProduct = () => {
    fetcher.submit({}, { method: "POST" });
  };

  return (
    <Page>
      <TitleBar title="Remix app template">
        <Button primary onClick={generateProduct}>
          Generate a product
        </Button>
      </TitleBar>

      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Congrats on creating a new Shopify app 🎉
                  </Text>
                  <Text as="p" variant="bodyMd">
                    This embedded app template uses{" "}
                    <Link
                      url="https://shopify.dev/docs/apps/tools/app-bridge"
                      external
                      removeUnderline
                    >
                      App Bridge
                    </Link>{" "}
                    interface examples like an{" "}
                    <Link url="/app/additional" removeUnderline>
                      additional page in the app nav
                    </Link>
                    , as well as an{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql"
                      external
                      removeUnderline
                    >
                      Admin GraphQL
                    </Link>{" "}
                    mutation demo, to provide a starting point for app
                    development.
                  </Text>
                </BlockStack>

                <BlockStack gap="200">
                  <Text variant="headingMd" as="h3">
                    Get started with products
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Generate a product with GraphQL and get the JSON output.
                    Learn more about{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
                      external
                      removeUnderline
                    >
                      productCreate
                    </Link>
                    .
                  </Text>
                </BlockStack>

                <InlineStack gap="300">
                  <Button loading={isLoading} onClick={generateProduct}>
                    Generate a product
                  </Button>
                  {fetcher.data?.product && (
                    <Button
                      url={`shopify:admin/products/${productId}`}
                      target="_blank"
                      variant="plain"
                    >
                      View product
                    </Button>
                  )}
                </InlineStack>

                {fetcher.data?.product && (
                  <>
                    <Text variant="headingMd" as="h3">
                      productCreate mutation
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>
                          {JSON.stringify(fetcher.data.product, null, 2)}
                        </code>
                      </pre>
                    </Box>

                    <Text variant="headingMd" as="h3">
                      productVariantsBulkUpdate mutation
                    </Text>
                    <Box
                      padding="400"
                      background="bg-surface-active"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                      overflowX="scroll"
                    >
                      <pre style={{ margin: 0 }}>
                        <code>
                          {JSON.stringify(fetcher.data.variant, null, 2)}
                        </code>
                      </pre>
                    </Box>
                  </>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    App template specs
                  </Text>
                  <BlockStack gap="200">
                    <SpecRow label="Framework" url="https://remix.run" value="Remix" />
                    <SpecRow label="Database" url="https://www.prisma.io/" value="Prisma" />
                    <SpecRow
                      label="Interface"
                      value={
                        <>
                          <Link url="https://polaris.shopify.com" external removeUnderline>
                            Polaris
                          </Link>
                          {", "}
                          <Link
                            url="https://shopify.dev/docs/apps/tools/app-bridge"
                            external
                            removeUnderline
                          >
                            App Bridge
                          </Link>
                        </>
                      }
                    />
                    <SpecRow
                      label="API"
                      url="https://shopify.dev/docs/api/admin-graphql"
                      value="GraphQL API"
                    />
                  </BlockStack>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Next steps
                  </Text>
                  <List>
                    <List.Item>
                      Build an{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                        external
                        removeUnderline
                      >
                        example app
                      </Link>
                    </List.Item>
                    <List.Item>
                      Explore Shopify’s API with{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                        external
                        removeUnderline
                      >
                        GraphiQL
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

function SpecRow({ label, url, value }) {
  return (
    <InlineStack align="space-between">
      <Text as="span" variant="bodyMd">
        {label}
      </Text>
      {typeof value === "string" ? (
        <Link url={url} external removeUnderline>
          {value}
        </Link>
      ) : (
        value
      )}
    </InlineStack>
  );
}
