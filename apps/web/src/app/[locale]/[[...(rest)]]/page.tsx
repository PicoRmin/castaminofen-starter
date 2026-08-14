import { notFound } from 'next/navigation';
import { isSupportedLocale } from '@/i18n/config';

// Import all page components that can be locale-prefixed
import HomePage from '@/app/page';
import LibraryPage from '@/app/library/page';
import SearchPage from '@/app/search/page';
import CreatePage from '@/app/create/page';
import CreatorPage from '@/app/creator/page';
import CommunityPage from '@/app/community/page';
import ProfilePage from '@/app/profile/page';
import LoginPage from '@/app/login/page';
import RegisterPage from '@/app/register/page';
import SettingsPage from '@/app/settings/page';
import AdminPage from '@/app/admin/page';
import OfflineLibraryPage from '@/app/offline-library/page';
import PodcastsPage from '@/app/podcasts/page';
import PlaylistsPage from '@/app/playlists/page';

interface LocalePrefixedPageProps {
  params: Promise<{ locale: string; rest?: string[] }>;
}

// Map of routes to their component functions (not pre-rendered)
const pageComponentMap = {
  '/': HomePage,
  '/library': LibraryPage,
  '/search': SearchPage,
  '/create': CreatePage,
  '/creator': CreatorPage,
  '/community': CommunityPage,
  '/profile': ProfilePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/settings': SettingsPage,
  '/admin': AdminPage,
  '/offline-library': OfflineLibraryPage,
  '/podcasts': PodcastsPage,
  '/playlists': PlaylistsPage,
};

export default async function LocalePrefixedPage({ params }: LocalePrefixedPageProps) {
  const { locale, rest = [] } = await params;

  // Verify locale is supported
  if (!isSupportedLocale(locale)) {
    notFound();
  }

  // Build the route path
  const routePath = rest.length === 0 ? '/' : `/${rest.join('/')}`;

  // Try to find component for this route
  const ComponentClass = pageComponentMap[routePath as keyof typeof pageComponentMap];
  
  if (ComponentClass) {
    // SSR now handles locale correctly, no client-side correction needed
    return <ComponentClass />;
  }

  // Dynamic routes (/episodes, /podcasts, /playlists with IDs) are not supported via locale prefix
  // Users should access /episodes/[id] etc directly
  // Route not found
  notFound();
}
