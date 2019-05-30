import { IConfiguration, Overmind, IOperator } from 'overmind'

type PropsFunction<Config extends IConfiguration, Props> = (
  app: Overmind<Config>
) => Props

export interface TStory<Config extends IConfiguration = any, Props = any> {
  // The name of the story
  name: string
  // What is the proper type here ?
  // If not set here, it must be set in the Stories defaults.
  component?: any
  // A component to wrap the tested component.
  wrapper?: any
  // A sequence triggered on component wrapper click
  titleClick?: IOperator<Config, React.MouseEvent, React.MouseEvent>
  // Turn on debugger for this story by providing a port number (should be unique
  // for each story).
  devtools?: string
  // Regular props passed to component.
  props?: Props | PropsFunction<Config, Props>
  state?: any
  actions?: {
    [key: string]: any
  }
  config?: Config
  // theme override
  theme?: {
    [key: string]: any
  }
  children?: any
  // jsx to use this story (use this if there are children and/or the guessing of
  // component name does not work)
  jsx?: string
}
export type Story<Props = any> = TStory<any, Props>

export interface TStories<Config extends IConfiguration = any, Props = any> {
  name: string
  stories: TStory<Config, Props>[]
  // Defaults for all stories in this set
  component?: any
  wrapper?: any
  titleClick?: IOperator<Config, React.MouseEvent, React.MouseEvent>
  // Regular props passed to component.
  props?: Props | PropsFunction<Config, Props>
  state?: any
  actions?: {
    [key: string]: any
  }
  config?: Config
  theme?: {
    [key: string]: any
  }
  children?: any
}
export type Stories<Props = any> = TStories<any, Props>

export interface StoryConfig {
  state: {
    stories: {}
  }
}
