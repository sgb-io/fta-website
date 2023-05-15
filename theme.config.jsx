import Image from "next/image";

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
};

export default config;
