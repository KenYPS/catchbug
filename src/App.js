import React, { useEffect, useReducer } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import themeStyle from 'Css/style'

import RouterView from './Router'
import { initialState, ContextStore, reducer } from './Reducer/index'
import packageJson from '../package.json'
import GlobalStyle from 'Css/globalStyle'

function App () {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { stateReducer } = state
  const theme = stateReducer.get('theme')

  useEffect(() => {
    // Object.defineProperty(document, 'domain', {
    //   set: undefined
    // })
    delete document.domain
  }, [])

  return <ContextStore.Provider value={{ state, dispatch }}>
    <ThemeProvider theme={themeStyle[theme]} test={theme}>
      <>
        <div data-version={packageJson.version} />
        <GlobalStyle />
        <Router>
          <RouterView />
        </Router>
      </>
    </ThemeProvider>
  </ContextStore.Provider>
}

export default App
