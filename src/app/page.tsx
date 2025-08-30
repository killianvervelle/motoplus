

const SHOP_DOMAIN =
  process.env.SHOPIFY_STORE_DOMAIN ?? 'motoplus-site76.myshopify.com';
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? '2024-10'; // <- bump from 2023-01
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

const ENDPOINT = `https://${SHOP_DOMAIN}/api/${API_VERSION}/graphql.json`;
const QUERY = /* GraphQL */ `query ShopName { shop { name } }`;

function HomeView({ shopName }: { shopName?: string | null }) {
  return (
    <main className="container">
      <h1>{shopName ?? 'Motoplus'}</h1>
    </main>
  );
}

export default async function Page() {
  if (!TOKEN) {
    console.error('Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN in Production');
    return <HomeView shopName={null} />;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      cache: 'no-store', // avoid stale cache while debugging
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query: QUERY }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Shopify fetch failed', { status: res.status, text });
      return <HomeView shopName={null} />;
    }

    const json = await res.json();
    if (json.errors) {
      console.error('Shopify GraphQL errors', json.errors);
      return <HomeView shopName={null} />;
    }

    const name = json.data?.shop?.name ?? null;
    return <HomeView shopName={name} />;
  } catch (err) {
    console.error('Homepage fetch threw', err);
    return <HomeView shopName={null} />;
  }
}


