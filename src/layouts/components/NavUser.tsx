'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Gravatar from 'react-gravatar'
import { BsPerson } from 'react-icons/bs'
import { useTranslations } from 'next-intl';
import Link from 'next/link'
import { navUserOptions } from '@/lib/constants'

type UserInfo = {
  firstName: string
  lastName: string
  email: string
}

async function fetchUser(): Promise<UserInfo | null> {
  const res = await fetch('/api/customer/me', { credentials: 'include' })
  if (!res.ok) return null

  const json = await res.json()

  const c = json.customer
  return {
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.emailAddress?.emailAddress ?? ''
  }
}

const NavUser = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const t = useTranslations('navuser')

  useEffect(() => {
    const getUser = async () => {
      const userInfo = await fetchUser()
      setUser(userInfo)
    }
    getUser()
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch("/api/customer/auth/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Failed to logout:", err);
    }

    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    router.push("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <div className='relative'>
      {user ? (
        <button
          onClick={toggleDropdown}
          className='relative cursor-pointer text-left sm:text-xs flex items-center justify-center'
        >
          <div className='flex items-center gap-x-1'>
            <div className='h-6 w-6 border border-white rounded-full'>
              <Gravatar email={user?.email} style={{ borderRadius: '50px' }} key={user?.email} />
            </div>
            <div className='leading-none max-md:hidden'>
              <div className='flex items-center'>
                <p className='block text-white dark:text-darkmode-text-dark text-base truncate'>
                  {user?.firstName?.split(' ')[0]}
                </p>
                <svg
                  className={`w-5 text-white dark:text-darkmode-text-dark dark:hover:text-darkmode-text-primary`}
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  aria-hidden='true'
                >
                  <path
                    fillRule='evenodd'
                    d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          </div>
        </button>
      ) : (
        <a
          className='text-2xl text-white hover:text-text-primary hover:text-[#c60404]  dark:border-darkmode-border dark:text-white flex items-center'
          href='/login'
          aria-label='login'
        >
          <BsPerson className='dark:hover:text-darkmode-primary' />
        </a>
      )}

      {dropdownOpen && (
        <div className='z-20 text-center absolute w-full right-0 bg-transparent shadow-md rounded mt-2'>
          <div
            className='absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden'
          >
            <div role='menu' aria-orientation='vertical' aria-labelledby='menu-button'>
              <ul className='relative inline-block text-left text-text-light w-full' onPointerLeave={() => setDropdownOpen(false)}>
                {navUserOptions.map((option) => (
                  <li
                    key={option.slug}
                    className="flex text-sm text-text-dark hover:bg-dark/50 hover:text-white"
                  >
                    {option.slug === 'log-out' ? (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left pl-4 py-2"
                      >
                        {t(option.slug)}
                      </button>
                    ) : (
                      <Link
                        href={`/${option.slug}`}
                        className="w-full pl-4 py-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        {t(option.slug)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavUser
