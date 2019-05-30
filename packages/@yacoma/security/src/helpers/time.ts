export const FUTURE_LEEWAY = 60 * 1000 //  60 seconds (datetime skew)
export const PAST_LEEWAY = 120 * 1000 // 120 seconds (datetime skew + network speed)
export const TOKEN_TTL = 30 * 60 * 1000 // 30 minutes
export const PAST_MESSAGE = `should not be older then 120 seconds`
export const TTL_MESSAGE = `should not be older then 120 seconds`
export const FUTURE_MESSAGE = 'should not be more then 60 seconds in the future'

export function timeSkewCheck(
  now: number,
  name: string | undefined,
  date: number,
  ttl: number = 0
): string | undefined {
  if (ttl > 0 && date + ttl < now - PAST_LEEWAY) {
    const msg = `should not be older then ${Math.floor(
      ttl / 1000
    )} + 120 seconds`
    return name ? `${name}: ${msg}` : msg
  } else if (date < now - PAST_LEEWAY) {
    return name ? `${name}: ${PAST_MESSAGE}` : PAST_MESSAGE
  }
  if (date > now + FUTURE_LEEWAY) {
    return name ? `${name}: ${FUTURE_MESSAGE}` : FUTURE_MESSAGE
  }
  return undefined
}

let serverSkew = 0
export function setRemoteNow(remoteNow: number): number {
  serverSkew = remoteNow - Date.now()
  return serverSkew
}

export function remoteNow(): number {
  return Date.now() + serverSkew
}
