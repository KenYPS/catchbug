import  React, { useState, useEffect } from 'react'
import styled from "styled-components"
import media from 'cssMix/index'
import { useDebouncedCallback } from 'use-debounce'
import {FiChevronUp} from 'react-icons/fi'

const showIcon = (setShow) => {
  
  const doc = document.documentElement
  const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

  if (top > 50) setShow(true)
  else if (top === 0) setShow(false)
}

export default () => {
    const [isShow, setIsShow] = useState(false)
    const [debounceSetState] = useDebouncedCallback(() => showIcon(setIsShow), 100)
    useEffect(() => {
        const refListner = window.addEventListener('scroll', debounceSetState)
      return window.removeEventListener('scroll', refListner)
    }, [debounceSetState])

    const goToTop = () => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth"
        })
    }
    return isShow&&<StyledGoTop
        key='gotop'
        onClick={goToTop}
    >
      <FiChevronUp/>
    </StyledGoTop>

}


const StyledGoTop = styled.div`
  position: fixed;
  right:20px;
  bottom:70px;
  z-index:99;
  width:60px;
  height:60px;
  -webkit-tap-highlight-color:transparent;
  background-size:100%;
  transform:translateZ(0);
  background:#3e3b2c;
  border-radius:50%;
  cursor: pointer;
  display: flex;
  align-items:center;
  justify-content:center;
  >svg{
    height:40px;
    width:40px;
      color:${({ theme }) => theme.colors['13']};

  }
${
    media.tablet`
      width:50px;
    height:50px;
  bottom:30px;
>svg{
    height:30px;
    width:30px; 
  }
    `
    }
${
  media.tablet`
      width:40px;
    height:40px;
  bottom:30px;
>svg{
    height:30px;
    width:30px; 
  }
    `
    }
`