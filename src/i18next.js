import i18next from 'i18next'
import ru from './locales/ru.json'

const i18n = i18next.createInstance()

const initPromise = i18n.init({
  lng: 'ru',
  fallbackLng: 'ru',
  resources: { ru: { translation: ru } },
  interpolation: { escapeValue: false },
})

export default initPromise.then(() => i18n)
