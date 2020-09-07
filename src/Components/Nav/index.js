import React, { useContext, useState, useEffect, useMemo, useRef } from "react"
import styled from 'styled-components'
import media from 'cssMix/index'
import { ContextStore } from 'Reducer'
import { Map, List, fromJS } from 'immutable'

// api
import {  } from 'api'

// comp
import Menu from './Menu'
import SearchBar from 'Components/common/SearchBar'

const menuList = fromJS([
    {
        name: '123',
    },
])

export default props => {
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const activeNav = stateReducer.get('activeNav')
    useEffect(()=>{
        dispatch({ type: 'SET_DATA', path: 'activeNav', value: menuList.getIn([0,'name'])})
    },[dispatch])

    return <Nav>
        <StyledSearchBar />
        <Menu
            list={menuList}
            activeNav={activeNav}
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