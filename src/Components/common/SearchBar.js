
import React, { } from 'react'
import styled from 'styled-components'

import { BiPlus } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { selectData } from 'Reducer/dataSlice'
import { setSearchValue } from 'Reducer/dataSlice'

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
  const { searchValue } = useSelector(selectData)
  const dispatch = useDispatch()
  const inputHandler = (value) => {
    dispatch(setSearchValue(value))
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
