import * as fp from '@appman/mac_modules/fp'

import * as commands from 'config/constants/commands'

import i18n from 'services/i18n'
import { isAnswer } from 'config/validation'
import { appSyncClient } from 'services/app-sync'
import { updateCaseMutation } from 'schema/case/mutation'
import { getFeature } from 'config/features'
import { getLogger } from './logger'

const logger = getLogger('utils/state.js')

export const isTextMessage = fp.pipe(fp.get('message.type'), fp.isEqual('text'))
export const isDevelopmentMode = process.env.DEVELOPMENT_MODE === 'true'

export const getNextCommand = ({ actions }) => ({
  cond: isDevelopmentMode ? isAnswer('next') : () => false,
  actions,
})

/** only these keys will be translated when sending messages */
const translationKeys = [
  'text',
  'altText',
  'label',
  'title',
  'subtitle',
  'bodyMessage',
  'buttonTitle',
  'buttonMessage',
]

export const isYes = fp.isEqual('yes')

export const isNo = fp.isEqual('no')

export const getModule = fp.pipe(
  fp.when(fp.isObject, fp.pipe(fp.keys, fp.first))
)

export const getCommandFromMessage = (message) =>
  fp.find(
    fp.pipe(
      fp.get('text'),
      fp.isEqual(fp.pipe(fp.split(' '), fp.first)(message))
    )
  )

export const getCommand = (message, language, tenant) => {
  const feature = getFeature(tenant)
  const commandGroup = fp.omitBy((value) => {
    const flowName = fp.pipe(fp.split(':'), fp.first)(value)
    const applicationName = fp.pipe(
      fp.split(':'),
      fp.first
    )(feature.application)
    const allowGroup = [applicationName, 'common']

    return !allowGroup.includes(flowName)
  }, commands)

  const command = fp.pipe(
    fp.values,
    fp.map((value) => ({ key: value, text: i18n.getFixedT(language)(value) })),
    getCommandFromMessage(message),
    fp.get('key')
  )(commandGroup)

  if (command) {
    const args = fp.pipe(fp.split(' '), fp.slice(1, Infinity))(message)

    return [command, ...args]
  }

  return null
}

export const getMeta = (state) => fp.values(state.meta)[0]

export const getAnswer = fp.pipe(
  fp.props(['content.text']),
  fp.find(fp.complement(fp.isNil))
)

export const updateData = (key, fn) => (context, event) => ({
  data: fp.set(
    key.replace('data.', ''),
    fp.isFunction(fn) ? fn(event.payload) : getAnswer(event.payload),
    context.data
  ),
})

export const updateSession = (key, fn) => (context, event) =>
  fp.set(key, fn(event), {})

export const getMessageTemplate = ({
  action = {},
  event = {},
  session = {},
  dependencies = {},
} = {}) =>
  fp.pipe(
    fp.concat([]),
    fp.map(
      fp.when(fp.isFunction, (fn) =>
        fn({
          action,
          event,
          session,
          dependencies,
        }))
    ),
    fp.flatten,
    fp.reject(fp.isNil),
    fp.map(
      fp.traverse(
        fp.when(
          fp.pipe(fp.nthArg(1), fp.last, fp.includes(fp.__, translationKeys)),
          (value) => {
            return i18n.getFixedT(session.language, session.tenant)(
              value,
              {
                action,
                event,
                session,
                dependencies,
                interpolation: { escapeValue: false },
              }
            )
          }
        )
      )
    ),
    fp.reject(fp.anyPass(fp.isNil, fp.isEmpty))
  )

export const clearCurrentForm = async (caseId, tenant) => {
  try {
    const input = {
      id: caseId,
      currentForm: null,
      /** NOTE: this key will be used to validate each LIFF whether the client can open the form or not */
      latestFlowStartedAt: new Date().toISOString(),
    }
    await appSyncClient.mutate({
      mutation: updateCaseMutation,
      variables: { input, tenant },
    })
    // eslint-disable-next-line no-console
    logger.info(`cleared currentForm of case:${caseId}`)
    return
  } catch (error) {
    // eslint-disable-next-line no-console
    logger.info('Error update case', error)
  }
}
