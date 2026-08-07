import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import TanStackProvider from '../components/TanStackProvider/TanStackProvider';
import AuthProvider from '../components/AuthProvider/AuthProvider';
import './globals.css';

const roboto = Roboto({
  weight: ['400', '500', '700'], 
  subsets: ['latin', 'cyrillic'], 
  variable: '--font-roboto', 
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoteHub - Your Personal Notes App',
  description: 'A convenient application for creating, organizing, and managing your personal notes efficiently.',
  openGraph: {
    title: 'NoteHub - Your Personal Notes App',
    description: 'A convenient application for creating, organizing, and managing your personal notes efficiently.',
    url: 'https://notehub.com/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Open Graph Image',
      },
    ],
  },
};

export default function RootLayout({
  children,
  sidebar,
  modal,
}: {
  children: React.ReactNode;
  sidebar?: React.ReactNode; 
  modal?: React.ReactNode;   
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <TanStackProvider>
          <AuthProvider>
            <Header />
            <div style={{ display: 'flex', minHeight: '80vh' }}>
              {sidebar && <aside>{sidebar}</aside>}
              <main style={{ flex: 1 }}>{children}</main>
            </div>
            {modal}
            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
