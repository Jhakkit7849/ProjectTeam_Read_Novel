export const stripHtml = (html='') => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
export const countWords = (html='') => stripHtml(html).split(' ').filter(Boolean).length