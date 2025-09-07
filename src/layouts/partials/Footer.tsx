"use client";

import menu from "@/config/menu.json";
import Link from "next/link";
import { Suspense } from 'react'
import DropdownLanguages from '../components/filter/DropdownLanguages'
import { languageItems } from "@/lib/constants";

export interface ISocial {
  name: string;
  icon: string;
  link: string;
}

const Footer = () => {
  return (
    <footer className="bg-light dark:bg-darkmode-light mt-30">
      <div className="container">
        <div className="flex flex-row items-start justify-center gap-20 md:gap-x-30 py-10 md:pt-10 md:pb-14">
          <div className="flex flex-col justify-start gap-x-4 lg:gap-x-10 my-3">
            <span className="font-semibold mr-4 pb-3">Contact us</span>
            <a
              href="/contact"
              className="btn max-md:btn-sm btn-primary text-sm hover:bg-gray-700 h-6 px-5 py-3 flex items-center justify-start text-left"
            >
              By Email
            </a>
          </div>
          <ul className="flex flex-col justify-start gap-x-4 lg:gap-x-10 my-3">
            <span className="font-semibold mr-4 pb-3">About us</span>
            {menu.footerAbout.map((menu) => (
              <li className="footer-link text-sm" key={menu.name}>
                <Link href={menu.url}>{menu.name}</Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-x-4 lg:gap-x-10 my-3">
            <span className="font-semibold mr-4 pb-3">Service</span>
            {menu.footerService.map((menu) => (
              <li className="footer-link text-sm" key={menu.name}>
                <Link href={menu.url}>{menu.name}</Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-x-4 lg:gap-x-10 my-3">
            <span className="font-semibold mr-4 pb-3">Career</span>
            {menu.footerCareer.map((menu) => (
              <li className="footer-link text-sm" key={menu.name}>
                <p>{menu.description}</p>
              </li>
            ))}
          </ul>
          <div className='flex flex-col gap-x-4 lg:gap-x-10 my-3'>
            <span className="font-semibold mr-4 pb-3">Language</span>
            <Suspense>
              <DropdownLanguages list={languageItems} />
            </Suspense>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 py-5">
          <div className="flex flex-col md:flex-row gap-y-2 justify-center items-center text-text-light dark:text-darkmode-text-light">
            <p
              className="text-sm font-light">
              © {new Date().getFullYear()} Moto Plus. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
