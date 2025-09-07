export type LanguageItem = {
    title: string;
    code: string;
}

export const defaultLanguage: LanguageItem = {
    title: "English",
    code: "en"
};

export const languageItems: LanguageItem[] = [
  defaultLanguage,
  { title: "Portugese", code: "pt" },
  { title: "French", code: "fr" },
]

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
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

export type SubmenuItem = {
  name: string;
  slug: string;
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
      { name: "Engine Parts", slug: "engine-parts" },
      { name: "Suspension", slug: "suspension" },
      { name: "Brakes", slug: "brakes" },
      { name: "Bodywork", slug: "bodywork" },
      { name: "Electrical Components", slug: "electrical-components" },
      { name: "Exhaust Systems", slug: "exhaust-systems" },
      { name: "Wheels & Tires", slug: "wheels-tires" },
      { name: "Transmission Parts", slug: "transmission-parts" },
      { name: "Cooling Systems", slug: "cooling-systems" },
      { name: "Fuel Systems", slug: "fuel-systems" },
      { name: "Clutch Components", slug: "clutch-components" },
      { name: "Steering Components", slug: "steering-components" },
      { name: "Miscellaneous Parts", slug: "miscellaneous-parts" },
    ],
  },
  {
    name: "ACCESSSORIES",
    slug: "accessories",
    kind: "accessory",
    submenu: [
      { name: "Riding Gear", slug: "riding-gear" },
      { name: "Helmets", slug: "helmets" },
      { name: "Gloves", slug: "gloves" },
      { name: "Jackets", slug: "jackets" },
      { name: "Pants", slug: "pants" },
      { name: "Boots", slug: "boots" },
      { name: "Luggage & Storage", slug: "luggage-storage" },
      { name: "Communication Systems", slug: "communication-systems" },
      { name: "Navigation Systems", slug: "navigation-systems" },
      { name: "Covers & Protection", slug: "covers-protection" },
      { name: "Maintenance & Cleaning", slug: "maintenance-cleaning" },
      { name: "Miscellaneous Accessories", slug: "miscellaneous-accessories" },
    ],
  },
  {
    name: "BRANDS",
    slug: "brands",
    kind: "brand",
    submenu: [
      { name: "Honda", slug: "honda" },
      { name: "Yamaha", slug: "yamaha" },
      { name: "Suzuki", slug: "suzuki" },
      { name: "Kawasaki", slug: "kawasaki" },
      { name: "Ducati", slug: "ducati" },
      { name: "BMW", slug: "bmw" },
      { name: "Harley-Davidson", slug: "harley-davidson" },
      { name: "KTM", slug: "ktm" },
      { name: "Triumph", slug: "triumph" },
      { name: "Aprilia", slug: "aprilia" },
      { name: "Moto Guzzi", slug: "moto-guzzi" },
      { name: "Royal Enfield", slug: "royal-enfield" },
      { name: "Other Brands", slug: "other-brands" },
    ],
  },
];


export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";
export const DEFAULT_OPTION = "Default Title";
export const SHOPIFY_GRAPHQL_API_ENDPOINT = `/api/2023-01/graphql.json`;
