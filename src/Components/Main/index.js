import React, { useContext, useMemo } from "react"
import styled from 'styled-components'
import media from 'cssMix/index'
import { ContextStore } from 'Reducer'
import {List } from 'immutable'
// comp 
import Items from './Items'
import Search from './Search'
// api
import { apiDeleteList, apiAddList, apiGetList} from 'api'

// util
// import { transToLowercaseAndTrim } from 'Utils/index'

export default props => {
    const { state: { stateReducer },dispatch } = useContext(ContextStore)
    const itemList = stateReducer.get('itemList', List)
    const site = stateReducer.getIn(['menuList', 0, 'name'])
    const addValue = stateReducer.get('searchValue')
    const filteredList = useMemo(()=> itemList.filter(v => {
        const itemNum = v.get('itemNum' ,'')
        return itemNum.includes(addValue)
        })
        , [itemList, addValue])
    const handleRemoveClick = (itemNum) => {
        apiDeleteList({ itemNum, site }, dispatch)
    }

    const handleImgClick = (link) => {
        const windowOpen = window.open()
        new Promise(res => {
            res()
        }).then(() => {
            windowOpen.location.href = link
        })
    }
    function handleAddClick() {
        apiAddList({ addValue, site }, dispatch)
    }
    function handleRefresh() {
        apiGetList({ site }, dispatch)
    }
    return <Main>
        <Search handleAddClick={handleAddClick} handleRefresh={handleRefresh}/>
        <Items
            list={filteredList}
            handleRemoveClick={handleRemoveClick}
            handleImgClick={handleImgClick}
        />
    </Main>
}

// style
const Main = styled.div`
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

