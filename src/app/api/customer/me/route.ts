import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_API_CLIENT_ID!;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const query = `
    query {
      customer {
        firstName
        lastName
        email
        defaultAddress {
          id
          firstName
          lastName
          address1
          address2
          city
          province
          country
          zip
          phone
        }
        addresses(first: 20) {
          edges {
            node {
              id
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
              phone
            }
          }
        }
      }
    }
  `;

  const resp = await fetch(
    // ✅ Customer Account API endpoint
    `https://shopify.com/${shopId}/account/customer/api/2025-01/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ Correct header for Customer Account API
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    }
  );

  if (!resp.ok) {
    const message = await resp.text();
    console.error("Shopify API error:", message);
    return NextResponse.json({ error: message }, { status: resp.status });
  }

  const { data, errors } = await resp.json();

  if (errors) {
    console.log("SHIT");
    console.error("GraphQL errors:", errors);
    return NextResponse.json({ errors }, { status: 500 });
  }

  // ✅ Return JSON to the client
  return NextResponse.json(data);
}
