import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { History, Tickets } from '../types/apiResponse'

export const tinkoffApi = createApi({
  reducerPath: 'tinkoffApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api-invest.tinkoff.ru/openapi/sandbox/',
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
    },
  }),
  endpoints: (builder) => ({
    getInstruments: builder.query<Tickets, void>({
      query: () => 'market/stocks',
    }),

    getInstrumentsHistory: builder.query<
      { [key: string]: History }[],
      { figi: string; name: string }[]
    >({
      async queryFn(figi, _queryApi, _extraOptions, fetchWithBQ) {
        let hasError = false

        const startDate = new Date(2018, 0, 1, 0, 0, 0, 0).toISOString()
        const endDate = new Date().toISOString()
        const interval = 'month'

        const histories = await Promise.all(
          figi.map(async (f) => {
            const result = await fetchWithBQ(
              `market/candles?figi=${f.figi}&from=${startDate}&to=${endDate}&interval=${interval}`
            )

            if (result.error) {
              hasError = true
              return { error: result.error as FetchBaseQueryError }
            }

            return { [f.name]: result.data } as { [key: string]: History }
          })
        )

        return !hasError
          ? {
              data: histories as { [key: string]: History }[],
              isFetching: false,
            }
          : {
              error: {
                status: 'FETCH_ERROR',
                error: 'some error',
              } as FetchBaseQueryError,
            }
      },
    }),
  }),
})

export const { useGetInstrumentsQuery, useGetInstrumentsHistoryQuery } =
  tinkoffApi
