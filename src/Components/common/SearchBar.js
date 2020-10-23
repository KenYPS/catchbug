
import React, { useContext } from 'react'
import styled from 'styled-components'
import { ContextStore } from 'Reducer'

import { BiPlus } from 'react-icons/bi'

const Container = styled.div`
width:100%;
height: 100%;
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

const SearchBar = ({ className, handleAddClick }) => {
  const { state: { stateReducer }, dispatch } = useContext(ContextStore)
  const searchValue = stateReducer.get('searchValue')
  const inputHandler = (value) => {
    dispatch({ type: 'SET_DATA', path: 'searchValue', value })
  }
  return <Container
    className={className}>
    <input
      placeholder={'新增搜尋costco商品編號'}
      value={searchValue}
      onChange={e => inputHandler(e.target.value)}
      autoFocus
    />
    <BiPlus onClick={handleAddClick}/>

  </Container>
}

export default SearchBar
