import axios from 'axios'
import * as fp from '@appman/mac_modules/fp'
import { filterAOCClient } from 'utils/config'

const instance = axios.create({
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-cache',
    authorization: `Bearer ${process.env.TENANT_CONFIG_TOKEN}`,
  },
  baseURL: process.env.TENANT_CONFIG_URL,
})

export const fetchFeaturesConfig = async () => {
  const response = await instance.get('/items/client', {
    params: {
      fields: 'id,name,aoc_config,aoc_features',
    },
  })
  const clientsConfig = fp.getOr([], 'data.data', response)
  return filterAOCClient(clientsConfig)
}

export const formatConfigsToRecord = (clientsConfig = [], mappingFn) => {
  const record = {}
  clientsConfig.forEach((config) => {
    const clientId = fp.get('name', config)
    record[clientId] = mappingFn(config)
  })
  return record
}

/* ------------------------- feature---------------------- */
export const mappingFeatureFields = (config) => {
  return {
    name: fp.get('name', config),
    application: fp.get('aoc_config.bot_application_name', config),
    teams: fp.get('aoc_config.agent_groups_regex', config),
    workingHour: fp.get('aoc_config.working_hour', config),
    setting: {
      format: fp.get('aoc_config.number_format_config', config),
    },
    translations: fp.get('aoc_config.bot_custom_translations', config),
    lineLiffUrl: fp.get('aoc_config.line_liff_url', config),
    defaultClientUrl: fp.get('aoc_config.default_client_url', config),
    publicAssetVersion: fp.get('aoc_config.public_asset_version', config),
  }
}

export const getFeaturesRecord = async () => {
  const clientsConfig = await fetchFeaturesConfig()
  return formatConfigsToRecord(clientsConfig, mappingFeatureFields)
}
/* ------------------------------------------------------- */
