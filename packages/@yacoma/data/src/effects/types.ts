import { UserWithKeys } from '@lucidogen/security'
import { GraphQLClient } from 'graphql-request'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { TransportSettings } from '../types'

export interface DataFxContext {
  user?: UserWithKeys
  client: GraphQLClient
  subscriptionClient: SubscriptionClient
  expire?: number
  sessionId?: string
  token: string
  endpoint: TransportSettings['endpoint']
  // TODO: helper functions
  // saveItem
  // etc
}
