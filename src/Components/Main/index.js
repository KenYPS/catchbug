import React, { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import media from 'cssMix/index'

// comp
import Items from './Items'
import Search from './Search'

// api
// import { apiDeleteList, apiAddList, apiGetList } from 'api'

// util
// import { transToLowercaseAndTrim } from 'Utils/index'

import useOutsideClickListener from 'useHooks/useOutsideClickListener'
import { useDispatch, useSelector } from 'react-redux'
import { selectData } from 'Reducer/dataSlice'
import { fetchItemList } from 'Reducer/dataSlice'
import { fetchAddList } from 'Reducer/dataSlice'
import { fetchDeleteList } from 'Reducer/dataSlice'

export default function Main() {
  const dispatch = useDispatch()
  const { itemList, menuList, searchValue: addItemNum } = useSelector(
    selectData
  )
  const site = menuList[0].name

  const [reomoveButtonSeq, setReomoveButtonSeq] = useState()

  const clickElementRef = useRef(null)
  const iconRef = useRef(null)
  const filteredList = useMemo(
    () =>
      itemList.filter((v) => {
        const itemNum = v.itemNum
        return itemNum.includes(addItemNum)
      }),
    [itemList, addItemNum]
  )

  useOutsideClickListener(
    iconRef,
    setReomoveButtonSeq.bind(null, ''),
    clickElementRef
  )

  const handleRemoveClick = (deleteItemNum) => {
    dispatch(fetchDeleteList({ deleteItemNum, site }))
    // apiDeleteList({ deleteItemNum, site }, dispatch)
  }

  const handleImgClick = (link) => {
    const windowOpen = window.open('about:blank')
    new Promise((resolve) => {
      resolve()
    }).then(() => {
      windowOpen.location.href = link
    })
  }
  function handleAddClick() {
    if (!addItemNum) return
    dispatch(fetchAddList({ addItemNum, site }))
    // apiAddList({ addItemNum, site }, dispatch)
  }
  function handleRefresh() {
    dispatch(fetchItemList({ site }))
    // apiGetList({ site }, dispatch)
  }
  return (
    <StyledMain>
      <Search handleAddClick={handleAddClick} handleRefresh={handleRefresh} />
      <Items
        clickElementRef={clickElementRef}
        list={filteredList}
        handleRemoveClick={handleRemoveClick}
        handleImgClick={handleImgClick}
        reomoveButtonSeq={reomoveButtonSeq}
        setReomoveButtonSeq={setReomoveButtonSeq}
        iconRef={iconRef}
      />
    </StyledMain>
  )
}

// style
const StyledMain = styled.div`
  background: #12110f;
  width: 100%;
  padding: 70px 150px;
  box-sizing: border-box;
  ${media.tablet`
    flex-grow:1;
    padding:86px 62px;
    `}
  ${media.mobile`
          padding:32px 10px;
        `}
`
