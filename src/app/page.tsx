


export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
console.log('[route] reached');

const endpoint = "https://motoplus-site76.myshopify.com/api/2023-01/graphql.json"




export default async function Home() {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      },
      body: JSON.stringify({ query: '{ shop { name } }' }) // placeholder; use your real query
      // IMPORTANT: no-cache or cache: 'no-store' if you want no caching
    });

    if (!res.ok) {
      console.error('Shopify homepage fetch failed', {
        status: res.status,
        endpoint,
        hasToken: !!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      });
      // TEMP while debugging: render a soft error instead of hard 404
      return <main className="container">Failed to load homepage data.</main>;
      // or: return notFound();  // restore this after fixing env/API
    }

    const data = await res.json();
    if (!data /* or missing fields */) {
      console.warn('Shopify homepage data empty');
      return <main className="container">No data returned.</main>;
      // or notFound();
    }

    return <Home />;
  } catch (err) {
    console.error('Homepage fetch threw', err);
    return <main className="container">Unexpected error.</main>;
  }
}


