// app/routes/api.export-products.js
import { json } from "@remix-run/node";

const ADMIN_API_TOKEN = "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";
const SHOP_DOMAIN = "corex-tech.myshopify.com";

const expandedFields = {
  variants: `
    variants(first: 10) {
      edges {
        node {
          id
          title
          price
          sku
        }
      }
    }
  `,
  images: `
    images(first: 10) {
      edges {
        node {
          src
          altText
        }
      }
    }
  `
};

const fieldAliases = {
  price: "variants",
  sku: "variants",
  id: "variants",
  variant_title: "variants"
};

const buildProductFields = (selectedFields) => {
  const resolvedFields = new Set();
  for (const field of selectedFields) {
    if (fieldAliases[field]) {
      resolvedFields.add(fieldAliases[field]);
    } else {
      resolvedFields.add(field);
    }
  }

  const simpleFields = [...resolvedFields]
    .filter(f => !expandedFields[f])
    .join("\n");

  const complexFields = [...resolvedFields]
    .filter(f => expandedFields[f])
    .map(f => expandedFields[f])
    .join("\n");

  return { simpleFields, complexFields };
};

const fetchAllProducts = async (fields) => {
  const products = [];
  let hasNextPage = true;
  let endCursor = null;

  const { simpleFields, complexFields } = buildProductFields(fields);

  while (hasNextPage) {
    const graphqlQuery = `
      query {
        products(first: 100${endCursor ? `, after: "${endCursor}"` : ""}) {
          edges {
            node {
              ${simpleFields}
              ${complexFields}
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const response = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-04/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ADMIN_API_TOKEN,
      },
      body: JSON.stringify({ query: graphqlQuery }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error(JSON.stringify(result.errors));
    }

    const edges = result?.data?.products?.edges || [];
    products.push(...edges.map(edge => edge.node));
    hasNextPage = result?.data?.products?.pageInfo?.hasNextPage;
    endCursor = result?.data?.products?.pageInfo?.endCursor;
  }

  return products;
};

// ✅ GET: used by browser/test tools
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const fieldsParam = url.searchParams.get("fields");

  if (!fieldsParam) {
    return json({ error: "Missing required parameter: fields" }, { status: 400 });
  }

  const selectedFields = fieldsParam
    .split(",")
    .map(f => f.trim())
    .filter(Boolean);

  const storeSetup = {
    storeName: "CoreX Tech Store",
    storeUrl: "https://corex-tech.myshopify.com",
    language: "English",
    currency: "USD",
    businessField: "E-commerce",
  };

  try {
    const products = await fetchAllProducts(selectedFields);

    return json({
      storeSetup,
      apiToken: ADMIN_API_TOKEN.replace(/^(.{10}).+/, "$1******"),
      selectedFields,
      products,
    });
  } catch (err) {
    console.error("GET Fetch failed:", err);
    return json({ error: "Failed to fetch product data", details: err.message }, { status: 500 });
  }
};

// ✅ POST: used by frontend to pass custom storeSetup
export const action = async ({ request }) => {
  try {
    const body = await request.json();
    const fieldsParam = body.fields;

    const selectedFields = fieldsParam
      .split(",")
      .map(f => f.trim())
      .filter(Boolean);

    const customStoreSetup = body.storeSetup || {
      storeName: "Default Store",
      storeUrl: "https://example.com",
      language: "English",
      currency: "USD",
      businessField: "E-commerce",
    };

    const products = await fetchAllProducts(selectedFields);

    return json({
      storeSetup: customStoreSetup,
      apiToken: ADMIN_API_TOKEN.replace(/^(.{10}).+/, "$1******"),
      selectedFields,
      products,
    });
  } catch (err) {
    console.error("POST Fetch failed:", err);
    return json({ error: "Failed to fetch product data", details: err.message }, { status: 500 });
  }
};
