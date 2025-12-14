import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Header from '@/components/UI/layout/header';
import { Providers } from '@/providers/providers';
import { siteConfig } from '@/config/site.config';
import { layoutConfig } from '@/config/layout.config';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth/auth';
import AppLoader from '@/hoc/app-loader';
import Title from '@/components/UI/layout/title';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth(); // отримуємо сесію користувача auth - проміжне ПО (middleware) для захисту маршрутів і сторінок, що вимагають аутентифікації.
  //  Достаёт текущего пользователя в server components через auth().
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SessionProvider session={session}>
            <AppLoader>
              <div className="flex flex-col justify-between min-h-screen">
                <div className="flex flex-col">
                  <Header />
                  <main className="flex flex-col max-w-[1024px] px-[24px] mx-auto justify-start items-center">
                    <Title />
                    {children}
                  </main>
                </div>
                <footer
                  className="flex justify-center items-center"
                  style={{ height: layoutConfig.footerHeight }}
                >
                  <p>{siteConfig.description}</p>
                </footer>
              </div>
            </AppLoader>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  );
}
