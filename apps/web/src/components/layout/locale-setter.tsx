'use client';

import { useLayoutEffect } from 'react';

interface LocaleSetterProps {
  locale: string;
}

/**
 * Client-side component that sets HTML lang and dir attributes
 * This component should be rendered as early as possible in the locale-specific page
 * to ensure proper locale attributes are set before paint
 */
export function LocaleSetter({ locale }: LocaleSetterProps) {
  useLayoutEffect(() => {
    // Set HTML attributes based on locale
    const html = document.documentElement;
    html.lang = locale === 'en' ? 'en' : 'fa';
    html.dir = locale === 'en' ? 'ltr' : 'rtl';
  }, [locale]);

  return null; // This component doesn't render anything
}
