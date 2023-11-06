import i18n from 'services/i18n'

export const isAnswer = (key) => (text, { language, tenant } = {}) => {
  return i18n.getFixedT(language)(`${tenant}:${key}`) === text
}

export const isAnswerSplitted = (key) => (text, { language, tenant } = {}) => {
  return (
    i18n.getFixedT(language)(`${tenant}:${key}`) ===
    (text?.split ? text.split(' ')[0] : text)
  )
}
