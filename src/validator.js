import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'Ссылка не должна быть пустой',
    notOneOf: 'RSS уже добавлен',
  },
  string: {
    url: 'Ссылка должна быть валидным URL',
  },
})

const makeSchema = existingUrls =>
  yup.string()
    .required()
    .url()
    .notOneOf(existingUrls)

export const validateUrl = (value, existingUrls) =>
  makeSchema(existingUrls)
    .validate(value)
    .then(() => undefined)
    .catch((error) => {
      const message = error?.errors?.[0] || 'Неверное значение'
      return Promise.reject(new Error(message))
    })
