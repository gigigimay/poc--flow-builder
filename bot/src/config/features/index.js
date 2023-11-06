import { getFeaturesRecord } from 'services/features'
import { getLogger } from 'utils/logger'

const logger = getLogger('config/features/index.js')

const RETRY_INTERVAL_TIME = Number(process.env.TENANT_CONFIG_RETRY_INTERVAL_TIME || 10) * 1000 // default 10 seconds

let clientFeatures = {} /* this object will be automatically updated by polling */

export const getFeature = (tenant) => {
  const features = clientFeatures[tenant]

  if (!features) return clientFeatures[process.env.FEATURES]

  return features
}

export const initFeatures = async () => {
  try {
    const newClientFeatures = await getFeaturesRecord()

    // update(mutate) object
    clientFeatures = newClientFeatures
    return clientFeatures
  } catch (err) {

    if (err.response?.status === 504) {
      // skip sending error to sentry if tenant-config service is starting
      logger.info(err)
    } else {
      logger.error(err)
    }

    logger.info(`init features failed, retrying in ${RETRY_INTERVAL_TIME}ms...`)

    // wait and retry again
    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_TIME))
    return initFeatures()
  }
}
