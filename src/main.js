import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import axios from 'axios'
import initView from './view.js'
import { validateUrl } from './validator.js'
import { parseRss } from './parser.js'
import { uid } from './id.js'

const POLL_INTERVAL = 5000

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

const fetchAndMergeFeed = (feed, watched) =>
  axios.get(makeProxyUrl(feed.url))
    .then(({ data }) => {
      const { posts } = parseRss(data.contents)

      const known = new Set(
        watched.posts.filter(p => p.feedId === feed.id).map(p => p.link),
      )

      const newOnes = posts
        .filter(p => !known.has(p.link))
        .map(p => ({
          id: uid('post'),
          feedId: feed.id,
          title: p.title,
          link: p.link,
          description: p.description,
        }))

      if (newOnes.length > 0) {
        watched.posts = [...newOnes, ...watched.posts]
      }
    })
    .catch((error) => {
      console.error(error)
    })

const startPolling = (watched) => {
  const runCycle = () =>
    Promise.all(watched.feeds.map(feed => fetchAndMergeFeed(feed, watched)))
      .finally(() => {
        setTimeout(runCycle, POLL_INTERVAL)
      })

  runCycle()
}

initView(state, els).then((watched) => {
  startPolling(watched)

  const resetFormState = () => {
    watched.form.error = null
    watched.form.success = null
  }

  els.form.addEventListener('submit', (e) => {
    e.preventDefault()
    const url = els.input.value.trim()
    const existingUrls = watched.feeds.map(f => f.url)

    Promise.resolve()
      .then(() => {
        resetFormState()
        watched.form.status = 'processing'
      })
      .then(() => validateUrl(url, existingUrls))
      .then(() => axios.get(makeProxyUrl(url)))
      .then(({ data }) => {
        const { title, description, posts } = parseRss(data.contents)

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
