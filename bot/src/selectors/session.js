import querystring from 'query-string'
import * as fp from '@appman/mac_modules/fp'
import { getFeature } from 'config/features'
import * as Channel from '../constants/channel'

export const getClientUrl = (session, tenant) => {
 const { lineLiffUrl, defaultClientUrl } = getFeature(tenant)
  const channel = fp.get('channel')(session)
  switch (channel) {
    case Channel.LINE:
      return lineLiffUrl
    case Channel.FACEBOOK:
    default:
      return defaultClientUrl
  }
}

export const getClientId = (session) => fp.get('id')(session)

export const getClientAppId = (session) => fp.get('caseId')(session)

/** returns a path to agent-tools form (with params and timestamp) */
export const createClientFormPath = (
  path,
  { session, params = {}, caseId = undefined, timestamp = Date.now().valueOf() }
) => {
  const newCaseId = caseId || getClientAppId(session)
  const qs = querystring.stringify({
    timestamp,
    ...params,
  })
  const fullPath = `/client/${getClientId(session)}/form/${newCaseId}${path}`
  return `${encodeURI(fullPath)}?${qs}`
}

/** returns a FULL url to agent-tools form (with params and timestamp) */
export const createClientFormUrl = (path, { session, ...options }, tenant) => {
  return `${getClientUrl(session, tenant)}${createClientFormPath(path, {
    session,
    ...options,
  })}`
}
