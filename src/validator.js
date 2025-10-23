import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.alreadyExists',
  },
  string: {
    url: 'errors.url',
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
      const message = error?.errors?.[0] || 'errors.unknown'
      return Promise.reject(new Error(message))
    })
