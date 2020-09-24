import React from "react"
import styled from 'styled-components'
import media from 'cssMix/index'
// comp 
import SearchBar from 'Components/common/SearchBar'
// icon
import { IoIosSearch, IoMdClose } from 'react-icons/io'

export default ({ name, searchValue = '', t, handleAddClick }) => {
    return <>
        <SearchBarArea>
            <div>
                {!!searchValue ? t('gameSearch') : name}
            </div>
            <div className='bar'>
                <SearchBar />
                {!searchValue ? <IoIosSearch /> : <IoMdClose onClick={handleAddClick} />}
            </div>
        </SearchBarArea>
        {
            searchValue && <SearchResult>
                <span className='searchValue'>{{ searchValue }}</span>
            </SearchResult>
        }
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
        border: solid 1px ${({ theme }) => theme.colors['4']};
        border-radius: 25.5px;
        align-self: stretch;
        padding:0 40px 0 20px;
        >input{
            width:100%;
            height:100%;
            background:transparent;
            color:#ffffff;
            font-size:16px;
        }
        >svg{
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
    ${media.tablet`
    display:none;
    `}
`


const SearchResult = styled.div`
    color: ${({ theme }) => theme.colors['4']};
    font-size:20px;
    .searchValue{
        color: ${({ theme }) => theme.colors['1']};
    }
`