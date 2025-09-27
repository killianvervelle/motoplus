'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'


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

    useEffect(() => {
        setOrders([
            {
                id: '159816555',
                number: '#159816555',
                date: 'Sept 18, 2025',
                paymentStatus: 'Unpaid',
                fulfillmentStatus: 'Delivered',
                total: 'CHF 242.–'
            },
            {
                id: '154488874',
                number: '#154488874',
                date: 'July 28, 2025',
                paymentStatus: 'Paid',
                fulfillmentStatus: 'Dispatched',
                total: 'CHF 13.80'
            }
        ])
    }, [])

    return (
        <section className="pt-12 xl:pt-24">
            <div className="container">
                <h1 className="h2 mb-8">Account</h1>

                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-20">
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-4">Order history</h2>

                        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                <thead className="bg-gray-50 dark:bg-darkmode-light">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Order</th>
                                        <th className="px-4 py-2 text-left font-medium">Date</th>
                                        <th className="px-4 py-2 text-left font-medium">Payment status</th>
                                        <th className="px-4 py-2 text-left font-medium">Fulfillment status</th>
                                        <th className="px-4 py-2 text-right font-medium">Total</th> 
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-4 py-3 text-[#c60404] font-medium">
                                                <Link href={`/orders/${order.id}`}>{order.number}</Link>
                                            </td>
                                            <td className="px-4 py-3">{order.date}</td>
                                            <td className="px-4 py-3">{order.paymentStatus}</td>
                                            <td className="px-4 py-3">{order.fulfillmentStatus}</td>
                                            <td className="px-4 py-3 text-right font-semibold">
                                                {order.total}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <aside className="w-full md:w-64 shrink-0">
                        <h2 className="text-xl font-semibold mb-4">Account details</h2>
                        <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                            John Smith <br />
                            151 O Connor Street <br />
                            Ottawa ON K2P 2L8 <br />
                            Canada
                        </p>
                        <a
                            href="/profile"
                            className="inline-block mt-3 text-[#c60404] hover:underline text-sm"
                        >
                            View addresses (1)
                        </a>
                    </aside>
                </div>
            </div>
        </section>
    )
}
