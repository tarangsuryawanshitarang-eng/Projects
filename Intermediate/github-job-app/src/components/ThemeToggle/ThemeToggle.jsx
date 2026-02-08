import React, { useContext } from 'react'
import ThemeContext from '../../context/ThemeContext.jsx'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle(){
  const { theme, toggleTheme } = useContext(ThemeContext)
  const isDark = theme === 'dark'
  return (
    <button aria-label="Toggle theme" className={styles.btn} onClick={toggleTheme}>
      {isDark ? '🌙' : '🌞'}
    </button>
  )
}
