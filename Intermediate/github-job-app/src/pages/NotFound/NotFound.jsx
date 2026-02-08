import React from 'react'
import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

export default function NotFound(){
  return (
    <main className={styles.notfound}>
      <h1>404</h1>
      <p>Page not found. Go back to <Link to="/">home</Link>.</p>
    </main>
  )
}
