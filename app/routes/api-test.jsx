// import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
// import { Page, Card, Text } from "@shopify/polaris";
// import { authenticate } from "~/shopify.server";

// export const loader = async ({ request }) => {
//   const { session, admin } = await authenticate.admin(request);

//   const response = await admin.rest.get({
//     path: "products",
//     query: { limit: 5 },
//   });

//   return json({ products: response.body?.products || [] });
// };

// export default function ApiTest() {
//   const { products } = useLoaderData();

//   return (
//     <Page title="API Test - Product Fetch">
//       <Card sectioned>
//         {products.length ? (
//           products.map((p) => (
//             <Text key={p.id}>
//               🛍 {p.title} — ${p.variants?.[0]?.price || "N/A"}
//             </Text>
//           ))
//         ) : (
//           <Text>No products found or API failed.</Text>
//         )}
//       </Card>
//     </Page>
//   );
// }
