/* eslint-disable guard-for-in */
import i18next from 'i18next'
import commonTh from 'config/locales/th/common'

import { mappingTranslations } from 'utils/config'

const i18n = i18next.createInstance()

export const initI18n = async (clientFeatures = {}) => {
  const customTranslations = mappingTranslations(clientFeatures)
  const clientNames = Object.keys(clientFeatures)

  await new Promise((resolve, reject) => {
    i18n.init(
      {
        // Currently, bot can support only th language
        lng: 'th',
        fallbackLng: 'th',
        debug: false,
        ns: ['common', ...clientNames],
        defaultNS: 'common',
        fallbackNS: 'common',
        resources: {
          th: {
            common: commonTh,
            ...customTranslations,
          },
          // en: {},
        },
      },
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })

  return i18n
}

export const updateI18nResources = (clientFeatures = {}) => {
  Object.keys(clientFeatures).forEach((tenant) => {
    const featureValue = clientFeatures[tenant]
    const { translations } = featureValue

    /* remove to clear earlier config */
    i18n.removeResourceBundle('th', tenant, translations)
    /*  addResource for each namespace */
    i18n.addResourceBundle('th', tenant, translations, true, true)
  })
}

export default i18n
