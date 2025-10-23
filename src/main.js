import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import axios from 'axios'
import initView from './view.js'
import { validateUrl } from './validator.js'
import { parseRss } from './parser.js'
import { uid } from './id.js'

const els = {
  form: document.querySelector('.rss-form'),
  input: document.getElementById('url-input'),
  button: document.getElementById('add-button') || document.querySelector('button[type="submit"]'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds .list-group'),
  posts: document.querySelector('.posts .list-group'),
}

const makeProxyUrl = url =>
  `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

const state = {
  form: { status: 'idle', error: null, success: null },
  feeds: [],
  posts: [],
}

const getExistingUrls = st => st.feeds.map(f => f.url)

initView(state, els).then((watched) => {
  const resetFormState = () => {
    watched.form.error = null
    watched.form.success = null
  }

  els.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = els.input.value.trim()
    const urls = getExistingUrls(watched)

    Promise.resolve()
      .then(() => {
        resetFormState()
        watched.form.status = 'processing'
      })
      .then(() => validateUrl(url, urls))
      .then(() => axios.get(makeProxyUrl(url)))
      .then(({ data }) => {
        const xml = data.contents
        const { title, description, posts } = parseRss(xml)

        const feedId = uid('feed')
        const feed = { id: feedId, url, title, description }
        const preparedPosts = posts.map(p => ({
          id: uid('post'),
          feedId,
          title: p.title,
          link: p.link,
          description: p.description,
        }))

        watched.feeds = [feed, ...watched.feeds]
        watched.posts = [...preparedPosts, ...watched.posts]

        watched.form.success = 'ui.successAdded'
        els.form.reset()
        els.input.focus()
      })
      .catch((err) => {
        if (err.isAxiosError) {
          watched.form.error = 'errors.network'
        }
        else if (err?.message === 'errors.parse' || err?.isParseError) {
          watched.form.error = 'errors.parse'
        }
        else if (typeof err?.message === 'string' && err.message.startsWith('errors.')) {
          watched.form.error = err.message
        }
        else {
          watched.form.error = 'errors.unknown'
        }
      })
      .finally(() => {
        watched.form.status = 'idle'
      })
  })
})
