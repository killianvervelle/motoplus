import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
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
    emailAddress {
      emailAddress
    }
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
        }
      }
    }
  }
}
  `;

  const resp = await fetch(
    `https://shopify.com/91717009789/account/customer/api/2025-01/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
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

  return NextResponse.json(data);
}




export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { address } = await req.json();

  const addressInput = {
    firstName:    address.firstName,
    lastName:     address.lastName,
    address1:     address.address1,
    address2:     address.address2 || null,
    city:         address.city,
    zip:          address.zip,
    territoryCode: address.territoryCode,   
    zoneCode:     address.province || null,
    phoneNumber:  address.phone || null,
  };

  const mutation = `
    mutation addressCreate(
      $addressInput: CustomerAddressInput!
      $defaultAddress: Boolean
    ) {
      customerAddressCreate(
        address: $addressInput
        defaultAddress: $defaultAddress
      ) {
        customerAddress {
          id
          address1
          city
          territoryCode
          zoneCode
          phoneNumber
          zip
        }
        userErrors {
          field
          message
          code
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
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          addressInput,
          defaultAddress: true, 
        },
      }),
      cache: "no-store",
    }
  );

  if (!resp.ok) {
    const message = await resp.text();
    console.error("Shopify API error:", message);
    return NextResponse.json({ error: message }, { status: resp.status });
  }

  const json = await resp.json();

  if (json.errors) {
    console.error("GraphQL errors:", json.errors);
    return NextResponse.json({ errors: json.errors }, { status: 500 });
  }

  const result = json.data?.customerAddressCreate;
  if (result?.userErrors?.length) {
    console.error("User errors:", result.userErrors);
    return NextResponse.json(
      { error: result.userErrors.map((e: any) => e.message).join(", ") },
      { status: 400 }
    );
  }

  return NextResponse.json({ id: result.customerAddress.id });
}




export async function DELETE(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing address id" }, { status: 400 });
  }

  const mutation = `
    mutation addressDelete($addressId: ID!) {
      customerAddressDelete(addressId: $addressId) {
        deletedAddressId
        userErrors {
          field
          message
          code
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
      },
      body: JSON.stringify({
        query: mutation,
        variables: { addressId:id },
      }),
      cache: "no-store",
    }
  );

  if (!resp.ok) {
    const message = await resp.text();
    console.error("Shopify API error:", message);
    return NextResponse.json({ error: message }, { status: resp.status });
  }

  const json = await resp.json();

  if (json.errors) {
    console.error("GraphQL errors:", json.errors);
    return NextResponse.json({ errors: json.errors }, { status: 500 });
  }

  const result = json.data?.customerAddressDelete;
  if (result?.userErrors?.length) {
    return NextResponse.json(
      { error: result.userErrors.map((e: any) => e.message).join(", ") },
      { status: 400 }
    );
  }

  return NextResponse.json({
    deletedId: result?.deletedAddressId ?? null,
  });
}