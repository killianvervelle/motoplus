"use client";

import { markdownify } from "@/lib/utils/textConverter";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { ContactUsItem } from "@/types";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import { useState } from "react";

export const runtime = 'nodejs';
export const revalidate = 0;
console.log('[route] reached');

export default function ContactForm() {
    const [sending, setSending] = useState(false);
    const [done, setDone] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();



    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget;
        const data = new FormData(form);

        setSending(true);

        if (!executeRecaptcha) {
            return;
        }

        const token = await executeRecaptcha("contact");
        if (!token) {
            return;
        }

        const v = await fetch("/api/customer/validateRecaptcha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recaptchaResponse: token }),
        });

        if (!v.ok) {
            setSending(false);
            return;
        }

        const payload = {
            firstName: data.get("firstName"),
            lastName: data.get("lastName"),
            email: data.get("email"),
            message: data.get("message"),
            body: data.get("message")
        };

        const r = await fetch("/api/customer/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        setSending(false);
        if (r.ok) form.reset();

        setDone(true)
        setToken(null);
    }

    const data = {
        "contact_meta": [
            {
                "name": "Address",
                "contact": "Chem. des Mésanges 4, 1032 Romanel-sur-Lausanne"
            },
            {
                "name": "Email",
                "contact": "motopecas.net@gmail.com"
            },
            {
                "name": "Phone",
                "contact": "(+41) 021 535 67 11"
            },
            {
                "name": "Shop Time",
                "contact": "Monday - Friday:</br> 8:30 am – 12 pm </br> 1:30 pm – 6:30 pm </br></br>  Saturday: </br> 9 am – 12 pm </br> 12:10 pm – 4 pm </br>"
            }
        ]
    }

    return (
        <>
            <SeoMeta
                title={'Connect with Us'}
            />
            <PageHeader title={'Connect with Us'} />
            <section className="pt-12 xl:pt-24">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data &&
                            data.contact_meta?.map((contact: ContactUsItem) => (
                                <div
                                    key={contact.name}
                                    className="p-6 bg-light dark:bg-darkmode-light rounded-md text-center"
                                >
                                    <p
                                        dangerouslySetInnerHTML={markdownify(contact.name)}
                                        className="mb-6 h3 font-medium text-text-dark dark:text-darkmode-text-dark"
                                    />
                                    <p dangerouslySetInnerHTML={markdownify(contact.contact)} />
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="mx-auto lg:col-10 my-20">
                        <h2 className="mb-14 text-center">
                            We would love to hear from you!
                        </h2>

                        <form
                            className="border border-border dark:border-darkmode-border rounded-md p-10"
                            method="POST"
                            onSubmit={onSubmit}
                        >
                            <div className="mb-6 md:grid grid-cols-2 gap-x-8 max-md:space-y-6">
                                <div>
                                    <label htmlFor="firstName" className="form-label">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        className="form-input"
                                        type="text"
                                        required
                                        maxLength={25}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="form-label">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        className="form-input"
                                        type="text"
                                        maxLength={25}
                                    />
                                </div>
                            </div>

                            <div className="mb-6 md:grid grid-cols-2 gap-x-8 max-md:space-y-6">
                                <div>
                                    <label htmlFor="email" className="form-label">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        className="form-input"
                                        type="email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="name" className="form-label">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        className="form-input"
                                        type="text"
                                        required
                                        minLength={10}
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="message" className="form-label">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="form-input"
                                    rows={8}
                                    required
                                    minLength={10}
                                ></textarea>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" disabled={sending || done} className="btn btn-primary">
                                    {sending ? "Sending…" : done ? "Sent" : "Send"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};
