"use client";

import React, { useState, useCallback } from 'react'
import { MENU_ITEMS } from '@/lib/constants';
import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { translateClient } from "../../lib/utils/translateClient";
import { useTheme } from "next-themes";
import { Suspense } from "react";
import SkeletonFeaturedProducts from "@/components/loadings/skeleton/SkeletonFeaturedProducts";
import { useRouter } from "next/navigation";


export default function Navbar() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const open = useCallback((i: number) => setOpenIndex(i), []);
    const close = useCallback(() => setOpenIndex(null), []);
    const router = useRouter();
    const { resolvedTheme } = useTheme();

    const translatedSeeAll = translateClient("featuredProducts", "see-all-products")
    const transaltedGallery = translateClient("gallery", "gallery")
    const translatedMoto = translateClient("moto", "moto")
    const translateMotobilia = translateClient("motobilia", "motobilia")

    const handleClick = (parent: string, child?: string) => {
        const params = new URLSearchParams();

        const p = parent.toLowerCase();


        if (["accessories", "accessoires", "acessórios"].includes(p)) {
            params.set("t", "accessories");
            if (child) params.set("c", child);
        } else if (["used parts", "peças usadas", "pièces d'occasion"].includes(p)) {
            params.set("t", "moto-parts");
            if (child) params.set("c", child);
            params.set("condition", "used");
        } else if (["new parts", "novas peças", "nouvelles pièces"].includes(p)) {
            params.set("t", "moto-parts");
            if (child) params.set("c", child);
            params.set("condition", "new");
        }

        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className=" bg-[#d7d7d7] dark:bg-darkmode-light">
            <div
                className={clsx(
                    "fixed inset-0 transition-opacity duration-300",
                    openIndex !== null
                        ? "opacity-100 bg-black/50 dark:bg-black/70  pointer-events-auto z-[30]"
                        : "opacity-0 pointer-events-none z-0"
                )}
                onClick={close}
                aria-hidden="true"
            />

            <nav className="navbar hidden md:flex bg-[#c7c6c6] dark:bg-darkmode-light z-50">
                <div className="container flex justify-between items-center">
                    <ul className="flex items-center justify-start ">
                        <li>
                            <Link href="/" aria-label="Home" onClick={() => close()} scroll className="inline-flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 cursor-pointer hover:text-[#c60404] font-bold text-text-dark dark:text-white mt-1 mr-2"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    role="img"
                                >
                                    <path d="M3 10.5L12 4l9 6.5" />
                                    <path d="M5 10.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9.5" />
                                    <path d="M9.5 21v-5.5h5V21" />
                                </svg>
                            </Link>
                        </li>

                        <li key="products" className="px-2">
                            <Link
                                href={{
                                    pathname: "/products",
                                    query: { t: "motos" },
                                }}
                                className="inline-flex items-center text-[14px] px-1 py-1 rounded transition-colors font-bold
                                        text-[#29292c] dark:text-white hover:text-[#c60404]
                                        hover:bg-white/70 dark:hover:bg-white/10"
                            >
                                {translatedMoto}
                            </Link>
                        </li>
                        {MENU_ITEMS.map((menuItem, i) => {
                            return (
                                <li
                                    key={menuItem.slug}
                                    className="px-2"
                                >
                                <div
                                className="inline-flex items-center text-[14px] px-1 py-1 rounded transition-colors font-bold
                                        text-[#29292c] dark:text-white hover:text-[#c60404]
                                        hover:bg-white/70 dark:hover:bg-white/10 hover:cursor-pointer"
                                onClick={() => handleClick(menuItem.name)}
                            >
                                {menuItem.name}
                            </div>  
                                </li>
                            );
                        })}
                        <li key="collectibles" className="px-2">
                            <Link
                                href={{
                                    pathname: "/products",
                                    query: { t: "collectibles" },
                                }}
                                className="inline-flex items-center text-[14px] px-1 py-1 rounded transition-colors font-bold
                                        text-[#29292c] dark:text-white hover:text-[#c60404]
                                        hover:bg-white/70 dark:hover:bg-white/10"
                            >
                                {translateMotobilia}
                            </Link>
                        </li>
                        <li key="gallery" className="px-2">
                            <Link
                                href="/gallery"
                                className="inline-flex items-center text-[14px] px-1 py-1 rounded transition-colors font-bold
                                        text-[#29292c] dark:text-white hover:text-[#c60404]
                                        hover:bg-white/70 dark:hover:bg-white/10"
                            >
                                {transaltedGallery}
                            </Link>
                        </li>
                    </ul>
                    <div className="flex items-center gap-2">
                        <img
                            src="/images/google.png"
                            alt="Google"
                            className="w-4 h-4"
                        />

                        <div className="flex items-center gap-1">
                            {[...Array(4)].map((_, i) => (
                                <svg
                                    key={i}
                                    className="w-4 h-4 text-yellow-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286
                                    3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588
                                    1.81l-3.387 2.46a1 1 0 00-.364 1.118l1.286
                                    3.967c.3.921-.755 1.688-1.54 1.118l-3.387-2.46a1
                                    1 0 00-1.175 0l-3.387 2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.967a1
                                    1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0
                                    00.95-.69l1.286-3.967z" />
                                </svg>
                            ))}
                            <div className="relative w-4 h-4">
                                {/* yellow half–star on top */}
                                <svg
                                    className="absolute inset-0 w-4 h-4 z-10 text-yellow-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <defs>
                                        <linearGradient id="half-yellow">
                                            <stop offset="50%" stopColor="currentColor" />
                                            <stop offset="50%" stopColor="transparent" />
                                        </linearGradient>
                                    </defs>
                                    <path fill="url(#half-yellow)" d="M9.049 2.927c.3-.921 1.603-.921
                                    1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0
                                    1.371 1.24.588 1.81l-3.387 2.46a1 1 0
                                    00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.54
                                    1.118l-3.387-2.46a1 1 0 00-1.175 0l-3.387
                                    2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.967a1
                                    1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0
                                    00.95-.69l1.286-3.967z"/>
                                </svg>

                                {/* black full star as background */}
                                <svg
                                    className="absolute inset-0 w-4 h-4 text-gray-100"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921
                                    1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0
                                    1.371 1.24.588 1.81l-3.387 2.46a1 1 0
                                    00-.364 1.118l1.286 3.967c.3.921-.755 1.688-1.54
                                    1.118l-3.387-2.46a1 1 0 00-1.175 0l-3.387
                                    2.46c-.784.57-1.838-.197-1.54-1.118l1.286-3.967a1
                                    1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0
                                    00.95-.69l1.286-3.967z"/>
                                </svg>
                            </div>

                            <span className="ml-1 font-semibold text-sm">4.5 / 5</span>
                        </div>
                    </div>
                </div>
            </nav >
        </div >
    );
}