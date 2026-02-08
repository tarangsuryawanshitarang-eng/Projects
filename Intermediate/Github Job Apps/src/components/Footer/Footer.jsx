import React from 'react'
import styles from './Footer.module.css'

export default function Footer(){
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>© {new Date().getFullYear()} DevJobs. All rights reserved.</div>
    </footer>
  )
}
