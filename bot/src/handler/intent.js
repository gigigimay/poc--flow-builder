import * as fp from '@appman/mac_modules/fp'

import { getCommand } from 'utils/state'

import { COMMAND, ANSWER, FALLBACK } from 'constants/state'
import state from './state'

const sendCommand = async (
  { session, event, actions, command: [command, ...args] },
  tenant
) => {
  return state(
    COMMAND,
    { payload: command, args },
    { session, event, actions },
    tenant
  )
}

const sendAnswer = async ({ session, event, actions }, tenant) => {
  return state(
    ANSWER,
    { payload: event },
    { session, event, actions },
    tenant
  )
}

const sendFallbackFlow = ({ session, event, actions }, tenant) => {
  return state(
    FALLBACK,
    { payload: event },
    { session, event, actions },
    tenant
  )
}

export const process = async ({ session, event, actions }, tenant) => {
  const text = fp.getOr('', 'content.text', event)
  const lng = fp.getOr('th', 'langauge', session)

  const command = getCommand(text, lng, tenant)

  if (command) {
    return sendCommand({ session, event, actions, command }, tenant)
  }

  /** if the client starts the conversation while there is no pending session,
   *  redirect them to fallback flow
   */
  if (!session.module) {
    return sendFallbackFlow({ session, event, actions }, tenant)
  }

  return sendAnswer({ session, event, actions }, tenant)
}
