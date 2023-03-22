import { Select } from 'antd'
import { useState } from 'react'
import { InstrumentsEntity } from '../../types/apiResponse'

type Props = {
  tickets: Pick<InstrumentsEntity, 'figi' | 'ticker' | 'name'>[]
  onChange: (figi: string[]) => void
}

export const Tickets = ({ tickets, onChange }: Props) => {
  const [filter, setFilter] = useState('')

  const onChangeHandler = (figi: string[]) => {
    setFilter('')
    onChange(figi)
  }

  const onSearchHandler = (value: string) => {
    setFilter(value)
  }

  return (
    <Select
      showSearch
      placeholder="Select a ticket"
      optionFilterProp={filter}
      onChange={onChangeHandler}
      onSearch={onSearchHandler}
      style={{ width: '100%' }}
      filterOption={(input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
      }
      options={tickets.map((ticket) => ({
        value: JSON.stringify({ figi: ticket.figi, name: ticket.name }),
        label: `(${ticket.ticker}) ${ticket.name}`,
      }))}
      mode="multiple"
    />
  )
}
