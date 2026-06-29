import { describe, expect, it } from 'vitest';
import { buildPath, detectLangFromPath, getLocalizedPath } from './routing';

describe('routing helpers', () => {
  it('detects the language from localized paths', () => {
    expect(detectLangFromPath('/blog/post/es', '/')).toBe('es');
    expect(detectLangFromPath('/about/en', '/')).toBe('en');
    expect(detectLangFromPath('/es/blog/post', '/')).toBe('es');
    expect(detectLangFromPath('/blog/es', '/')).toBe('es');
    expect(detectLangFromPath('/lucha.github.io/es/blog/post', '/lucha.github.io/')).toBe('es');
    expect(detectLangFromPath('/lucha.github.io/blog/post', '/lucha.github.io/')).toBe('en');
  });

  it('builds localized paths consistently', () => {
    expect(getLocalizedPath('/blog', '/', 'es')).toBe('/blog/es');
    expect(getLocalizedPath('/blog/post/en', '/', 'es')).toBe('/blog/post/es');
    expect(getLocalizedPath('/blog/post', '/', 'es')).toBe('/blog/post/es');
    expect(getLocalizedPath('/es/about', '/', 'en')).toBe('/about/en');
    expect(buildPath({ base: '/', segments: ['about'], lang: 'en', langPosition: 'suffix' })).toBe('/about/en');
    expect(getLocalizedPath('/lucha.github.io/blog', '/lucha.github.io/', 'es')).toBe(
      '/lucha.github.io/blog/es'
    );
    expect(getLocalizedPath('/lucha.github.io/es/about', '/lucha.github.io/', 'en')).toBe(
      '/lucha.github.io/about/en'
    );
    expect(
      buildPath({
        base: '/lucha.github.io/',
        segments: ['blog', 'post'],
        lang: 'es',
        langPosition: 'suffix',
        trailingSlash: true,
      })
    ).toBe('/lucha.github.io/blog/post/es/');
  });
});