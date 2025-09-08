'use client'

import NavUser from '@/components/NavUser'
import SearchBar from '@/components/SearchBar'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import config from '@/config/config.json'
import menu from '@/config/menu.json'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import Image from "next/image";

interface IChildNavigationLink {
  name: string
  url: string
  slug: string
}

interface INavigationLink {
  name: string
  url: string
  slug: string
  hasChildren?: boolean
  children?: IChildNavigationLink[]
}

const isMenuItemActive = (menu: INavigationLink, pathname: string) => {
  return (pathname === `${menu.url}/` || pathname === menu.url) && 'nav-active'
}

const hasKids = (n: INavigationLink | undefined): n is INavigationLink & { children: INavigationLink[] } =>
  !!n?.children && Array.isArray(n.children) && n.children.length > 0;

function MenuGroup({
  menu,
  pathname,
  isOpen,
  onToggle,
  onToggleSidebar,
}: {
  menu: INavigationLink;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
  onToggleSidebar: () => void;
}) {
  const [openChild, setOpenChild] = React.useState<number | null>(null);

  return menu.hasChildren ? (
    <li className='nav-item nav-dropdown group relative' key={menu.name}>
      <span
        className={`nav-link inline-flex hover:text-[#c70303] items-center ${(menu.children?.map(({ url }) => url).includes(pathname) ||
          menu.children?.map(({ url }) => `${url}/`).includes(pathname)) &&
          'active'
          }`}
        onClick={onToggle}
      >
        {menu.name}
        <svg className='h-4 w-4 fill-current ml-2 ' viewBox='0 0 20 20'>
          <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
        </svg>
      </span>
      <ul className={`nav-dropdown-list hover:text-[#c70303] ${openChild === null ? 'bg-[#f5f5f793]' : ''} ${isOpen ? 'visible' : 'hidden'}`}>
        {menu.children?.map((child, i) => {
          const grand = hasKids(child) ? child.children : [];

          return (
            <li className="nav-dropdown-item" key={`child-${i}`}>
              <Link
                href={{ pathname: "/products", query: { group: menu.slug, subgroup: child.slug } }}
                onClick={(e) => {
                  if (grand.length) { e.preventDefault(); setOpenChild(openChild === i ? null : i); }
                }}
                className={`nav-sublink hover:text-[#c70303] inline-flex items-center ${isMenuItemActive(child, pathname)}`}
              >
                {child.name}
                {grand.length > 0 && (
                  <svg className="h-4 w-4 ml-2 fill-current" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                )}
              </Link>

              {grand.length > 0 && (
                <ul className={`nav-dropdown-list my-3 bg-[#f5f5f793] ${openChild === i ? 'visible' : 'hidden'}`}>
                  {grand.map((cat, j) => (
                    <li className="nav-dropdown-item" key={`grand-${j}`} onClick={() => onToggleSidebar()}>
                      <Link
                        href={{ pathname: "/products", query: { group: menu.slug, subgroup: child.slug, category: cat.slug } }}
                        className={`nav-subsublink hover:text-[#c70303] ${isMenuItemActive(cat, pathname)}`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  ) : (
    <li className='nav-item' key={menu.name}>
      <Link href={menu.url} className={`nav-link block hover:text-[#c70303] ${isMenuItemActive(menu, pathname)}`}>
        {menu.name}
      </Link>
    </li>
  )
}

const Header: React.FC<{ children: any }> = ({ children }) => {
  const [navbarShadow, setNavbarShadow] = useState(false)
  const { main }: { main: INavigationLink[] } = menu
  const { navigation_button, settings } = config
  const pathname = usePathname()
  const [showSidebar, setShowSidebar] = useState(false)
  const router = useRouter();
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

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

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const toggleMenuIndex = (idx: number) =>
    setOpenMenuIndex(curr => (curr === idx ? null : idx));

  return (
    <header
      className={`header pb-5 z-[60] bg-[#353434] dark:bg-darkmode-light ${settings.sticky_header && 'sticky top-0'} ${navbarShadow ? 'shadow-sm' : 'shadow-none'}`}
    >
      <nav className='navbar flex flex-wrap z-[60] relative container'>
        <div className='order-1 py-6 mb-3 md:mb-0 md:py-0 flex items-center justify-between md:justify-center space-x-7 lg:space-x-14'>
          <div className="absolute left-1/2 -translate-x-1/2 mt-3 md:mt-0 md:static md:translate-x-0">
            <Image
              src="/images/logo.png"
              alt="Logo"
              className="py-6 md:py-0 block hover:cursor-pointer"
              width={80}
              onClick={() => router.push('/')}
              height={0}
              style={{ height: "auto" }}
              priority
            />
          </div>
        </div>

        <div className='max-lg:mt-4 w-full lg:w-[45%] xl:w-[60%] lg:order-2 order-3'>
          {settings.search && (
            <Suspense>
              <SearchBar />
            </Suspense>
          )}
        </div>

        <div className='order-1 lg:order-3 ml-auto flex items-center lg:ml-0'>
          <ThemeSwitcher className='mr-4 md:mr-6' />
          <Suspense fallback={children[0]}>{children[1]}</Suspense>

          {settings.account && (
            <div className='ml-4 md:ml-6'>
              <NavUser />
            </div>
          )}

          <div className='z-60 block md:hidden ml-6 absolute left-0 md:relative'>
            <button id='nav-toggle' className='focus:outline-none' onClick={handleToggleSidebar}>
              {showSidebar ? (
                <svg className='h-5 fill-current block' viewBox='0 0 20 20'>
                  <title>Menu Close</title>
                  <polygon
                    points='11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2'
                    transform='rotate(45 10 10)'
                  ></polygon>
                </svg>
              ) : (
                <svg className='h-5 fill-current text-white block hover:text-[#c60404]' viewBox='0 0 20 20'>
                  <title>Menu Open</title>
                  <path d='M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z'></path>
                </svg>
              )}
            </button>

            <div
              className={`fixed top-0 left-0 h-full bg-black opacity-50 w-full ${showSidebar ? 'block' : 'hidden'}`}
              onClick={handleToggleSidebar}
            ></div>

            <div
              className={`fixed top-0 left-0 h-full bg-white dark:bg-darkmode-body overflow-y-auto w-full md:w-96 p-9 ${showSidebar ? 'transition-transform transform translate-x-0' : 'transition-transform transform -translate-x-full'}`}
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
              </div>
              <ul>
                {main.map((menu, i) => (
                  <MenuGroup
                    key={`menu-${i}`}
                    menu={menu}
                    pathname={pathname}
                    isOpen={openMenuIndex === i}
                    onToggle={() => toggleMenuIndex(i)}
                    onToggleSidebar={() => setShowSidebar(false)}
                  />
                ))}
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
