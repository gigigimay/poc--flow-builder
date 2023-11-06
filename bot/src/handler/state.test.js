const { handleDependencies } = require('./state')

describe('When handleDependencies ', async () => {
  describe('is function ', async () => {
    let dependencies
    let result
    it('should return result', async () => {
      dependencies = async (arg) => ({ arg })
      result = await handleDependencies({ dependencies })
      expect(result).toEqual({
        arg: {
          session: undefined,
          event: undefined,
        },
      })
      dependencies = async () => []
      result = await handleDependencies({ dependencies })
      expect(result).toEqual([])
      dependencies = async () => ({ test: 1 })
      result = await handleDependencies({ dependencies })
      expect(result).toEqual({ test: 1 })
      dependencies = async ({ session, event }) => ({ session, event })
      result = await handleDependencies({ dependencies, session: 1, event: 2 })
      expect(result).toEqual({ session: 1, event: 2 })
    })
  })

  describe('is string ', async () => {
    let dependencies
    let result
    const actions = {
      objectify: async (arg) => ({ arg }),
      listify: async () => [],
      testify: async () => ({ test: 1 }),
      eventify: async ({ session, event }) => ({ session, event }),
    }
    it('should return result from actions', async () => {
      dependencies = 'objectify'
      result = await handleDependencies({ dependencies, actions })
      expect(result).toEqual({
        arg: {
          session: undefined,
          event: undefined,
        },
      })
      dependencies = 'listify'
      result = await handleDependencies({ dependencies, actions })
      expect(result).toEqual([])
      dependencies = 'testify'
      result = await handleDependencies({ dependencies, actions })
      expect(result).toEqual({ test: 1 })
      dependencies = 'eventify'
      result = await handleDependencies({
        dependencies,
        actions,
        session: 1,
        event: 2,
      })
      expect(result).toEqual({ session: 1, event: 2 })
    })
  })

  describe('is list ', async () => {
    let dependencies
    let result
    const actions = {
      objectify: async (arg) => ({ arg }),
      listify: async () => ['hello'],
      testify: async () => ({ test: 1 }),
      eventify: async ({ session, event }) => ({ session, event }),
    }
    it('should return result from actions', async () => {
      dependencies = ['objectify', async () => ({ test: 1 })]
      result = await handleDependencies({ dependencies, actions })
      expect(result).toEqual({
        '0': {
          arg: {
            session: undefined,
            event: undefined,
          },
        },
        '1': { test: 1 },
        arg: {
          session: undefined,
          event: undefined,
        },
        test: 1,
      })
      dependencies = ['objectify', 'listify']
      result = await handleDependencies({ dependencies, actions })
      expect(result).toEqual({
        '0': {
          arg: {
            session: undefined,
            event: undefined,
          },
        },
        '1': ['hello'],
        arg: {
          session: undefined,
          event: undefined,
        },
      })
    })
  })
})
