import { useEffect } from 'react'
import noop from 'lodash'

export default (ref, onOutsideClick = noop, iconRef) => {
  console.log(ref)
  console.log(iconRef)
  useEffect(() => {
    function handleClickOutside (event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick()
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [iconRef, onOutsideClick, ref])
}
