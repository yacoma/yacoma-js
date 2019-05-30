import { Item } from '@lucidogen/data'
import { DraggableHooks } from '@lucidogen/dragdrop'
import { isPrivateCollectionId, workCollectionId } from '@lucidogen/security'
import { Icon } from '@lucidogen/styled'
import classnames from 'classnames'
import * as React from 'react'
import { useState } from 'react'
import { Comp, styled, theme, useOvermind } from '../app'

export interface DocIconProps extends Partial<DraggableHooks> {
  className?: string
  blink?: boolean
  item: Item
}

const TheIcon = styled(Icon)`
  color: ${theme.privateColor};
  &.Shared {
    color: ${theme.sharedColor};
  }
  height: 4rem;
  width: auto;
  line-height: 4rem;
  padding: 8px;
  font-size: 3rem;
  opacity: 0.5;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 8rem;
  left: 1rem;
  z-index: 7;
  width: auto;
  &.blink {
    background: #ffe5b4;
    transition: none;
  }
  transition: background-color 0.5s ease;
  border-radius: 5px;
`

export const DocIcon: Comp<DocIconProps> = ({ className, item, ...props }) => {
  const ctx = useOvermind()
  const { data } = ctx.effects
  const currId = item.id
  const currSavedAt = item.savedAt
  const [savedAt, setSavedAt] = useState(currSavedAt)
  const [itemId, setItemId] = useState(currId)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || !el.classList) {
      return
    }
    if (currId === itemId && currSavedAt !== savedAt) {
      el.classList.add('blink')
      setTimeout(() => {
        if (el && el.classList) {
          el.classList.remove('blink')
        }
      }, 300)
    }
    setSavedAt(currSavedAt)
    setItemId(currId)
  })

  let icon: string = item.type
  const shared = data.isShared(ctx, item)
  const { id } = item
  const uid = ctx.state.data.auth.id

  if (id === workCollectionId(uid)) {
    icon = 'MyCollection'
  } else if (icon === 'Collection' && !shared) {
    icon = 'OwnCollection'
  }

  return (
    <Wrapper ref={ref as any}>
      <TheIcon
        className={classnames(className, icon, {
          Shared: data.isShared(ctx, item),
          Private: isPrivateCollectionId(item.id),
        })}
        icon={icon}
        {...props}
      />
    </Wrapper>
  )
}
