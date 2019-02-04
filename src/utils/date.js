import format from 'date-fns/format'
import ruLocale from 'date-fns/locale/ru'

export function shortDate(date) {
  return format(date, 'DD MMM', { locale: ruLocale })
}

export function longDate(date) {
  return format(date, 'DD MMM YYYY', { locale: ruLocale })
}

export function getFullYear() {
  const now = new Date()
  return now.getFullYear()
}
