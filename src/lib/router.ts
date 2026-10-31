import { useEffect, useState } from 'react';

export interface Route {
  path: string;
  parts: string[];
  params: URLSearchParams;
  raw: string;
}

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const [pathPart, query = ''] = clean.split('?');
  const path = pathPart.replace(/\/+$/, '') || 'overview';
  return {
    path,
    parts: path.split('/').filter(Boolean),
    params: new URLSearchParams(query),
    raw: hash,
  };
}

export function navigate(to: string): void {
  const next = to.startsWith('#') ? to : `#/${to.replace(/^\//, '')}`;
  if (window.location.hash === next) return;
  window.location.hash = next;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onChange);
    if (!window.location.hash) window.location.hash = '#/overview';
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function useQueryState(key: string): [string, (v: string) => void] {
  const route = useRoute();
  const value = route.params.get(key) ?? '';
  const set = (v: string) => {
    const params = new URLSearchParams(route.params);
    if (v) params.set(key, v);
    else params.delete(key);
    const qs = params.toString();
    navigate(`/${route.path}${qs ? `?${qs}` : ''}`);
  };
  return [value, set];
}
