'use client'

import { humanize } from '@/lib/utils/textConverter'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BiHome } from 'react-icons/bi'
import slugify from "slugify"
import { translateClient } from "../../lib/utils/translateClient";

const Breadcrumbs = ({ className }: { className?: string }) => {
  const pathname = usePathname()

  const hiddenLocales = ['fr', 'en', 'pt'];
  const paths = pathname
    .split('/')
    .filter((x) => x && !hiddenLocales.includes(x));

  const parts = [
    {
      label: <BiHome className='text-text-light dark:text-darkmode-text-light' size={24} />,
      href: '/',
      'aria-label': pathname === '/' ? 'page' : undefined
    }
  ]

  paths.forEach((label: string, i: number) => {
    const href = `/${paths.slice(0, i + 1).join('/')}`
    const isLast = i === paths.length - 1

    if (label !== "page") {
      parts.push({
        label: (
          <span>
            {isLast
              ? translateClient("breadCrums", slugify(label, { lower: true }))
              : humanize(label.replace(/[-_]/g, " ")) || ""}
          </span>
        ),
        href,
        "aria-label": pathname === href ? "page" : undefined,
      })
    }
  })

  return (
    <nav aria-label='Breadcrumb' className={className}>
      <ol className='inline-flex' role='list'>
        {parts
          .map(({ label, ...attrs }, index) => (
            <li className='mx-1' role='listitem' key={index}>
              {index > 0 && <span className='inline-block mr-1 text-text-light dark:text-darkmode-text-light'>&gt;</span>}
              {index !== parts.length - 1 ? (
                <Link className='text-primary dark:text-darkmode-primary' {...attrs}>
                  {label}
                </Link>
              ) : (
                <span className='text-text-light dark:text-darkmode-text-light'>{label}</span>
              )}
            </li>
          ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
