import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/context/AuthContext';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Swiftskil',
  description: 'Learn any topic with AI-generated lesson plans and interactive content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AnimatePresence mode="wait" initial={false}>
          {children}
        </AnimatePresence>
        </ThemeProvider>
      </AuthProvider>
      </body>
    </html>
  );
}