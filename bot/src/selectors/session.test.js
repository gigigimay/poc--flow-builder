import { createClientFormUrl, createClientFormPath } from './session'

describe('createClientFormPath', () => {
  const session = { id: 'U421a', caseId: 1, channel: 'LINE' }
  it('should return agent-tools path', () => {
    const result = createClientFormPath('/carInfo/xxx', { session })
    const expected = '/client/U421a/form/1/carInfo/xxx?timestamp=1584261063000'
    expect(result).toBe(expected)
  })
})

jest.mock('config/features', () => ({
  getFeature: (tenant) => {
    if(tenant){
      return {
        lineLiffUrl: 'https://liff.line.me/11111-AAbbCC', 
        defaultClientUrl: 'https://test.com/agent-tools',
      }
    }
    return undefined
  },
}))

describe('createClientFormUrl', () => {
  describe('FACEBOOK / default channel', () => {
    const session = { id: 'U421a', caseId: 1, channel: 'FACEBOOK' }

    it('should return full agent-tools url (FACEBOOK / default channel)', () => {
      const result = createClientFormUrl('/carInfo/xxx', { session }, 'mac-portal')
      const expected =
        'https://test.com/agent-tools/client/U421a/form/1/carInfo/xxx?timestamp=1584261063000'
      expect(result).toBe(expected)
    })
  })

  describe('LINE channel', () => {
    const session = { id: 'U421a', caseId: 1, channel: 'LINE' }

    it('should return full agent-tools url', () => {
      const result = createClientFormUrl('/carInfo/xxx', { session }, 'mac-portal')
      const expected =
        'https://liff.line.me/11111-AAbbCC/client/U421a/form/1/carInfo/xxx?timestamp=1584261063000'
      expect(result).toBe(expected)
    })

    it('should return full agent-tools url with params', () => {
      const result = createClientFormUrl('/carInfo/xxx', {
        session,
        params: { brand: 'eiei' },
      }, 'mac-portal')
      const expected =
        'https://liff.line.me/11111-AAbbCC/client/U421a/form/1/carInfo/xxx?brand=eiei&timestamp=1584261063000'
      expect(result).toBe(expected)
    })

    it('should return full agent-tools url with params (encoded)', () => {
      const result = createClientFormUrl('/carInfo/xxx', {
        session,
        params: { brand: 'อิอิ' },
      }, 'mac-portal')
      const expected =
        'https://liff.line.me/11111-AAbbCC/client/U421a/form/1/carInfo/xxx?brand=%E0%B8%AD%E0%B8%B4%E0%B8%AD%E0%B8%B4&timestamp=1584261063000'
      expect(result).toBe(expected)
    })
  })
})
