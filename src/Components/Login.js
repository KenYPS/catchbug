import React, { useState } from "react"
import styled from 'styled-components'

import ModalBox from 'Components/common/Modalbox'

import {  useApiVerifyUser, useApiGoogleLogin } from 'api'


export default ( ) => {
    const [modalOpen, setModalOpen] = useState(false)
    useApiVerifyUser(setModalOpen)
    const apiGoogleLogin = useApiGoogleLogin(setModalOpen)

    function handleLogin() {
        apiGoogleLogin()
    }

    return <ModalBox
        isOpen={modalOpen}
    >
        <Container>
            {/* <StyledInput>
                <span>帳號</span>
                <input autoFocus 
                    value={account}
                onChange={e => setAccount(e.target.value)} />
            </StyledInput>
            <StyledInput>
                <span>密碼</span>
                <input
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}/>
            </StyledInput> */}
            <ControlArea>
                <Button onClick={handleLogin}>
                    Google登入
                </Button>
            </ControlArea>

        </Container>
    </ModalBox>
}

const Container = styled.div`
width:100%;
box-sizing:border-box;
text-align:center;
`

// style
// const StyledInput = styled.div`
// height: 25px;
// margin-bottom:10px;
// >span{
//     margin-right:5px;
// }
// >input{
// width:80%;
// height: 100%;
// padding-left: 5px;
// }
// `

const ControlArea = styled.div`
width:100%;
display: flex;
justify-content:center;
align-items:center;
`

const Button = styled.button`
width:90%;
line-height:30px;
border-radius:5px;
background-color: #00bcd4;
cursor: pointer;
:hover{
    opacity:0.7;
}
`