export interface LocalizedText {
  ko: string;
  en: string;
  ja: string;
  zh: string;
  vi: string;
}

export interface ForWorkItem {
  title: LocalizedText;
  company: string;
  description: LocalizedText;
  date: string;
  link: string;
  image: string;
}
