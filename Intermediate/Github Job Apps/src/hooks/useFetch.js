import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

// Generic fetch hook with Axios and AbortController
export default function useFetch(url, options = {}){
  const { method = 'GET', params = {}, headers = {}, immediate = true } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const controller = useRef(null)

  const fetchData = async (overrideParams) => {
    if(!url) return
    try{
      setLoading(true)
      setError(null)
      controller.current = new AbortController()
      const res = await axios({
        url,
        method,
        params: { ...params, ...(overrideParams||{}) },
        headers,
        signal: controller.current.signal
      })
      setData(res.data)
    }catch(err){
      if(err.name === 'AbortError') return
      setError(err)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(immediate){ fetchData() }
    return () => {
      controller.current?.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[url])

  const refetch = (overrideParams) => fetchData(overrideParams)

  return { data, loading, error, refetch }
}
