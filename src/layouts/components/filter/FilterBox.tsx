"use client";

import { useMemo, useState } from "react";
import { HomeFilterBoxProp } from "@/lib/constants";
import { slugify } from "@/lib/utils/textConverter"
import Image from "next/image";
import { useRouter } from "next/navigation";


const FilterBox = ({
    filtersBrands,
    filtersComponents,
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

    const brands = useMemo(() => Object.keys(filtersBrands).sort(), [filtersBrands]);

    type Pick = { name: string; slug: string } | null;

    const models = useMemo(() => {
        if (!selectedBrand) return [];
        return (filtersBrands[selectedBrand.name] ?? []).sort();
    }, [filtersBrands, selectedBrand]);

    const toggleSelect = (key: string) => {
        setOpenSelect(openSelect === key ? null : key);
    };

    const closeAnd = (fn: () => void) => () => {
        fn();
        setOpenSelect(null);
    };

    const handleSearch = () => {
        setAnimate(true);
        const params = new URLSearchParams();
        if (selectedBrand) params.set("brand", slugify(selectedBrand.slug));
        if (selectedModel) params.set("model", slugify(selectedModel.slug));
        if (selectedComponent) params.set("part", slugify(selectedComponent.slug));
        router.push(`/products?${params.toString()}`);
    }

    return (
        <div className="bg-[#232222] min-h-[150px] text-white px-10 py-10 rounded-2xl shadow-lg opacity-97">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                    <span className="hidden sm:block font-semibold text-3xl pb-6 text-white">{title}</span>
                    <div className="flex flex-row justify-between gap-4">
                        <span className="font-semibold text-xl text-[#c70303]">{subtitle}</span>
                        <span className="hidden sm:block font-semibold text-lg text-white">{`${available}${totalProducts}${available2}`}</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <button
                            type="button"
                            className="inline-flex w-full justify-between items-center rounded-md bg-white px-3 py-2 text-[16px] font-semibold shadow-sm ring-1 ring-inset ring-gray-300 disabled:cursor-not-allowed cursor-pointer"
                            onClick={() => toggleSelect("Brand")}
                        >
                            <span className="text-gray-600 truncate">
                                {selectedBrand?.name ?? `${brand}`}
                            </span>
                            <Chevron open={openSelect === "Brand"} />
                        </button>
                        {openSelect === "Brand" && (
                            <ul className="absolute left-0 w-full z-10 mt-2 max-h-64 overflow-auto bg-white text-sm text-gray-700 rounded-md shadow-lg">
                                {brands.map((b) => (
                                    <li
                                        key={b}
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={closeAnd(() => {
                                            setSelectedBrand(b);
                                            setSelectedModel(null);
                                        })}
                                    >
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            className="inline-flex w-full justify-between items-center rounded-md bg-white px-3 py-2 text-[16px] font-semibold shadow-sm ring-1 ring-inset ring-gray-300 disabled:cursor-not-allowed cursor-pointer disabled:opacity-50"
                            onClick={() => selectedBrand && toggleSelect("Model")}
                            disabled={!selectedBrand}
                        >
                            <span className="text-gray-600 truncate">
                                {selectedModel?.name ?? `${model}`}
                            </span>
                            <Chevron open={openSelect === "Model"} />
                        </button>
                        {openSelect === "Model" && (
                            <ul className="absolute left-0 w-full z-10 mt-2 max-h-64 overflow-auto bg-white text-sm text-gray-700 rounded-md shadow-lg">
                                {models.map((m) => (
                                    <li
                                        key={m}
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={closeAnd(() => setSelectedModel(m))}
                                    >
                                        {m}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            className="inline-flex w-full justify-between items-center rounded-md bg-white px-3 py-2 text-[16px] font-semibold shadow-sm ring-1 ring-inset ring-gray-300 disabled:cursor-not-allowed cursor-pointer disabled:opacity-50"
                            onClick={() => selectedModel && toggleSelect("Component")}
                            disabled={!selectedModel}
                        >
                            <span className="text-gray-600 truncate">
                                {selectedComponent?.name ?? `${part}`}
                            </span>
                            <Chevron open={openSelect === "Component"} />
                        </button>
                        {openSelect === "Component" && (
                            <ul className="absolute left-0 w-full z-10 mt-2 max-h-64 overflow-auto bg-white text-gray-700 text-sm rounded-md shadow-lg">
                                {Object.entries(filtersComponents).map(([groupName, items]) => (
                                    <li key={groupName}>
                                        <div className="px-4 py-2 font-semibold text-[#c70303]">
                                            {groupName}
                                        </div>

                                        <ul>
                                            {items.map((item) => (
                                                <li
                                                    key={item}
                                                    className="px-6 py-2 hover:bg-gray-200 cursor-pointer"
                                                    onClick={closeAnd(() => setSelectedComponent(item))}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <button
                            type="button"
                            className="inline-flex w-full justify-center items-center rounded-md bg-[#c70303] hover:bg-[#930101] px-3 py-2 text-[16px] font-semibold shadow-sm ring-1 ring-inset ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => handleSearch()}
                            disabled={!selectedBrand}
                        >
                            <div className="flex flex-row items-center justify-between gap-3">
                                <span className="text-white">
                                    {search}
                                </span>
                                <Image
                                    src={"/images/moto.png"}
                                    alt="Logo"
                                    width={22}
                                    height={22}
                                    style={{ height: "auto", width: "22px" }}
                                    className={`duration-4000 ease-in-out overflow-hidden
                                        ${animate ? "lg:translate-x-[2000px] sm:translate-x-[100px] -rotate-70 opacity-100" : "translate-x-0 rotate-0 opacity-100"}`}
                                />
                            </div>

                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Chevron = ({ open }: { open: boolean }) => (
    < svg
        className={`h-5 w-5 text-gray-400 transform ${open ? "rotate-180" : ""} transition-transform`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
        />
    </svg >
)

export default FilterBox;
