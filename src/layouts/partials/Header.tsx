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


interface IChildNavigationLink {
  name: string
  slug: string
  submenu?: IChildNavigationLink[]
}

interface INavigationLink {
  name: string
  slug: string
  submenu?: IChildNavigationLink[]
}

const isMenuItemActive = (menu: IChildNavigationLink, pathname: string) => {
  return pathname.includes(menu.slug) ? 'nav-active' : ''
}

const hasKids = (n: IChildNavigationLink | undefined): n is IChildNavigationLink & { submenu: IChildNavigationLink[] } =>
  !!n?.submenu && Array.isArray(n.submenu) && n.submenu.length > 0

function MenuGroup({
  menu,
  pathname,
  isOpen,
  onToggle,
  onToggleSidebar,
}: {
  menu: INavigationLink
  pathname: string
  isOpen: boolean
  onToggle: () => void
  onToggleSidebar: () => void
}) {
  const [openChild, setOpenChild] = useState<number | null>(null)
  const router = useRouter()

  // Same logic as Navbar for filtering
  const handleClick = (parent: string, child: string) => {
    const params = new URLSearchParams()
    const p = parent.toLowerCase()

    if (["accessories", "accessoires", "acessórios"].includes(p)) {
      params.set("t", "accessories");
      params.set("c", child);
    } else if (["used parts", "peças usadas", "pièces d'occasion"].includes(p)) {
      params.set("t", "moto-parts");
      params.set("c", child);
      params.set("condition", "used");
    } else if (["new parts", "novas peças", "nouvelles pièces"].includes(p)) {
      params.set("t", "moto-parts");
      params.set("c", child);
      params.set("condition", "new");
    }

    router.push(`/products?${params.toString()}`)
    onToggleSidebar()
  }


  return menu.submenu && menu.submenu.length > 0 ? (
    <li className="nav-item nav-dropdown group relative" key={menu.name}>
      <span
        className={`nav-link inline-flex hover:text-[#c70303] items-center ${isOpen ? 'active' : ''
          }`}
        onClick={onToggle}
      >
        {translateClient("menu", menu.slug)}
        <svg className="h-4 w-4 fill-current ml-2" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </span>

      {/* Submenu level 1 */}
      <ul
        className={`nav-dropdown-list hover:text-[#c70303] ${openChild === null ? "bg-[#f5f5f793]" : ""
          } ${isOpen ? "visible" : "hidden"}`}
      >
        {menu.submenu
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
          .map((child, i) => {
            const grand = hasKids(child) ? child.submenu : []

            return (
              <li className="nav-dropdown-item" key={`child-${i}`}>
                <button
                  type="button"
                  onClick={() =>
                    grand.length
                      ? setOpenChild(openChild === i ? null : i)
                      : handleClick(menu.name, child.slug)
                  }
                  className={`nav-sublink hover:text-[#c70303] inline-flex items-center ${isMenuItemActive(
                    child,
                    pathname
                  )}`}
                >
                  {translateClient("menu", child.slug)}
                  {grand.length > 0 && (
                    <svg className="h-4 w-4 ml-2 fill-current" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  )}
                </button>

                {/* Submenu level 2 */}
                {grand.length > 0 && (
                  <ul
                    className={`nav-dropdown-list my-3 bg-[#f5f5f793] ${openChild === i ? "visible" : "hidden"
                      }`}
                  >
                    {grand
                      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }))
                      .map((cat, j) => (
                        <li className="nav-dropdown-item" key={`grand-${j}`}>
                          <button
                            type="button"
                            className={`nav-subsublink hover:text-[#c70303] ${isMenuItemActive(
                              cat,
                              pathname
                            )}`}
                            onClick={() => handleClick(menu.name, cat.slug)}
                          >
                            {translateClient("menu", cat.slug)}
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            )
          })}
      </ul>
    </li>
  ) : (
    <li className="nav-item" key={menu.name}>
      <Link
        href={`/${menu.slug}`}
        className={`nav-link block hover:text-[#c70303] ${isMenuItemActive(menu, pathname)}`}
        onClick={onToggleSidebar}
      >
        {translateClient("menu", menu.slug)}
      </Link>
    </li>
  )
}

const Header: React.FC<{ children: any }> = ({ children }) => {
  const [navbarShadow, setNavbarShadow] = useState(false)
  const { navigation_button, settings } = config
  const pathname = usePathname()
  const [showSidebar, setShowSidebar] = useState(false)
  const router = useRouter()
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)

  const transaltedGallery = translateClient("gallery", "gallery")
  const translatedMoto = translateClient("moto", "moto")
  const translateMotobilia = translateClient("motobilia", "motobilia")

  useEffect(() => {
    window.scroll(0, 0)
    setShowSidebar(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setNavbarShadow(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleToggleSidebar = () => setShowSidebar(!showSidebar)
  const toggleMenuIndex = (idx: number) =>
    setOpenMenuIndex(curr => (curr === idx ? null : idx))

  return (
    <header
      className={`header pb-5 z-[60] bg-[#232222] dark:bg-darkmode-light ${settings.sticky_header && 'sticky top-0'
        } ${navbarShadow ? 'shadow-sm' : 'shadow-none'}`}
    >
      <nav className='navbar flex flex-wrap z-[60] relative container'>
        {/* Center logo */}
        <div className='order-1 py-6 mb-3 md:mb-0 md:py-0 flex items-center justify-between md:justify-center space-x-7 lg:space-x-14'>
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 md:mt-0 md:static md:translate-x-0">
            <Image
              src="/images/logo.png"
              alt="Logo"
              className="py-6 md:py-0 block hover:cursor-pointer"
              onClick={() => router.push('/')}
              width={80}
              height={80}
              style={{ height: "auto", width: "80px" }}
              priority
            />
          </div>
        </div>

        {/* Search bar */}
        <div className='max-lg:mt-4 w-full lg:w-[45%] xl:w-[60%] lg:order-2 order-3'>
          {settings.search && (
            <Suspense>
              <SearchBar />
            </Suspense>
          )}
        </div>

        {/* Right icons */}
        <div className='order-1 lg:order-3 ml-auto flex items-center lg:ml-0'>
          <ThemeSwitcher className='mr-4 md:mr-6' />
          <Suspense fallback={children[0]}>{children[1]}</Suspense>
          {settings.account && (
            <div className='ml-4 md:ml-6'>
              <NavUser />
            </div>
          )}

          {/* Sidebar toggle (mobile only) */}
          <div className='z-40 block md:hidden ml-6 absolute left-0 md:relative'>
            <button id='nav-toggle' className='focus:outline-none z-10' onClick={handleToggleSidebar}>
              {showSidebar ? (
                <svg className='h-5 fill-current block' viewBox='0 0 20 20'>
                  <title>Menu Close</title>
                  <polygon
                    points='11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2'
                    transform='rotate(45 10 10)'
                  ></polygon>
                </svg>
              ) : (
                <svg className='h-5 fill-current z-10 text-white block hover:text-[#c60404]' viewBox='0 0 20 20'>
                  <title>Menu Open</title>
                  <path className='z-10' d='M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z'></path>
                </svg>
              )}
            </button>

            {/* Overlay */}
            <div
              className={`fixed top-0 left-0 h-full bg-black opacity-50 w-full ${showSidebar ? 'block' : 'hidden'}`}
              onClick={handleToggleSidebar}
            ></div>

            {/* Sidebar menu */}
            <div
              className={`fixed top-0 left-0 h-full bg-white dark:bg-darkmode-body overflow-y-auto w-screen box-border p-9 transition-transform transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <div className='flex justify-between items-center mb-14'>
                <button onClick={handleToggleSidebar} className='p-2'>
                  <svg className='h-5 fill-current block' viewBox='0 0 20 20'>
                    <title>Menu Close</title>
                    <polygon
                      points='11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2'
                      transform='rotate(45 10 10)'
                    ></polygon>
                  </svg>
                </button>
                <Suspense>
                  <DropdownLanguages list={languageItems} />
                </Suspense>
              </div>

              <ul>
                <li className="nav-item mb-2">
                  <Link
                    href="/"
                    className="nav-link block hover:text-[#c70303] font-semibold"
                    onClick={handleToggleSidebar}
                  >
                    {translateClient("header", "home").toUpperCase()}
                  </Link>
                </li>

                <li key="products" className="nav-item mt-2">
                  <Link
                    href={{
                      pathname: "/products",
                      query: { t: "motos" },
                    }}
                    className="nav-link block hover:text-[#c70303] font-semibold"
                    onClick={handleToggleSidebar}
                  >
                    {translatedMoto}
                  </Link>
                </li>

                {MENU_ITEMS.map((menu, i) => (
                  <MenuGroup
                    key={`menu-${i}`}
                    menu={menu}
                    pathname={pathname}
                    isOpen={openMenuIndex === i}
                    onToggle={() => toggleMenuIndex(i)}
                    onToggleSidebar={() => setShowSidebar(false)}
                  />
                ))}

                <li key="collectibles" className="nav-item mt-2">
                  <Link
                    href={{
                      pathname: "/products",
                      query: { t: "collectibles" },
                    }}
                    className="nav-link block hover:text-[#c70303] font-semibold"
                    onClick={handleToggleSidebar}
                  >
                    {translateMotobilia}
                  </Link>
                </li>
                <li key="gallery" className="nav-item mt-2">
                  <Link
                    href="/gallery"
                    className="nav-link block hover:text-[#c70303] font-semibold"
                    onClick={handleToggleSidebar}
                  >
                    {transaltedGallery}
                  </Link>
                </li>

                <li className="nav-item mt-2">
                  <Link
                    href="/contact"
                    className="nav-link block hover:text-[#c70303] font-semibold"
                    onClick={handleToggleSidebar}
                  >
                    {translateClient("header", "contact").toUpperCase()}
                  </Link>
                </li>

                {navigation_button.enable && (
                  <li className='mt-4 inline-block lg:hidden mr-4 md:mr-6'>
                    <Link className='btn btn-outline-primary btn-sm' href={navigation_button.link}>
                      {navigation_button.label}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header