import * as fp from '@appman/mac_modules/fp'
import { text } from 'config/templates'
import { isAnswer } from 'config/validation'
import { ANSWER, NEXT, RESUME, RESUMED, SKIP } from 'constants/state'
import { actions } from 'xstate'
import { updateData } from './state'
import createQuestion, {
  addDefaultOnResume,
  toArray,
  flattenConditionArray,
  mapTextToCondition,
  mapStateWithQuestion,
  mapStateAnswer,
} from './createQuestion'

describe('addDefaultOnResume', () => {
  it('should add default on.RESUME to state', () => {
    const state = {}
    expect(addDefaultOnResume(state)).toEqual({
      on: {
        [RESUME]: {
          actions: actions.assign({ status: RESUMED }),
          target: '.question',
        },
      },
    })
  })
  it('should prefer the state over the default value', () => {
    const state = {
      on: {
        [ANSWER]: 'something',
        [RESUME]: {
          target: '.question2',
        },
      },
    }
    expect(addDefaultOnResume(state)).toEqual({
      on: {
        [ANSWER]: 'something',
        [RESUME]: {
          actions: actions.assign({ status: RESUMED }),
          target: '.question2',
        },
      },
    })
  })
})

describe('mapStateWithQuestion', () => {
  it('should return state if it does not have question', () => {
    const state = {}
    expect(mapStateWithQuestion(state)).toEqual({})
  })
  it('should return updated state if it has question', () => {
    const state = {
      states: {
        question: {},
      },
    }
    expect(mapStateWithQuestion(state)).toEqual({
      initial: 'question',
      states: {
        question: {},
      },
      on: {
        [RESUME]: {
          actions: actions.assign({ status: RESUMED }),
          target: '.question',
        },
      },
    })
  })
})

describe('toArray', () => {
  it('should return [] when input is []', () => {
    expect(toArray([])).toEqual([])
  })
  it('should return [{}] when input is {}', () => {
    expect(toArray({})).toEqual([{}])
  })
})

describe('flattenConditionArray', () => {
  it('should map array of `cond` to multiple conditions', () => {
    const answers = [
      { cond: [1, 2, 3], target: 'A' },
      { cond: 4, target: 'B' },
    ]
    expect(flattenConditionArray(answers)).toEqual([
      { cond: 1, target: 'A' },
      { cond: 2, target: 'A' },
      { cond: 3, target: 'A' },
      { cond: 4, target: 'B' },
    ])
  })
})

describe('mapTextToCondFunction', () => {
  it('should', () => {
    const cond = (text, context, event) => ({ text, context, event })
    const answers = [{ cond }]
    const result = mapTextToCondition(answers)
    const context = {}
    const event = { payload: { content: { text: 'ABC' } } }
    expect(result[0].cond(context, event)).toEqual(cond('ABC', context, event))
  })
})

describe('mapStateAnswer', () => {
  it('should return state if on.ANSWER is nil', () => {
    const state = {}
    expect(mapStateAnswer(state)).toEqual({})
  })
  it('should return updated state if on.ANSWER is not nil', () => {
    const state = {
      on: {
        [ANSWER]: {},
      },
    }
    expect(mapStateAnswer(state)).toEqual({
      on: {
        [ANSWER]: [{}],
      },
    })
  })
})

describe('createQuestion', () => {
  it('should match snapshots when called with empty object', () => {
    const result = createQuestion({})
    expect(result).toMatchSnapshot(result)
  })

  it('should match snapshots when called with state', () => {
    const mockState = {
      initial: 'show_new_product',
      states: {
        show_new_product: {
          states: {
            question: {
              meta: {
                field: 'data.buy_new_product',
                dependencies: jest.fn(),
                message: jest.fn(),
              },
            },
            invalid: {
              meta: {
                message: text({ text: 'error' }),
              },
            },
          },
          on: {
            [ANSWER]: [
              {
                cond: isAnswer('ซื้ออันนี้'),
                actions: [
                  actions.assign(
                    updateData('data.buy_new_product', fp.constant(12344))
                  ),
                  actions.raise(SKIP),
                ],
              },
              {
                cond: isAnswer('แนะนำอันใหม่'),
                actions: [actions.raise(NEXT)],
              },
            ],
            [NEXT]: {
              target: 'suggest_product',
            },
            [SKIP]: {
              target: 'addition',
            },
          },
        },
        suggest_product: {
          states: {
            question: {
              meta: {
                message: text({ text: '[new] suggest product~~' }),
              },
            },
          },
        },
        addition: {
          states: {
            question: {
              meta: {
                message: text({ text: '[new] addtional question~~' }),
              },
            },
          },
        },
      },
    }

    const result = createQuestion(mockState)
    expect(result).toMatchSnapshot(result)
  })
})
