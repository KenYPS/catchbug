import React from 'react'
import styled from 'styled-components'
import media from 'cssMix/index'
// comp
import SearchBar from 'Components/common/SearchBar'
// icon
import { IoMdRefresh } from 'react-icons/io'

export default function Search ({ className, handleRefresh, handleAddClick }) {
  return <>
    <SearchBarArea>
      <div className='bar'>
        <SearchBar className={className} handleAddClick={handleAddClick}/>
      </div>
      <IoMdRefresh onClick={handleRefresh}/>
    </SearchBarArea>
  </>
}

const SearchBarArea = styled.div`
height:50px;
display: flex;
justify-content:space-between;
align-items:center;
color:#ffffff;
font-size:26px;
margin-bottom:62px;
    .bar{
        position: relative;
        box-sizing:border-box;
        width:320px;
        height: 100%;
        border: solid 1px ${({ theme }) => theme.colors['4']};
        border-radius: 25.5px;
        align-self: stretch;
        padding:0 0 0 20px;
        input{
            width:100%;
            height:100%;
            background:transparent;
            color:#ffffff;
            font-size:16px;
        }
        svg{
            position: absolute;
            right:19px;;
            top:50%;
            transform:translateY(-50%);
            color:#707070;
            cursor: pointer;
            width:24px;
            height:24px;
        }
    }
    >svg{
    color:${({ theme }) => theme.colors['1']};
    width:30px;
    height: 30px;
    cursor:pointer;
    }
    ${media.tablet`
    display:none;
    `}
`
