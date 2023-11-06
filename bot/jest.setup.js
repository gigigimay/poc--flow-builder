process.env.FEATURES = 'default'
process.env.APPSYNC_URL = ''
process.env.LINE_CLIENT_URL = 'https://liff.line.me/11111-AAbbCC'
process.env.DEFAULT_CLIENT_URL = 'https://test.com/agent-tools'

Date.now = () => new Date('2020-03-15 15:31:03:000 GMT+7').valueOf()

jest.mock('services/app-sync', () => ({
  appSyncClient: jest.fn(),
}))

jest.mock('services/features', () => {
  const mockResponse = require('./src/services/__test__/config-response-example')
  return {
    ...jest.requireActual('./src/services/features'),
    fetchFeaturesConfig: async () => {
      return mockResponse
    },
  }
})

jest.mock('config/features', () => ({
  getFeature: () => ({
    name: 'mac-portal',
    application: 'mac-portal:application',
    teams: {
      renew: 'team-[0-5]',
      interested: 'team-6',
      other: 'team-7',
      ask_information: 'team-8',
    },
    workingHour: {
      start: 9,
      end: 18,
    },
    setting: {
      format: {
        currency: {
          decimals: 2,
          showZeroWithDecimals: false,
        },
        integer: {
          decimals: 0,
          showZeroWithDecimals: false,
        },
      },
    },
    translation: {},
  }),
}))

jest.mock('services/i18n', () => ({
  getFixedT: () => jest.fn(),
}))
