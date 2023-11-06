import * as fp from '@appman/mac_modules/fp'
import { actions } from 'xstate'
import { ANSWER, RESUME, RESUMED } from 'constants/state'
import { getAnswer } from './state'

// set default on.RESUME to go to question
export const addDefaultOnResume = fp.update(
  'on',
  fp.flip(fp.defaultsDeep)({
    [RESUME]: {
      actions: actions.assign({ status: RESUMED }),
      target: '.question',
    },
  })
)

export const mapStateWithQuestion = (state) => {
  const hasQuestion = fp.has('states.question')(state)
  if (!hasQuestion) {
    return state
  }
  return fp.pipe(
    // set initial state to `question`
    fp.set('initial', 'question'),
    addDefaultOnResume
  )(state)
}

export const toArray = fp.concat([])

// if `cond` is an array, map it into multiple answer conditions
export const flattenConditionArray = fp.pipe(
  fp.map(
    fp.when(
      fp.pipe(fp.get('cond'), fp.isArray),
      ({ cond, ...action }) =>
        fp.map((cond) => ({ cond, ...action }), cond)
    )
  ),
  fp.flatten,
)

// map text from ANSWER event into `cond` key of on.ANSWER
export const mapTextToCondition = fp.map(
  fp.update(
    'cond',
    fp.when(
      fp.isFunction,
      (fn) => (context, event) =>
        fn(getAnswer(event.payload), context, event)
    )
  )
)

export const mapStateAnswer = (state) => {
  const onAnswer = fp.get(['on', ANSWER])(state)
  if (fp.isNil(onAnswer)) {
    return state
  }
  const newAnswer = fp.pipe(
    toArray,
    flattenConditionArray,
    mapTextToCondition,
  )(onAnswer)
  return fp.set(['on', ANSWER], newAnswer)(state)
}

const mapStates = (states) => fp.mapValues(
  fp.pipe(
    mapStateWithQuestion,
    mapStateAnswer,
    fp.when(fp.has('states'), fp.update('states', mapStates))
  )
)(states)

const createQuestion = (config) => {
  return fp.pipe(
    fp.set('entry', actions.assign({ status: RESUMED })),
    fp.update('states', mapStates)
  )(config)
}

export default createQuestion
