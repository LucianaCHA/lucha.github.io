import { homeContent } from "./home";

export function useTranslations(lang: string) {
  return {
    home: homeContent[lang],
  };
}