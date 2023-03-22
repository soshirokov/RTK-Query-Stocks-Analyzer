import React from 'react'
import { Provider } from 'react-redux'
import { Main } from './pages/Main'
import { store } from './redux'

function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  )
}

export default App
