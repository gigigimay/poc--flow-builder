import 'isomorphic-fetch'

import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'

const url = process.env.SERVICE_PORTAL_URL

/**
  TODO: find another solution for sending header when query service-portal
 */
export const createServicePortalClient = (headers) => {
  const httpLink = createHttpLink({ uri: url, headers })

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
      mutate: {
        fetchPolicy: 'no-cache',
      },
    },
  })
}

export const servicePortal = createServicePortalClient()
