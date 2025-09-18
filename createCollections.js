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
        name: "Suspension & Steering",
        slug: "suspension--steering",
        submenu: [
          { name: "Front Forks / Fork Tubes", slug: "front-forks--fork-tubes" },
          { name: "Shock Absorber / Rear Shock", slug: "shock-absorber--rear-shock" },
          { name: "Triple Tree / Steering Stem", slug: "triple-tree--steering-stem" },
          { name: "Steering Bearings", slug: "steering-bearings" }
        ]
      },
      {
        name: "Wheels & Tyres",
        slug: "wheels--tyres",
        submenu: [
          { name: "Rims / Wheels", slug: "rims--wheels" },
          { name: "Hubs & Spokes", slug: "hubs--spokes" },
          { name: "Tires (Front / Rear)", slug: "tires-front--rear" },
          { name: "Inner Tubes", slug: "inner-tubes" },
          { name: "Wheel Axle / Spacers", slug: "wheel-axle--spacers" }
        ]
      },
      {
        name: "Frame & Bodywork",
        slug: "frame--bodywork",
        submenu: [
          { name: "Frame & Subframe", slug: "frame--subframe" },
          { name: "Footpegs / Rearsets", slug: "footpegs--rearsets" },
          { name: "Fairings / Side Panels", slug: "fairings--side-panels" },
          { name: "Seat & Seat Covers", slug: "seat--seat-covers" }
        ]
      },
      {
        name: "Exhaust",
        slug: "exhaust",
        submenu: [
          { name: "Complete Exhaust Systems", slug: "complete-exhaust-systems" },
          { name: "Headers / Downpipes", slug: "headers--downpipes" },
          { name: "Mufflers / Silencers", slug: "mufflers--silencers" },
          { name: "Exhaust Clamps & Gaskets", slug: "exhaust-clamps--gaskets" }
        ]
      },
      {
        name: "Cooling",
        slug: "cooling",
        submenu: [
          { name: "Radiator", slug: "radiator" },
          { name: "Radiator Cap & Hoses", slug: "radiator-cap--hoses" },
          { name: "Water Pump", slug: "water-pump" }
        ]
      },
      {
        name: "Engine & Transmission",
        slug: "engine--transmission",
        submenu: [
          { name: "Engine Blocks / Crankcases", slug: "engine-blocks--crankcases" },
          { name: "Pistons / Cylinder Kits", slug: "pistons--cylinder-kits" },
          { name: "Camshaft / Valvetrain Parts", slug: "camshaft--valvetrain-parts" },
          { name: "Gearbox / Transmission Parts", slug: "gearbox--transmission-parts" },
          { name: "Gaskets & Seals", slug: "gaskets--seals" }
        ]
      },

      {
        name: "Riding Gear",
        slug: "riding-gear",
        imageBlack: "/images/suitB.png",
        imageWhite: "/images/suitW.png",
        submenu: [
          { name: "Helmets", slug: "helmets" },
          { name: "Gloves", slug: "gloves" },
          { name: "Jackets / Pants", slug: "jackets--pants" },
          { name: "Boots", slug: "boots" }
        ]
      },

      {
        name: "Navigation, Intercom & Telephone",
        slug: "navigation--intercom--telephone",
        imageBlack: "/images/automotiveB.png",
        imageWhite: "/images/automotiveW.png",
        submenu: [
          { name: "GPS Tracker / Alarm Systems", slug: "gps-tracker--alarm-systems" }
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
