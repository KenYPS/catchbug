import { useEffect, useState } from 'react';

function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once

    const [storedValue, setStoredValue] = useState(() => {
        try {
            // Get from local storage by key
            const item = localStorage.getItem(key)
            console.log(item);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            // If error also return initialValue
            console.log(error)
            return initialValue
        }
    })
  
    useEffect(()=>{
        const valueToStore =
            storedValue instanceof Function ? storedValue(storedValue) : storedValue
        if (valueToStore)
        localStorage.setItem(key, JSON.stringify(valueToStore))
        else
        localStorage.removeItem(key)
    }, [key, storedValue])


    return [storedValue, setStoredValue];
}


export default useLocalStorage