import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function OrdersLayout({ children }: { children: React.ReactNode }) {
  const cookie = await cookies();
  const token = cookie.get("token")?.value

  if (!token) {
    redirect("/login")
  }

  return <>{children}</>
}