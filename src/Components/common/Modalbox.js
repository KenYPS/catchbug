import React, { useEffect, useCallback } from 'react'
import styled from 'styled-components'
// import { CSSTransition } from 'react-transition-group';
import noop from 'lodash'
// import { Motion, spring, TransitionMotion } from 'react-motion';
import { useSpring, animated } from 'react-spring'
// style
const StyledReactModal = styled.div`
  width:100vw;
  height:100vh;
  position: fixed;
  top:0;
  left:0;
  z-index:100;
  background-color: rgba(0, 0, 0, 0.5);
  overflow:auto;
  visibility:${({ isOpen }) => isOpen ? 'visible' : 'hidden'};

  transition:0.3s;
  .pop-enter {
  transform: scale(0.1);
  opacity: 0;
}
.pop-enter-active {
  transform: scale(1);
  opacity: 1;
  transition: 0.3s ease-out;
}
.pop-exit {
  opacity: 1;
  transform: scale(1);
}
.pop-exit-active {
  opacity: 0;
  transform: scale(0.1);
  transition: 0.3s ease-out;
}

`
export default function Modalbox ({
  isOpen = false,
  onModalClose = noop,
  children,
  confirmModal = false
}) {
  const escClick = useCallback(event => {
    if (event.keyCode === 27) onModalClose()
  }, [onModalClose])

  useEffect(() => {
    document.addEventListener('keydown', (event) => escClick(event), false)
  }, [escClick])

  const stopPropa = (e) => {
    e.stopPropagation()
  }

  return (
    <StyledReactModal isOpen={isOpen} onClick={onModalClose}>

      <Wrapper isOpen={isOpen} onClick={stopPropa}>
        {children}
      </Wrapper>

    </StyledReactModal >
  )
}

const Wrapper = ({ children, isOpen = false, className, confirmModal }) => {
  const { x } = useSpring({ from: { x: 0 }, x: isOpen ? 1 : 0, config: { duration: 300 } })
  return <ModalWarpper style={{
    transform: x.interpolate(x => `scale(${x})`)
  }}
  >{children}</ModalWarpper>
}

const ModalWarpper = styled(animated.div)`
    box-sizing:border-box;
    width:296px;
    margin:20vh auto;
    z-index:110;
    background: #fff;
    max-height:90%;
    overflow:auto;
    border-radius:10px;
    background: #e6f1f0;
    >div{
    padding:10px 10px;
    }
  
`
