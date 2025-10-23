import onChange from 'on-change'
import { Modal } from 'bootstrap'
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

const renderPosts = (posts, readPostsIds, boxEl) => {
  boxEl.innerHTML = ''
  posts.forEach((post) => {
    const li = document.createElement('li')
    li.className = 'list-group-item d-flex justify-content-between align-items-start'

    const a = document.createElement('a')
    a.setAttribute('href', post.link)
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener noreferrer')
    a.dataset.id = post.id
    a.className = readPostsIds.includes(post.id) ? 'fw-normal' : 'fw-bold'
    a.textContent = post.title

    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'btn btn-outline-primary btn-sm ms-3'
    btn.dataset.role = 'preview'
    btn.dataset.id = post.id
    btn.textContent = 'Просмотр'

    li.append(a, btn)
    boxEl.appendChild(li)
  })
}

export default function initView(state, elements) {
  return i18nReady.then((i18nextInstance) => {
    window.i18n = i18nextInstance

    renderFeeds(state.feeds, elements.feeds)
    renderPosts(state.posts, state.readPosts, elements.posts)

    const bsModal = new Modal(elements.modal.element)

    const openModalFor = (postId, currentState) => {
      const post = currentState.posts.find(p => p.id === postId)
      if (!post) return

      elements.modal.title.textContent = post.title
      elements.modal.body.textContent = post.description || ''
      elements.modal.link.setAttribute('href', post.link)

      bsModal.show()
    }

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
          renderPosts(value, state.readPosts, elements.posts)
          break
        }
        case 'readPosts': {
          renderPosts(state.posts, value, elements.posts)
          break
        }
        case 'ui.modalPostId': {
          if (value) openModalFor(value, state)
          break
        }
        default:
          break
      }
    })

    elements.posts.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-role="preview"]')
      const link = e.target.closest('a[data-id]')

      const markRead = (id) => {
        if (!watched.readPosts.includes(id)) {
          watched.readPosts = [...watched.readPosts, id]
        }
      }

      if (btn) {
        const id = btn.dataset.id
        markRead(id)
        if (!watched.ui) watched.ui = { modalPostId: null }
        watched.ui.modalPostId = id
        return
      }

      if (link) {
        const id = link.dataset.id
        markRead(id)
      }
    })

    return watched
  })
}
