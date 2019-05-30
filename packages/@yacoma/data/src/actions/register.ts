import { action } from 'overmind'
import { Operator } from '../app'

export const register: Operator = action(async ctx => {
  const { data } = ctx.effects
  const form = ctx.state.data.login
  if (form.valid) {
    // Word list valid
    delete form.error
    const result = await data.register(ctx)
    if (result) {
      data.loggedIn(ctx, result.user)
    } else {
      console.log('COULD NOT REGISTER ??')
    }
  } else {
    // Invalid word list
    form.error = 'WordListDoesNotMatch'
  }
})

export const registerCancel: Operator = action(ctx => {
  const { data, dialog } = ctx.effects
  data.clearForm(ctx)
  dialog.show(ctx, 'Login')
})

export const registerNameContinue: Operator = action(ctx => {
  const { data, dialog } = ctx.effects
  const { login } = ctx.state.data
  if (!login.username || !login.email) {
    login.error = 'InvalidUsernameOrEmail'
  } else {
    delete login.error
    data.newWordList(ctx)
    dialog.show(ctx, 'RegisterWords')
  }
})

export const registerWordsContinue: Operator = action(ctx => {
  const { dialog } = ctx.effects
  ctx.state.data.login.wordListVerify = []
  dialog.show(ctx, 'RegisterVerify')
})
