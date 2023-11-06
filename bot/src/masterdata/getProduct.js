import * as fp from '@appman/mac_modules/fp'
import {
  servicePortal,
  createServicePortalClient,
} from 'services/service-portal'
import {
  autoInsuranceProductQuery,
  recommendedProductQuery,
} from 'schema/product/query'
import { BOT } from 'constants/channel'

const channel = BOT

export const getInterestedProducts = async (
  tenant,
  autoInsuranceProductInput
) => {
  const result = await servicePortal.query({
    query: autoInsuranceProductQuery,
    variables: {
      tenant,
      autoInsuranceProductInput: {
        ...autoInsuranceProductInput,
        channel,
      },
    },
  })

  return fp.pathOr([], ['data', 'autoInsuranceProduct', 'products'], result)
}

export const getRenewProducts = async (
  tenant,
  recommendedProductInput,
  accessToken
) => {
  const result = await createServicePortalClient({
    'x-otp-access-token': accessToken,
  }).query({
    query: recommendedProductQuery,
    variables: {
      tenant,
      recommendedProductInput: {
        ...recommendedProductInput,
        channel,
      },
    },
  })

  return fp.pathOr(
    [],
    ['data', 'recommendedProductsSearch', 'products'],
    result
  )
}
