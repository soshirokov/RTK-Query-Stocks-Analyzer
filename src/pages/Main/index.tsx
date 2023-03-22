import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { useState } from 'react'
import { TicketAnalizer } from '../../containers/TicketAnalizer'
import { TicketSelector } from '../../containers/TicketSelector'
import styles from './styles.module.scss'

export const Main = () => {
  const [selectedTickets, setSelectedTickets] = useState<
    { figi: string; name: string }[]
  >([])

  const onChange = (figi: string[]) => {
    const newFigies = figi.map((f) => JSON.parse(f))

    setSelectedTickets(newFigies)
  }
  return (
    <Layout className={styles.Layout}>
      <Content className={styles.Content}>
        <TicketSelector onChange={onChange} />
        <TicketAnalizer figies={selectedTickets} />
      </Content>
    </Layout>
  )
}
