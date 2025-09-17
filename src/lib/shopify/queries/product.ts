import productFragment from "../fragments/product";

export const getProductQuery = /* GraphQL */ `
  query getProduct(
  $handle: String!
  $language: LanguageCode) @inContext(language: $language){
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ ` 
  query getProducts (  
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
    $cursor: String
    $language: LanguageCode
  ) @inContext(language: $language) {
    products(
      sortKey: $sortKey
      reverse: $reverse
      query: $query
      first: 18
      after: $cursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
      }
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;

export const getHighestProductPriceQuery = /* GraphQL */ `
  query getHighestProductPrice {
    products(first: 1, sortKey: PRICE, reverse: true) {
      edges {
        node {
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getLatestProductsQuery = /* GraphQL */ `
  query getLatestProducts ($language: LanguageCode) @inContext(language: $language){
    products(first: 15, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;