import productFragment from "../fragments/product";
import seoFragment from "../fragments/seo";

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    image {
      altText
      url
    }
    seo {
      ...seo
    }
    updatedAt
    products(first: 100) {
      edges {
        node {
          id
        }
      }
    }
  }
  ${seoFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionsQuery = /* GraphQL */ `
    query getCollections($language: LanguageCode, $cursor: String) @inContext(language: $language) {
    collections(first: 250, after: $cursor, sortKey: TITLE) {
      edges {
      cursor
        node {
          ...collection
        }
      }
        pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
    $filters: [ProductFilter!]
    $language: LanguageCode
    $after: String # <--- 1. Add this variable definition
  ) @inContext(language: $language){
    collection(handle: $handle) {
      products(
        sortKey: $sortKey
        reverse: $reverse
        first: 24
        filters: $filters
        after: $after # <--- 2. Pass it to the products connection
      ) {
        pageInfo {     # <--- 3. Ensure this is inside the products block
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
  }
  ${productFragment}
`;