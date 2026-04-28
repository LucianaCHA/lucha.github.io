import { defineMiddleware } from 'astro:middleware';

const REPO_BASE = '/lucha.github.io';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname, search } = context.url;

  // In local dev, accept legacy repo-prefixed URLs and redirect to root-based routes.
  if (import.meta.env.DEV && (pathname === REPO_BASE || pathname.startsWith(`${REPO_BASE}/`))) {
    const normalizedPath = pathname.slice(REPO_BASE.length) || '/';
    return context.redirect(`${normalizedPath}${search}`, 302);
  }

  return next();
});
