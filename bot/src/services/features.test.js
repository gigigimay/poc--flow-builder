import { formatConfigsToRecord, mappingFeatureFields } from './features'
import mockResponse from './__test__/config-response-example'

describe('mappingFeatureFields', () => {
  const responseConfig = mockResponse[0]
  it('should return correct features shape', () => {
    const features = mappingFeatureFields(responseConfig)
    expect(features).toEqual({
      name: 'aycal',
      application: 'aycal:application',
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
      translations: {
        button: {
          bought_previously_yes: 'เคยซื้อ123',
        },
      },
      defaultClientUrl: "https://ccs-dev.appmanteam.com/agent-tools",
      lineLiffUrl: "https://liff.line.me/1654185430-AYDo0YM9",
    })
  })
})

describe('formatConfigsToRecord', () => {
  it('should return object which has client name as a key', () => {
    const mappingFn = jest.fn(() => ({
      bot: true,
    }))
    const clientsConfig = [
      {
        name: 'A',
        aoc_config: {},
        aoc_features: {},
      },
      {
        name: 'B',
        aoc_config: {},
        aoc_features: {},
      },
      {
        name: 'C',
        aoc_config: {},
        aoc_features: {},
      },
    ]

    expect(formatConfigsToRecord(clientsConfig, mappingFn)).toEqual({
      A: { bot: true },
      B: { bot: true },
      C: { bot: true },
    })
    expect(mappingFn).toHaveBeenCalledTimes(3)
  })
})
