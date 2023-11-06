import moment from 'moment'
import querystring from 'query-string'
import * as fp from '@appman/mac_modules/fp'
import { formatCurrency as formatCurrencyUtils } from '@appman/mac_modules/utilities'
import { getCaseQuery } from 'schema/case/query'
import { appSyncClient } from 'services/app-sync'
import { servicePortal } from 'services/service-portal'
import { getVehicleBrandQuery } from 'schema/brand/query'
import { BulletType } from 'config/constants'

export const getS3ImageUrl = (imagePath, feature) => {
  const qs = querystring.stringify({
    public_asset_version: feature?.publicAssetVersion,
  })
  return `${process.env.PUBLIC_IMAGE_ENDPOINT}/${imagePath}?${qs}`
}


export const parseJSON = (json) => {
  try {
    return JSON.parse(json)
  } catch (err) {
    return json
  }
}

export const localisedFormat = (date, locale, format = 'DD/MM/YYYY') =>
  locale === 'th'
    ? date.format(format.replace('YYYY', (date.year() + 543).toString()))
    : date.format(format)

export const calculateTimeDiff = (event) =>
  moment(fp.getOr('', 'data.expireDate', event), 'YYYYMMDD').diff(
    moment()
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0),
    'days'
  )

export const checkLifeTimeDiff = (after, before) => (event) =>
  (after === undefined || calculateTimeDiff(event) <= after) &&
  (before === undefined || calculateTimeDiff(event) > before)

export const getCaseData = async (id, tenant) => {
  const result = await appSyncClient.query({
    query: getCaseQuery,
    variables: { id, tenant },
  })

  return fp.getOr({}, 'data.getCase')(result)
}

export const getBrandsData = async (
  tenant,
  vehicleType,
  { brandName, modelName, modelYear, subModel }
) => {
  const result = await servicePortal.query({
    query: getVehicleBrandQuery,
    variables: {
      tenant,
      vehicleType,
      filter: { brandName, modelName, modelYear, subModel },
    },
  })

  return fp.getOr({}, 'data.brand')(result)
}

export const getCurrentForm = fp.pipe(fp.getOr('{}', 'currentForm'), parseJSON)

export const formatCurrency = (feature) => (value) => {
  const options = fp.get('setting.format.currency', feature)
  return formatCurrencyUtils(value, options)
}

export const formatInteger = (feature) => (value) => {
  const options = fp.get('setting.format.integer', feature)
  return formatCurrencyUtils(value, options)
}

export const isOutOfWorkingHours = (feature) => (timestamp) =>
  moment(timestamp).weekday() > 5 ||
  moment(timestamp).weekday() < 1 ||
  moment(timestamp).hours() >= (feature.workingHour?.end || 18) ||
  moment(timestamp).hours() < (feature.workingHour?.start || 9)

export const getTextWithBullet = ({ bulletType, text }) =>
  `${BulletType[bulletType]} ${text}`
