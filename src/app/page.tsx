

export const revalidate = 60;               // rebuild at most once per minute
export const runtime = 'nodejs';

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN ?? 'motoplus-site76.myshopify.com';
const API_VERSION = process.env.SHOPIFY_API_VERSION ?? '2024-10';
const TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const ENDPOINT = `https://${SHOP_DOMAIN}/api/${API_VERSION}/graphql.json`;
const QUERY = `query { shop { name } }`;

function HomeView({ name }: { name: string | null }) {
  return <main className="container"><h1>{name ?? 'Motoplus'}</h1></main>;
}

export default async function Page() {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    // IMPORTANT: no 'cache: "no-store"' here
    next: { revalidate: 60 },               // (optional, since file-level revalidate is set)
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query: QUERY }),
  });

  if (!res.ok) {
    console.error('Shopify fetch failed', { status: res.status });
    // For a static page, return a soft UI instead of throwing, so build doesn’t fail
    return <HomeView name={null} />;
  }

  const json = await res.json();
  return <HomeView name={json.data?.shop?.name ?? null} />;
}

