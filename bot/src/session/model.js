import redis from 'services/redis'

export const Session = redis.model('session', {
  idGenerator() {
    return this.property('id')
  },
  properties: {
    id: {
      type: 'string',
    },
  },
})
