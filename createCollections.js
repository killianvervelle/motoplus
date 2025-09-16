import fetch from 'node-fetch';
import process from 'process'
import 'dotenv/config';

// 🔑 Replace with your shop domain and Admin API token
const SHOP = process.env.SHOPIFY_STORE_DOMAIN;      // e.g. motoplus-site76.myshopify.com
const API_VERSION = process.env.SHOPIFY_API_VERSION ;
const TOKEN = process.env.SHOPIFY_ADMIN_SECRET;    // your Admin API access token

// --- your category data ---
// paste only the top-level objects that have submenu arrays:
const categories = [
      {
        name: "Wash & Shine",
        slug: "wash--shine",
        imageBlack: "/images/sprayB.png",
        imageWhite: "/images/sprayW.png",
        submenu: [
          { name: "Cleaning Supplies", slug: "cleaning-supplies" },
          { name: "Brush", slug: "brush" },
          { name: "Sponge", slug: "sponge" },
          { name: "Cleaning Cloth", slug: "cleaning-cloth" },
          { name: "Degreaser", slug: "degreaser" },
          { name: "Corrosion Protection", slug: "corrosion-protection" },
          { name: "Cleaning Set", slug: "cleaning-set" },
          { name: "Wax Spray", slug: "wax-spray" },
          { name: "Silicone Spray", slug: "silicone-spray" },
          { name: "Bug Spray", slug: "bug-spray" },
          { name: "Wheel Cleaner", slug: "wheel-cleaner" },
          { name: "Exhaust Plug", slug: "exhaust-plug" }
        ]
      },
      {
        name: "Tools",
        slug: "tools",
        imageBlack: "/images/clampB.png",
        imageWhite: "/images/clampW.png",
        submenu: [
          { name: "Oil Filter Wrench", slug: "oil-filter-wrench" },
          { name: "Spark Plug Wrench", slug: "spark-plug-wrench" },
          { name: "Cable Lubricator Tool", slug: "cable-lubricator-tool" },
          { name: "Front Fork Tools", slug: "front-fork-tools" },
          { name: "Carburetor Screwdriver", slug: "carburetor-screwdriver" },
          { name: "Voltage Tester", slug: "voltage-tester" },
          { name: "Spring Puller", slug: "spring-puller" },
          { name: "Gasket Scraper", slug: "gasket-scraper" },
          { name: "Stethoscope", slug: "stethoscope" },
          { name: "Thread Repair", slug: "thread-repair" },
          { name: "Synchronous Tester", slug: "synchronous-tester" },
          { name: "Brake Bleeder", slug: "brake-bleeder" },
          { name: "Tire Pressure Gauge", slug: "tire-pressure-gauge" },
          { name: "Front Wheel Axle Tool", slug: "front-wheel-axle-tool" },
          { name: "Chain Tools", slug: "chain-tools" }
        ]
      },
      {
        name: "Workshop Equipment",
        slug: "workshop-equipment",
        imageBlack: "/images/wrenchB.png",
        imageWhite: "/images/wrenchW.png",
        submenu: [
          { name: "Wheel Chock", slug: "wheel-chock" },
          { name: "Paddock Stand", slug: "paddock-stand" },
          { name: "Motorcycle Lift", slug: "motorcycle-lift" },
          { name: "Funnel", slug: "funnel" },
          { name: "Tire Repair Kit", slug: "tire-repair-kit" },
          { name: "Paddock Stand Adapter", slug: "paddock-stand-adapter" },
          { name: "Assortment boxes", slug: "assortment-boxes" },
          { name: "Magnetic Scale", slug: "magnetic-scale" },
          { name: "Jerrycan", slug: "jerrycan" },
          { name: "Auxiliary Fuel Tank", slug: "auxiliary-fuel-tank" },
          { name: "Fuel Tank Protector", slug: "fuel-tank-protector" },
          { name: "Handlebar Harness", slug: "handlebar-harness" },
          { name: "Oil Collection Tray", slug: "oil-collection-tray" },
          { name: "Vice Jaws", slug: "vice-jaws" },
          { name: "Hand Cleaner", slug: "hand-cleaner" },
          { name: "Threadlocker", slug: "threadlocker" },
          { name: "Tie-Down Straps", slug: "tie-down-straps" },
          { name: "Workshop Glove", slug: "workshop-glove" },
          { name: "Mechanics Bar Stool", slug: "mechanics-bar-stool" },
          { name: "Workshop Manual", slug: "workshop-manual" }
        ]
      },
      {
        name: "Locks",
        slug: "locks",
        imageBlack: "/images/lockB.png",
        imageWhite: "/images/lockW.png",
        submenu: [
          { name: "Chain Lock", slug: "chain-lock" },
          { name: "U-lock", slug: "u-lock" },
          { name: "Ground /Wall Anchor", slug: "ground-wall-anchor" },
          { name: "Lock Accessory", slug: "lock-accessory" },
          { name: "Disc Brake Lock", slug: "disc-brake-lock" },
          { name: "Lock Reminder", slug: "lock-reminder" }
        ]
      },
      {
        name: "Clothing & Merchandise",
        slug: "clothing--merchandise",
        imageBlack: "/images/suitB.png",
        imageWhite: "/images/suitW.png",
        submenu: [
          { name: "Clothing Care", slug: "clothing-care" },
          { name: "Pedal for Kids", slug: "pedal-for-kids" }
        ]
      },
      {
        name: "Navigation, Intercom & Telephone",
        slug: "navigation--intercom--telephone",
        imageBlack: "/images/automotiveB.png",
        imageWhite: "/images/automotiveW.png",
        submenu: [
          { name: "Intercom", slug: "intercom" },
          { name: "Phone Holder", slug: "phone-holder" },
          { name: "Phone Holder Mounting", slug: "phone-holder-mounting" },
          { name: "Phone Holder Accessoires", slug: "phone-holder-accessoires" },
          { name: "Navigation System", slug: "navigation-system" }
        ]
      }
];

// Helper to create one collection
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

  //const json = await res.json();
  //console.log(`✅ Created collection: ${json.custom_collection.title} (id: ${json.custom_collection.id})`);
}

// Main: loop through every submenu name and create a collection
(async () => {
  for (const category of categories) {
    for (const item of category.submenu) {
      await createCollection(item.name);
    }
  }
})();
