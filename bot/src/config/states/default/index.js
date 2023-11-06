import createQuestion from "utils/createQuestion"
import { text } from 'config/templates'
import { ANSWER, FALLBACK } from "constants/state"
import { isAnswer } from "config/validation"

const testFlow = {
  id: 'test-flow',
  initial: 'initial_test_flow_state',
  states: {
    initial_test_flow_state: {
      states: {
        question: {
          meta: {
            message: text({ text: 'Cats or dogs?' }),
          },
        },
        invalid: {
          meta: {
            message: text({ text: 'Please answer again.' }),
          },
        },
      },
      on: {
        ANSWER: [
          {
            cond: isAnswer('Cats'),
            target: 'ans_a',
          },
          {
            cond: isAnswer('Dogs'),
            target: 'ans_b',
          },
          {
            target: '.invalid',
          },
        ],
      },
    },
    ans_a: {
      meta: {
        message: text({ text: 'I love cats, too!' }),
      },
    },
    ans_b: {
      meta: {
        message: text({ text: 'I love dogs, too!' }),
      },
    },
  },
}

export default {
  states: {
    test_flow: createQuestion(testFlow),
    fallback: createQuestion(testFlow),
  },
  events: {
    'common:command.interested': 'test_flow',
    [FALLBACK]: 'fallback',
  },
}
