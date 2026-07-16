import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Castaminofen',
  description: 'Phase 0 foundation for Castaminofen',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
