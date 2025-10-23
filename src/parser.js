export const parseRss = (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')
  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    const err = new Error('errors.parse')
    err.isParseError = true
    throw err
  }

  const getText = (sel, root = doc) => (root.querySelector(sel)?.textContent || '').trim()

  const channel = doc.querySelector('channel')
  const title = getText('title', channel)
  const description = getText('description', channel)

  const items = Array.from(doc.querySelectorAll('channel > item'))
  const posts = items.map(item => ({
    title: getText('title', item),
    link: getText('link', item),
    description: getText('description', item),
  }))

  return { title, description, posts }
}
