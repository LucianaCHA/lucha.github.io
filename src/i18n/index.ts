import { aboutContent } from './about';
import { footerContent } from './footer';
import { homeContent } from './home';

export function useTranslations(lang: string) {
  return {
    home: homeContent[lang],
    footer: footerContent[lang],
    about: aboutContent[lang],
  };
}
