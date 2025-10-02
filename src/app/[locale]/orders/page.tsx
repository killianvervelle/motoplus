'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl';


type Order = {
    id: string
    number: string
    date: string
    paymentStatus: string
    fulfillmentStatus: string
    total: string
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const t = useTranslations('orderID')

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch('/api/customer/orders', { credentials: 'include' })
                if (!res.ok) {
                    throw new Error(await res.text())
                }
                const json = await res.json()
                setOrders(json.orders)
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return <p className="p-6">{t("loading")}</p>
    if (error) return <p className="p-6 text-red-600">{t("error")}: {error}</p>

    return (
        <section className="section">
            <div className="container pt-12 2xl:pt-36 xl:pt-28 pb-20 max-w-5xl">
                <h1 className="h2 mb-8">{t("account")}</h1>

                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-20">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-4">{t("history")}</h2>

                        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                <thead className="bg-gray-50 dark:bg-darkmode-light">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">{t("order")}</th>
                                        <th className="px-4 py-2 text-left font-medium">{t("date")}</th>
                                        <th className="px-4 py-2 text-left font-medium">{t("payment")}</th>
                                        <th className="px-4 py-2 text-left font-medium">{t("fullfillment")}</th>
                                        <th className="px-4 py-2 text-right font-medium">{t("total")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                                {t("no-orders")}.
                                            </td>
                                        </tr>
                                    )}
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-4 py-3 text-[#c60404] font-medium">
                                                <Link href={`/orders/${encodeURIComponent(order.id)}`}>
                                                    {order.number}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">{order.date}</td>
                                            <td className="px-4 py-3">{order.paymentStatus}</td>
                                            <td className="px-4 py-3">{order.fulfillmentStatus}</td>
                                            <td className="px-4 py-3 text-right font-semibold">{order.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
