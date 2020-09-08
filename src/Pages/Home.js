import React, { } from "react"
import styled from 'styled-components'
import media from 'cssMix/index'

import Nav from 'Components/Nav'
import Main from 'Components/Main'


import { useVerifyUser} from 'api'

export default props => {

    useVerifyUser()

    return <Home>
        <Nav/>
        <Main/>
    </Home>
}

// style
const Home = styled.div`
display: flex;
width:100%;
min-height:100%;
${media.tablet`
flex-direction:column;
`}
`

