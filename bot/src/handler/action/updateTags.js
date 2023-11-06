import * as fp from '@appman/mac_modules/fp'
import { appSyncClient } from 'services/app-sync'
import { getChatQuery } from 'schema/chat/query'
import { updateChatMutation } from 'schema/chat/mutation'
import { getLogger } from 'utils/logger'

const logger = getLogger('handler/action/updateTags.js')

export default (tags = []) => async (ctx) => {
  const chatId = fp.get('id', ctx)
  const tenant = fp.get('tenant', ctx)

  try {
    const getChatResponse = await appSyncClient.query({
      query: getChatQuery,
      variables: { chatId, tenant },
    })

    const previousTags = fp.getOr([], 'data.getChat.tags', getChatResponse)
    const newTags = fp.uniq([...previousTags, ...tags])

    const data = await appSyncClient.mutate({
      mutation: updateChatMutation,
      variables: {
        input: {
          chatId,
          tags: newTags,
        },
        tenant,
      },
    })

    const updatedTags = fp.getOr([], 'data.updateChat.tags', data)
    logger.info(`Updated tags of ${chatId} to be ${updatedTags}`)

    return
  } catch (e) {
    logger.error(`Error updateTags : ${e}\n${JSON.stringify(e, null, 2)}`)
  }
}
