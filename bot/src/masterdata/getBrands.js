import * as fp from '@appman/mac_modules/fp'
import { CURRENTFORM_PATH } from 'constants/case'
import { getBrandsData } from 'utils/data'

export const transformData = (id, value) => {
  return {
    key: value,
    code: id,
    translations: {
      en: { label: value },
      th: { label: value },
    },
  }
}

export const getAvailableInsuranceTier = (currentForm) =>
  fp.getOr([], CURRENTFORM_PATH.CARINFO_AVAILABLE_TIERS, currentForm)

export default async (tenant, vehicleType) => {
  const result = await getBrandsData(tenant, vehicleType, {})
  return result.map(({ id, name }) => transformData(id, name))
}
