'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useTranslations } from 'next-intl';

type Item = {
    title: string
    sku: string
    price: string
    quantity: number
    total: string
    image: string | null
    discount?: string | null
}

type OrderDetails = {
    number: string
    date: string
    paymentStatus: string
    fulfillmentStatus: string
    subtotal: string
    shipping: string
    total: string
    billingAddress: Address
    shippingAddress: Address
    items: Item[]
}

type Address = {
    firstName?: string
    lastName?: string
    address1?: string
    address2?: string
    city?: string
    zip?: string
    country?: string
}

function AddressBlock({ title, address }: { title: string; address: Address }) {
    return (
        <div>
            <h5 className="font-semibold mb-1">{title}</h5>
            <div className="text-sm text-left">
                <p>{address.firstName} {address.lastName}</p>
                {address.address1 && <p>{address.address1}</p>}
                {address.address2 && <p>{address.address2}</p>}
                <p>
                    {address.city} {address.zip}
                </p>
                <p>{address.country}</p>
            </div>
        </div>
    )
}

export default function OrderDetailsPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const invoiceRef = useRef<HTMLDivElement>(null)

    const t = useTranslations('orderID')

    useEffect(() => {
        if (!id) return;
        async function load() {
            try {
                const res = await fetch(`/api/customer/orders/${id}`, {
                    credentials: "include"
                })
                if (!res.ok) throw new Error(await res.text())
                const json = await res.json()
                const o = json.order

                setOrder({
                    number: o.name,
                    date: new Date(o.processedAt).toLocaleString(),
                    paymentStatus: o.financialStatus,
                    fulfillmentStatus:o.fulfillmentStatus,
                    subtotal: `${o.subtotal.amount} ${o.subtotal.currencyCode}`,
                    shipping: `${o.totalShipping.amount} ${o.totalShipping.currencyCode}`,
                    total: `${o.totalPrice.amount} ${o.totalPrice.currencyCode}`,
                    billingAddress: {
                        firstName: o.billingAddress?.firstName,
                        lastName: o.billingAddress?.lastName,
                        address1: o.billingAddress?.address1,
                        address2: o.billingAddress?.address2,
                        city: o.billingAddress?.city,
                        zip: o.billingAddress?.zip,
                        country: o.billingAddress?.country,
                    },
                    shippingAddress: {
                        firstName: o.shippingAddress?.firstName,
                        lastName: o.shippingAddress?.lastName,
                        address1: o.shippingAddress?.address1,
                        address2: o.shippingAddress?.address2,
                        city: o.shippingAddress?.city,
                        zip: o.shippingAddress?.zip,
                        country: o.shippingAddress?.country,
                    },
                    items: o.lineItems.edges.map((e: any) => ({
                        title: e.node.name,
                        sku: e.node.sku ?? '',
                        price: `${e.node.price.amount} ${e.node.price.currencyCode}`,
                        quantity: e.node.quantity,
                        total: `${e.node.totalPrice.amount} ${e.node.totalPrice.currencyCode}`,
                        discount: e.node.totalDiscount.amount !== "0.0"
                            ? `${e.node.totalDiscount.amount} ${e.node.totalDiscount.currencyCode}`
                            : null,
                        image: e.node.image?.url ?? null,
                    })),
                })
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) return <p className="p-6">Loading order…</p>
    if (error) return <p className="p-6 text-red-600">Error: {error}</p>
    if (!order) return null

    return (
        <section className="section">
            <div className="container pt-28 2xl:pt-36 pb-28 max-w-5xl">
                <h1 className="h2 mb-4">{t("account")}</h1>
                <a
                    href="/orders"
                    className="text-sm text-primary hover:underline inline-block mb-8"
                >
                    ← {t("return")}
                </a>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20" ref={invoiceRef}>
                    <div className="lg:col-span-2">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">
                                {t("order")} {order.number}
                            </h2>
                            <div className='flex flex-row justify-between'>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                    {t("placed-on")} {order.date}
                                </p>
                                <p className="text-sm mb-1">
                                    {t("fullfillment")}: {order.fulfillmentStatus}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        <th className="py-3 px-4 text-left">{t("product")}</th>
                                        <th className="py-3 px-4 text-right">{t("price")}</th>
                                        <th className="py-3 px-4 text-center">{t("quantity")}</th>
                                        <th className="py-3 px-4 text-right">{t("total")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {order.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="py-3 px-4 flex items-center gap-3">
                                                {item.image && <img src={item.image} alt={item.title} className="h-10 w-10 rounded" />}
                                                {item.title}
                                            </td>
                                            <td className="py-3 px-4 text-right">{item.price}</td>
                                            <td className="py-3 px-4 text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="py-3 px-4 text-right">{item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex flex-col items-end text-sm space-y-1">
                            <div className="flex justify-between w-full max-w-sm">
                                <span>{t("subtotal")}</span>
                                <span>{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-sm">
                                <span>{t("shipping")}</span>
                                <span>{order.shipping}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-sm font-semibold text-base mt-2">
                                <span>{t("total")}</span>
                                <span>{order.total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex lg:flex-col flex-row justify-start gap-20 lg:gap-0 space-y-8 text-left items-start">
                        <AddressBlock title={t("billing-address")} address={order.billingAddress} />
                        <AddressBlock title={t("shipping-address")} address={order.shippingAddress} />
                    </div>

                </div>

            </div>
        </section>
    )
}
