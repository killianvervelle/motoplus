'use client'

import NavUser from '@/components/NavUser'
import SearchBar from '@/components/SearchBar'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import config from '@/config/config.json'
import { MENU_ITEMS } from '@/lib/constants';
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import Image from "next/image";
import { translateClient } from "../../lib/utils/translateClient";
import DropdownLanguages from '../components/filter/DropdownLanguages'
import { languageItems } from "@/lib/constants";
import { useTranslations, useLocale } from 'next-intl';

const Header: React.FC<{ children: any }> = ({ children }) => {
  const { settings, navigation_button } = config
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const [showSidebar, setShowSidebar] = useState(false)
  const [navbarShadow, setNavbarShadow] = useState(false)
  const middleMenuTranslations = useTranslations('middlemenu')

  const transaltedGallery = translateClient("gallery", "gallery")
  const translatedMoto = translateClient("moto", "moto")
  const translateMotobilia = translateClient("motobilia", "motobilia")

  useEffect(() => {
    window.scroll(0, 0)
    setShowSidebar(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setNavbarShadow(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleToggleSidebar = () => setShowSidebar(!showSidebar)

  // Logic to handle direct menu clicks with locale-specific technical slugs
  const handleClick = (parentSlug: string) => {
    const params = new URLSearchParams()
    const parentName = middleMenuTranslations(parentSlug).toLowerCase().trim()

    const isAccessories = ["accessories", "accessoires", "accessórios"].includes(parentName)
    const isUsedParts = ["used parts", "peças usadas", "pièces d'occasion", "pièces d’occasion"].includes(parentName)
    const isNewParts = ["new parts", "novas peças", "nouvelles pièces"].includes(parentName)

        if (isAccessories) {
            if (locale === 'fr') {
                params.set("t", "accessoires");
            }
                else { 
            params.set("t", "accessories");
        } 
    }
        if (isUsedParts || isNewParts) {
            // Set type based on locale expectation
            if (locale === 'fr') {
                params.set("t", "pièces de moto");
                params.set("condition", isUsedParts ? "utilisé" : "nouveau");
            } else if (locale === 'en') {
                params.set("t", "motorcycle parts");
                params.set("condition", isUsedParts ? "used" : "new");
            } else {
                // Default / Portuguese
                params.set("t", "motorcycle parts");
                params.set("condition", isUsedParts ? "used" : "new");
            }
        }

        router.push(`/products?${params.toString()}`);
        setShowSidebar(false)
    };

  // Localized types for hardcoded links
  const motoType = locale === 'fr' ? "motocycles" : "motorcycles"
  const collectiblesType = locale === 'fr' ? "objets de collection" : "collectibles"

  return (
    <header className={`header pb-5 z-[60] bg-[#232222] dark:bg-darkmode-light ${settings.sticky_header && 'sticky top-0'} ${navbarShadow ? 'shadow-sm' : 'shadow-none'}`}>
      <nav className='navbar flex flex-wrap z-[60] relative container'>
        
        {/* Logo Section */}
        <div className='order-1 py-6 mb-3 md:mb-0 md:py-0 flex items-center justify-between md:justify-center space-x-7 lg:space-x-14'>
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 md:mt-0 md:static md:translate-x-0">
            <Image src="/images/logo.png" alt="Logo" className="py-6 md:py-0 block hover:cursor-pointer" onClick={() => router.push('/')} width={80} height={80} style={{ height: "auto", width: "80px" }} priority />
          </div>
        </div>

        {/* Search Bar Section */}
        <div className='max-lg:mt-4 w-full lg:w-[45%] xl:w-[60%] lg:order-2 order-3'>
          {settings.search && <Suspense><SearchBar /></Suspense>}
        </div>

        {/* Right Icons & Sidebar Toggle */}
        <div className='order-1 lg:order-3 ml-auto flex items-center lg:ml-0'>
          <ThemeSwitcher className='mr-4 md:mr-6' />
          <Suspense fallback={children[0]}>{children[1]}</Suspense>
          
          <div className='z-40 block md:hidden ml-6 absolute left-0 md:relative'>
            <button className='focus:outline-none z-10' onClick={handleToggleSidebar}>
              <svg className='h-5 fill-current z-10 text-white block hover:text-[#c60404]' viewBox='0 0 20 20'>
                <path d='M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z'></path>
              </svg>
            </button>

            {/* Sidebar Overlay */}
            <div className={`fixed top-0 left-0 h-full bg-black opacity-50 w-full ${showSidebar ? 'block' : 'hidden'}`} onClick={handleToggleSidebar}></div>

            {/* Sidebar Content (Flat Menu) */}
            <div className={`fixed top-0 left-0 h-full bg-white dark:bg-darkmode-body overflow-y-auto w-screen box-border p-9 transition-transform transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className='flex justify-between items-center mb-10'>
                <button onClick={handleToggleSidebar} className='p-2'>
                   <svg className='h-5 fill-current block' viewBox='0 0 20 20'><polygon points='11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2' transform='rotate(45 10 10)'></polygon></svg>
                </button>
                <Suspense><DropdownLanguages list={languageItems} /></Suspense>
              </div>

              <ul className="space-y-4">
                {/* Home */}
                <li>
                  <Link href="/" className="nav-link block hover:text-[#c70303] font-bold text-lg" onClick={handleToggleSidebar}>
                    {translateClient("header", "home").toUpperCase()}
                  </Link>
                </li>

                {/* Motorcycles */}
                <li>
                  <Link href={{ pathname: "/products", query: { t: motoType } }} className="nav-link block hover:text-[#c70303] font-bold text-lg" onClick={handleToggleSidebar}>
                    {translatedMoto}
                  </Link>
                </li>

                {/* Dynamic Menu Items (Accessories, Parts, etc.) */}
                {MENU_ITEMS.map((menu) => (
                  <li key={menu.slug}>
                    <button
                      className="nav-link block text-left w-full hover:text-[#c70303] font-bold text-lg"
                      onClick={() => handleClick(menu.slug)}
                    >
                      {middleMenuTranslations(menu.slug)}
                    </button>
                  </li>
                ))}

                {/* Collectibles */}
                <li>
                  <Link href={{ pathname: "/products", query: { t: collectiblesType } }} className="nav-link block hover:text-[#c70303] font-bold text-lg" onClick={handleToggleSidebar}>
                    {translateMotobilia}
                  </Link>
                </li>

                {/* Gallery */}
                <li>
                  <Link href="/gallery" className="nav-link block hover:text-[#c70303] font-bold text-lg" onClick={handleToggleSidebar}>
                    {transaltedGallery}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header