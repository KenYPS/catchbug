import React, { useContext, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import media from 'cssMix/index'
import { ContextStore } from 'Reducer'
import { List } from 'immutable'

// comp
import Items from './Items'
import Search from './Search'

// api
import { apiDeleteList, apiAddList, apiGetList } from 'api'

// util
// import { transToLowercaseAndTrim } from 'Utils/index'

import useOutsideClickListener from 'useHooks/useOutsideClickListener'

export default function Main () {
  const { state: { stateReducer }, dispatch } = useContext(ContextStore)
  const itemList = stateReducer.get('itemList', List)
  const site = stateReducer.getIn(['menuList', 0, 'name'])
  const addItemNum = stateReducer.get('searchValue')

  const [reomoveButtonSeq, setReomoveButtonSeq] = useState()

  const popRef = useRef()
  const clickElementRef = useRef()

  const filteredList = useMemo(() => itemList.filter(v => {
    const itemNum = v.get('itemNum', '')
    return itemNum.includes(addItemNum)
  })
  , [itemList, addItemNum])

  useOutsideClickListener(popRef, setReomoveButtonSeq.bind(null, ''), clickElementRef)

  const handleRemoveClick = (deleteItemNum) => {
    apiDeleteList({ deleteItemNum, site }, dispatch)
  }

  const handleImgClick = (link) => {
    const windowOpen = window.open()
    new Promise(resolve => {
      resolve()
    }).then(() => {
      windowOpen.location.href = link
    })
  }
  function handleAddClick () {
    apiAddList({ addItemNum, site }, dispatch)
  }
  function handleRefresh () {
    apiGetList({ site }, dispatch)
  }
  return <StyledMain>
    <Search handleAddClick={handleAddClick} handleRefresh={handleRefresh} />
    <Items
      popRef={popRef}
      clickElementRef={clickElementRef}
      list={filteredList}
      handleRemoveClick={handleRemoveClick}
      handleImgClick={handleImgClick}
      reomoveButtonSeq={reomoveButtonSeq}
      setReomoveButtonSeq={setReomoveButtonSeq}
    />
  </StyledMain>
}

// style
const StyledMain = styled.div`
background:#12110f;
width:100%;
padding:70px 150px;
box-sizing:border-box;
${media.tablet`
    flex-grow:1;
    padding:86px 62px;
    `
    }
    ${media.mobile`
        padding:32px 10px;
        `
    }
`
