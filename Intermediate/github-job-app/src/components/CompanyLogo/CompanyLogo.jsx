import React from 'react'
import { generateColorFromString } from '../../utils/helpers.js'
import styles from './CompanyLogo.module.css'

export default function CompanyLogo({ name, logo }){
  if(logo){
    return <img src={logo} alt={name + ' logo'} className={styles.logo} />
  }
  const initials = (name || 'Company').slice(0,2).toUpperCase()
  const color = generateColorFromString(name || 'Company')
  return (
    <div className={styles.fallback} style={{ background: color }} aria-label={name + ' logo'}>
      {initials}
    </div>
  )
}
