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
  $customerAccessToken: String!
  $id: ID!
) {
  customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
    deletedCustomerAddressId
    userErrors {
      field
      message
    }
  }
}
`;

export const createUserAddressQuery  = `
mutation customerAddressCreate(
  $customerAccessToken: String!
  $address: MailingAddressInput!
) {
  customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
    customerAddress {
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
    userErrors {
      field
      message
    }
  }
}`
;

export const setDefaultAddressQuery = `
  mutation customerDefaultAddressUpdate(
    $customerAccessToken: String!
    $addressId: ID!
  ) {
    customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
      customer { id }
      userErrors { field message }
    }
  }
`

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