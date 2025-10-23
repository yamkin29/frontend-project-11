import onChange from 'on-change'
import i18nReady from './i18next.js'

const setFeedback = (element, codeOrText, kind) => {
  const t = window.i18n?.t?.bind(window.i18n) || (x => x)
  const text
    = typeof codeOrText === 'string' && (codeOrText.startsWith('errors.') || codeOrText.startsWith('ui.'))
      ? t(codeOrText)
      : (codeOrText || '')

  element.textContent = text
  element.classList.remove('text-success', 'text-danger')
  element.classList.add(kind === 'success' ? 'text-success' : 'text-danger')
}

const renderFeeds = (feeds, boxEl) => {
  boxEl.innerHTML = ''
  feeds.forEach((feed) => {
    const li = document.createElement('li')
    li.className = 'list-group-item'

    const h3 = document.createElement('h3')
    h3.className = 'h6 m-0'
    h3.textContent = feed.title

    const p = document.createElement('p')
    p.className = 'm-0 small text-black-50'
    p.textContent = feed.description

    li.append(h3, p)
    boxEl.appendChild(li)
  })
}

const renderPosts = (posts, boxEl) => {
  boxEl.innerHTML = ''
  posts.forEach((post) => {
    const li = document.createElement('li')
    li.className = 'list-group-item d-flex justify-content-between align-items-start'

    const a = document.createElement('a')
    a.setAttribute('href', post.link)
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener noreferrer')
    a.textContent = post.title

    li.appendChild(a)
    boxEl.appendChild(li)
  })
}

export default function initView(state, elements) {
  return i18nReady.then((i18nextInstance) => {
    window.i18n = i18nextInstance

    renderFeeds(state.feeds, elements.feeds)
    renderPosts(state.posts, elements.posts)

    const watched = onChange(state, (path, value) => {
      switch (path) {
        case 'form.status': {
          elements.button.disabled = value === 'processing'
          break
        }
        case 'form.error': {
          if (value) {
            elements.input.classList.add('is-invalid')
            setFeedback(elements.feedback, value, 'error')
          }
          else {
            elements.input.classList.remove('is-invalid')
            setFeedback(elements.feedback, '', 'success')
          }
          break
        }
        case 'form.success': {
          if (value) setFeedback(elements.feedback, value, 'success')
          break
        }
        case 'feeds': {
          renderFeeds(value, elements.feeds)
          break
        }
        case 'posts': {
          renderPosts(value, elements.posts)
          break
        }
        default:
          break
      }
    })

    return watched
  })
}
