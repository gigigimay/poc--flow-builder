import * as fp from '@appman/mac_modules/fp'
import { loadSession, updateSession } from 'session'
import { appSyncClient } from 'services/app-sync'
import { updateMessageMutation } from 'schema/chat/mutation'
import { getLogger } from 'utils/logger'
import { process as processMsg } from './intent'
import actions from './action'
import { USAGE_TYPE } from '../constants/report'

const logger = getLogger('handler/index.js')

const sendMessages = async (
  { messages, roomId, toChannel, caseId, appId },
  tenant
) => {
  // TODO - refactor
  // eslint-disable-next-line no-restricted-syntax
  for (const message of messages) {
    // eslint-disable-next-line no-continue
    if (fp.isNil(message) || fp.isEmpty(message)) continue

    const { type, command } = message

    const input = {
      chatId: roomId,
      caseId,
      appId,
      from: 'BOT',
      to: toChannel,
      usageType: USAGE_TYPE.AUTO,
      type,
      createdDatetime: new Date().toISOString(),
    }

    if (!fp.isNil(command)) {
      // send command message that will be resolved into a message in messaging (mac-mantis) service
      input.command = JSON.stringify(command)
    } else {
      // send normal message with content
      const content = type === 'text' ? message[message.type] : message
      input.content = JSON.stringify({ [type]: content })
    }

    logger.debug(`Sending Bot message:\n${JSON.stringify(message, null, 2)}`)
    // eslint-disable-next-line no-await-in-loop
    await appSyncClient.mutate({
      mutation: updateMessageMutation,
      variables: { input, tenant },
    })
  }
}

export default async (event, tenant) => {
  const { channel, roomId } = event.source
  // roomId == chatId
  const { receiverChannel, from, to, caseId } = event
  // receiverChannel was used only LMG

  const session = await loadSession(roomId)
  const toChannel =
    from === 'AGENT_TOOLS' && to === 'BOT' ? receiverChannel : channel
  // from AGENT_TOOLS was used in LMG
  session.channel = toChannel
  session.tenant = tenant
  if (caseId) {
    session.caseId = caseId
  }

  // NOTE: in process function it is possible that the clearSession route get called (via autoAssign pipeline)
  const { messages, session: updatedSession } = await processMsg(
    {
      event,
      session,
      actions,
    },
    tenant
  )

  await updateSession(roomId, { ...updatedSession, tenant })

  if (messages) {
    /** calling this async function synchronously to prevent message events from appearing in wrong order
     * (The message from bot webhook should come first, before messages that bot sends.) */
    sendMessages(
      {
        messages,
        roomId,
        toChannel,
        caseId: updatedSession.caseId,
        appId: updatedSession.appId,
      },
      tenant
    )
  }
}
