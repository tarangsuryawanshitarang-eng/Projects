import React, { createContext, useContext, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const BookmarkContext = createContext()

export const useBookmarks = () => useContext(BookmarkContext)

export function BookmarkProvider({ children }){
  // Persist bookmarks in localStorage
  const [bookmarks, setBookmarks] = useLocalStorage('devjobs_bookmarks', [])

  const addBookmark = (job) => {
    if(!job) return
    const exists = bookmarks.find(b => b.job_id === job.job_id)
    if(exists) return
    const entry = { ...job, dateBookmarked: new Date().toISOString() }
    const next = [entry, ...bookmarks]
    setBookmarks(next)
  }

  const removeBookmark = (jobId) => {
    const next = bookmarks.filter(b => b.job_id !== jobId)
    setBookmarks(next)
  }

  const clearAllBookmarks = () => setBookmarks([])

  const isBookmarked = (jobId) => bookmarks.some(b => b.job_id === jobId)
  const bookmarkCount = bookmarks.length

  const value = useMemo(() => ({ bookmarks, addBookmark, removeBookmark, clearAllBookmarks, isBookmarked, bookmarkCount }), [bookmarks])

  return (
    <BookmarkContext.Provider value={value}>{children}</BookmarkContext.Provider>
  )
}
