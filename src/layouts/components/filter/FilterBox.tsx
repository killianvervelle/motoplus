"use client";

import { useMemo, useState } from "react";
import { HomeFilterBoxProp } from "@/lib/constants";
import { slugify } from "@/lib/utils/textConverter";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const FilterBox = ({
    filtersBrands,
    totalProducts,
    title,
    subtitle,
    brand,
    model,
    part,
    search,
    available,
    available2
}: HomeFilterBoxProp) => {
    const [openSelect, setOpenSelect] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<Pick | null>(null);
    const [selectedModel, setSelectedModel] = useState<Pick | null>(null);
    const [selectedComponent, setSelectedComponent] = useState<Pick | null>(null);
    const [animate, setAnimate] = useState(false);
    const router = useRouter();

    type Pick = { name: string; handle: string } | null;

    const toggleSelect = (key: string) => {
        setOpenSelect(openSelect === key ? null : key);
    };

    const closeAnd = (fn: () => void) => () => {
        fn();
        setOpenSelect(null);
    };

    const t = useTranslations("older");

    // 1. Brands
    const brands = useMemo(() => Object.keys(filtersBrands).sort(), [filtersBrands]);

    // 2. Models
    const models = useMemo(() => {
        if (!selectedBrand) return [];
        const brandModelsObj = filtersBrands[selectedBrand.name]?.models || {};
        return Object.entries(brandModelsObj).map(([name, data]: [string, any]) => ({
            name: name,
            handle: data.handle
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, [filtersBrands, selectedBrand]);

    // 3. Components
    const componentOptions = useMemo(() => {
    if (!selectedBrand || !selectedModel) return [];

    // Log the keys we are about to use to see if they match the screenshot exactly

    const brandData = (filtersBrands as Record<string, any>)[selectedBrand.name];
    const modelData = brandData?.models?.[selectedModel.name];

    if (!modelData) {
        console.warn("Model Data not found for key:", selectedModel.name);
        return [];
    }

    return (modelData.components || []).sort();
}, [filtersBrands, selectedBrand, selectedModel]);

    // --- SEARCH REDIRECT ---
    const handleSearch = () => {
    setAnimate(true);
    const params = new URLSearchParams();

    if (selectedBrand) params.set("brand", selectedBrand.name);
    if (selectedModel) params.set("model", selectedModel.name);
    
    // CHANGE THIS: 
    // Instead of checking against a hardcoded string "Part", 
    // just check if selectedComponent exists. 
    // We already know it's only set when a user clicks a real option.
    if (selectedComponent) {
        params.set("component", selectedComponent.name);
    }

    const queryString = params.toString();

    setTimeout(() => {
        router.push(`/products?${queryString}`);
    }, 800);
};

    return (
        <div className="bg-[#232222] min-h-[150px] text-white px-10 py-10 rounded-2xl shadow-lg opacity-97 w-full max-w-6xl mx-auto">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <span className="hidden sm:block font-semibold text-3xl pb-6 text-white">{title}</span>
                    <div className="flex flex-row justify-between gap-4">
                        <span className="font-semibold text-xl text-[#c70303]">{subtitle}</span>
                        <span className="hidden sm:block font-semibold text-lg text-white">{`${available}${totalProducts}${available2}`}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Brand Select */}
                    <div className="relative">
                        <button
                            type="button"
                            className="inline-flex w-full justify-between items-center rounded-md bg-white px-3 py-2 text-[16px] font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 cursor-pointer"
                            onClick={() => toggleSelect("Brand")}
                        >
                            <span className="truncate">{selectedBrand?.name ?? brand}</span>
                            <Chevron open={openSelect === "Brand"} />
                        </button>
                        {openSelect === "Brand" && (
                            <ul className="absolute left-0 w-full z-20 mt-2 max-h-64 overflow-auto bg-white text-sm text-gray-700 rounded-md shadow-lg border">
                                {brands.map((b) => (
                                    <li
                                        key={filtersBrands[b].handle}
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={closeAnd(() => {
                                            setSelectedBrand({ name: b, handle: filtersBrands[b].handle });
                                            setSelectedModel(null);
                                            setSelectedComponent(null);
                                        })}
                                    >
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Model Select */}
                    <div className="relative">
                        <button
                            type="button"
                            disabled={!selectedBrand}
                            className="inline-flex w-full justify-between items-center rounded-md bg-white px-3 py-2 text-[16px] font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            onClick={() => toggleSelect("Model")}
                        >
                            <span className="truncate">{selectedModel?.name ?? model}</span>
                            <Chevron open={openSelect === "Model"} />
                        </button>
                        {openSelect === "Model" && (
                            <ul className="absolute left-0 w-full z-20 mt-2 max-h-64 overflow-auto bg-white text-sm text-gray-700 rounded-md shadow-lg border">
                                {models.map((m, index) => (
                                    <li
                                        key={`${m.handle}-${index}`}
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={closeAnd(() => {
                                            setSelectedModel({ name: m.name, handle: m.handle });
                                            setSelectedComponent(null);
                                        })}
                                    >
                                        {m.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Component Select */}
                    <div className="relative">
                        <button
                            type="button"
                            disabled={!selectedModel}
                            className="inline-flex w-full justify-between items-center rounded-md bg-white px-3 py-2 text-[16px] font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            onClick={() => toggleSelect("Component")}
                        >
                            <span className="truncate">{selectedComponent?.name ?? part}</span>
                            <Chevron open={openSelect === "Component"} />
                        </button>
                        {openSelect === "Component" && (
                            <ul className="absolute left-0 w-full z-20 mt-2 max-h-64 overflow-auto bg-white text-sm text-gray-700 rounded-md shadow-lg border">
                                {componentOptions.map((item: any) => (
                                    <li
                                        key={item}
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={closeAnd(() => {
                                            setSelectedComponent({ name: item, handle: slugify(item) });
                                        })}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Search Button */}
                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={!selectedBrand || animate}
                        className="inline-flex w-full justify-center items-center rounded-md bg-[#c70303] hover:bg-[#930101] px-3 py-2 text-[16px] font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative overflow-hidden"
                    >
                        <div className="flex flex-row items-center justify-between gap-3">
                            <span>{search}</span>
                            <Image
                                src="/images/moto.png"
                                alt="Moto Icon"
                                width={22}
                                height={22}
                                className={`transition-transform duration-[800ms] ease-in-out ${
                                    animate ? "translate-x-[500px] -rotate-12" : "translate-x-0"
                                }`}
                            />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

const Chevron = ({ open }: { open: boolean }) => (
    <svg
        className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
);

export default FilterBox;