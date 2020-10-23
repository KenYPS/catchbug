
export const getInitLang = (lang) => {
  const hashUrl = window.location.hash.split('?')
  const joinQuery = hashUrl.slice(1, hashUrl.length).join('')
  const query = new URLSearchParams(joinQuery)
  const queryLang = query.get('language')
  const userLang = navigator.language || navigator.userLanguage
  if (userLang !== 'zh-CN' && userLang !== 'en' && userLang !== 'en-US') lang = 'en'
  if (userLang === 'zh-TW') { lang = 'cn' }
  return queryLang || lang
}

export const transToLowercaseAndTrim = (str) => str.toLowerCase().trim()

export const abstractAccount = email => email.replace(/@.*$/, '')
