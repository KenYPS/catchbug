import React, { useMemo } from 'react'
import styled from 'styled-components'

import ModalBox from 'Components/common/Modalbox'

import { lineLogin, useLineLoggingCheck } from 'api'
import { selectUser } from 'Reducer/userSlice'
import { useSelector } from 'react-redux'

export default function Login() {
  const { idToken } = useSelector(selectUser)
  useLineLoggingCheck()
  const modalOpen = useMemo(() => !idToken, [idToken])
  function handleLineLogin() {
    lineLogin()
  }

  return (
    <ModalBox isOpen={modalOpen}>
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
          <Button color="#00b900" onClick={handleLineLogin}>
            Line登入
          </Button>
          {/* <Button
                    color='#00bcd4'
                    onClick={handleGoogleLogin}>
                    Google登入
                </Button> */}
        </ControlArea>
      </Container>
    </ModalBox>
  )
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  text-align: center;
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
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Button = styled.button`
  width: 90%;
  line-height: 30px;
  border-radius: 5px;
  background-color: ${({ color }) => color};
  margin: 10px 0;
  cursor: pointer;
  :hover {
    opacity: 0.7;
  }
`
