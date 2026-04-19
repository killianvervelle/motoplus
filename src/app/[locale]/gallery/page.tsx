import fs from "fs";
import path from "path";

import GalleryClient from '@/components/Gallery';


export default async function GalleryPage() {
    const galleryDir = path.join(process.cwd(), "public/images/gallery");
    const email = process.env.ADMIN_EMAIL;

    // Create folder if missing
    if (!fs.existsSync(galleryDir)) {
        fs.mkdirSync(galleryDir, { recursive: true });
    }

    const imageFiles = fs
        .readdirSync(galleryDir)
        .filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file));
        
        return <GalleryClient imageFiles={imageFiles} />;

}