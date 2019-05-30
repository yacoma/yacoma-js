import * as React from 'react'
import { Card, CardTitle, Modal } from '@yacoma/styled'
import { Comp } from '../app'

export interface OfflineProps {}

export const OfflineCard: Comp = () => (
  <Card large shadow>
    <CardTitle titleKey="Offline" icon="Offline" spin single />
  </Card>
)

export const Offline: Comp = () => (
  <Modal>
    <OfflineCard />
  </Modal>
)
