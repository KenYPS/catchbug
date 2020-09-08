
import React, { useContext, useRef, useEffect } from "react"
import styled from 'styled-components'
import { ContextStore } from 'Reducer'

import {BiPlus} from 'react-icons/bi'

export default ({ className, handleAddClick }) => {
    const { state: { stateReducer }, dispatch } = useContext(ContextStore)
    const searchValue = stateReducer.get('searchValue')
    const inputHandler = (value) => {
        dispatch({ type: 'SET_DATA', path: 'searchValue', value })
    }

    return <SearchBar
        className={className}>
        <input
            placeholder={'新增搜尋'}
            value={searchValue}
            onChange={e => inputHandler(e.target.value)}
            autoFocus
        />
        <BiPlus onClick={handleAddClick}/>
    </SearchBar>
       
    
    
}

const SearchBar = styled.div`
width:100%;
position: relative;

>svg{
    position: absolute;
    right:10px;
    top:50%;
    transform:translateY(-50%);
    color:#ffffff;
    width:30px;
    height: 30px;
    cursor: pointer;
}

`