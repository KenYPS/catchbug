import React, {  } from "react"
import styled from 'styled-components'
import media from 'cssMix/index'
import {  fromJS } from 'immutable'

// comp 
import Items from './Items'
// api
import { } from 'api'

// util
// import { transToLowercaseAndTrim } from 'Utils/index'

const listItems = fromJS(['111', '333'])

export default props => {

    const addItemValue =()=>{

}


    return <Main>
        <Items
            list={listItems}
            addItemValue={addItemValue}
        />
    </Main>
}

// style
const Main = styled.div`
background:#12110f;
width:100%;
padding:70px 150px;
box-sizing:border-box;
${
    media.tablet`
    flex-grow:1;
    padding:86px 62px;
    `
    }
    ${
    media.mobile`
        padding:32px 10px;
        `
    }
`

