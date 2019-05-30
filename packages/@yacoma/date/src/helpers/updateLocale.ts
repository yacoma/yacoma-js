import moment from 'moment'

const LANG_TO_LOCALE: { [key: string]: string } = {
  fr: 'fr-ch',
  en: 'en-gb',
}

export function updateLocale(lang: string) {
  moment.locale(LANG_TO_LOCALE[lang || 'en'] || lang)
}
