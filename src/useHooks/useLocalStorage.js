import { useEffect, useState } from 'react'

function useLocalStorage (key, initialValue = '') {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item || initialValue
    } catch (error) {
      // If error also return initialValue
      return initialValue
    }
  })

  useEffect(() => {
    if (storedValue) { localStorage.setItem(key, storedValue) } else { localStorage.removeItem(key) }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}

export default useLocalStorage
