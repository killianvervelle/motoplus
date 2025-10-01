import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { financialStatusLabels, fulfillmentStatusLabels} from '@/lib/constants'


function StatusLabel({ status, locale }: { status: string; locale: string }) {
  return financialStatusLabels[locale]?.[status] ?? status;
}

function FulfillmentStatus({ status, locale }: { status: string; locale: string }) {
  return fulfillmentStatusLabels[locale]?.[status] ?? status;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const rawLocale  = cookieStore.get("NEXT_LOCALE")?.value || "EN"
  const locale = rawLocale.split("-")[0]

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

   const query = `
    query customerOrders
     {
    customer {
      orders(first: 20) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillments(first: 1) {
              edges {
                node {
                  status
                }
              }
            }
            totalPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
  `;

  const resp = await fetch(
    "https://shopify.com/91717009789/account/customer/api/2025-01/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        "Accept-Language": locale
      },
      body: JSON.stringify({ 
        query,
      variables: {
    }, }),
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
    console.error("GraphQL errors:", errors);
    return NextResponse.json({ errors }, { status: 500 });
  }

  const orders =
  data.customer.orders.edges.map((e: any) => {
    const o = e.node;
    return {
      id: o.id,
      number: o.name,
      date: new Date(o.processedAt).toLocaleDateString(),
      paymentStatus: StatusLabel({status:o.financialStatus, locale: locale}),
      fulfillmentStatus: o.fulfillments.edges.length
        ? FulfillmentStatus({status:o.fulfillments.edges[0].node.status, locale: locale})
        : FulfillmentStatus({status:"UNFULFILLED", locale: locale}),
      total: `${o.totalPrice.amount} ${o.totalPrice.currencyCode}`,
    };
  }) ?? [];

  return NextResponse.json({ orders });
}