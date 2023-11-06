import * as fp from '@appman/mac_modules/fp'
import { appSyncClient } from 'services/app-sync'
import { autoAssignChat } from 'schema/chat/mutation'
import { getLogger } from 'utils/logger'

const logger = getLogger('handler/action/assignAgent.js')

export default async ({
  session,
  groupRegex,
  isDirectAssignToNone = false,
  assignToFormerOwner = false,
}) => {
  const chatId = fp.get('id', session)
  const caseId = fp.get('caseId', session)
  const tenant = fp.get('tenant', session)

  // NOTE: for renew-flow, when select product -> assign to the former agent who used to be the owner
  const owner = fp.get('data.owner', session)

  try {
    const data = await appSyncClient.mutate({
      mutation: autoAssignChat,
      variables: {
        input: {
          chatId,
          groupRegex,
          caseId,
          agentId: assignToFormerOwner ? owner : undefined,
          isDirectAssignToNone,
        },
        tenant,
      },
    })

    const ownerId = fp.getOr(null, 'data.autoAssignChat.owner', data)
    logger.info(`Assigned case to agent ${ownerId}`)

    return { isSuccess: true }
  } catch (e) {
    logger.error(`Error assigning agent: ${e}\n${JSON.stringify(e, null, 2)}`)
    return { isSuccess: false }
  }
}
