import React from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import styles from './Header.module.css'

export default function Header({ bookmarkCount = 0 }){
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink} aria-label="DevJobs home">DevJobs</Link>
        </div>
        <nav className={styles.nav} aria-label="Main navigation">
          <Link to="/" className={styles.link}>Home</Link>
          <Link to="/bookmarks" className={styles.link}>
            Bookmarks
            {bookmarkCount > 0 && <span className={styles.badge}>{bookmarkCount}</span>}
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
