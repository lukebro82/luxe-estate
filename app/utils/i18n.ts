import { cookies } from "next/headers";

const dictionaries = {
  en: () =>
    import("@/dictionaries/en.json").then((module) => module.default),
  es: () =>
    import("@/dictionaries/es.json").then((module) => module.default),
  fr: () =>
    import("@/dictionaries/fr.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getLocale = async (): Promise<Locale> => {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value as Locale;
  return dictionaries[locale] ? locale : "es";
};

export const getDictionary = async () => {
  const locale = await getLocale();
  return dictionaries[locale]();
};
