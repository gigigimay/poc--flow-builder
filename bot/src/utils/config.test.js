import { mappingTranslations, filterAOCClient } from './config'

describe('mappingTranslations', () => {
  const clientFeatures = {
    'mac-portal': {
      translations: { title: 'A' },
    },
    aycal: {
      translations: { title: 'B' },
    },
    goldshop: {
      translations: { title: 'C' },
    },
  }
  const expectedResult = {
    'mac-portal': {
      title: 'A',
    },
    aycal: {
      title: 'B',
    },
    goldshop: {
      title: 'C',
    },
  }
  it('should map client features to the shape of resource bundle', () => {
    expect(mappingTranslations(clientFeatures)).toEqual(expectedResult)
  })
})

describe('filterAOCClient', () => {
  it('should filter only client that has aoc configuration and features (C and E)', () => {
    const clientsConfig = [
      { name: 'A', aoc_config: {} },
      { name: 'B', aoc_features: {} },
      { name: 'C', aoc_config: {}, aoc_features: {} },
      { name: 'D' },
      { name: 'E', aoc_config: {}, aoc_features: {} },
    ]

    const result = filterAOCClient(clientsConfig)
    expect(result).toEqual([
      { name: 'C', aoc_config: {}, aoc_features: {} },
      { name: 'E', aoc_config: {}, aoc_features: {} },
    ])
  })
})
