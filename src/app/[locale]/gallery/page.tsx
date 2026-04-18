import fs from "fs";
import path from "path";
import { cookies } from "next/headers";

import GalleryClient from '@/components/Gallery';

async function getShopifyUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("shopify_session_token")?.value;

  if (!sessionToken) return null;

  const response = await fetch("https://your-shopify-store.myshopify.com/api/customer/me", {
    headers: {
      "Authorization": `Bearer ${sessionToken}`,
    },
  });

  return response.ok ? await response.json() : null;
}

export default async function GalleryPage() {
    const galleryDir = path.join(process.cwd(), "public/images/gallery");
    const email = process.env.ADMIN_EMAIL;
    const user = await getShopifyUser();

    // Create folder if missing
    if (!fs.existsSync(galleryDir)) {
        fs.mkdirSync(galleryDir, { recursive: true });
    }

    const imageFiles = fs
        .readdirSync(galleryDir)
        .filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file));

    const isAdmin = user?.email === email;
    if (isAdmin) {
        return <GalleryClient imageFiles={imageFiles} isAdmin={true} />;
    }
    return <GalleryClient imageFiles={imageFiles} isAdmin={false} />;
}