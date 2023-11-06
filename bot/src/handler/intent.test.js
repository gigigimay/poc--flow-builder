import 'isomorphic-fetch'

import { process } from './intent'

global.WebSocket = require('ws')

describe('process intent', () => {
  const tenant = 'aycal'

  let session = {
    id: 'Ueef4559a6fb779a442e0df16a0a75860',
    channel: 'LINE',
    data: {},
    ownerId: '',
    customerId: '',
    owner: {},
    application: '',
    module: '',
    intent: {},
    status: '',
    language: 'th',
    createdAt: '1584780734179',
    updatedAt: '1584781650989',
    tenant,
  }

  describe('test covid flow', () => {
    // mock correct agent_id set to adminit
    const texts = [
      'สนใจประกัน',
      'ตอบมั่วๆ',
      'ก็ยังตอบมั่วๆอยู่',
      'มี',
      'เลือกตัวแทนรหัส 1234',
      'สนใจประกัน',
    ]
    let messages

    texts.map(async (text) => {
      it(text, async () => {
        const event = {
          source: {
            roomId: 'Ueef4559a6fb779a442e0df16a0a75860',
            channel: 'LINE',
          },
          type: 'text',
          createdDatetime: '2020-03-21T09:12:11.208Z',
          content: { text },
        }

        const { messages: newMessage, session: updatedSession } = await process(
          {
            session,
            event,
          },
          tenant
        )
        // eslint-disable-next-line no-unused-vars
        messages = newMessage
        session = updatedSession
      })
    })
  })
})
