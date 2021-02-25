import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import media from 'cssMix/index'

// comp
import Menu from './Menu'
import SearchBar from 'Components/common/SearchBar'

// api
// import {  apiLineLogout } from 'api'

import { useDispatch, useSelector } from 'react-redux'
import { selectData } from 'Reducer/dataSlice'
import { selectUser } from 'Reducer/userSlice'
import { fetchItemList } from 'Reducer/dataSlice'
import { fetchAddList } from 'Reducer/dataSlice'
import { fetchLineLogout } from 'Reducer/userSlice'

export default function Nav() {
  const dispatch = useDispatch()
  const { account } = useSelector(selectUser)
  const {  menuList, searchValue: addItemNum } = useSelector(
    selectData
  )
    const site = menuList[0].name
  const [activeNav, setActiveNav] = useState(site)


  useEffect(() => {
    dispatch({
      type: 'SET_DATA',
      path: 'activeNav',
      value: site,
    })
  }, [dispatch, menuList,site])

  function handleAddClick() {
    if (!addItemNum) return
    dispatch(fetchAddList({ addItemNum, site }))
    // apiAddList({ addItemNum, site }, dispatch)
  }

  function handleSignOut() {
    dispatch(fetchLineLogout())
    // apiLineLogout(dispatch)
  }
  function handleRefresh() {
    dispatch(fetchItemList({ site }))
    // apiGetList({ site }, dispatch)
  }
  return (
    <StyledNav>
      <LoginArea>
        <div>{account}</div>
        <button onClick={handleSignOut}>登出</button>
      </LoginArea>
      <StyledSearchBar handleAddClick={handleAddClick} />
      <Menu
        list={menuList}
        activeNav={activeNav}
        handleRefresh={handleRefresh}
        setActiveNav={setActiveNav}
      />
      {/* <Login modalOpen={modalOpen}
            handleLogin={handleLogin}
        /> */}
    </StyledNav>
  )
}

const StyledNav = styled.div`
  background: ${({ theme }) => theme.navBackground};
  box-sizing: border-box;
  padding: 42px 20px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 340px;
  flex-shrink: 0;
  ${media.tablet`
    align-self: stretch;
    width:100%;
    padding:10px 32px 0 32px;
    position:relative;
    background-size:cover;
`}
  ${media.mobile`
    padding:10px 20px 0 20px;
    `}
`
const LoginArea = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  color: #00bcd4;
  > button {
    color: #00bcd4;
    cursor: pointer;
    padding: 5px;
  }
`
const StyledSearchBar = styled(SearchBar)`
  display: none;
  > input {
    width: 100%;
    box-sizing: border-box;
    background: transparent;
    font-size: 16px;
    color: #ffffff;
    border: 1px solid #ffffff;
    padding: 14px;
  }
  ${media.tablet`
display:block;
`}
`
