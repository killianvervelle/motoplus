export const createCustomerMutation = /* GraphQL */ `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const getCustomerAccessTokenMutation = /* GraphQL */ `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const getUserDetailsQuery = /* GraphQL */ `
  query getOrders($input: String!) {
    customer(customerAccessToken: $input) {
      id
      firstName
      lastName
      acceptsMarketing
      email
      phone

      # Fetch all saved addresses (shipping/billing book)
      addresses(first: 6) {
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

      # The default address (often used as the “billing” address)
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
    }
  }
`;

export const deleteUserAddressQuery  = `
mutation customerAddressDelete(
  $id: ID!
) {
  customerAddressDelete(id: $id) {
    deletedCustomerAddressId
    userErrors {
      field
      message
    }
  }
}
`;

export const createUserAddressQuery = `
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
}`
;

export const customerRecoverQuery = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      userErrors {
        field
        message
      }
    }
  }
`;