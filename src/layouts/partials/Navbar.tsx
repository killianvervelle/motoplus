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

    const handleClick = (parent: string, child: string) => {
        const params = new URLSearchParams();

        const p = parent.toLowerCase();

        if (["brands", "marcas", "marques"].includes(p)) {
            params.set("v", child);
        } else if (["accessories", "accessoires", "acessórios"].includes(p)) {
            params.set("c", child);
        } else if (["used parts", "peças usadas", "pièces d'occasion"].includes(p)) {
            params.set("c", child);
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

                        {MENU_ITEMS.map((menuItem, i) => {
                            const isOpen = openIndex === i;
                            const panelId = `megamenu-${menuItem.slug}`;
                            return (
                                <li
                                    key={menuItem.slug}
                                    className="px-2"
                                    onMouseEnter={() => open(i)}
                                    onMouseLeave={close}
                                    onFocus={() => open(i)}
                                    onBlur={(e) => {
                                        if (!e.currentTarget.contains(e.relatedTarget as Node)) close();
                                    }}
                                >
                                    <button
                                        className={clsx(
                                            "text-[14px] px-1 py-1 rounded transition-colors hover:text-[#c60404] font-bold",
                                            "text-[#29292c] dark:text-white dark:hover:text-[#c60404]",
                                            isOpen && "bg-white/70 dark:bg-white/10"
                                        )}
                                        aria-haspopup="true"
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => (isOpen ? close() : open(i))}
                                        onKeyDown={(e) => e.key === "Escape" && close()}
                                    >
                                        {translateClient("menu", menuItem.slug)}
                                    </button>

                                    <div
                                        id={panelId}
                                        role="menu"
                                        className={clsx(
                                            "absolute left-0 -mt-1 top-full w-full z-[70] opacity-0 invisible pointer-events-none",
                                            "transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] ",
                                            isOpen && "opacity-100 visible translate-y-0"
                                        )}
                                        onMouseLeave={close}
                                        onMouseEnter={() => open(i)}
                                    >
                                        <div className="bg-[#fafafc] rounded-b-md container  dark:bg-darkmode-body w-full border border-gray-200 dark:border-border/40 shadow-xl pointer-events-auto relative">
                                            <div className="p-6">
                                                <ul className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-x-8 [column-fill:_balance] space-y-5">
                                                    {menuItem.submenu.map((section) => {
                                                        const items = Array.isArray(section.submenu) ? section.submenu : [];

                                                        return (
                                                            <li
                                                                key={section.slug}
                                                                className="inline-block w-full align-top space-y-2 mb-6 break-inside-avoid
                                                                [page-break-inside:avoid] [-webkit-column-break-inside:avoid]"
                                                            >
                                                                {section.imageWhite ?
                                                                    <div className="flex items-center justify-left gap-5 px-2">
                                                                        <Image
                                                                            src={
                                                                                resolvedTheme === "dark"
                                                                                    ? section.imageWhite || "/images/placeholder.png"
                                                                                    : section.imageBlack || "/images/placeholder.png"
                                                                            }
                                                                            alt="Logo"
                                                                            width={30}
                                                                            height={30}
                                                                            style={{ height: 'auto', width: '30px' }}
                                                                            className={resolvedTheme === "dark" ? "invert brightness-100" : ""}
                                                                        />
                                                                        <Link
                                                                            href="#"
                                                                            className="inline-block text-[15px] font-extrabold text-[#c70303] dark:text-[#c70303]
                                                                         decoration-current cursor-default
                                                                        focus-visible:underline focus-visible:outline-none rounded"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                close();
                                                                            }}
                                                                            role="menuitem"
                                                                        >
                                                                            {translateClient("menu", section.slug)}
                                                                        </Link>
                                                                    </div>
                                                                    :
                                                                    <div className="px-2">
                                                                        <Link
                                                                            href={{ pathname: "/products", query: { group: menuItem.slug, subgroup: section.slug } }}
                                                                            className="inline-block text-[15px] font-extrabold text-[#c70303] dark:text-[#c70303]
                                                                        hover:underline underline-offset-4 decoration-current dark:hover:text-[#c60404]
                                                                        focus-visible:underline focus-visible:outline-none rounded"
                                                                            onClick={close}
                                                                            role="menuitem"
                                                                        >
                                                                            {translateClient("menu", section.slug)}
                                                                        </Link>
                                                                    </div>
                                                                }

                                                                <ul className="flex flex-wrap items-center">
                                                                    {items.length === 0 ? (
                                                                        <li>
                                                                            <Link
                                                                                href={{
                                                                                    pathname: "/products",
                                                                                    query: { group: menuItem.slug, subgroup: section.slug },
                                                                                }}
                                                                                className="text-sm font-medium text-[#1d1d1f] dark:hover:text-[#c60404] hover:bg-[#f5f5f7] dark:text-white dark:hover:bg-white/5 rounded-md py-1 px-1"
                                                                                onClick={close}
                                                                                role="menuitem"
                                                                            >
                                                                                {translateClient("menu", section.slug)}
                                                                            </Link>
                                                                        </li>
                                                                    ) : (
                                                                        items.map((item, idx) => (
                                                                            <li key={item.slug} className="inline">
                                                                                <Link
                                                                                    href="#"
                                                                                    className="text-sm hover:underline font-semibold text-[#1d1d1f] dark:hover:text-[#c60404] dark:text-white rounded-md py-1 px-1"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        handleClick(menuItem.name, item.slug)
                                                                                        close();
                                                                                    }
                                                                                    }
                                                                                    role="menuitem"
                                                                                >
                                                                                    {translateClient("menu", item.slug)}
                                                                                </Link>
                                                                                {idx < items.length - 1 && <span>,&nbsp;</span>}
                                                                            </li>
                                                                        ))
                                                                    )}
                                                                </ul>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                            <Suspense fallback={<SkeletonFeaturedProducts />}>
                                                <div className='flex justify-center mt-7'>
                                                    <Link
                                                        className={`${openIndex !== null ? "block" : "hidden"} absolute bottom-4 right-4 btn btn-sm hover:bg-gray-700 btn-primary font-medium`}
                                                        href={'/products'}
                                                        onClick={close}>
                                                        {translatedSeeAll}
                                                    </Link>
                                                </div>
                                            </Suspense>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
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
            </nav>
        </div>
    );
}