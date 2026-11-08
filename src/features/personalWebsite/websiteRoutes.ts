export type SiteRoute =
  | { page: 'home' }
  | { page: 'about' }
  | { page: 'blog' }
  | { page: 'post'; slug: string }
  | { page: 'photos' }
  | { page: 'photo'; id: string }
  | { page: 'guestbook' }
  | { page: 'friends' }
  | { page: 'contact' }
  | { page: 'owls' }
  | { page: 'frame'; id: string }
  | { page: 'still' }
  | { page: 'outbound'; host: string }
  | { page: 'notFound'; path: string };

const BASE = '/website';
const DOMAIN = 'eleanorvale.example';

export function parseSiteRoute(path: string): SiteRoute {
  const rest = path.slice(BASE.length).replace(/\/$/, '');
  const [first, second] = rest.split('/').filter(Boolean);

  if (rest === '') return { page: 'home' };
  if (rest === '/~eleanor/still') return { page: 'still' };

  if (first === 'blog') return second ? { page: 'post', slug: second } : { page: 'blog' };
  if (first === 'photos') return second ? { page: 'photo', id: second } : { page: 'photos' };
  if (first === 'owls') return second ? { page: 'frame', id: second } : { page: 'owls' };
  if (first === 'out' && second) return { page: 'outbound', host: second };

  if (!second) {
    if (first === 'about') return { page: 'about' };
    if (first === 'guestbook') return { page: 'guestbook' };
    if (first === 'friends') return { page: 'friends' };
    if (first === 'contact') return { page: 'contact' };
  }

  return { page: 'notFound', path: rest };
}

/** What the simulated address bar shows. */
export function siteAddress(route: SiteRoute, path: string) {
  if (route.page === 'outbound') return `http://${route.host}/`;
  const rest = path.slice(BASE.length);

  switch (route.page) {
    case 'home':
      return `http://${DOMAIN}/`;
    case 'post':
      return `http://${DOMAIN}/blog/${route.slug}.html`;
    case 'photo':
      return `http://${DOMAIN}/photos/${route.id}.html`;
    case 'frame':
      return `http://${DOMAIN}/owls/${route.id}.JPG`;
    case 'owls':
      return `http://${DOMAIN}/owls/`;
    case 'still':
      return `http://${DOMAIN}/~eleanor/still/`;
    default:
      return `http://${DOMAIN}${rest}${rest.endsWith('.html') ? '' : '.html'}`;
  }
}
