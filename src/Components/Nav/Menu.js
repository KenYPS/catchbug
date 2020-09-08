import React, { } from "react"
import styled from 'styled-components'
import media from 'cssMix'
import { List } from 'immutable'

import { apiLogin } from 'api'

export default ({ 
    list = List(),
    activeNav
}) => {
    return <Menu>
        {list.map(v => {
            const name = v.get('name')
            return <div className={`list ${activeNav === name && 'active'}`}
                key={name}
                onClick={apiLogin}
            >
                {name}
            </div>
        })}
    </Menu>
}

// style
const Menu = styled.div`
background:${({ theme }) => theme.navBackground};
width:100%;
font-size:20px;
color:${({ theme }) => theme.colors['5']};
overflow-x:auto;
cursor: pointer;
.list{
    text-align:center;
    margin-bottom: 28px;
    &.active{
      color:${({ theme }) => theme.colors['1']};
    }
}

${media.tablet`
display:flex;
align-items:center;
padding:0;
font-size:18px;
margin:7px 0;
.list{
    /* flex:0 0 100px; */
    flex-shrink:0;
    padding:1px 15px;
    margin-right:25px;
    margin-bottom: 0;
    border:1px solid transparent;

    &.active{
    border:1px solid ${({ theme }) => theme.colors['12']};
    border-radius:14.5px;
    }
}

`}
`