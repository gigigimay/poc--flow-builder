import gql from 'graphql-tag'

export const brandInfo = gql`
  fragment brand on Brand {
    id
    name
  }
`
