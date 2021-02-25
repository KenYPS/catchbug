import React, { useEffect } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import themeStyle from 'Css/style'

import RouterView from './Router'
import packageJson from '../package.json'
import GlobalStyle from 'Css/globalStyle'
import { useSelector } from 'react-redux'
import { selectData } from 'Reducer/dataSlice'
import { selectUser } from 'Reducer/userSlice'

function App() {
  const { theme } = useSelector(selectData)
  const { accessToken, idToken } = useSelector(selectUser)

  //sync token to localstorage
  useEffect(() => {
    if (accessToken && idToken) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('idToken', idToken)
    } else {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('idToken')
    }
  }, [accessToken, idToken])
  useEffect(() => {
    delete document.domain
  }, [])

  return (
    <ThemeProvider theme={themeStyle[theme]} test={theme}>
      <>
        <div data-version={packageJson.version} />
        <GlobalStyle />
        <Router>
          <RouterView />
        </Router>
      </>
    </ThemeProvider>
  )
}

export default App
