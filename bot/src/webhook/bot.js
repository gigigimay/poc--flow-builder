import express from 'express'
import * as fp from '@appman/mac_modules/fp'
import wrapAsync from 'express-async-handler'
import handler from 'handler'
import { isDevelopmentMode } from 'utils/state'
import { deleteSession } from 'session'
import { getLogger } from 'utils/logger'
import { getFeature } from 'config/features'

const logger = getLogger('webhook/bot.js')

export default () => {
  const router = express.Router()

  router.use(express.urlencoded({ extended: true }))
  router.use(express.json())

  router.get('/', (_req, res) => {
    res.send('BOT WEBHOOK')
  })

  router.post(
    '/process',
    wrapAsync(async (req, res) => {
      try {
        const message = fp.get('body.result.message', req)

        const { name: tenant } = getFeature(req.query.tenant)

        // appId was used only LMG
        const {
          chatId,
          from,
          to,
          channel,
          appId: caseId,
          content,
        } = req.body.input
        const { owner } = req.body.result
        const textMessage = fp.getOr('', 'text', content)

        logger.debug(
          `POST ('/process'):\n${JSON.stringify(req.body.input, null, 2)}`
        )

        if (owner !== 'bot' && to !== 'BOT') {
          res.status(200).json({
            message: 'this message not matched with condition',
          })
          return
        }

        if (isDevelopmentMode && textMessage.toLowerCase() === 'clear') {
          // to clear data in development env
          await deleteSession(chatId)
          logger.info(`Cleared session ${chatId} (clear)`)
          return
        }

        await handler(
          {
            ...message,
            receiverChannel: channel,
            from,
            to,
            caseId,
          },
          tenant
        )

        res.sendStatus(200)
      } catch (error) {
        logger.error(error)
        res.sendStatus(400)
      }
    })
  )
  router.post(
    '/clearSession',
    wrapAsync(async (req, res) => {
      const { chatId } = req.body.input

      try {
        /** deleting session when the chat is assigned via agent-tools (ex. promotion flow)
         * because when assigning, the bot state won't be cleared yet */
        await deleteSession(chatId)
        logger.info(`Cleared session ${chatId} (/clearSession)`)

        res.sendStatus(200)
      } catch (error) {
        logger.error(error)
        res.sendStatus(500)
      }
    })
  )
  return router
}
