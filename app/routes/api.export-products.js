import { json } from "@remix-run/node";

const ADMIN_API_TOKEN = "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";
const SHOP_DOMAIN = "pitchertech.myshopify.com";

// Field mappings
const variantFieldsMap = {
  variant_title: "title",
  variant_price: "price",
  variant_sku: "sku",
  variant_size: "selectedOptions",
  variant_color: "selectedOptions",
};

const imageFieldsMap = {
  image_src: "src",
  image_alt: "altText",
};

// Build dynamic GraphQL field structure
const buildProductFields = (selectedFields) => {
  const rootFields = [];
  const variantFields = new Set();
  const imageFields = new Set();

  for (const field of selectedFields) {
    if (variantFieldsMap[field]) {
      if (field === "variant_size" || field === "variant_color") {
        variantFields.add("selectedOptions { name value }");
      } else {
        variantFields.add(variantFieldsMap[field]);
      }
    } else if (imageFieldsMap[field]) {
      imageFields.add(imageFieldsMap[field]);
    } else if (field === "images") {
      imageFields.add("src");
      imageFields.add("altText");
    } else if (field === "variants") {
      variantFields.add("id");
      variantFields.add("title");
      variantFields.add("sku");
      variantFields.add("price");
    } else {
      rootFields.push(field);
    }
  }

  const variantBlock = variantFields.size
    ? `variants(first: 10) {
        edges {
          node {
            ${[...variantFields].join("\n")}
          }
        }
      }`
    : "";

  const imageBlock = imageFields.size
    ? `images(first: 10) {
        edges {
          node {
            ${[...imageFields].join("\n")}
          }
        }
      }`
    : "";

  return {
    rootFields: rootFields.join("\n"),
    variantBlock,
    imageBlock,
  };
};

// Fetch all products with pagination
const fetchAllProducts = async (fields) => {
  const products = [];
  let hasNextPage = true;
  let endCursor = null;

  const { rootFields, variantBlock, imageBlock } = buildProductFields(fields);

  while (hasNextPage) {
    const graphqlQuery = `
      query {
        products(first: 100${endCursor ? `, after: "${endCursor}"` : ""}) {
          edges {
            node {
              ${rootFields}
              ${variantBlock}
              ${imageBlock}
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

    for (const edge of edges) {
      const product = edge.node;
      const flatProduct = { ...product };

      // Flatten variants
      const variantNode = product.variants?.edges?.[0]?.node || {};

      if (fields.includes("variant_title")) flatProduct.variant_title = variantNode.title;
      if (fields.includes("variant_price")) flatProduct.variant_price = variantNode.price;
      if (fields.includes("variant_sku")) flatProduct.variant_sku = variantNode.sku;

      let foundSize = false;
let foundColor = false;

const options = variantNode.selectedOptions || [];

for (const opt of options) {
  if (fields.includes("variant_size") && opt.name.toLowerCase().includes("size")) {
    flatProduct.variant_size = opt.value;
    foundSize = true;
  }
  if (fields.includes("variant_color") && opt.name.toLowerCase().includes("color")) {
    flatProduct.variant_color = opt.value;
    foundColor = true;
  }
}

// Fallbacks if size/color option not found
if (fields.includes("variant_size") && !foundSize) {
  flatProduct.variant_size = "N/A";
}
if (fields.includes("variant_color") && !foundColor) {
  flatProduct.variant_color = "N/A";
}


      // Flatten images
      const imageNode = product.images?.edges?.[0]?.node || {};
      if (fields.includes("image_src")) flatProduct.image_src = imageNode.src;
      if (fields.includes("image_alt")) flatProduct.image_alt = imageNode.altText;

      products.push(flatProduct);
    }

    hasNextPage = result?.data?.products?.pageInfo?.hasNextPage;
    endCursor = result?.data?.products?.pageInfo?.endCursor;
  }

  return products;
};

// GET for manual testing
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const fieldsParam = url.searchParams.get("fields");

  if (!fieldsParam) {
    return json({ error: "Missing required parameter: fields" }, { status: 400 });
  }

  const selectedFields = fieldsParam.split(",").map(f => f.trim()).filter(Boolean);

  try {
    const products = await fetchAllProducts(selectedFields);

    return json({
      storeSetup: {
        storeName: "Pitchertech",
        storeUrl: "https://pitchertech.myshopify.com",
        language: "English",
        currency: "USD",
        businessField: "Fashion",
      },
      apiToken: ADMIN_API_TOKEN,
      selectedFields,
      products,
    });
  } catch (err) {
    console.error("GET Fetch failed:", err);
    return json({ error: "Failed to fetch product data", details: err.message }, { status: 500 });
  }
};

// POST for frontend export
export const action = async ({ request }) => {
  try {
    const body = await request.json();
    const fieldsParam = body.fields;

    const selectedFields = fieldsParam.split(",").map(f => f.trim()).filter(Boolean);

    const customStoreSetup = body.storeSetup || {
      storeName: "Pitchertech",
      storeUrl: "https://pitchertech.myshopify.com",
      language: "English",
      currency: "USD",
      businessField: "Fashion",
    };

    const products = await fetchAllProducts(selectedFields);

    return json({
      storeSetup: customStoreSetup,
      apiToken: ADMIN_API_TOKEN,
      selectedFields,
      products,
    });
  } catch (err) {
    console.error("POST Fetch failed:", err);
    return json({ error: "Failed to fetch product data", details: err.message }, { status: 500 });
  }
};
