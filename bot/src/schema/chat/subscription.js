import gql from 'graphql-tag'

import { chat } from './fragment'

export const onUpdateMessageSubscription = gql`
  subscription onUpdateMessage($id: String) {
    onUpdateMessage(id: $id) {
      ...chat
    }
  }
  ${chat}
`

export const onChatMessageSubscription = gql`
  subscription onUpdateMessage($owner: String) {
    onUpdateMessage(owner: $owner) {
      ...chat
    }
  }
  ${chat}
`

export const onChatChangedWithPrevOwnerSubscription = gql`
  subscription onPrevChatChanged($prevOwner: String) {
    onPrevChatChanged(prevOwner: $prevOwner) {
      ...chat
    }
  }
  ${chat}
`

export const onChatChangedSubscription = gql`
  subscription onChatChanged($owner: String) {
    onChatChanged(owner: $owner) {
      ...chat
    }
  }
  ${chat}
`
