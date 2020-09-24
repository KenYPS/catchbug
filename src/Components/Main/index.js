import React, { useContext } from "react"
import styled from 'styled-components'
import media from 'cssMix/index'
import { ContextStore } from 'Reducer'

// comp 
import Items from './Items'
// api
import { apiDeleteList} from 'api'

// util
// import { transToLowercaseAndTrim } from 'Utils/index'

export default props => {
    const { state: { stateReducer },dispatch } = useContext(ContextStore)
    const itemList = stateReducer.get('itemList')
    const site = stateReducer.getIn(['menuList', 0, 'name'])

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

    return <Main>
        <Items
            list={itemList}
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

