import classnames from 'classnames'
import * as React from 'react'
import { Comp, useOvermind } from '../app'

export interface ChildrenProps {
  className?: string
  family: string | { [key: string]: boolean }
  [key: string]: any
}

export const Children: Comp<ChildrenProps> = ({
  family,
  className,
  ...passedProps
}) => {
  const ctx = useOvermind()
  const allFamilies = ctx.state.styled.familyComponents()
  const families =
    typeof family === 'string'
      ? [family]
      : Object.keys(family).filter(k => family[k])
  const groups: { [key: string]: JSX.Element[] } = {}
  families.map((family, fidx) => {
    const children = allFamilies[family]
    if (!children) {
      console.log(allFamilies)
      throw new Error(
        `Invalid family name '${family}' (no settings for this name).`
      )
    }
    return Object.keys(children).map((child, idx) => {
      const { component: Comp, props, enable, visible, group } = children[child]
      const theProps = Object.assign(
        {},
        typeof props === 'function' ? props(ctx) : Object.assign({}, props),
        passedProps
      )
      const enabled = enable
        ? enable(ctx, { family, child, props: theProps })
        : true
      let className =
        visible && !visible(ctx, { family, child, props: theProps })
          ? 'hidden'
          : undefined
      if (enabled) {
        if (!groups[group]) {
          groups[group] = []
        }
        groups[group].push(
          <Comp className={className} key={fidx + idx} {...theProps} />
        )
      }
    })
  })
  const groupNames = Object.keys(groups)
  if (groupNames.length === 1) {
    if (className) {
      return <div className={className}>{groups[groupNames[0]]}</div>
    } else {
      return <React.Fragment>{groups[groupNames[0]]}</React.Fragment>
    }
  } else {
    return (
      <div className={classnames(className, 'Groups')}>
        {groupNames.map(row => (
          <div key={row} className="Group">
            {groups[row]}
          </div>
        ))}
      </div>
    )
  }
}
