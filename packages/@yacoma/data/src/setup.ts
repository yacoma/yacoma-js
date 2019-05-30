import { Setup } from '@lucidogen/build'

import { makeEffects } from './effects'
import {
  AuthHandler,
  DataConfig,
  DataSettings,
  TypeHandlers,
  TransportSettings,
} from './types'

export const setup: Setup<DataConfig, DataSettings> = (config, settings) => {
  const types: TypeHandlers = {}
  const authentication: AuthHandler = {} as any
  let endpoint: TransportSettings['endpoint'] = {
    graphql: 'http://localhost:4000/graphql',
    cdn: 'http://localhost',
    subscriptions: 'ws://localhost:4000/subscriptions',
  }
  let skipInit = false
  Object.keys(settings).forEach(blockName => {
    const setting = settings[blockName]
    if (setting.types) {
      Object.assign(types, setting.types)
    }
    if (setting.authentication) {
      Object.assign(authentication, setting.authentication)
    }
    if (setting.endpoint) {
      endpoint = setting.endpoint
    }
    if (typeof setting.skipInit === 'boolean') {
      skipInit = setting.skipInit
    }
    if (setting.uploadLimit) {
      config.state.data.uploadLimit = setting.uploadLimit
    }
  })
  config.effects.data = makeEffects({
    types,
    authentication,
    endpoint,
    skipInit,
  })
}
