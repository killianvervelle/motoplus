'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { SetLanguageItem } from './FilterDropdownItem'
import { LanguageItem } from '@/lib/constants'
import { useLocale } from 'next-intl';
import { useTranslations } from "next-intl";

const DropdownLanguages = ({ list }: { list: LanguageItem[] }) => {
  const [active, setActive] = useState('English')
  const locale = useLocale();
  const t = useTranslations('language');

  const [openSelect, setOpenSelect] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenSelect(false)
      }
    }

    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    if (locale) {
      setActive(t(locale));
    }
  }, [locale]);

  return (
    <div className='relative inline-block text-left text-text-light' ref={menuRef}>
      <button
        type='button'
        className='inline-flex w-32  justify-center gap-x-1.5 rounded-md bg-white px-3 py-1 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 cursor-pointer'
        onClick={() => {
          setOpenSelect(!openSelect)
        }}
        id='menu-button'
        aria-haspopup='true'
      >
        <div className='text-gray-600'>{active}</div>
        <svg
          className={`-mr-1 h-5 w-5 text-gray-400 transform ${openSelect ? 'rotate-180' : ''} transition-transform`}
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
      </button>

      {openSelect && (
        <div
          className='absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden'
          onClick={() => {
            setOpenSelect(false)
          }}
        >
          <div role='menu' aria-orientation='vertical' aria-labelledby='menu-button'>
            {list.map((item: LanguageItem, i) => (
              <Suspense key={i}>
                <SetLanguageItem item={item} />
              </Suspense>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DropdownLanguages
