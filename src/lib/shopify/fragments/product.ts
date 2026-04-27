import imageFragment from "./image";
import seoFragment from "./seo";

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    
    metafields(identifiers: [
      {namespace: "custom", key: "brand"},
      {namespace: "custom", key: "model"},
      {namespace: "custom", key: "component"},
      {namespace: "custom", key: "type"},     
      {namespace: "custom", key: "condition"}  
    ]) {
      key
      value
      namespace
    }
      
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    
    compareAtPriceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
    vendor
    collections(first: 100) {
      nodes {
        title
        products(first: 100) {
          edges {
            node {
              title
              vendor
            }
          }
        }
      }
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
