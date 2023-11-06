import * as fp from '@appman/mac_modules/fp'

export const mappingTranslations = (clientFeatures = {}) => {
  const translationResources = {}

  Object.keys(clientFeatures).forEach((tenant) => {
    const featureValue = clientFeatures[tenant]
    const { translations } = featureValue
    translationResources[tenant] = translations
  })

  return translationResources
}

export const filterAOCClient = (clientsConfig = []) => {
  return clientsConfig.filter(
    (clientConfig) =>
      fp.has('aoc_config', clientConfig) && fp.has('aoc_features', clientConfig)
  )
}
