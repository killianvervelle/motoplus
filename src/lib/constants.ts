export type LanguageItem = {
    title: string;
    code: string;
    image?: string
}

export const defaultLanguage: LanguageItem = {
    title: "English",
    code: "en",
    image: "/images/royaume-uni.png"
};

export const languageItems: LanguageItem[] = [
  defaultLanguage,
  { title: "Portuguese", code: "pt", image: "/images/portugual.png" },
  { title: "French", code: "fr", image: "/images/france.png" },
]

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export type Filters = Record<string, string[]>;

export type HomeFilterBoxProp = { 
  filtersComponents: Filters
  filtersBrands: Filters
  totalProducts: string
  title: string
  subtitle: string
  brand: string
  model: string
  part: string
  search: string
  available: string
  available2: string
}

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: "relevance",
  sortKey: "CREATED_AT",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  }, // asc
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  }, // asc
  {
    title: "Price: High to low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export const TAGS = {
  collections: "collections",
  products: "products",
  cart: "cart",
};

export type SubSubmenuItem = {
  name: string;
  slug: string;
};

export type SubmenuItem = {
  name: string;
  slug: string;
  imageBlack?: string;
  imageWhite?: string;
  submenu: SubSubmenuItem[];
};

export type MenuItem = {
  name: string;
  slug: string;
  kind: "category" | "brand" | "accessory";
  submenu: SubmenuItem[];
};

