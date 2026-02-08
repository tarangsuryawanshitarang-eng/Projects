import React, { useState, useMemo, useCallback } from 'react'
import styles from './SearchBar.module.css'
import searchIcon from '../../assets/icons/search.svg'
import locationIcon from '../../assets/icons/location.svg'
import { useNavigate, useLocation } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'

export default function SearchBar(){
  const navigate = useNavigate()
  const locationRouter = useLocation()
  const [title, setTitle] = useState('')
  const [loc, setLoc] = useState('')
  const debouncedTitle = useDebounce(title, 400)
  const debouncedLoc = useDebounce(loc, 400)

  // Sync with URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(locationRouter.search)
    const q = params.get('q') || ''
    const l = params.get('location') || ''
    setTitle(q)
    setLoc(l)
  }, []);

  const onSubmit = (e) => {
    e.preventDefault()
    const q = debouncedTitle.trim()
    const locationQuery = debouncedLoc.trim()
    const qsp = new URLSearchParams()
    if(q) qsp.set('q', q)
    if(locationQuery) qsp.set('location', locationQuery)
    navigate('/?' + qsp.toString())
  }

  const onKeyDown = (ev) => {
    if(ev.key === 'Enter') {
      onSubmit(ev)
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} aria-label="Search jobs">
      <div className={styles.inputWrap}>
        <input aria-label="Job title" placeholder="Title, company, or keyword" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={onKeyDown} />
        <span className={styles.icon}><img src={searchIcon} alt="search"/></span>
      </div>
      <div className={styles.inputWrap}>
        <input aria-label="Location" placeholder="City, state, or remote" value={loc} onChange={e => setLoc(e.target.value)} onKeyDown={onKeyDown} />
        <span className={styles.icon}><img src={locationIcon} alt="location"/></span>
      </div>
      <button type="submit" className={styles.btn}>Search</button>
    </form>
  )
}
