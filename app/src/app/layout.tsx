import type { Metadata } from "next";
import "./globals.css";
import { createTheme, InitColorSchemeScript } from "@mui/material";

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
        <InitColorSchemeScript attribute="data" />
        {children}
      </body>
    </html>
  );
}
