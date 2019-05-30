import { CompositionHolder, newComposition } from '../lib'

export function ensureComposition(holder: CompositionHolder) {
  if (!holder.composition) {
    holder.composition = newComposition({
      id: 'base',
      title: holder.title || true,
    })
  }
}
