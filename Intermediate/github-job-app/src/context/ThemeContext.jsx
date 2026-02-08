import React, { createContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const ThemeContext = createContext()

export const useTheme = () => React.useContext(ThemeContext)

export function ThemeProvider({ children }){
  const [theme, setTheme] = useLocalStorage('devjobs_theme', 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  const value = { theme, toggleTheme, isDark: theme === 'dark' }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export default ThemeContext
