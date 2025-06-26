import { redirect } from "@remix-run/node";
export const loader = () => redirect("/product-details-fetcher");
