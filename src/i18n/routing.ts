export type Lang = 'en' | 'es';

const isLang = (value: string | undefined): value is Lang => value === 'en' || value === 'es';

function getSegments(pathname: string, base: string) {
  const pathWithoutBase = pathname.startsWith(base) ? pathname.slice(base.length - 1) : pathname;
  return pathWithoutBase.split('/').filter(Boolean);
}

export function detectLangFromPath(pathname: string, base: string, fallback: Lang = 'en'): Lang {
  const segments = getSegments(pathname, base);
  const [first, second] = segments;

  if (first === 'about' && isLang(second)) return second;
  if (isLang(first)) return first;

  return fallback;
}

export function getLocalizedPath(pathname: string, base: string, lang: Lang): string {
  const segments = getSegments(pathname, base);
  const [first, second, ...rest] = segments;

  // Keep About in /about/{lang} format
  if (first === 'about' || (isLang(first) && second === 'about')) {
    return `${base}about/${lang}`;
  }

  const remaining = isLang(first) ? [second, ...rest].filter(Boolean) : segments;
  const suffix = remaining.length ? `/${remaining.join('/')}` : '/';

  return `${base}${lang}${suffix}`;
}

export function getHomePath(base: string, lang: Lang): string {
  return `${base}${lang}/`;
}

export function getAboutPath(base: string, lang: Lang): string {
  return `${base}about/${lang}`;
}
