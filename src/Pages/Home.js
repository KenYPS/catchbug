import React, { } from 'react'
import styled from 'styled-components'
import media from 'cssMix/index'

import Nav from 'Components/Nav'
import Main from 'Components/Main'
import Login from 'Components/Login'
import GoTop from 'Components/GoTop'

// style
const Container = styled.div`
display: flex;
width:100%;
min-height:100%;
${media.tablet`
    flex-direction:column;
  `}
`

const Home = props => {
  return (
    <Container>
      <Nav/>
      <Main/>
      <Login/>
      <GoTop/>
    </Container>
  )
}

export default Home
