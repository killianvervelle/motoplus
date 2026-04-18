import { writeFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const GALLERY_PATH = path.join(process.cwd(), "public/images/gallery");


export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(GALLERY_PATH, file.name);

    await writeFile(filePath, buffer);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { fileName }: { fileName: string } = await request.json();
    const filePath = path.join(GALLERY_PATH, fileName);

    await unlink(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}