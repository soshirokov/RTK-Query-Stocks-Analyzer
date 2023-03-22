import { Spin } from 'antd'
import { Tickets } from '../../components/Tickets'
import { useGetInstrumentsQuery } from '../../redux/create-api'

type Props = {
  onChange: (figi: string[]) => void
}

export const TicketSelector = ({ onChange }: Props) => {
  const { data, error, isLoading } = useGetInstrumentsQuery()

  const tickets = data?.payload.instruments ?? []

  const onChangeHandler = (figi: string[]) => {
    onChange(figi)
  }

  return (
    <>
      {!isLoading ? (
        !error ? (
          <Tickets onChange={onChangeHandler} tickets={tickets} />
        ) : (
          { error }
        )
      ) : (
        <Spin />
      )}
    </>
  )
}
