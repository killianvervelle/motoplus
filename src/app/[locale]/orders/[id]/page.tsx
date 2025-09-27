'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useRef } from 'react'

type Item = {
    title: string
    sku: string
    price: string
    quantity: number
    total: string
}

type OrderDetails = {
    number: string
    date: string
    paymentStatus: string
    fulfillmentStatus: string
    subtotal: string
    shipping: string
    total: string
    billingAddress: string
    shippingAddress: string
    items: Item[]
}

export default function OrderDetailsPage() {
    const { id } = useParams() as { id: string }
    const [order, setOrder] = useState<OrderDetails | null>(null)
    const invoiceRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setOrder({
            number: `#${id}`,
            date: 'June 23, 2025 at 8:19 pm',
            paymentStatus: 'Paid',
            fulfillmentStatus: 'Unfulfilled',
            subtotal: 'CHF 215.00',
            shipping: 'CHF 0.00',
            total: 'CHF 215.00',
            billingAddress: `
John Smith
151 O'Connor Street
Ottawa ON K2P 2L8
Canada`,
            shippingAddress: 
            `
John Smith 
151 O'Connor Street
Ottawa ON K2P 2L8
Canada`,
            items: [
                {
                    title: 'Wave Wallet – Earth',
                    sku: '11-003-023',
                    price: 'CHF 215.00',
                    quantity: 1,
                    total: 'CHF 215.00',
                },
            ],
        })
    }, [id])

    if (!order)
        return (
            <section className="pt-12 xl:pt-24">
                <div className="container">Loading…</div>
            </section>
        )

    return (
        <section className="pt-12 xl:pt-24">
            <div className="container max-w-6xl">
                <h1 className="h2 mb-4">Account</h1>
                <a
                    href="/orders"
                    className="text-sm text-primary hover:underline inline-block mb-8"
                >
                    ← Return to Account details
                </a>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-20" ref={invoiceRef}>
                    <div className="lg:col-span-2">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">
                                Order {order.number}
                            </h2>
                            <div className='flex flex-row justify-between'>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                                    Placed on {order.date}
                                </p>
                                <p className="text-sm mb-1">
                                    Fulfillment Status: {order.fulfillmentStatus}
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-md">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Product</th>
                                        <th className="py-3 px-4 text-left">SKU</th>
                                        <th className="py-3 px-4 text-right">Price</th>
                                        <th className="py-3 px-4 text-center">Qty</th>
                                        <th className="py-3 px-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {order.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="py-3 px-4">{item.title}</td>
                                            <td className="py-3 px-4">{item.sku}</td>
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
                                <span>Subtotal</span>
                                <span>{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-sm">
                                <span>Shipping (Standard)</span>
                                <span>{order.shipping}</span>
                            </div>
                            <div className="flex justify-between w-full max-w-sm font-semibold text-base mt-2">
                                <span>Total</span>
                                <span>{order.total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex lg:flex-col flex-row justify-start gap-20 lg:gap-0 space-y-8 text-left items-start">
                        <div>
                            <h5 className="font-semibold mb-1">Billing Address</h5>
                            <pre className="whitespace-pre-wrap text-sm text-left">
                                {order.billingAddress}
                            </pre>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-1">Shipping Address</h5>
                            <pre className="whitespace-pre-wrap text-sm text-left">
                                {order.shippingAddress}
                            </pre>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    )
}
