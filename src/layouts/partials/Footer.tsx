"use client";

import menu from "@/config/menu.json";
import Link from "next/link";
import { Suspense } from 'react'
import DropdownLanguages from '../components/filter/DropdownLanguages'
import { languageItems } from "@/lib/constants";
import { translateClient } from "../../lib/utils/translateClient";

export interface ISocial {
  name: string;
  icon: string;
  link: string;
}

const Footer = () => {
  return (
    <footer className="bg-[#232222] dark:bg-darkmode-light mt-50 text-white">
      <div className="container-foot">
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5
                        gap-y-5 gap-x-7 sm:gap-y-10 lg:gap-x-20
                        py-10 md:pt-10 md:pb-14">
          <div className="flex flex-col justify-start gap-x-4 lg:gap-x-10 my-3">
            <span className="font-semibold mr-4 pb-3">{translateClient("footer-contact", "contact-us")}</span>
            <a
              href="/contact"
              className="inline-flex w-28 sm:w-32
                justify-center gap-x-1.5
                rounded-md bg-white
                px-3 py-1
                text-sm font-semibold text-gray-600
                shadow-sm ring-1 ring-inset ring-gray-300
                cursor-pointer
                hover:bg-gray-700 hover:text-white"
            >
              {translateClient("footer-contact", "by-email")}
            </a>
          </div>
          <ul className="flex flex-col justify-start gap-x-4 lg:gap-x-10 my-3 min-w-44 sm:min-w-0">
            <span className="font-semibold mr-4 pb-3">{translateClient("footer-about", "about-us")}</span>
            {menu.footerAbout.map((menu) => (
              <li className="footer-link text-sm text-white hover:text-[#c60404]" key={menu.name}>
                <Link href={menu.url}>{translateClient("footer-about", menu.slug)}</Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-x-4 lg:gap-x-10 my-3 min-w-44 sm:min-w-0">
            <span className="font-semibold mr-4 pb-3">{translateClient("footer-service", "service")}</span>
            {menu.footerService.map((menu) => (
              <li className="footer-link text-sm text-white hover:text-[#c60404]" key={menu.name}>
                <Link href={menu.url + "#" + menu.nav}>{translateClient("footer-service", menu.slug)}</Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-x-4 lg:gap-x-10 my-3 min-w-44 sm:min-w-0 items-start">
            <span className="font-semibold mr-4 pb-3">{translateClient("footer-career", "title")}</span>
            {menu.footerCareer.map((menu) => (
              <li className="footer-link text-sm text-white" key={menu.name}>
                <p>{translateClient("footer-career", menu.slug)}</p>
              </li>
            ))}
          </ul>
          <div className='flex flex-col gap-x-4 lg:gap-x-10 my-3 min-w-44 sm:min-w-0'>
            <span className="font-semibold text-white mr-4 pb-3">{translateClient("footer-language", "language")}</span>
            <Suspense>
              <DropdownLanguages list={languageItems} />
            </Suspense>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 py-5">
          <div className="flex flex-col md:flex-row gap-y-2 justify-center items-center text-text-light dark:text-darkmode-text-light">
            <p
              className="text-sm text-white font-light">
              {`© ${new Date().getFullYear()} Moto Plus. ${translateClient("footer-rights", "rights")}`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
