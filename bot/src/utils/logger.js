import Sentry from 'winston-transport-sentry-node'
import sentryConfig from 'config/sentry'
import { createLogger, transports, format } from 'winston'

export const createCustomLogLevels = (logLevel) => {
  const enabledLevels = ['error', 'warn']
  const disabledLevels = []
  const inputLevels = logLevel ? logLevel.split(',') : []
  const checkingLevels = ['info', 'debug']

  checkingLevels.forEach((level) => {
    if (inputLevels.includes(level)) {
      enabledLevels.push(level)
    } else {
      disabledLevels.push(level)
    }
  })
  const outputLevels = [
    ...enabledLevels,
    'transportSeparator',
    ...disabledLevels,
  ]

  const result = {}
  outputLevels.forEach((level, index) => {
    result[level] = index
  })

  return result
}

export const getLogger = (label) =>
  createLogger({
    levels: createCustomLogLevels(process.env.LOG_LEVEL),
    format: format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      format.label({ label }),
      format.printf(
        (lgr) =>
          `${lgr.timestamp} - ${lgr.level} - [${lgr.label}]: ${lgr.message}`
      )
    ),
    transports: [
      new transports.Console({ level: 'transportSeparator' }),
      new Sentry({ sentry: sentryConfig, level: 'error' }),
    ],
  })
