import { useState } from "react"
import {List ,Map} from "immutable"

export default ({ api }) => {
    const [fetchData, setfetchData] = useState(List())
    const [isLoading, setIsLoading] = useState(false)
    const fetchApiFunc = (dispatch, path) => {
        setIsLoading(true)
        let array =[]
        api.once("value", (res) => {
            const val = res.val()
            for (const key in val) {
                if (val.hasOwnProperty(key)) {
                    const element = Map(val[key]).merge(Map({key}));
                    array.push(element)
                }
            }
            setfetchData(List(array))
            setIsLoading(false)
        })
    }
    return {
        isLoading,
        fetchApiFunc,
        fetchData
    }
}

