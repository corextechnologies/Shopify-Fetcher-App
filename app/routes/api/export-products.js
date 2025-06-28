// // app/routes/api/export-products.jsx
// import { json } from "@remix-run/node";
// import { authenticate } from "~/shopify.server"; // built-in for token

// export const loader = async ({ request }) => {
//   const { session } = await authenticate.admin(request);
//   const token = session.accessToken;
//   const shop = session.shop;

//   const url = new URL(request.url);
//   const fields = url.searchParams.get("fields");

//   if (!fields) {
//     return json({ error: "Missing fields param" }, { status: 400 });
//   }

//   const fieldList = fields.split(",").map(f => f.trim()).filter(Boolean);

//   const query = `
//     {
//       products(first: 10) {
//         edges {
//           node {
//             ${fieldList.join("\n")}
//           }
//         }
//       }
//     }
//   `;

//   try {
//     const response = await fetch(`https://${shop}/admin/api/2024-04/graphql.json`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-Shopify-Access-Token": token,
//       },
//       body: JSON.stringify({ query }),
//     });

//     const result = await response.json();
//     const products = result?.data?.products?.edges?.map(edge => edge.node) || [];

//     return json({ products });
//   } catch (error) {
//     console.error("GraphQL Fetch Error:", error);
//     return json({ error: "Failed to fetch products" }, { status: 500 });
//   }
// };
