import { NextRequest, NextResponse } from 'next/server';

const supportedLocales = ['fa', 'en'] as const;
const defaultLocale = 'fa';
const localeCookieName = 'castaminofen-locale';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Extract locale from pathname if it starts with /fa or /en
  let locale = defaultLocale;
  const localeMatch = pathname.match(/^\/([a-z]{2})(?:\/|$)/);

  if (localeMatch) {
    const candidateLocale = localeMatch[1];
    // Verify it's a supported locale
    if (supportedLocales.includes(candidateLocale as any)) {
      locale = candidateLocale;
    }
  }

  // Create request headers copy with the detected locale
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-castaminofen-locale', locale);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set probe header for testing
  response.headers.set(
    'x-castaminofen-middleware-probe',
    'phase-9.6.3'
  );

  // Set the locale cookie so it persists across requests
  response.cookies.set(localeCookieName, locale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
