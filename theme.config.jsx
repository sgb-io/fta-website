import { useConfig } from "nextra-theme-docs";
import Image from "next/image";

const Head = () => {
  const { frontMatter, title } = useConfig();
  return (
    <>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta
        name="description"
        content={
          frontMatter?.description ||
          "FTA (Fast TypeScript Analyzer) is a super-fast TypeScript static analysis tool written in Rust. It captures static information about TypeScript code and generates easy-to-understand analytics that tell you about complexity and maintainability issues that you may want to address."
        }
      />
      <meta
        name="og:description"
        content={
          frontMatter.description ||
          "FTA (Fast TypeScript Analyzer) is a super-fast TypeScript static analysis tool written in Rust. It captures static information about TypeScript code and generates easy-to-understand analytics that tell you about complexity and maintainability issues that you may want to address."
        }
      />
      <meta
        name="og:title"
        content={title ? title + " – FTA" : "FTA: Fast TypeScript Analyzer"}
      />
      <meta name="apple-mobile-web-app-title" content="FTA" />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
        media="print"
        onLoad="this.media='all'"
      />
    </>
  );
};

const config = {
  project: {
    link: "https://github.com/sgb-io/fta",
  },
  logo: (
    <>
      <Image src="/fta-logo.png" width={74} height={45} alt="FTA" />
      <span style={{ marginLeft: 10 }}>Fast TypeScript Analyzer</span>
    </>
  ),
  footer: {
    text: (
      <span>
        <a href="https://ftaproject.dev" target="_blank">
          FTA Project
        </a>
        , powered by Nextra
      </span>
    ),
  },
  useNextSeoProps: () => {
    return {
      titleTemplate: "%s – FTA",
    };
  },
  head: <Head />,
};

export default config;
