import 'isomorphic-fetch'

import express from 'express'
import cors from 'cors'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

import { initI18n, updateI18nResources } from 'services/i18n'
import { connect } from 'services/redis'

import bot from 'webhook/bot'
import { getLogger } from 'utils/logger'
import sentryConfig from 'config/sentry'
import { initFeatures } from 'config/features'

const REFRESH_INTERVAL_TIME =
  Number(process.env.TENANT_CONFIG_REFRESH_INTERVAL_TIME || 1800) * 1000 // default is 30 mins

const app = express()

Sentry.init({
  ...sentryConfig,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
})

const logger = getLogger('index.js')

const port = process.env.PORT || 8083

app.use(cors())

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.use('/webhook/bot', bot())

app.use(Sentry.Handlers.errorHandler())

const refreshFeatures = async () => {
  logger.debug('refreshing features...')

  const clientFeatures = await initFeatures()
  updateI18nResources(clientFeatures)

  logger.debug('features have been updated')
}

connect()
  .then(async () => {
    logger.debug('initializing features...')
    const clientFeatures = await initFeatures()
    await initI18n(clientFeatures)
    logger.debug('features initialized')

    /* polling to get the latest configuration */
    setInterval(refreshFeatures, REFRESH_INTERVAL_TIME)
  })
  .then(() =>
    app.listen(port, async (err) => {
      if (err) {
        logger.error(err)
        throw err
      } else {
        logger.info(`Server started on port ${port}`)
        logger.debug(`Server running in DEVELOPMENT_MODE`)
      }
    }))
  .catch(logger.error)
