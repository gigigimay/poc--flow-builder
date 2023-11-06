import * as fp from '@appman/mac_modules/fp'
import { Machine, actions } from 'xstate'
import {
  isTextMessage,
  getModule,
  getMeta,
  getMessageTemplate,
  clearCurrentForm,
} from 'utils/state'
import {
  INVALID,
  NEXT,
  COMMAND,
  RESUME,
  PAUSED,
  ERROR,
  BROKEN,
  FALLBACK,
} from 'constants/state'

import stateConfig from 'config/states'
import { getLogger } from 'utils/logger'
import { getFeature } from 'config/features'

const logger = getLogger('handler/state.js')

const guards = {
  isTextMessage: fp.pipe(fp.nthArg(1), fp.get('payload'), isTextMessage),
  isNotTextMessage: fp.pipe(
    fp.nthArg(1),
    fp.get('payload'),
    fp.complement(isTextMessage)
  ),
}

const getStateConfig = (stateConfig) =>
  fp.assign(stateConfig.states, {
    listening: {
      entry: actions.assign({ status: PAUSED, finished: true }),
      on: stateConfig.events,
    },
  })

export const listen = async (
  state,
  { action = {}, event, session, dependencies }
) => {
  if (!fp.isEmpty(state.meta) && !fp.isEmpty(event)) {
    const meta = getMeta(state)

    if (meta.message) {
      const message = getMessageTemplate({
        action,
        event,
        session,
        dependencies,
      })(meta.message)

      if (!fp.isEmpty(message)) {
        return message
      }
    }
  }

  return null
}

export const handleDependencies = async ({
  dependencies,
  actions,
  event,
  session,
}) => {
  const handleDependency = async (dependency) => {
    if (fp.isFunction(dependency)) {
      return dependency({
        event,
        session,
      })
    }
    if (fp.isString(dependency) && fp.isFunction(actions[dependency])) {
      const fn = actions[dependency]
      return fn({ session, event })
    }
    return undefined
  }

  if (Array.isArray(dependencies)) {
    const dependencyResults = await Promise.all(
      dependencies.map(handleDependency)
    )
    return dependencyResults.reduce(Object.assign, {})
  }
  return handleDependency(dependencies)
}

export default async (
  type,
  action = {},
  { session, event, actions = {} } = {},
  tenant
) => {
  const {
    // application,
    module: prevModule,
    intent: prevIntent,
    status: prevStatus,
  } = session

  const feature = getFeature(tenant)
  const states = getStateConfig(stateConfig[feature.application])

  let stateMachine = Machine(
    {
      id: 'state',
      initial: 'listening',
      context: {
        finished: false,
        data: {},
      },
      states,
    },
    {
      guards,
      actions,
    }
  )

  stateMachine = stateMachine.withContext(
    fp.defaults(stateMachine.context, session)
  )

  let currentState = fp.getOr(
    stateMachine.initialState.value,
    prevModule,
    prevIntent
  )

  const processMeta = async () => {
    try {
      await Promise.all(
        currentState.actions.map(
          (action) => action.exec && action.exec(currentState.context, event)
        )
      )

      const dependencies = fp.get('dependencies', getMeta(currentState))

      action.dependencies = await handleDependencies({
        dependencies,
        actions,
        event,
        session: currentState.context,
      })

      const transition = fp.get('transition', getMeta(currentState))
      const isExit = fp.isEqual(
        fp.last(currentState.toStrings()),
        fp.get(prevModule, prevIntent)
      )
      if (fp.isFunction(transition)) {
        const nextEvent = await transition({
          isExit,
          event,
          dependencies: action.dependencies,
          session: currentState.context,
        })
        if (nextEvent) {
          currentState = stateMachine.transition(currentState, nextEvent)
          await processMeta()
        }
      }
    } catch (e) {
      currentState = stateMachine.transition(currentState, INVALID)
      logger.error(`Error processing meta: ${e}\n${JSON.stringify(e, null, 2)}`)
    }
  }

  const skipQuestion = async () => {
    let field = null

    await processMeta()

    do {
      const intent = fp.last(currentState.toStrings())

      if (fp.endsWith('question', intent)) {
        field = fp.get('field', getMeta(currentState))
      } else {
        field = null
      }

      if (field) {
        const fieldData = fp.get(field, currentState.context)

        if (fp.isNil(fieldData)) {
          field = null
        } else {
          currentState = stateMachine.transition(currentState, NEXT)

          // eslint-disable-next-line no-await-in-loop
          await processMeta()

          field = fp.get('field', getMeta(currentState))
        }
      }
    } while (!fp.isNil(field) && fp.contains(NEXT, currentState.nextEvents))
  }

  if (type === COMMAND) {
    // NOTE: start the flow / switch across each flow

    if (session.caseId > 0) {
      await clearCurrentForm(session.caseId, tenant)
      // clear values of field 'data' in context
      stateMachine.context.data = {}
    }

    const initialState = stateMachine.transition(
      stateMachine.initialState.value,
      {
        type: action.payload,
        ...action,
      }
    )
    currentState = initialState

    await skipQuestion()
  } else if (type === FALLBACK && states[FALLBACK]) {
    /** NOTE: enter fallback flow when the client starts conversation with other messages than a command */

    logger.info(`Redirecting chatId:${session.id} to FALLBACK flow`)
    const initialState = stateMachine.transition(
      stateMachine.initialState.value,
      {
        type: FALLBACK,
        ...action,
      }
    )
    currentState = initialState

    await skipQuestion()
  } else if (type === ERROR) {
    const initialState = stateMachine.transition(
      stateMachine.initialState.value,
      {
        type,
        ...action,
      }
    )
    await listen(initialState, {
      action,
      event,
    })

    return { messages: null, session }
  } else if (prevStatus === BROKEN) {
    currentState = stateMachine.transition(currentState, RESUME)

    await skipQuestion()
  } else if (prevStatus === PAUSED) {
    return { messages: null, session }
  } else {
    currentState = stateMachine.transition(currentState, { type, ...action })
    await skipQuestion()
  }

  const { status, finished = false, ...updatedSession } = currentState.context

  const nextState = fp.last(currentState.toStrings())

  let currentStatus = status
  let currentModule = getModule(currentState.value)
  let currentIntent = nextState

  let messages
  try {
    messages = await listen(currentState, {
      action,
      event,
      dependencies: action.dependencies,
      session: currentState.context,
    })
  } catch (e) {
    currentStatus = BROKEN
    logger.error(`Error getting messages: ${e}\n${JSON.stringify(e, null, 2)}`)
  }

  if (finished) {
    currentIntent = fp.omit(currentModule, prevIntent)
    currentModule = ''
    // TODO - fix later since it is not safe
    updatedSession.data = {}
  } else {
    currentIntent = fp.when(
      () => !fp.isEmpty(currentModule),
      fp.set(currentModule, currentIntent)
    )(prevIntent)
  }

  return {
    messages,
    session: {
      ...updatedSession,
      status: currentStatus,
      intent: currentIntent,
      module:
        currentModule === stateMachine.initialState.value ? '' : currentModule,
    },
  }
}
