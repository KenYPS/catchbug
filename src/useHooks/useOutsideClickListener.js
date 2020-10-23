import { useEffect } from "react";
import noop from 'lodash'

export default (ref, onOutsideClick = noop, iconRef)=> {
  useEffect(() => {
    function handleClickOutside(event) {
      if (iconRef.current.contains(event.target)) return 
      if (ref.current &&!ref.current.contains(event.target)) {
        onOutsideClick()
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [iconRef, onOutsideClick, ref]);

}
