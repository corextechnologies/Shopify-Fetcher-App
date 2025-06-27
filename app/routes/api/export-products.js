// app/routes/api/export-products.js
import { json } from '@remix-run/node';
import { getApiToken } from '~/utils/tokenStore';

export const action = async ({ request }) => {
  const token = getApiToken();

  if (!token) {
    return json({ error: 'Missing token' }, { status: 401 });
  }

  const formData = await request.json();
  const { storeUrl, selectedFields = [], imageSize = 'original' } = formData;

  if (!storeUrl || !selectedFields.length) {
    return json({ error: 'Invalid request: storeUrl and fields required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://${storeUrl}/admin/api/2024-04/products.json?limit=10`, {
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return json({ error: 'Failed to fetch products' }, { status: response.status });
    }

    const data = await response.json();

    // Transform products to only include selected fields
    const exportedProducts = data.products.map(product => {
      const output = {};

      selectedFields.forEach(field => {
        if (field === 'image') {
          const imageUrl = product.image?.src;
          if (imageUrl) {
            const sizeParam = imageSize !== 'original' ? `_${imageSize}` : '';
            output.image = imageUrl.replace(/(\.\w+)$/, `${sizeParam}$1`);
          } else {
            output.image = null;
          }
        } else {
          output[field] = product[field];
        }
      });

      return output;
    });

    return json({ products: exportedProducts });
  } catch (error) {
    return json({ error: 'Error fetching product data', details: error.message }, { status: 500 });
  }
};
