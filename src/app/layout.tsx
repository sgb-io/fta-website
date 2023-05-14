import "./global.css";

export const metadata = {
  title: "fta.rs",
  description: "Fast TypeScript Analyzer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
