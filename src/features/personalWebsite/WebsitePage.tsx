import { useEffect, type ReactNode } from 'react';
import { href, usePath } from '../../app/router';
import { useDiscovery } from '../../hooks/useDiscovery';
import { AboutPage } from './pages/AboutPage';
import { BlogIndexPage, BlogPostPage } from './pages/BlogPages';
import { ContactPage } from './pages/ContactPage';
import { FriendsPage } from './pages/FriendsPage';
import { GuestbookPage } from './pages/GuestbookPage';
import { HomePage } from './pages/HomePage';
import { OutboundPage, ServerNotFoundPage } from './pages/ErrorPages';
import { OwlFramePage, OwlsPage } from './pages/OwlsPages';
import { PhotoDetailPage, PhotosPage } from './pages/PhotoPages';
import { StillPage } from './pages/StillPage';
import { parseSiteRoute, siteAddress, type SiteRoute } from './websiteRoutes';

const NAV_ITEMS = [
  { label: 'home', to: '/website', page: 'home' },
  { label: 'about', to: '/website/about', page: 'about' },
  { label: 'blog', to: '/website/blog', page: 'blog' },
  { label: 'photos', to: '/website/photos', page: 'photos' },
  { label: 'guestbook', to: '/website/guestbook', page: 'guestbook' },
  { label: 'friends', to: '/website/friends', page: 'friends' },
  { label: 'contact', to: '/website/contact', page: 'contact' },
];

/** Egg 8: the site's seven pages, visited in reverse nav order. */
const REVERSE_ORDER = NAV_ITEMS.map((item) => item.page).reverse();
let trail: string[] = [];

function recordTrail(page: string) {
  if (trail[trail.length - 1] === page) return false;
  trail = [...trail, page].slice(-REVERSE_ORDER.length);
  return trail.join() === REVERSE_ORDER.join();
}

function navKey(route: SiteRoute) {
  if (route.page === 'post') return 'blog';
  if (route.page === 'photo') return 'photos';
  return route.page;
}

function renderPage(route: SiteRoute): ReactNode {
  switch (route.page) {
    case 'home':
      return <HomePage />;
    case 'about':
      return <AboutPage />;
    case 'blog':
      return <BlogIndexPage />;
    case 'post':
      return <BlogPostPage slug={route.slug} />;
    case 'photos':
      return <PhotosPage />;
    case 'photo':
      return <PhotoDetailPage id={route.id} />;
    case 'guestbook':
      return <GuestbookPage />;
    case 'friends':
      return <FriendsPage />;
    case 'contact':
      return <ContactPage />;
    case 'owls':
      return <OwlsPage />;
    case 'frame':
      return <OwlFramePage id={route.id} />;
    case 'still':
      return <StillPage />;
    case 'outbound':
      return <OutboundPage host={route.host} />;
    case 'notFound':
      return <ServerNotFoundPage />;
  }
}

export function WebsitePage() {
  const path = usePath();
  const route = parseSiteRoute(path);
  const current = navKey(route);
  const { record } = useDiscovery();

  useEffect(() => {
    record('flags', 'visited-site');
    if (recordTrail(current)) record('flags', 'found-still');
  }, [current, record]);

  const isBareError = route.page === 'outbound' || route.page === 'notFound';

  return (
    <div className="browser">
      <div className="browser__titlebar">
        <span>~ eleanor's corner of the web ~</span>
      </div>
      <div className="browser__address">
        <span className="browser__address-label">Address</span>
        <output className="browser__address-value">{siteAddress(route, path)}</output>
      </div>

      {isBareError ? (
        <div className="browser__viewport">{renderPage(route)}</div>
      ) : (
        <div className="browser__viewport oldweb">
          <div className="oldweb__frame">
            <header className="oldweb__header">
              <p className="oldweb__title">~ eleanor's corner of the web ~</p>
            </header>
            <nav className="oldweb__nav" aria-label="Eleanor's website">
              {NAV_ITEMS.map((item, index) => (
                <span key={item.page}>
                  {index > 0 && <span aria-hidden="true"> | </span>}
                  <a href={href(item.to)} aria-current={current === item.page ? 'page' : undefined}>
                    {item.label}
                  </a>
                </span>
              ))}
            </nav>
            <div className="oldweb__content">{renderPage(route)}</div>
            <footer className="oldweb__footer">
              <p>Made by hand in Ashford.  Best viewed at 1024 x 768.</p>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
