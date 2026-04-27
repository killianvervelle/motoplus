"use client";

import ShowTags from '@/components/product/ShowTags'
import RangeSlider from '@/components/rangeSlider/RangeSlider'
import { ShopifyCollection } from '@/lib/shopify/types'
import { createUrl } from '@/lib/utils'
//import { slugify } from '@/lib/utils/textConverter'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { translateClient } from "../../lib/utils/translateClient";


const ProductFilters = ({
  brands_,
  models_,
  components_,
  maxPriceData,
}: {
  brands_: { brand: string; productCount: number }[];
  models_: { model: string; productCount: number }[];
  components_: { component: string; productCount: number }[];
  maxPriceData: { amount: string; currencyCode: string };
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current active filters from URL
  const selectedBrand = searchParams.get('brand');
  const selectedModel = searchParams.get('model');
  const selectedComponent = searchParams.get('component');

  // Generic handler to update URL params
  const handleFilterClick = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (newParams.get(key) === value) {
      newParams.delete(key);
      // Logic: If you deselect a Brand, clear dependent Model/Component
      if (key === 'brand') {
        newParams.delete('model');
        newParams.delete('component');
      }
      if (key === 'model') newParams.delete('component');
    } else {
      newParams.set(key, value);
      // Reset pagination when filter changes
      newParams.delete('cursor');
      newParams.delete('page');
    }
    
    router.push(createUrl("/products", newParams), { scroll: false });
  };

  const priceRangeLabel = translateClient("product-filters", "price-range");
  const brandsLabel = translateClient("product-filters", "brands");
  const modelsLabel = translateClient("product-filters", "models"); // usually "Models" in your context
  const componentsLabel = translateClient("product-filters", "components"); // usually "Components"

  return (
    <div className="space-y-8">
      {/* PRICE RANGE */}
      <div>
        <h5 className='mb-2 lg:text-xl'>{priceRangeLabel}</h5>
        <hr className='border-[#cecece] dark:border-darkmode-border' />
        <div className='pt-4'>
          <Suspense>
            <RangeSlider maxPriceData={maxPriceData} />
          </Suspense>
        </div>
      </div>

      {/* BRANDS */}
      {brands_.length > 0 && (
        <div>
          <h5 className="mb-2 lg:text-xl">{brandsLabel}</h5>
          <hr className="border-[#cecece] dark:border-darkmode-border" />
          <ul className="mt-4 space-y-3">
            {brands_.map((b) => (
              <li
                key={b.brand}
                className={`flex items-center justify-between cursor-pointer text-sm transition-colors hover:text-black ${
                  selectedBrand === b.brand
                    ? 'text-text-dark dark:text-darkmode-text-dark font-bold'
                    : 'text-text-light dark:text-darkmode-text-light'
                }`}
                onClick={() => handleFilterClick('brand', b.brand)}
              >
                <span>{b.brand} ({b.productCount})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* MODELS - Shows if a brand is selected OR if models exist */}
      {(selectedBrand || models_.length > 0) && models_.length > 0 && (
        <div>
          <h5 className="mb-2 mt-4 lg:mt-6 lg:text-xl">{modelsLabel}</h5>
          <hr className="border-[#cecece] dark:border-darkmode-border" />
          <ul className="mt-4 space-y-3">
            {models_.map((m) => (
              <li
                key={m.model}
                className={`flex items-center justify-between cursor-pointer text-sm transition-colors hover:text-black ${
                  selectedModel === m.model
                    ? 'text-text-dark dark:text-darkmode-text-dark font-bold'
                    : 'text-text-light dark:text-darkmode-text-light'
                }`}
                onClick={() => handleFilterClick('model', m.model)}
              >
                <span>{m.model} ({m.productCount})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* COMPONENTS - Shows if a model is selected OR if components exist */}
      {(selectedModel || components_.length > 0) && components_.length > 0 && (
        <div>
          <h5 className="mb-2 mt-8 lg:mt-10 lg:text-xl">{componentsLabel}</h5>
          <hr className="border-[#cecece] dark:border-darkmode-border" />
          <ul className="mt-4 space-y-3">
            {components_.map((c) => (
              <li
                key={c.component}
                className={`flex items-center justify-between cursor-pointer text-sm transition-colors hover:text-black ${
                  selectedComponent === c.component
                    ? 'text-text-dark dark:text-darkmode-text-dark font-bold'
                    : 'text-text-light dark:text-darkmode-text-light'
                }`}
                onClick={() => handleFilterClick('component', c.component)}
              >
                <span>{c.component} ({c.productCount})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
