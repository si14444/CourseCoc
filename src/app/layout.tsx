import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CourseCoc - 나만의 데이트 코스 만들기",
  description:
    "사랑하는 사람과 함께할 특별한 데이트 코스를 만들고 공유해보세요. 코스콕에서 로맨틱한 추억을 만드세요.",
  keywords: ["데이트", "코스", "연인", "로맨틱", "데이트코스", "커플"],
  authors: [{ name: "CourseCoc Team" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
    shortcut: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent extension interference during hydration
              if (typeof window !== 'undefined') {
                const observer = new MutationObserver(() => {
                  // Remove extension-added attributes that cause hydration mismatches
                  document.querySelectorAll('[data-wxt-integrated]').forEach(el => {
                    el.removeAttribute('data-wxt-integrated');
                  });
                });
                observer.observe(document.documentElement, {
                  attributes: true,
                  subtree: true
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
