export type Lang = 'en' | 'es';

type LangPosition = 'prefix' | 'suffix' | 'none';

interface PathParams {
  base: string;
  segments?: string[];
  lang?: Lang;
  langPosition?: LangPosition;
  trailingSlash?: boolean;
}

const isLang = (value: string | undefined): value is Lang => value === 'en' || value === 'es';

function getSegments(pathname: string, base: string) {
  const pathWithoutBase = pathname.startsWith(base) ? pathname.slice(base.length - 1) : pathname;
  return pathWithoutBase.split('/').filter(Boolean);
}

export function detectLangFromPath(pathname: string, base: string, fallback: Lang = 'en'): Lang {
  const segments = getSegments(pathname, base);
  const [first, second, third] = segments;

  if (first === 'about' && isLang(second)) return second;
  if (first === 'blog' && isLang(second)) return second;
  if (first === 'blog' && isLang(third)) return third;
  if (isLang(first)) return first;

  return fallback;
}

export function getLocalizedPath(pathname: string, base: string, lang: Lang): string {
  const segments = getSegments(pathname, base);
  const [first, second, third, ...rest] = segments;

  // Keep Blog list route as /blog
  if (first === 'blog' && !second) {
    return buildPath({
      base,
      segments: ['blog'],
      lang,
      langPosition: 'suffix',
      trailingSlash: pathname.endsWith('/'),
    });
  }

  // Keep Blog list route in /blog/{lang} format
  if (first === 'blog' && isLang(second) && !third) {
    return buildPath({
      base,
      segments: ['blog'],
      lang,
      langPosition: 'suffix',
      trailingSlash: pathname.endsWith('/'),
    });
  }

  // Keep Blog detail in /blog/{slug}/{lang} format
  if (first === 'blog' && second && isLang(third)) {
    return buildPath({
      base,
      segments: ['blog', second, lang, ...rest],
      trailingSlash: pathname.endsWith('/'),
    });
  }

  // Fallback for legacy /blog/{slug} paths: append target language.
  if (first === 'blog' && second) {
    return buildPath({
      base,
      segments: ['blog', second, lang, ...rest],
      trailingSlash: pathname.endsWith('/'),
    });
  }

  // Keep About in /about/{lang} format
  if (first === 'about' || (isLang(first) && second === 'about')) {
    return buildPath({ base, segments: ['about'], lang, langPosition: 'suffix' });
  }

  const remaining = isLang(first) ? [second, ...rest].filter(Boolean) : segments;

  return buildPath({
    base,
    segments: remaining,
    lang,
    langPosition: 'prefix',
    trailingSlash: remaining.length === 0,
  });
}

export function buildPath({
  base,
  segments = [],
  lang,
  langPosition = 'none',
  trailingSlash = false,
}: PathParams): string {
  const cleanSegments = segments.filter(Boolean);
  const resultSegments = [...cleanSegments];

  if (lang && langPosition === 'prefix') {
    resultSegments.unshift(lang);
  }

  if (lang && langPosition === 'suffix') {
    resultSegments.push(lang);
  }

  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const path = `${normalizedBase}${resultSegments.join('/')}`;

  if (trailingSlash) {
    return path.endsWith('/') ? path : `${path}/`;
  }

  return path.endsWith('/') && resultSegments.length ? path.slice(0, -1) : path;
}
