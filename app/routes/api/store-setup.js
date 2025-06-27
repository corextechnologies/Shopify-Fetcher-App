// app/routes/api/store-setup.js
import { json } from '@remix-run/node';
import { setApiToken } from '~/utils/tokenStore';

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const storeUrl = url.searchParams.get('storeUrl');
  const token = url.searchParams.get('token');

  if (!storeUrl || !token) {
    return json({ error: 'Missing storeUrl or token' }, { status: 400 });
  }

  // Save token temporarily
  setApiToken(token);

  try {
    const response = await fetch(`https://${storeUrl}/admin/api/2024-04/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return json({ error: 'Failed to fetch store data' }, { status: response.status });
    }

    const data = await response.json();
    return json({ store: data.shop });
  } catch (error) {
    return json({ error: 'Fetch error', details: error.message }, { status: 500 });
  }
};
