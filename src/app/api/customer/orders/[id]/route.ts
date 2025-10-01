import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { fulfillmentStatusLabels} from '@/lib/constants'


const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID!;
const version = process.env.SHOPIFY_API_VERSION!;

function FulfillmentStatus({ status, locale }: { status: string; locale: string }) {
  return fulfillmentStatusLabels[locale]?.[status] ?? status;
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params 
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  const rawLocale  = cookieStore.get("NEXT_LOCALE")?.value || "en"
  const locale = rawLocale.split("-")[0]

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const query = `
    query orderDetails($id: ID!) {
  order(id: $id) {
    id
    name
    processedAt
    financialStatus
    fulfillments(first: 5) {
      edges {
        node {
          status
        }
      }
    }
    subtotal { amount currencyCode }
    totalPrice { amount currencyCode }
    totalShipping { amount currencyCode }
    billingAddress {
      firstName
      lastName
      address1
      city
      country
      zip
    }
    shippingAddress {
      firstName
      lastName
      address1
      city
      country
      zip
    }
    lineItems(first: 20) {
      edges {
        node {
          id
          name
          sku
          variantTitle
          quantity
          price { amount currencyCode }
          totalPrice { amount currencyCode }
          totalDiscount { amount currencyCode }
          image { url altText }
        }
      }
    }
  }
}
  `

  const resp = await fetch(
    `https://shopify.com/${shopId}/account/customer/api/${version}/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        "Accept-Language": locale, 
      },
      body: JSON.stringify({ 
        query, 
        variables: {
        id: id,
        }, }),
      cache: "no-store",
    }
  )

  if (!resp.ok) {
    return NextResponse.json(
      { error: await resp.text() },
      { status: resp.status }
    )
  }

  const { data, errors } = await resp.json()

  const order = data.order

  if (errors) return NextResponse.json({ errors }, { status: 500 })

  return NextResponse.json({
    order: {
      ...order,
      fulfillmentStatus: order.fulfillments.edges.length
        ? FulfillmentStatus({status:order.fulfillments.edges[0].node.status, locale: locale})
        : FulfillmentStatus({status:"UNFULFILLED", locale: locale}),
    },
  })
}
