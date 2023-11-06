import { isAnswer } from './index'

jest.mock('services/i18n', () => ({
  getFixedT: () => () => 'Car',
}))

describe('validation', () => {
  const language = 'th'
  const tenant = 'aycal'

  describe('isAnswer', () => {
    it('should return true when the text event matches with the expected answer', () => {
      const result = isAnswer('vehicleType.car')('Car', { language, tenant })

      expect(result).toEqual(true)
    })

    it('should return false when the text event does not match with the expected answer', () => {
      const result = isAnswer('vehicleType.car')('Motorcycle', {
        language,
        tenant,
      })

      expect(result).toEqual(false)
    })
  })
})
