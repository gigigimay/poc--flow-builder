import * as fp from '@appman/mac_modules/fp'
import NodeCache from 'node-cache'

import redis from 'services/redis'
import { CACHE_TTL_SECOND, CACHE_CHECK_TTL_SECOND } from 'constants/cache'
import { Session } from './model'

export const cache = new NodeCache({
  stdTTL: CACHE_TTL_SECOND,
  checkperiod: CACHE_CHECK_TTL_SECOND,
  useClones: false,
})

export const getSession = (sid) => cache.get(sid)

export const updateSession = async (sid, props) => {
  const result = await getSession(sid)
  if (result) {
    result.property({
      ...props,
      updatedAt: Date.now(),
    })
    await result.save({ silent: true })

    return result.allProperties()
  }
  return result
}

export const deleteSession = async (sid) => {
  try {
    const result = await redis.factory('session', sid)
    if (result) {
      await result.remove({
        silent: true,
      })
    }
    if (cache.has(sid)) {
      cache.del(sid)
    }
  } catch (err) { }
}

export const loadSession = async (sid) => {
  let result
  try {
    result = await redis.factory('session', sid)
  } catch (err) {
    result = await redis.factory('session')
    result.property({
      id: sid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    await result.save({ silent: true })
  }

  if (result) {
    cache.set(sid, result)
  }

  return result.allProperties()
}

export const findSession = async (props) => {
  try {
    const result = await Session.loadMany(await Session.find(props))

    return fp.map((session) => session.allProperties(), result)
  } catch (err) {
    return null
  }
}

export const copySession = async (srcId, destId, selector = fp.identity) => {
  await loadSession(srcId)

  const session = getSession(srcId).allProperties()

  const result = await updateSession(destId, fp.omit(['id'], selector(session)))

  return result
}

export default {
  hasSession: (sid) => !fp.isNil(getSession(sid)),
  getSession: (sid) => getSession(sid).allProperties(),
  getChannel: (sid) => getSession(sid).property('channel'),
  getIntent: (sid) => getSession(sid).property('intent'),
  getData: (sid) => getSession(sid).property('data'),
  getStatus: (sid) => getSession(sid).property('status'),
  getApplication: (sid) => getSession(sid).property('application'),
  getModule: (sid) => getSession(sid).property('module'),
  getOwner: (sid) => getSession(sid).property('owner'),
  getOwnerId: (sid) => getSession(sid).property('ownerId'),
  getCustomerId: (sid) => getSession(sid).property('customerId'),
  getLanguage: (sid) => getSession(sid).property('language'),
  getUpdatedAt: (sid) => getSession(sid).property('updatedAt'),
  getCreatedAt: (sid) => getSession(sid).property('createdAt'),
  getReplyToken: (sid) => getSession(sid).property('replyToken'),
  isCustomer: (sid, userId) => {
    if (fp.isNil(userId)) return true

    const customerId = getSession(sid).property('customerId')

    return customerId === userId
  },
  isOwner: (sid, userId) => {
    if (fp.isNil(userId)) return true

    const ownerId = getSession(sid).property('ownerId')

    return ownerId === userId
  },
  getTenant: (sid) => getSession(sid).property('tenant'),
}
