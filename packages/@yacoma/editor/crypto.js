const cryptoGlobal = {
  getRandomValues: crypto.randomFillSync,
}

global.crypto = cryptoGlobal
