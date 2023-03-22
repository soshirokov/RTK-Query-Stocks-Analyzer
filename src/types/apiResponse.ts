export type Tickets = {
  trackingId: string
  payload: ticketsPayload
  status: string
}
export type ticketsPayload = {
  instruments?: InstrumentsEntity[] | null
  total: number
}
export type InstrumentsEntity = {
  figi: string
  ticker: string
  isin: string
  minPriceIncrement?: number | null
  lot: number
  currency: string
  name: string
  type: string
  minQuantity?: number | null
}

export type History = {
  trackingId: string
  payload: historyPayload
  status: string
}
export type historyPayload = {
  candles?: CandlesEntity[] | null
  interval: string
  figi: string
}
export type CandlesEntity = {
  o: number
  c: number
  h: number
  l: number
  v: number
  time: string
  interval: string
  figi: string
}
