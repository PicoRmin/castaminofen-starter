import { headers } from 'next/headers';

export async function GET() {
  const headersList = headers();
  const xLocale = headersList.get('x-locale');
  const xPathname = headersList.get('x-pathname');
  
  return Response.json({
    xLocale,
    xPathname,
  });
}
