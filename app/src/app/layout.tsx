import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pony Niceness Project",
  description: "Contribute to the study of pony niceness today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
