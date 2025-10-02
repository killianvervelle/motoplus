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
    path: "/",
    maxAge: 0, 
    expires: new Date(0), 
  });

  return res;
}