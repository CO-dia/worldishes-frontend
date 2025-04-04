import { ReactNode } from "react";
import { Viewport } from "next";
import { getSEOTags } from "@/libs/seo";
import Layout from "@/components/Layout";
import config from "@/config";
import "./globals.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Analytics } from "@vercel/analytics/react";

export const viewport: Viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme={config.colors.theme}>
      <body className="flex flex-col items-center">
        {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
        <Layout>{children}</Layout>
        <Analytics />
      </body>
    </html>
  );
}
