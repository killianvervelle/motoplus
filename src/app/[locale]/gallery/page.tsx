import fs from "fs";
import path from "path";
import Image from "next/image";

export default function GalleryPage() {
    const galleryDir = path.join(process.cwd(), "public/images/gallery");

    const imageFiles = fs
        .readdirSync(galleryDir)
        .filter((file) => /\.(png|jpe?g|gif|webp)$/i.test(file));

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {imageFiles.map((file, index) => (
                    <div
                        key={index}
                        className="relative aspect-square group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        <Image
                            src={`/images/gallery/${file}`}
                            alt={file.replace(/\.[^/.]+$/, "")}
                            fill
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}