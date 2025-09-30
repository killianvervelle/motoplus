import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST() {
  const res = NextResponse.json({ success: true });
  const cookieStore = await cookies();
  cookieStore.delete("token")
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: -1, 
    path: "/",
  });

  return res;
}