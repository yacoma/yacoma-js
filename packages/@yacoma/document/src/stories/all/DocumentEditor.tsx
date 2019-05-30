import { DocumentEditor as component } from '../..'
import { config, Stories } from '../helper'

export const documentEditor: Stories<{}> = {
  name: 'DocumentEditor',
  config,
  component,
  stories: [
    {
      name: 'simple',
    },
  ],
}
