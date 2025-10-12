/*import fetch from 'node-fetch';
import process from 'process'
import 'dotenv/config';
import fs from "fs";


const SHOP = process.env.SHOPIFY_STORE_DOMAIN;      // e.g. motoplus-site76.myshopify.com
const API_VERSION = process.env.SHOPIFY_API_VERSION ;
const TOKEN = process.env.SHOPIFY_ADMIN_SECRET;    // your Admin API access token

/*
// --- your category data ---
// paste only the top-level objects that have submenu arrays:
const categories = [
  // 🔹 Advertising & Promotional
  {
    name: "Pop Culture Crossovers",
    slug: "pop-culture-crossovers",
    submenu: [
      { name: "Movie Car Replicas", slug: "movie-car-replicas" },
      { name: "Comics & Graphic Novels", slug: "comics--graphic-novels" }
    ]
  }
];



async function createCollection(title) {
  const url = `${SHOP}/admin/api/${API_VERSION}/custom_collections.json`;

  const body = {
    custom_collection: {
      title,
      published: true
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create "${title}": ${text}`);
  }

  const json = await res.json();
  console.log(`✅ Created collection: ${json.custom_collection.title} (id: ${json.custom_collection.id})`);
}

// Main: loop through every submenu name and create a collection
(async () => {
  for (const category of categories) {
    for (const item of category.submenu) {
      await createCollection(item.name);
    }
  }
})();


async function fetchAllCollections() {
  let all = [];
  let pageInfo = null;
  const base = `${SHOP}/admin/api/${API_VERSION}/custom_collections.json?limit=250&fields=id,handle,title,created_at`; 

  while (true) {
    const url = pageInfo ? `${base}&page_info=${pageInfo}` : base;
    const res = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch collections: ${text}`);
    }

    const data = await res.json();
    all.push(...data.custom_collections);

    const link = res.headers.get("link");
    if (!link || !link.includes('rel="next"')) break;

    const match = link.match(/<([^>]+)>;\s*rel="next"/);
    if (!match) break;
    pageInfo = new URL(match[1]).searchParams.get("page_info");
  }

  return all;
}

function normalize(str = "") {
  return str.toLowerCase().trim();
}

function groupDuplicatesByTitle(collections) {
  const grouped = {};
  for (const c of collections) {
    const key = normalize(c.title);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  }
  return Object.entries(grouped).filter(([_, group]) => group.length > 1);
}

async function deleteCollection(id) {
  const url = `${SHOP}/admin/api/${API_VERSION}/custom_collections/${id}.json`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "X-Shopify-Access-Token": TOKEN },
  });
  return res.ok;
}

async function confirmAndDelete(dupes) {
  if (dupes.length === 0) {
    console.log("\n✅ No duplicate collections found!");
    return;
  }

  console.log(`\n⚠️ Found ${dupes.length} duplicate title groups:\n`);
  dupes.forEach(([title, group]) => {
    console.log(`🔁 "${title}" has ${group.length} collections:`);
    group.forEach(c => {
      console.log(`   - ID ${c.id}, handle: ${c.handle}, created: ${c.created_at}`);
    });
  });

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question("\n⚠️  Do you want to delete duplicates (keeping the oldest)? (yes/no) ", async answer => {
    if (answer.toLowerCase() === "yes") {
      for (const [title, group] of dupes) {
        // sort by created_at (oldest first)
        group.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const keep = group[0];
        const toDelete = group.slice(1);

        console.log(`\nKeeping oldest "${title}" (ID ${keep.id})`);
        for (const d of toDelete) {
          const ok = await deleteCollection(d.id);
          console.log(ok ? `🗑️  Deleted ${title} (ID ${d.id})` : `❌ Failed to delete ID ${d.id}`);
        }
      }
    } else {
      console.log("❎ Deletion cancelled.");
    }
    rl.close();
  });
}

(async () => {
  try {
    console.log("🔍 Fetching all collections...");
    const collections = await fetchAllCollections();
    console.log(`✅ Total fetched: ${collections.length}`);

    const dupes = groupDuplicatesByTitle(collections);
    await confirmAndDelete(dupes);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();

const endpoint = `${SHOP}/admin/api/${API_VERSION}/graphql.json`;


async function graphql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));
  }
  if (json.data?.metaobjectDelete?.userErrors?.length) {
    console.error("User errors:", json.data.metaobjectDelete.userErrors);
  }
  return json;
}

async function deleteAllModels() {
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    // Step 1 – fetch models
    const query = `
      query getAllModels($cursor: String) {
        metaobjects(type: "model", first: 50, after: $cursor) {
          edges {
            node { id handle }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `;

    const { data } = await graphql(query, { cursor });
    const edges = data.metaobjects.edges;

    // Step 2 – delete each model
    for (const edge of edges) {
      const id = edge.node.id;
      console.log("🗑 Deleting model:", id);

      const mutation = `
        mutation deleteModel($id: ID!) {
          metaobjectDelete(id: $id) {
            deletedId
            userErrors { field message }
          }
        }
      `;
      await graphql(mutation, { id });
    }

    hasNextPage = data.metaobjects.pageInfo.hasNextPage;
    cursor = data.metaobjects.pageInfo.endCursor;
  }
}

deleteAllModels().catch(console.error);

*/

