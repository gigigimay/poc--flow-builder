import 'isomorphic-fetch'

import { createAuthLink } from 'aws-appsync-auth-link'
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'

const url = process.env.APPSYNC_URL || ''
const region = process.env.APPSYNC_REGION
const auth = {
  type: process.env.APPSYNC_AUTH_TYPE,
  apiKey: process.env.APPSYNC_API_KEY,
}

const httpLink = createHttpLink({ uri: url })

const link = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  // httpLink,
  createSubscriptionHandshakeLink(url, httpLink),
])

export const appSyncClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
})
