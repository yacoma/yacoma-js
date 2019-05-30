import { action } from 'overmind'
import { Operator } from '../app'
import { NewDocumentArg } from '../args'

export const newDocument: Operator<NewDocumentArg> = action(
  async (ctx, value) => {
    const { effects, actions } = ctx
    const doc = await effects.document.createDocument(ctx, value)
    actions.data.select(effects.document.makeItemSelection(doc))
  }
)
