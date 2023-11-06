import { createCustomLogLevels } from './logger'

describe('createCustomLogLevels', () => {

  it('should return custom log levels in correct form', () => {
    const result = createCustomLogLevels('debug')
    expect(result).toEqual({
      error: 0,
      warn: 1,
      debug: 2,
      transportSeparator: 3,
      info: 4,
    })
  })

  it('should return custom log levels in correct form', () => {
    const result = createCustomLogLevels('info,debug')
    expect(result).toEqual({
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      transportSeparator: 4,
    })
  })

  it('should return default of custom log levels if arg is undefined', () => {
    const result = createCustomLogLevels()
    expect(result).toEqual({
      error: 0,
      warn: 1,
      transportSeparator: 2,
      info: 3,
      debug: 4,
    })
  })
})
