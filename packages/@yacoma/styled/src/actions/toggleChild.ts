import { Action } from '../app'

export const toggleChild: Action<{
  family: string
  child: string
  exclusive?: boolean
}> = (ctx, { family, child, exclusive }) => {
  const { state } = ctx
  if (!state.styled.show[family]) {
    state.styled.show[family] = { [child]: true }
  } else if (exclusive) {
    state.styled.show[family] = state.styled.show[family][child]
      ? {}
      : { [child]: true }
  } else {
    state.styled.show[family][child] = !state.styled.show[family][child]
  }
}
