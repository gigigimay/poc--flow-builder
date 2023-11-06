import * as fp from '@appman/mac_modules/fp'
import { appSyncClient } from 'services/app-sync'
import { updateCaseMutation } from 'schema/case/mutation'
import { getCaseData, getCurrentForm } from 'utils/data'
import { CURRENTFORM_PATH } from 'constants/case'

import { getLogger } from 'utils/logger'

const logger = getLogger('handler/action/updateAvailableProductsToCase.js')

export default async (context) => {
  const caseId = fp.get('caseId', context)
  const tenant = fp.get('tenant', context)

  const newAvailableProducts = fp.getOr([], 'data.products', context)

  try {
    const caseData = await getCaseData(caseId, tenant)
    const currentForm = getCurrentForm(caseData)

    const prevAvailableProducts = fp.getOr(
      [],
      CURRENTFORM_PATH.AVAILABLE_PRODUCTS,
      currentForm
    )

    const newData = JSON.stringify(
      fp.assocPath(
        CURRENTFORM_PATH.AVAILABLE_PRODUCTS,
        fp.uniqBy('id', [...newAvailableProducts, ...prevAvailableProducts]),
        currentForm
      )
    )

    const input = { id: caseId, currentForm: newData }

    await appSyncClient.mutate({
      mutation: updateCaseMutation,
      variables: { input, tenant },
    })

    logger.info(`save availableProducts to case:${caseId}`)
    return
  } catch (e) {
    logger.error(
      `Error update available products to case, ${e}\n${JSON.stringify(
        e,
        null,
        2
      )}`
    )
  }
}
