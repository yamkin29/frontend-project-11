import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import initView from './view.js'
import { validateUrl } from './validator.js'

const els = {
  form: document.querySelector('.rss-form'),
  input: document.getElementById('url-input'),
  button: document.getElementById('add-button') || document.querySelector('button[type="submit"]'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds .list-group') || document.getElementById('feeds'),
}

const state = {
  form: { status: 'idle', error: null, success: null },
  feeds: [],
}

initView(state, els).then((watched) => {
  const resetFormState = () => {
    watched.form.error = null
    watched.form.success = null
  }

  els.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = els.input.value.trim()

    Promise.resolve()
      .then(() => {
        resetFormState()
        watched.form.status = 'processing'
      })
      .then(() => validateUrl(url, watched.feeds))
      .then(() => {
        watched.feeds = [...watched.feeds, url]
        watched.form.success = 'ui.successAdded'
        els.form.reset()
        els.input.focus()
      })
      .catch((err) => {
        watched.form.error = err.message
      })
      .finally(() => {
        watched.form.status = 'idle'
      })
  })
})
