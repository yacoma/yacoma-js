import { action, debounce, pipe } from 'overmind'
import { Operator } from '../app'
import {
  CompositionWrapper,
  ElementSizes,
  SizeChangeArgs,
} from '../lib/utils/types'

const BATCH_MS = 200

const batchChanges = new WeakMap<object, ElementSizes>()

export const batchSizeChange: Operator<SizeChangeArgs> = action((_, value) => {
  const { holder, key, size } = value
  const { composition } = holder as CompositionWrapper
  let batch: ElementSizes
  if (batchChanges.has(composition)) {
    batch = batchChanges.get(composition) as ElementSizes
  } else {
    batch = JSON.parse(JSON.stringify(composition.sizes || {}))
    batchChanges.set(composition, batch)
    composition.sizes = batch
  }
  batch[key] = size
})

export const flushBatch: Operator<SizeChangeArgs> = action((_, value) => {
  const { holder } = value
  const { composition } = holder as CompositionWrapper

  const batch = batchChanges.get(holder)
  if (batch && Object.keys(batch).length) {
    Object.assign(composition.sizes || {}, batch)
    batchChanges.set(composition, {})
  }
})

export const sizeChange: Operator<SizeChangeArgs> = pipe(
  action(({ effects: { editor } }, value) =>
    editor.ensureComposition(value.holder)
  ),
  batchSizeChange,
  debounce(BATCH_MS),
  flushBatch
)
