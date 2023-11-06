export default {
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.LOGGING_ENABLED === 'true',
  environment: process.env.ENVIRONMENT,
  tracesSampleRate: 1.0,
}
