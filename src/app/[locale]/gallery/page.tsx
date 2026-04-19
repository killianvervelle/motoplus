import { list } from '@vercel/blob';
import GalleryClient from '@/components/Gallery';


export default async function GalleryPage() {
    const { blobs } = await list();

    const imageFiles = blobs.map((blob) => blob.url);
        
    return <GalleryClient imageFiles={imageFiles} />;

}