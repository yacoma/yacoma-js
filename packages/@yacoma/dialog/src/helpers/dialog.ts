import { Context } from '../app'

export function show({ state }: Context, dialog: string) {
  state.dialog.show = dialog
}

export function hide({ state }: Context) {
  delete state.dialog.show
}
