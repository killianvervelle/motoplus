export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import ReCaptchaProvider from "./ReCaptchaProvider";
import ContactFormClient from "./ContactFormClient";

export default function ContactPage() {
  return (
    <>
      <ReCaptchaProvider>
        <ContactFormClient />
      </ReCaptchaProvider>
    </>
  );
}