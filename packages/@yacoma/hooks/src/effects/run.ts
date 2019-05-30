import { Context } from '../app'

// The `noHookCallback` is only run if no hook returns true.
export async function run(
  hook: string,
  ctx: Context,
  args: any,
  noHookCallback?: () =>
    | Promise<boolean | undefined | void>
    | boolean
    | undefined
    | void
): Promise<boolean | undefined | void> {
  const hooks = ctx.state.hooks.hooks()[hook]
  if (hooks) {
    let done: boolean | undefined | void
    let idx = 0
    while (!done && hooks[idx]) {
      done = await hooks[idx](ctx, args)
      idx += 1
    }
    if (!done && noHookCallback) {
      done = await noHookCallback()
    }
    return done
  }
  // Not captured by hook
  return
}
