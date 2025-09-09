import { getTranslations } from 'next-intl/server';

export const translateServer = async (section: string, key: string) => {
  try {
    const t = await getTranslations(section);
    return t(key);
  } catch {
    return "ITEM NOT FOUND";
  }
};