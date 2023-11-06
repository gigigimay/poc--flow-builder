import { isRenewFlow } from './currentForm'

describe('isRenewFlow', () => {
  it('should return false when otpVerified is undefined', () => {
    const currentForm = {}
    expect(isRenewFlow(currentForm)).toEqual(false)
  })
  it('should return false when otpVerified value is false', () => {
    const currentForm = {
      otpVerified: {
        dirty: true,
        value: false,
      },
    }
    expect(isRenewFlow(currentForm)).toEqual(false)
  })
  it('should return true when otpVerified value is true', () => {
    const currentForm = {
      otpVerified: {
        dirty: true,
        value: true,
      },
    }
    expect(isRenewFlow(currentForm)).toEqual(true)
  })
})
