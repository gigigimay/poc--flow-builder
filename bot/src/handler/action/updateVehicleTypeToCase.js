import * as fp from '@appman/mac_modules/fp'
import { appSyncClient } from 'services/app-sync'
import { updateCaseMutation } from 'schema/case/mutation'
import { getCaseData, getCurrentForm } from 'utils/data'
import { getLogger } from 'utils/logger'
import getVehicleType from 'masterdata/getVehicleType'
import { CURRENTFORM_PATH } from 'constants/case'

const logger = getLogger('handler/action/updateVehicleTypeToCase.js')

export default async (context) => {
  const caseId = fp.get('caseId', context)
  const tenant = fp.get('tenant', context)
  const clientVehicleTypeKey = fp.get('data.vehicleType', context)
  try {
    const caseData = await getCaseData(caseId, tenant)
    const currentForm = getCurrentForm(caseData)

    const vehicleTypeOption = getVehicleType().find(fp.propEq('key', clientVehicleTypeKey))
    const newCurrentForm = fp.assocPath(
      CURRENTFORM_PATH.CARINFO_VEHICLE_TYPE,
      vehicleTypeOption
    )(currentForm)

    await appSyncClient.mutate({
      mutation: updateCaseMutation,
      variables: {
        input: {
          id: caseId,
          currentForm: JSON.stringify(newCurrentForm),
        },
        tenant,
      },
    })

  } catch (e) {
    logger.error(
      `Error updating vehicle type: ${e}\n${JSON.stringify(e, null, 2)}`
    )
  }
}
