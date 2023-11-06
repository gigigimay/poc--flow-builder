import * as fp from '@appman/mac_modules/fp'
import redis from 'node-redis'
import { Nohm as nohm } from 'nohm'
import { promisify } from 'util'
import { getLogger } from 'utils/logger'

const logger = getLogger('services/redis.js')

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
})

const hset = promisify(redisClient.hset).bind(redisClient)
const expire = promisify(redisClient.expire).bind(redisClient)
const set = promisify(redisClient.set).bind(redisClient)
const keys = promisify(redisClient.keys).bind(redisClient)
const get = promisify(redisClient.get).bind(redisClient)
const del = promisify(redisClient.del).bind(redisClient)

let isConnected = false
export const connect = () =>
  new Promise((resolve) => {
    if (isConnected || redisClient.ready) {
      resolve(nohm)
      return
    }

    redisClient.on('ready', () => {
      nohm.setClient(redisClient)
      isConnected = true
      resolve(nohm)
    })

    redisClient.on('error', (e) =>
      logger.error(
        `Redis connection error: ${e}\n${JSON.stringify(e, null, 2)}`
      ))
  })

export const disconnect = () =>
  new Promise((resolve) => {
    if (redisClient) {
      redisClient.quit(resolve)
    }
  })

export const setValue = async (name, key, value, ttl) => {
  const result = await hset(name, key, value)
  if (fp.isFinite(ttl)) {
    await expire(`${name}:${key}`, ttl)
  }
  return result
}

export const push = async (name, value, ttl) => {
  const key = `${name}:${Date.now()}`
  const result = await set(key, value)
  if (fp.isFinite(ttl)) {
    await expire(key, ttl)
  }
  return result
}

export const pop = async (name) => {
  const [key] = await keys(`${name}:*`)
  const result = await get(key)
  await del(key)
  return result
}

export default nohm
