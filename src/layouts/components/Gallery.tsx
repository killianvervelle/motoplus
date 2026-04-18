"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

export default function GalleryClient({ imageFiles, isAdmin }: { imageFiles: string[]; isAdmin: boolean }) {
  const router = useRouter();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/customer/gallery", { method: "POST", body: formData });
    if (res.ok) router.refresh(); // Syncs server state with UI
  };

  const handleDelete = async (fileName: string) => {
    const res = await fetch("/api/customer/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName }),
    });
    if (res.ok) router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {isAdmin && ( 
      <div className="mb-8 flex flex-col items-center gap-4">      
        <label className="cursor-pointer bg-red-600 font-bold text-white px-6 py-2 rounded-lg hover:bg-red-800 transition">
          Upload Image
          <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
        </label>
      </div>
        )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {imageFiles.map((file) => (
          <div key={file} className="relative aspect-square group overflow-hidden rounded-lg shadow-md border">
            <Image
              src={`/images/gallery/${file}`}
              alt={file}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {isAdmin && (
              <button
                onClick={() => handleDelete(file)}
                className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-800"
              >
                ✕
              </button>  
            )}
          </div>
        ))}
      </div>
    </div>
  );
}