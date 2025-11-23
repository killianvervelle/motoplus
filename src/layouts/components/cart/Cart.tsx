import { cookies } from "next/headers";
import CartModal from "./CartModal";
import { getCart } from "@/lib/shopify";

export default async function Cart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;
  const token = cookieStore.get("token")?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  return <CartModal cart={cart} token={token} />;
}
