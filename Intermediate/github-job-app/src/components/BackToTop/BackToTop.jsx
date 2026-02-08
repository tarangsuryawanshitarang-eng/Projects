import React, { useEffect, useState } from 'react'
import styles from './BackToTop.module.css'

export default function BackToTop(){
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
  if(!visible) return null
  return (
    <button aria-label="Back to top" className={styles.btn} onClick={scrollTop}>↑ Top</button>
  )
}
