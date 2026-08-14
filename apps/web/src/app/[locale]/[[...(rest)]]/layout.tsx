import { ReactNode } from 'react';
import { isSupportedLocale } from '@/i18n/config';

interface LocalePrefixedLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocalePrefixedLayout({ children, params }: LocalePrefixedLayoutProps) {
  const { locale } = await params;
  
  // Verify locale is supported - if not, let not-found handle it
  if (!isSupportedLocale(locale)) {
    // This shouldn't happen since page.tsx checks this, but just in case
    return null;
  }
  
  // The layout just passes children through
  // The root layout will read the locale from the cookie that middleware set
  // But the page component inside renders the appropriate page component
  return <>{children}</>;
}
