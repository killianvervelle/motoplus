import { NextRequest, NextResponse } from "next/server";
import { del, put } from '@vercel/blob';


export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = await put(`gallery/${file.name}`, file, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url }: { url: string } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    await del(url);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}