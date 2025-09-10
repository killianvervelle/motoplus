import Cart from '@/components/cart/Cart'
import OpenCart from '@/components/cart/OpenCart'
import config from '@/config/config.json'
import theme from '@/config/theme.json'
import TwSizeIndicator from '@/helpers/TwSizeIndicator'
import Footer from '@/partials/Footer'
import Header from '@/partials/Header'
import Navbar from '@/partials/Navbar'
import Providers from '@/partials/Providers'
import '@/styles/main.css'
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }>; }) {
  const pf = theme.fonts.font_family.primary
  const sf = theme.fonts.font_family.secondary

  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html suppressHydrationWarning={true} lang={locale}>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=5' />

        <link rel='shortcut icon' href={config.site.favicon} />
        <meta name='msapplication-TileColor' content='#000000' />
        <meta name='theme-color' media='(prefers-color-scheme: light)' content='#fff' />
        <meta name='theme-color' media='(prefers-color-scheme: dark)' content='#000' />

        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          href={`https://fonts.googleapis.com/css2?family=${pf}${sf ? '&family=' + sf : ''}&display=swap`}
          rel='stylesheet'
        />
      </head>

      <body suppressHydrationWarning={true}>
        <TwSizeIndicator />
        <Providers>
          <NextIntlClientProvider>
            <Header>
              <OpenCart />
              <Cart />
            </Header>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}