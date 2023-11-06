import * as fp from '@appman/mac_modules/fp'

import { LINE } from 'constants/channel'
import { TEXT } from 'constants/template'

const templates = {
    [TEXT]: require('./text'),
}

export const getTemplate = (type) => (props) => () => {
  const template = fp.get(type, templates)

  if (!template) {
    throw new Error(`Can't find ${type} template`)
  }

  if (fp.isFunction(template)) {
    return template(props)
  }

  return template
}

export const commandMessage = (command) => ({ session }) => {
  // TODO: refactor messaging so that command message should be same message type
  const messageType = session.channel === LINE ? 'flex' : 'template'
  return {
    type: messageType,
    command,
  }
}

export const text = getTemplate(TEXT)
