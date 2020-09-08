import React, { useContext, useState, useEffect, useMemo, useRef } from "react"
import styled from 'styled-components'
import media from 'cssMix/index'
import { ContextStore } from 'Reducer'
import { Map, List, fromJS } from 'immutable'

// api
import { apiLogin } from 'api'

// comp
import Menu from './Menu'
import SearchBar from 'Components/common/SearchBar'
import Login from './Login'
const menuList = fromJS([
    {
        name: '123',
    },
])

export default props => {
    const [modalOpen, setModalOpen] = useState(true)
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const activeNav = stateReducer.get('activeNav')
    const account = stateReducer.get('account')

    useEffect(() => {
        dispatch({ type: 'SET_DATA', path: 'activeNav', value: menuList.getIn([0, 'name']) })
    }, [dispatch])

    function handleLogin(account, password) {
        apiLogin(account, password, dispatch, setModalOpen)
    }

    function handleAddClick(params) {
        
    }


    return <Nav>
        <LoginArea>
            <div>
                {account}
            </div>
            {/* <button onClick={setModalOpen.bind(null, true)}>
                {account ?'登出':'登入'}     
            </button> */}
        </LoginArea>
        <StyledSearchBar handleAddClick={handleAddClick}/>
        <Menu
            list={menuList}
            activeNav={activeNav}
        />
        <Login modalOpen={modalOpen}
            handleLogin={handleLogin}
        />
    </Nav>
}

const Nav = styled.div`
background:${({ theme }) => theme.navBackground};
box-sizing:border-box;
padding:42px 20px 0 20px;
display: flex;
flex-direction:column;
align-items:center;
width:340px;
flex-shrink:0; 
${media.tablet`
    align-self: stretch;
    width:100%;
    padding:10px 32px 0 32px;
    position:relative;
    background-size:cover;
`}
${
    media.mobile`
    padding:10px 20px 0 20px;
    `
    }


`
const LoginArea = styled.div`
width:100%;
height: 30px;
display: flex;
justify-content:space-between;
color:#00bcd4;
>button{
color:#00bcd4;
cursor: pointer;
padding:5px;
}
`
const StyledSearchBar = styled(SearchBar)`
display:none;
>input{
width:100%;
box-sizing:border-box;
background:transparent;
font-size:16px;
color:#ffffff;
border: 1px solid #ffffff;
padding:14px;
 
}
${media.tablet`
display:block;
`
    }

`