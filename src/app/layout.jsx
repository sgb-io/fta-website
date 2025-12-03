import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./global.css";
import Script from "next/script";
import Image from "next/image";

const GA_TRACKING_ID = "G-R9CFR6RFX1";

export const metadata = {
  metadataBase: new URL("https://ftaproject.dev"),
  title: {
    template: "%s – FTA",
    default: "FTA: Fast TypeScript Analyzer",
  },
  description:
    "FTA (Fast TypeScript Analyzer) is a super-fast TypeScript static analysis tool written in Rust. It captures static information about TypeScript code and generates easy-to-understand analytics that tell you about complexity and maintainability issues that you may want to address.",
  applicationName: "FTA",
  appleWebApp: {
    title: "FTA",
  },
  other: {
    "msapplication-TileColor": "#ffffff",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <>
          <Image src="/fta-logo.png" width={74} height={45} alt="FTA" />
          <span style={{ marginLeft: 10 }}>Fast TypeScript Analyzer</span>
        </>
      }
      projectLink="https://github.com/sgb-io/fta"
    />
  );

  const pageMap = await getPageMap();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <meta name="theme-color" content="#ffffff" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
          media="print"
        />
      </Head>
      <body>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Layout
          navbar={navbar}
          footer={
            <Footer>
              <span>
                <a href="https://ftaproject.dev" target="_blank">
                  FTA Docs
                </a>
                , powered by Nextra. FTA is supported by{" "}
                <strong>
                  <a href="https://savingtool.co.uk">Saving Tool UK</a>
                </strong>{" "}
                - the UK&apos;s most comprehensive personal finance tool.
              </span>
            </Footer>
          }
          docsRepositoryBase="https://github.com/sgb-io/fta"
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
