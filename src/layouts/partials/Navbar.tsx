"use client";

import React, { useState, useCallback } from 'react'
//import { useSearchParams, useRouter } from 'next/navigation'
import { MENU_ITEMS } from '@/lib/constants';
//import { createUrl } from '@/lib/utils'
import Link from "next/link";
import clsx from "clsx";

export default function Navbar() {
    //const router = useRouter();
    //const searchParams = useSearchParams();
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const open = useCallback((i: number) => setOpenIndex(i), []);
    const close = useCallback(() => setOpenIndex(null), []);


    /**type MenuKind = "brand" | "category" | "accessory";

    const setSingleParam = (key: "b" | "c" | "a", value: string, scroll = true) => {
        const params = new URLSearchParams(searchParams?.toString() ?? "");
        params.delete(key);
        params.append(key, value);
        router.push(createUrl("/products", params), { scroll });
    };

    const handlers: Record<MenuKind, (slug: string) => void> = {
        brand: (slug) => setSingleParam("b", slug, true),
        category: (slug) => setSingleParam("c", slug, true),
        accessory: (slug) => setSingleParam("a", slug, true),
    };**/

    return (
        <div className="mb-10 bg-[#d7d7d7] dark:bg-darkmode-light">
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

            <nav className="navbar hidden md:flex bg-[#d7d7d7] dark:bg-darkmode-light z-50">
                <div className=" container">
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
                                            "text-[13px] px-1 py-1 rounded transition-colors hover:text-[#c60404] font-bold",
                                            "text-[#29292c] dark:text-white dark:hover:text-white",
                                            isOpen && "bg-white/70 dark:bg-white/10"
                                        )}
                                        aria-haspopup="true"
                                        aria-expanded={isOpen}
                                        aria-controls={panelId}
                                        onClick={() => (isOpen ? close() : open(i))}
                                        onKeyDown={(e) => e.key === "Escape" && close()}
                                    >
                                        {menuItem.name}
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
                                        <div className="bg-[#fafafc] rounded-b-md container dark:bg-darkmode-body w-full border border-gray-200 dark:border-border/40 shadow-xl pointer-events-auto">
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
                                                                <div className="px-2 text-[15px] font-extrabold text-[#c70303] dark:text-white">
                                                                    {section.name}
                                                                </div>

                                                                <ul className="flex flex-wrap items-center">
                                                                    {items.length === 0 ? (
                                                                        <li>
                                                                            <Link
                                                                                href={{
                                                                                    pathname: "/products",
                                                                                    query: { group: menuItem.slug, category: section.slug },
                                                                                }}
                                                                                className="text-sm font-medium text-[#1d1d1f] hover:text-black hover:bg-[#f5f5f7] dark:text-white dark:hover:bg-white/5 rounded-md py-1 px-1"
                                                                                onClick={close}
                                                                                role="menuitem"
                                                                            >
                                                                                {section.name}
                                                                            </Link>
                                                                        </li>
                                                                    ) : (
                                                                        items.map((item, idx) => (
                                                                            <li key={item.slug} className="inline">
                                                                                <Link
                                                                                    href={{
                                                                                        pathname: "/products",
                                                                                        query: { group: menuItem.slug, category: item.slug },
                                                                                    }}
                                                                                    className="text-sm hover:underline font-semibold text-[#1d1d1f] hover:text-black dark:text-white rounded-md py-1 px-1"
                                                                                    onClick={close}
                                                                                    role="menuitem"
                                                                                >
                                                                                    {item.name}
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
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </div>
    );
}