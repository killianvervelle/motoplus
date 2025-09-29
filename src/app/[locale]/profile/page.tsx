'use client'

import { useEffect, useState } from 'react'
import type { ShopifyAddress, NewShopifyAddress } from '@/lib/shopify/types'
import Cookies from 'js-cookie'
import { deleteUserAdress, createUserAdress } from '@/lib/shopify'
import { europeanCountries } from '@/lib/constants'

type ProfileUser = {
    firstName: string
    lastName: string
    email: string
    defaultAddress?: ShopifyAddress | null
    addresses: ShopifyAddress[]
}

async function fetchUser() {
    const res = await fetch('/api/customer/me', { credentials: 'include' })
    console.log("RES", res)
    if (!res.ok) return null
    return await res.json()
}

export default function ProfilePage() {
    const [user, setUser] = useState<ProfileUser | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<NewShopifyAddress>({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        province: '',
        country: '',
        zip: '',
        phone: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchUser().then(setUser)
    }, [])

    const initials =
        `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase()

    const formatAddress = (a?: ShopifyAddress | null) =>
        a
            ? `${a.firstName ?? ''} ${a.lastName ?? ''}
${a.address1 ?? ''}${a.address2 ? `, ${a.address2}` : ''}
${a.city ?? ''} ${a.province ?? ''} ${a.zip ?? ''}
${a.country ?? ''}`
            : 'No address on file.'

    const handleDelete = async (id: string) => {
        const accessToken = Cookies.get('token')
        if (!accessToken) return null
        try {
            await deleteUserAdress(accessToken, id)
            const updated = await fetchUser()
            setUser(updated)
        } catch (err) {
            console.error('Error deleting address:', err)
        }
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e: React.FormEvent) => {
        const accessToken = Cookies.get('token')
        if (!accessToken) return null
        e.preventDefault()
        setLoading(true); setError(null)
        try {
            await createUserAdress(accessToken, form)
            setShowForm(false)
            fetchUser().then(setUser)
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="pt-12 xl:pt-24">
            <div className="container max-w-5xl">
                <h1 className="h2 mb-10 text-center">My Account</h1>

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="bg-white dark:bg-darkmode-light rounded-xl shadow p-8 flex flex-col items-center text-center">
                        <div className="h-28 w-28 mb-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-800 text-3xl font-bold">
                            {initials}
                        </div>

                        <p className="text-2xl font-semibold">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-gray-500 dark:text-gray-300 mt-2">{user?.email}</p>

                        <hr className="my-6 w-full border-gray-200 dark:border-gray-700" />

                        <div className="flex flex-col space-y-3 w-full">
                            <a
                                href="/orders"
                                className="btn btn-outline-primary w-full hover:bg-gray-700"
                            >
                                View Orders
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-darkmode-light rounded-xl p-6">
                            <div className="whitespace-pre-line text-sm">
                                {formatAddress(user?.defaultAddress)}
                            </div>
                        </div>

                        <div className="h-[1px] bg-black/30 rounded-full" />

                        <div className="bg-white dark:bg-darkmode-light rounded-xl shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg">Saved Addresses</h3>
                                <button
                                    onClick={() => {
                                        setShowForm(!showForm)
                                        setForm({
                                            firstName: '',
                                            lastName: '',
                                            address1: '',
                                            address2: '',
                                            city: '',
                                            province: '',
                                            country: '',
                                            zip: '',
                                            phone: '',
                                        })
                                    }}
                                    className="btn btn-outline-primary text-sm hover:bg-gray-700"
                                >
                                    {showForm ? 'Close' : '+ Add Address'}
                                </button>
                            </div>

                            {user?.addresses && user.addresses.filter(a => a.id !== user.defaultAddress?.id).length > 0 ? (
                                user.addresses
                                    .filter(a => a.id !== user.defaultAddress?.id)
                                    .map((addr, i) => (
                                        <div
                                            key={addr.id}
                                            className={`pt-4 ${i > 0 ? 'border-t border-gray-300 mt-4' : ''}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="whitespace-pre-line text-sm">
                                                    {formatAddress(addr)}
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(addr.id)}
                                                    className="text-red-600 text-sm hover:underline ml-4"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <p className="text-sm text-gray-500">No additional addresses.</p>
                            )}

                            {showForm && (
                                <form onSubmit={handleSubmit} className="mt-8 border-t border-gray-300 pt-6 space-y-4">
                                    <h4 className="font-semibold text-md mb-2">Add New Address (will become default)</h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="firstName" placeholder="First name" value={form.firstName ? form.firstName : ''}
                                            onChange={handleFormChange} className="border p-2 rounded w-full" required />
                                        <input name="lastName" placeholder="Last name" value={form.lastName ? form.lastName : ''}
                                            onChange={handleFormChange} className="border p-2 rounded w-full" required />
                                    </div>

                                    <input name="address1" placeholder="Street address" value={form.address1 ? form.address1 : ''}
                                        onChange={handleFormChange} className="border p-2 rounded w-full" required />
                                    <input name="address2" placeholder="Apartment, suite (optional)" value={form.address2 ? form.address2 : ''}
                                        onChange={handleFormChange} className="border p-2 rounded w-full" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="city" placeholder="City" value={form.city ? form.city : ''}
                                            onChange={handleFormChange} className="border p-2 rounded w-full" required />
                                        <input name="province" placeholder="Province/State" value={form.province ? form.province : ''}
                                            onChange={handleFormChange} className="border p-2 rounded w-full" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <input name="zip" placeholder="Postal code" value={form.zip ? form.zip : ''}
                                            onChange={handleFormChange} className="border p-2 rounded w-full" required />
                                        <select
                                            name="country"
                                            value={form.country ? form.country : ''}
                                            onChange={(e) => setForm({ ...form, country: e.target.value })}
                                            className="border p-2 rounded w-full"
                                            required
                                        >
                                            <option value="">Select country…</option>
                                            {europeanCountries.map(c => (
                                                <option key={c.code} value={c.name}>
                                                    {c.name} ({c.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <input name="phone" placeholder="Phone (optional)" value={form.phone ? form.phone : ''}
                                        onChange={handleFormChange} className="border p-2 rounded w-full" />

                                    {error && <p className="text-red-600 text-sm">{error}</p>}

                                    <button type="submit" disabled={loading} className="btn btn-primary w-full hover:bg-gray-700">
                                        {loading ? 'Adding…' : 'Add & Set Default'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}
