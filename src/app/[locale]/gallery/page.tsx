import fs from "fs";
import path from "path";

import GalleryClient from '@/components/Gallery';

type ProfileUser = {
    firstName: string
    lastName: string
    email: string
}

async function fetchUser() {
    const res = await fetch('/api/customer/me', { credentials: 'include' })
    if (!res.ok) return null

    const json = await res.json()

    const c = json.customer
    return {
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.emailAddress?.emailAddress ?? '',
        defaultAddress: c.defaultAddress,
        addresses: c.addresses.edges.map((e: any) => e.node)
    }
}

export default async function GalleryPage() {
    const galleryDir = path.join(process.cwd(), "public/images/gallery");
    const email = process.env.ADMIN_EMAIL;
    const user = await fetchUser();

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