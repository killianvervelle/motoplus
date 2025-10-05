'use client'

import { SortFilterItem as SortFilterItemType } from '@/lib/constants'
import { createUrl } from '@/lib/utils'
import Link from 'next/link'
import Image from "next/image";
import { useSearchParams } from 'next/navigation'
import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { ListItem, PathFilterItem as PathFilterItemType } from '../product/ProductLayouts'
import { LanguageItem } from "@/lib/constants";
import { translateClient } from "../../../lib/utils/translateClient";


function PathFilterItem({ item }: { item: PathFilterItemType }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = pathname === item.path
  const newParams = new URLSearchParams(searchParams.toString())
  const DynamicTag = active ? 'p' : Link

  newParams.delete('q')

  return (
    <li className='mt-2 flex text-black dark:text-white' key={item.title}>
      <DynamicTag
        href={createUrl(item.path, newParams)}
        className={`w-full text-sm ${active ? 'bg-green-400' : 'hover:underline'}`}
      >
        {item.title}
      </DynamicTag>
    </li>
  )
}

function SortFilterItem({ item }: { item: SortFilterItemType }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const newParams = new URLSearchParams(searchParams.toString())

  if (item.slug) {
    newParams.set('sort', translateClient("sorting", item.slug) ? item.slug : "")
  } else {
    newParams.delete('sort')
  }

  const href = createUrl(pathname, newParams)

  const active = searchParams.get('sort') === item.slug

  const DynamicTag = active ? 'p' : Link

  return (
    <li className='flex text-sm text-text-dark hover:bg-dark/50 hover:text-white' key={item.title}>
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        className={`w-full pl-4 py-2 ${active ? 'bg-dark text-white' : ''}`}
      >
        {translateClient("sorting", item.slug ? item.slug : "Not found")}
      </DynamicTag>
    </li>
  )
}

function SortLanguageItem({ item }: { item: LanguageItem }) {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale();
  const searchParams = useSearchParams()
  const active = locale === item.code;

  const handleChange = (newlocale: string) => {
    router.replace(
      { pathname, query: Object.fromEntries(searchParams) },
      { locale: newlocale }
    )
  };

  return (
    <li
      className='flex items-center cursor-pointer justify-between px-5 text-sm text-text-dark hover:bg-dark/50 hover:text-white'
      key={item.title}
      onClick={() => {
        handleChange(item.code)
      }}>
      <p className={`w-full pl-4 py-2 text-gray-900 ${active ? 'font-bold' : ''}`}>
        {translateClient("footer-language", item.code)}
      </p>
      <Image
        src={item.image ? item.image : "/images/image-placeholder.png"}
        alt="Logo"
        width={20}
        height={0}
        style={{ height: "auto" }}
      />
    </li >
  )
}

export function FilterDropdownItem({ item }: { item: ListItem }) {
  return 'path' in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />
}

export function SetLanguageItem({ item }: { item: LanguageItem }) {
  return <SortLanguageItem item={item} />
}
