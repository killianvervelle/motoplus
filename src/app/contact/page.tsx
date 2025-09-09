export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import ReCaptchaProvider from "./ReCaptchaProvider";
import ContactFormClient from "./ContactFormClient";

export default function ContactPage() {
  return (
    <>
      <SeoMeta title="Connect with Us" />
      <PageHeader title="Connect with Us" />
      <ReCaptchaProvider>
        <ContactFormClient />
      </ReCaptchaProvider>
    </>
  );
}