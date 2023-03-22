import { Area, Datum } from '@ant-design/charts'
import { endOfDay, format } from 'date-fns'
import { useMemo, useState } from 'react'
import { useGetInstrumentsHistoryQuery } from '../../redux/create-api'
import styles from './styles.module.scss'

export const TicketAnalizer = ({
  figies,
}: {
  figies: { figi: string; name: string }[]
}) => {
  const [errors, setErrors] = useState('')
  const { data } = useGetInstrumentsHistoryQuery(figies)

  const series = useMemo(() => {
    setErrors('')
    const dateCounter: { [key: string]: number } = {}
    return data
      ? data.reduce(
          (
            acc: { date: string; value: number; ticket: string }[],
            ticketHistory
          ) => {
            const ticketName = Object.keys(ticketHistory)[0]

            const candles = ticketHistory[ticketName].payload?.candles ?? []

            if (!candles.length) {
              setErrors((prevState) => {
                const errorsArr =
                  prevState?.length > 0 ? prevState.split(', ') : []
                errorsArr.push(`Для ${ticketName} нет данных`)
                return errorsArr.join(', ')
              })
            }

            const baseValue = candles.length > 0 ? candles?.[0].c ?? 0 : 0

            const mappedHistory: {
              date: string
              value: number
              ticket: string
            }[] = candles?.map((candle) => ({
              date: format(
                endOfDay(new Date(candle.time)),
                "yyyy-MM-dd'T'HH:mm:ss'Z'"
              ),
              value: Math.ceil((candle.c / baseValue) * 100 - 100),
              ticket: ticketName,
            }))

            mappedHistory.forEach((item) => {
              const indexInResult = acc.findIndex(
                (r) => r.date === item.date && r.ticket === 'portfolio'
              )
              if (indexInResult === -1) {
                const newPortfolioItem = {
                  date: item.date,
                  ticket: 'portfolio',
                  value: item.value,
                }
                acc.push(newPortfolioItem)
                dateCounter[item.date] = 1
              } else {
                acc[indexInResult].value = Math.ceil(
                  (acc[indexInResult].value * dateCounter[item.date] +
                    item.value) /
                    ++dateCounter[item.date]
                )
              }
            })

            console.log(mappedHistory ? [...acc, ...mappedHistory] : acc)

            return mappedHistory ? [...acc, ...mappedHistory] : acc
          },
          []
        )
      : []
  }, [data, setErrors])

  const config = {
    data: series,
    xField: 'date',
    yField: 'value',
    seriesField: 'ticket',
    smooth: true,
    color: [
      '#6897a7',
      '#8bc0d6',
      '#60d7a7',
      '#dedede',
      '#fedca9',
      '#fab36f',
      '#d96d6f',
    ],
    xAxis: {
      type: 'time',
      mask: 'MM.YYYY',
    },
    yAxis: {
      label: {
        // 数值格式化为千分位
        formatter: (v: string) => {
          return `${v}%`
        },
      },
    },
    tooltip: {
      formatter: (datum: Datum) => {
        return { name: datum.ticket, value: datum.value + '%' }
      },
    },
  }

  return (
    <>
      {errors && <div className={styles.Errors}>{errors}</div>}
      <div className={styles.Chart}>
        <Area {...config} />
      </div>
    </>
  )
}
