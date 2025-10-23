import onChange from 'on-change'
import i18nReady from './i18next.js'

const setFeedback = (element, codeOrText, kind) => {
  const t = window.i18n.t.bind(window.i18n)
  const text
    = typeof codeOrText === 'string' && (codeOrText.startsWith('errors.') || codeOrText.startsWith('ui.'))
      ? t(codeOrText)
      : (codeOrText || '')

  element.textContent = text
  element.classList.remove('text-success', 'text-danger')
  element.classList.add(kind === 'success' ? 'text-success' : 'text-danger')
}

const renderFeeds = (feeds, listEl) => {
  listEl.innerHTML = ''
  feeds.forEach((url) => {
    const li = document.createElement('li')
    li.className = 'list-group-item'
    li.textContent = url
    listEl.appendChild(li)
  })
}

export default function initView(state, elements) {
  return i18nReady.then((i18nextInstance) => {
    window.i18n = i18nextInstance

    renderFeeds(state.feeds, elements.feeds)

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
        default:
          break
      }
    })

    return watched
  })
}
