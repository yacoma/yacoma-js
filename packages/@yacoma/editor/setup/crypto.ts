import { randomFillSync } from 'crypto'

const crypto = {
  getRandomValues: randomFillSync,
}

global.crypto = crypto
