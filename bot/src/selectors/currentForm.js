import * as fp from '@appman/mac_modules/fp'

export const isRenewFlow = (currentForm) =>
  fp.getOr(false, 'otpVerified.value', currentForm) === true
