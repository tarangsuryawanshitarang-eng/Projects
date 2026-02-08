import { useEffect, useState } from 'react'

export default function useMediaQuery(query){
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const m = window.matchMedia(query)
    const onChange = () => setMatches(!!m.matches)
    setMatches(m.matches)
    m.addEventListener('change', onChange)
    return () => m.removeEventListener('change', onChange)
  }, [query])
  return matches
}
