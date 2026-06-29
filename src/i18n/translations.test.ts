import { describe, expect, it } from 'vitest';
import { aboutContent } from './about';
import { footerContent } from './footer';
import { homeContent } from './home';
import { useTranslations } from './index';

describe('translations', () => {
  it('returns the Spanish copy for the selected language', () => {
    const translations = useTranslations('es');

    expect(translations.home.title).toBe(homeContent.es.title);
    expect(translations.about.title).toBe(aboutContent.es.title);
    expect(translations.footer.tagline).toBe(footerContent.es.tagline);
  });

  it('returns the English copy for the selected language', () => {
    const translations = useTranslations('en');

    expect(translations.home.more).toBe(homeContent.en.more);
    expect(translations.about.paragraphs).toHaveLength(aboutContent.en.paragraphs.length);
    expect(translations.footer.tagline).toBe(footerContent.en.tagline);
  });

  it('keeps the locale data available in the source tables', () => {
    expect(Object.keys(homeContent)).toEqual(['es', 'en']);
    expect(Object.keys(aboutContent)).toEqual(['es', 'en']);
    expect(Object.keys(footerContent)).toEqual(['es', 'en']);
  });
});