/*const endpoint = `${SHOP}/admin/api/${API_VERSION}/graphql.json`;

async function graphql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
  }
  return json;
}

// --- Paginated fetch ---
async function fetchAll(type) {
  let results = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const query = `
      query GetMetaobjects($cursor: String) {
        metaobjects(first: 250, type: "${type}", after: $cursor) {
          edges {
            cursor
            node {
              id
              handle
              fields { key value }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const { data } = await graphql(query, { cursor });
    const { edges, pageInfo } = data.metaobjects;

    results.push(...edges.map((e) => e.node));
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return results;
}

// --- Main runner ---
async function run() {
  console.log("Fetching brands...");
  const brands = await fetchAll("brand");

  console.log("Fetching models...");
  const models = await fetchAll("model");

  // Build brand dictionary
  const brandMap = {};

  for (const brand of brands) {
    const nameField = brand.fields.find((f) => f.key === "name")?.value;
    brandMap[nameField] = {
      handle: brand.handle,
      models: [],
    };
  }

  for (const model of models) {
    const nameField = model.fields.find((f) => f.key === "name")?.value;
    const brandField = model.fields.find((f) => f.key === "brand")?.value; // will be brandId

    if (!brandField || !nameField) continue;

    console.log("fetched model", model)

    // Find brand by ID
    const brandEntry = Object.entries(brands).find(
      ([, b]) => b.id === brandField
    );

    if (brandEntry) {
      const brandName = brandEntry[1].fields.find((f) => f.key === "name").value;
      console.log("-----fetched brand", brandName)
      brandMap[brandName].models.push({
        name: nameField,
        handle: model.handle,
      });
    }
  }

  fs.writeFileSync("./brands_models.json", JSON.stringify(brandMap, null, 2));
  console.log("✅ Exported to brands_models.json");
}

run().catch(console.error);




const brandsModels = JSON.parse(fs.readFileSync("./brands_models.json", "utf8"));

const endpoint  = `${SHOP}/admin/api/${API_VERSION}/graphql.json`;

async function graphql(query, variables = {}) {
  
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors || json.data?.metaobjectCreate?.userErrors?.length) {
    console.error(JSON.stringify(json, null, 2));
  }
  return json;
}

async function getDefinitions() {
  const query = `
    {
      brandDef: metaobjectDefinitionByType(type: "brand") {
        id
        type
        name
        fieldDefinitions { key name }
      }
      modelDef: metaobjectDefinitionByType(type: "model") {
        id
        type
        name
        fieldDefinitions { key name }
      }
    }
  `;
  const { data } = await graphql(query);
  return {
    brandDef: data.brandDef,
    modelDef: data.modelDef,
  };
}

async function createBrand(handle, brandKey) {
  const mutation = `
    mutation createBrand($brandKey: String!, $value: String!) {
      metaobjectCreate(
        metaobject: {
          type: "brand"
          fields: [{ key: $brandKey, value: $value }]
        }
      ) {
        metaobject { id handle }
        userErrors { field message }
      }
    }
  `;
  const variables = { brandKey, value: handle };
  const data = await graphql(mutation, variables);
  return data.data?.metaobjectCreate?.metaobject?.id;
}

async function createModel(handle, brandId, modelKey, brandRefKey) {
  const mutation = `
    mutation createModel($modelKey: String!, $brandRefKey: String!, $handleVal: String!, $brandId: String!) {
      metaobjectCreate(
        metaobject: {
          type: "model"
          fields: [
            { key: $modelKey, value: $handleVal }
            { key: $brandRefKey, value: $brandId }
          ]
        }
      ) {
        metaobject { id handle }
        userErrors { field message }
      }
    }
  `;
  const variables = {
    modelKey,
    brandRefKey,
    handleVal: handle,
    brandId: brandId.toString(),
  };
  return graphql(mutation, variables);
}

async function run() {
  const { brandDef, modelDef } = await getDefinitions();

  // Just use "name" since that's the actual field key
  const brandKey = brandDef.fieldDefinitions.find(f => f.key === "name")?.key;
  const modelKey = modelDef.fieldDefinitions.find(f => f.key === "name")?.key;
  const brandRefKey = modelDef.fieldDefinitions.find(f => f.key === "brand")?.key;

  console.log("ℹ️ Using keys:", { brandKey, modelKey, brandRefKey });

  for (const [brandName, brandData] of Object.entries(brandsModels)) {
    console.log(`➡️ Creating brand: ${brandData.handle}`);
    const brandId = await createBrand(brandData.handle, brandKey);

    if (brandId) {
      for (const model of brandData.models) {
        console.log(`   ↳ Creating model: ${model.handle}`);
        await createModel(model.handle, brandId, modelKey, brandRefKey);
      }
    }
  }
}

run().catch(console.error);


/*

const endpoint  = `${SHOP}/admin/api/${API_VERSION}/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
  }
  return result.data;
}

// 🔹 1. Fetch products with brand/model references
async function getProducts(cursor = null) {
  const query = `
    query GetProducts($cursor: String) {
  products(first: 50, after: $cursor) {
    edges {
      cursor
      node {
        id
        title
        metafield_brand: metafield(namespace: "custom", key: "brand") {
          reference {
            ... on Metaobject {
              field(key: "name") {
                value
              }
            }
          }
        }
        metafield_model: metafield(namespace: "custom", key: "model") {
          reference {
            ... on Metaobject {
              field(key: "name") {
                value
              }
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}
  `;

  const data = await shopifyFetch(query, { cursor });
  return data.products;
}

// 2. Write brand_name / model_name back to product metafields
async function setProductNames(productId, brandName, modelName) {
  const metafields = [];

  if (brandName) {
    metafields.push({
      ownerId: productId,
      namespace: "custom",
      key: "brand_name",
      type: "single_line_text_field",
      value: brandName,
    });
  }

  if (modelName) {
    metafields.push({
      ownerId: productId,
      namespace: "custom",
      key: "model_name",
      type: "single_line_text_field",
      value: modelName,
    });
  }

  if (metafields.length === 0) return;

  const mutation = `
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  await shopifyFetch(mutation, { metafields });
  console.log(`✅ Updated product ${productId} → brand: ${brandName || "N/A"} | model: ${modelName || "N/A"}`);
}

// 3. Main runner
async function run() {
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const products = await getProducts(cursor);

    for (const edge of products.edges) {
      const product = edge.node;

      console.log("PRODUCT", product)

      const brandField = product.metafield_brand;
      const modelField = product.metafield_model;

      console.log("BRANDFIELD", brandField)
      console.log("modelField", modelField)


      const brandName = product.metafield_brand?.reference?.field?.value || null;
      const modelName = product.metafield_model?.reference?.field?.value || null;

      await setProductNames(product.id, brandName, modelName);
    }

    hasNextPage = products.pageInfo.hasNextPage;
    cursor = products.edges.at(-1)?.cursor;
  }
}

run().catch(console.error);

*/