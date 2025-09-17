"use client";

import { useTranslations } from "next-intl";

export const translateClient = (section: string, key: string) => {
  try {
    const t = useTranslations(section);
    return t(key);
  } catch {
    return "ITEM NOT FOUND"
  }
}