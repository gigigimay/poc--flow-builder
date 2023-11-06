import * as fp from '@appman/mac_modules/fp'
import { appSyncClient } from 'services/app-sync'
import { updateCaseMutation } from 'schema/case/mutation'
import { getCaseData, getCurrentForm } from 'utils/data'
import { getLogger } from 'utils/logger'

const logger = getLogger('handler/action/updateSelectedTierToCase.js')

export default async (context) => {
  const caseId = fp.get('caseId', context)
  const tenant = fp.get('tenant', context)
  const selectedTier = fp.get('data.selectedTier', context)
  try {
    const caseData = await getCaseData(caseId, tenant)
    const currentForm = getCurrentForm(caseData)
    const fieldId = 'carInfo.insuranceTier'

    // selectedTier would be like 'ประกันรถชั้น 1'
    const tierKey = selectedTier.split(' ').pop()
    const newData = fp.pipe(
      fp.assocPath(`${fieldId}.value`, {
        key: tierKey,
        translations: {
          en: { label: tierKey },
          th: { label: tierKey },
        },
      }),
      JSON.stringify
    )(currentForm)

    const input = { id: caseId, currentForm: newData }

    await appSyncClient.mutate({
      mutation: updateCaseMutation,
      variables: { input, tenant },
    })
    return
  } catch (e) {
    logger.error(
      `Error updating selected tier: ${e}\n${JSON.stringify(e, null, 2)}`
    )
  }
}
