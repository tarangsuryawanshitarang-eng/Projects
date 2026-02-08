import { useEffect, useRef } from 'react'

export default function useInfiniteScroll(callback, hasMore = true){
  const observer = useRef()
  const lastElementRef = useRef(null)

  useEffect(() => {
    if(!hasMore) return
    if(observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      const first = entries[0]
      if(first && first.isIntersecting){
        callback()
      }
    }, { rootMargin: '200px' })
    if(lastElementRef.current) observer.current.observe(lastElementRef.current)
    return () => observer.current?.disconnect()
  }, [hasMore, callback])

  return { lastElementRef }
}
