import onChange from 'on-change'

const setFeedback = (element, message, kind) => {
  element.textContent = message
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
  renderFeeds(state.feeds, elements.feeds)

  return onChange(state, (path, value) => {
    switch (path) {
      case 'form.status': {
        const disabled = value === 'processing'
        elements.button.disabled = disabled
        if (state.form.error) {
          elements.input.classList.add('is-invalid')
        }
        else {
          elements.input.classList.remove('is-invalid')
        }
        break
      }

      case 'form.error': {
        if (value) {
          setFeedback(elements.feedback, value, 'error')
          elements.input.classList.add('is-invalid')
        }
        else {
          elements.input.classList.remove('is-invalid')
          setFeedback(elements.feedback, '', 'success')
        }
        break
      }

      case 'form.success': {
        if (value) {
          setFeedback(elements.feedback, value, 'success')
        }
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
}
