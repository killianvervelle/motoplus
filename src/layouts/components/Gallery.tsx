"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function GalleryClient({ imageFiles }: { imageFiles: string[] }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    const checkAdmin = async () => {
      const user = await fetchUser();
      if (user) {
        setIsAdmin(user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
      }
    };
    checkAdmin();
  }, []);


  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/customer/gallery", { 
    method: "POST", 
    body: formData 
  });
  
  if (res.ok) {
    router.refresh(); 
  } else {
    const err = await res.json();
    alert(err.error || "Upload failed");
  }
};

const handleDelete = async (url: string) => {
  const res = await fetch("/api/customer/gallery", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  
  if (res.ok) router.refresh();
};

{imageFiles.map((url) => (
  <div key={url} className="relative aspect-square group overflow-hidden rounded-lg shadow-md border">
    <Image
      src={url} 
      alt="Gallery image"
      fill
      className="object-cover transition-transform group-hover:scale-105"
    />
    {isAdmin && (
      <button
        onClick={() => handleDelete(url)}
        className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full z-20"
      >
        ✕
      </button>
    )}
  </div>
))}

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