export const MENU_ITEMS: MenuItem[] = [
  {
    name: "USED PARTS",
    slug: "used-parts",
    kind: "category",
    submenu: [
      {
        name: "Drivetrain",
        slug: "drivetrain",
        imageBlack: "/images/wheelB.png",
        imageWhite: "/images/wheelW.png",
        submenu: [
          { name: "Chains", slug: "chains" },
          { name: "Sprockets", slug: "sprockets" },
          { name: "Chain Guard", slug: "chain-guard" },
          { name: "Chain and Sprockets Kit", slug: "chain-and-sprockets-kit" },
          { name: "Chain Oiler System", slug: "chain-oiler-system" },
          { name: "Chain Tools", slug: "chain-tools" },
          { name: "Clutch", slug: "clutch" },
          { name: "Clutch Plate", slug: "clutch-plate" }
        ]
      },
      {
        name: "Fuel Tank",
        slug: "fuel-tank",
        imageBlack: "/images/gas-tankB.png",
        imageWhite: "/images/gas-tankW.png",
        submenu: [
          { name: "Fuel Hose", slug: "fuel-hose" },
          { name: "Quick Connector", slug: "quick-connector" },
          { name: "Fuel Tank Cleaner", slug: "fuel-tank-cleaner" },
          { name: "Fuel Tank Deruster", slug: "fuel-tank-deruster" },
          { name: "Fuel Tank Sealant", slug: "fuel-tank-sealant" },
          { name: "Fuel Pump", slug: "fuel-pump" }
        ]
      },



      {
        name: "Suspension & Steering",
        slug: "suspension--steering",
        imageBlack: "/images/suspensionD.png",
        imageWhite: "/images/suspensionL.png",
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
        imageBlack: "/images/wheelD.png",
        imageWhite: "/images/wheelL.png",
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
        imageBlack: "/images/bicycleD.png",
        imageWhite: "/images/bicycleL.png",
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
        imageBlack: "/images/mufflerD.png",
        imageWhite: "/images/mufflerL.png",
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
        imageBlack: "/images/radiatorD.png",
        imageWhite: "/images/radiatorL.png",
        submenu: [
          { name: "Radiator", slug: "radiator" },
          { name: "Radiator Cap & Hoses", slug: "radiator-cap--hoses" },
          { name: "Water Pump", slug: "water-pump" }
        ]
      },
      {
        name: "Engine & Transmission",
        slug: "engine--transmission",
        imageBlack: "/images/engineD.png",
        imageWhite: "/images/engineL.png",
        submenu: [
          { name: "Engine Blocks / Crankcases", slug: "engine-blocks--crankcases" },
          { name: "Pistons / Cylinder Kits", slug: "pistons--cylinder-kits" },
          { name: "Camshaft / Valvetrain Parts", slug: "camshaft--valvetrain-parts" },
          { name: "Gearbox / Transmission Parts", slug: "gearbox--transmission-parts" },
          { name: "Gaskets & Seals", slug: "gaskets--seals" }
        ]
      },



      {
        name: "Electric",
        slug: "electric",
        imageBlack: "/images/wireB.png",
        imageWhite: "/images/wireW.png",
        submenu: [
          { name: "Regulator", slug: "regulator" },
          { name: "Starter", slug: "starter" },
          { name: "Alternator", slug: "alternator" },
          { name: "Battery Charger", slug: "battery-charger" },
          { name: "Sparkplug", slug: "sparkplug" },
          { name: "Battery", slug: "battery" },
          { name: "Contact Cleaner", slug: "contact-cleaner" },
          { name: "Battery Charger Accessories", slug: "battery-charger-accessories" },
          { name: "Battery Booster", slug: "battery-booster" },
          { name: "Tape", slug: "tape" },
          { name: "Spark Plug Wire", slug: "spark-plug-wire" },
          { name: "Spark Plug Cap", slug: "spark-plug-cap" },
          { name: "Ignition Coil", slug: "ignition-coil" },
          { name: "Flasher Relay", slug: "flasher-relay" },
          { name: "Clutch Switch", slug: "clutch-switch" },
          { name: "Brake Light Switch", slug: "brake-light-switch" },
          { name: "Starter Relay", slug: "starter-relay" }
        ]
      },
      {
        name: "Filters",
        slug: "filters",
        imageBlack: "/images/oil-filterB.png", 
        imageWhite: "/images/oil-filterW.png",
        submenu: [
          { name: "Oil Filter", slug: "oil-filter" },
          { name: "Air filter", slug: "air-filter" },
          { name: "Maintenance Package", slug: "maintenance-package" },
          { name: "Fuel Filter", slug: "fuel-filter" },
          { name: "Air Filter Oil", slug: "air-filter-oil" },
          { name: "Air Filter Cleaner", slug: "air-filter-cleaner" }
        ]
      },
      {
        name: "Oil & Fluids",
        slug: "oil--fluids",
        imageBlack: "/images/engine-oilB.png",
        imageWhite: "/images/engine-oilW.png",
        submenu: [
          { name: "Engine coolant", slug: "engine-coolant" },
          { name: "Engine Oil", slug: "engine-oil" },
          { name: "Clutch Fluid", slug: "clutch-fluid" },
          { name: "Fork Oil", slug: "fork-oil" },
          { name: "Transmission Oil", slug: "transmission-oil" },
          { name: "2 Stroke Oil", slug: "2-stroke-oil" },
          { name: "Oil Collection Tray", slug: "oil-collection-tray" },
          { name: "Shock absorber oil", slug: "shock-absorber-oil" }
        ]
      },
      {
        name: "Brakes",
        slug: "brakes",
        imageBlack: "/images/disc-brakeB.png",
        imageWhite: "/images/disc-brakeW.png",
        submenu: [
          { name: "Brake Fluid", slug: "brake-fluid" },
          { name: "Brake Disc Rear", slug: "brake-disc-rear" },
          { name: "Brake Cleaner", slug: "brake-cleaner" },
          { name: "Brake Disc Front", slug: "brake-disc-front" },
          { name: "Brake Pads", slug: "brake-pads" },
          { name: "Maintenance Package", slug: "maintenance-package" },
          { name: "Brake Bleeder", slug: "brake-bleeder" },
          { name: "Brake Caliper Repair Kit", slug: "brake-caliper-repair-kit" },
          { name: "Brake Pump Repair Kit", slug: "brake-pump-repair-kit" },
          { name: "Brake Piston Grease", slug: "brake-piston-grease" }
        ]
      },
      {
        name: "Handlebar & Controls",
        slug: "handlebar--controls",
        imageBlack: "/images/brakeB.png",
        imageWhite: "/images/brakeW.png",
        submenu: [
          { name: "Mirror set", slug: "mirror-set" },
          { name: "Mirror Adapter", slug: "mirror-adapter" },
          { name: "Mirror Holder", slug: "mirror-holder" },
          { name: "Throttle cable", slug: "throttle-cable" },
          { name: "Clutch Cable", slug: "clutch-cable" },
          { name: "Brake Lever", slug: "brake-lever" },
          { name: "Clutch Lever", slug: "clutch-lever" },
          { name: "Mirror Left", slug: "mirror-left" },
          { name: "Mirror Right", slug: "mirror-right" },
          { name: "Brake Line", slug: "brake-line" }
        ]
      },
      {
        name: "Maintenance",
        slug: "maintenance",
        imageBlack: "/images/settingsB.png",
        imageWhite: "/images/settingsW.png",
        submenu: [
          { name: "Assembly Paste", slug: "assembly-paste" },
          { name: "Chain Spray", slug: "chain-spray" },
          { name: "Lithium Grease", slug: "lithium-grease" },
          { name: "Bearing Grease", slug: "bearing-grease" },
          { name: "Liquid Gasket", slug: "liquid-gasket" },
          { name: "Drain Plug", slug: "drain-plug" },
          { name: "Multispray", slug: "multispray" },
          { name: "Radiator Cleaner", slug: "radiator-cleaner" },
          { name: "Carburetor Cleaner", slug: "carburetor-cleaner" },
          { name: "Penetrating Oil", slug: "penetrating-oil" },
          { name: "Drain Plug Washer", slug: "drain-plug-washer" },
          { name: "Gasket Paper", slug: "gasket-paper" },
          { name: "Clamps", slug: "clamps" },
          { name: "Engine Oil Cleaner", slug: "engine-oil-cleaner" },
          { name: "Chain Cleaner", slug: "chain-cleaner" },
          { name: "Molybdeen Grease", slug: "molybdeen-grease" },
          { name: "Alternator Cover Gasket", slug: "alternator-cover-gasket" },
          { name: "Clutch Cover Gasket", slug: "clutch-cover-gasket" },
          { name: "Valve cover gasket", slug: "valve-cover-gasket" },
          { name: "Primary Cover Gasket", slug: "primary-cover-gasket" }
        ]
      },
      {
        name: "Overhaul Kits",
        slug: "overhaul-kits",
        imageBlack: "/images/mechanic-toolsB.png",
        imageWhite: "/images/mechanic-toolsW.png",
        submenu: [
          { name: "Carburettor Repair Kit", slug: "carburettor-repair-kit" },
          { name: "Front Fork Oil Seal", slug: "front-fork-oil-seal" },
          { name: "Wheel Bearing", slug: "wheel-bearing" },
          { name: "Steering Bearing", slug: "steering-bearing" },
          { name: "Gaskets", slug: "gaskets" },
          { name: "Swingarm Bearing", slug: "swingarm-bearing" },
          { name: "Fuel Tap Repair Kit", slug: "fuel-tap-repair-kit" },
          { name: "Link System Bearing", slug: "link-system-bearing" },
          { name: "Shock Absorber Bearing", slug: "shock-absorber-bearing" },
          { name: "Front Fork Repair Kit", slug: "front-fork-repair-kit" }
        ]
      },
    ]
  },

  {
    name: "ACCESSORIES",
    slug: "accessory",
    kind: "accessory",
    submenu: [
      {
        name: "Accessories",
        slug: "accessories",
        imageBlack: "/images/gripB.png",
        imageWhite: "/images/gripW.png",
        submenu: [
          { name: "Heated Grips", slug: "heated-grips" },
          { name: "Motorcycle Cover", slug: "motorcycle-cover" },
          { name: "Cruise Control", slug: "cruise-control" },
          { name: "Windscreen Bolts", slug: "windscreen-bolts" },
          { name: "Grip Glue", slug: "grip-glue" },
          { name: "Tyre Shine", slug: "tyre-shine" },
          { name: "Kickstand Pad", slug: "kickstand-pad" }
        ]
      },
      {
        name: "Luggage",
        slug: "luggage",
        imageBlack: "/images/airpodsB.png",
        imageWhite: "/images/airpodsW.png",
        submenu: [
          { name: "Case Set", slug: "case-set" },
          { name: "Cargo Net", slug: "cargo-net" },
          { name: "Travelbag Kit", slug: "travelbag-kit" },
          { name: "Top Case", slug: "top-case" },
          { name: "Tank Bag", slug: "tank-bag" },
          { name: "Backpack", slug: "backpack" },
          { name: "Luggage Roll", slug: "luggage-roll" },
          { name: "Saddle Bag", slug: "saddle-bag" },
          { name: "Tank Bag Mounting", slug: "tank-bag-mounting" },
          { name: "Bag set", slug: "bag-set" },
          { name: "Bag Left", slug: "bag-left" },
          { name: "Bag Right", slug: "bag-right" },
          { name: "Suitcase Left", slug: "suitcase-left" },
          { name: "Suitcase Right", slug: "suitcase-right" },
          { name: "Luggage rack", slug: "luggage-rack" }
        ]
      },
      {
        name: "Fuel & Additives",
        slug: "fuel--additives",
        imageBlack: "/images/cosmeticB.png",
        imageWhite: "/images/cosmeticW.png",
        submenu: [
          { name: "Stabilizer", slug: "stabilizer" },
          { name: "Cleaner", slug: "cleaner" },
          { name: "Octane Booster", slug: "octane-booster" },
          { name: "E10 Additive", slug: "e10-additive" },
          { name: "Ecomaxx Fuel", slug: "ecomaxx-fuel" }
        ]
      },
      {
        name: "Wash & Shine",
        slug: "wash--shine",
        imageBlack: "/images/sprayB.png",
        imageWhite: "/images/sprayW.png",
        submenu: [
          { name: "Seat Spray", slug: "seat-spray" },
          { name: "Polish & Wax", slug: "polish--wax" },
          { name: "Chrome & Alu Polish", slug: "chrome--alu-polish" },
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
        name: "Riding Gear",
        slug: "riding-gear",
        imageBlack: "/images/suitB.png",
        imageWhite: "/images/suitW.png",
        submenu: [
          { name: "Clothing Care", slug: "clothing-care" },
          { name: "Pedal for Kids", slug: "pedal-for-kids" },
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
          { name: "Intercom", slug: "intercom" },
          { name: "Phone Holder", slug: "phone-holder" },
          { name: "Phone Holder Mounting", slug: "phone-holder-mounting" },
          { name: "Phone Holder Accessoires", slug: "phone-holder-accessoires" },
          { name: "Navigation System", slug: "navigation-system" },
          { name: "GPS Tracker / Alarm Systems", slug: "gps-tracker--alarm-systems" }
        ]
      },





    ]
  },

  {
  name: "BRANDS",
  slug: "brands",
  kind: "brand",
  submenu: [
    { name: "A", slug: "a", submenu: [
      { name: "A-Sider", slug: "a-sider" },
      { name: "AFAM", slug: "afam" },
      { name: "Abus", slug: "abus" },
      { name: "Acebikes", slug: "acebikes" },
      { name: "All Balls Racing", slug: "all-balls-racing" },
      { name: "Ate", slug: "ate" },
      { name: "Athena", slug: "athena" }
    ]},
    { name: "B", slug: "b", submenu: [
      { name: "BS Battery", slug: "bs-battery" },
      { name: "Barkbusters", slug: "barkbusters" },
      { name: "Barracuda", slug: "barracuda" },
      { name: "Beru", slug: "beru" },
      { name: "Bihr", slug: "bihr" },
      { name: "Bike Lift", slug: "bike-lift" },
      { name: "Bikeservice", slug: "bikeservice" },
      { name: "Brembo", slug: "brembo" }
    ]},
    { name: "C", slug: "c", submenu: [
      { name: "Castrol", slug: "castrol" },
      { name: "Centauro", slug: "centauro" }
    ]},
    { name: "D", slug: "d", submenu: [
      { name: "DS Covers", slug: "ds-covers" },
      { name: "Daytona", slug: "daytona" },
      { name: "Denali", slug: "denali" },
      { name: "Domino", slug: "domino" },
      { name: "Draper", slug: "draper" }
    ]},
    { name: "E", slug: "e", submenu: [
      { name: "Ecomaxx", slug: "ecomaxx" },
      { name: "Elring", slug: "elring" }
    ]},
    { name: "F", slug: "f", submenu: [
      { name: "Forté", slug: "forte" }
    ]},
    { name: "G", slug: "g", submenu: [
      { name: "GIVI", slug: "givi" },
      { name: "Garmin", slug: "garmin" }
    ]},
    { name: "H", slug: "h", submenu: [
      { name: "HPX", slug: "hpx" },
      { name: "Haynes", slug: "haynes" },
      { name: "Held", slug: "held" },
      { name: "Hepco & Becker", slug: "hepco-becker" },
      { name: "Hiflofiltro", slug: "hiflofiltro" },
      { name: "Hiplok", slug: "hiplok" }
    ]},
    { name: "I", slug: "i", submenu: [
      { name: "IK Sprayers", slug: "ik-sprayers" }
    ]},
    { name: "J", slug: "j", submenu: [
      { name: "JMP", slug: "jmp" },
      { name: "JT Sprockets", slug: "jt-sprockets" }
    ]},
    { name: "K", slug: "k", submenu: [
      { name: "K&N", slug: "k-n" },
      { name: "KAOKO", slug: "kaoko" }
    ]},
    { name: "L", slug: "l", submenu: [
      { name: "Liqui Moly", slug: "liqui-moly" },
      { name: "Loctite", slug: "loctite" }
    ]},
    { name: "M", slug: "m", submenu: [
      { name: "Mahle", slug: "mahle" },
      { name: "Motion Pro", slug: "motion-pro" },
      { name: "Motobrackets", slug: "motobrackets" },
      { name: "Motorcycle Storehouse", slug: "motorcycle-storehouse" },
      { name: "Motul", slug: "motul" },
      { name: "Muc-Off", slug: "muc-off" }
    ]},
    { name: "N", slug: "n", submenu: [
      { name: "NGK", slug: "ngk" },
      { name: "NOCO", slug: "noco" }
    ]},
    { name: "O", slug: "o", submenu: [
      { name: "Onedesign", slug: "onedesign" },
      { name: "Osram", slug: "osram" },
      { name: "Oxford", slug: "oxford" }
    ]},
    { name: "P", slug: "p", submenu: [
      { name: "Pressol", slug: "pressol" },
      { name: "Putoline", slug: "putoline" }
    ]},
    { name: "Q", slug: "q", submenu: [
      { name: "Quad Lock", slug: "quad-lock" }
    ]},
    { name: "R", slug: "r", submenu: [
      { name: "RK", slug: "rk" },
      { name: "Roadlok", slug: "roadlok" }
    ]},
    { name: "S", slug: "s", submenu: [
      { name: "SP Connect", slug: "sp-connect" },
      { name: "SW-Motech", slug: "sw-motech" },
      { name: "Sachs", slug: "sachs" },
      { name: "Scottoiler", slug: "scottoiler" },
      { name: "Sena", slug: "sena" },
      { name: "Sonic", slug: "sonic" }
    ]},
    { name: "T", slug: "t", submenu: [
      { name: "TNK", slug: "tnk" },
      { name: "TRW", slug: "trw" },
      { name: "Tank Cure", slug: "tank-cure" },
      { name: "Tecmate", slug: "tecmate" },
      { name: "Tecnium", slug: "tecnium" },
      { name: "TomTom", slug: "tomtom" },
      { name: "Tsubaki", slug: "tsubaki" },
      { name: "Twin Air", slug: "twin-air" }
    ]},
    { name: "V", slug: "v", submenu: [
      { name: "V-Parts", slug: "v-parts" },
      { name: "Vector", slug: "vector" }
    ]},
    { name: "W", slug: "w", submenu: [
      { name: "WAI Global", slug: "wai-global" },
      { name: "WRS", slug: "wrs" },
      { name: "Wunderlich", slug: "wunderlich" }
    ]},
    { name: "Y", slug: "y", submenu: [
      { name: "Yuasa", slug: "yuasa" }
    ]}
  ]
}
];


export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export const SHOPIFY_GRAPHQL_API_ENDPOINT = `/api/2023-01/graphql.json`;
