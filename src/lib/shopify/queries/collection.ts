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
  query getCollections($language: LanguageCode) @inContext(language: $language) {
    collections(first: 249, sortKey: TITLE) {
      edges {
        node {
          ...collection
        }
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
  ) @inContext(language: $language){
    collection(handle: $handle) {
      products(
        sortKey: $sortKey
        reverse: $reverse
        first: 100
        filters: $filters
      ) {
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