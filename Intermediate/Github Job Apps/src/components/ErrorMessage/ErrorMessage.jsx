import React from 'react'
import styles from './ErrorMessage.module.css'

export default function ErrorMessage({ title = 'Something went wrong', onRetry }){
  return (
    <div className={styles.banner} role="alert" aria-live="polite">
      <div className={styles.msg}>{title}</div>
      {onRetry && <button className={styles.btn} onClick={onRetry}>Retry</button>}
    </div>
  )
}
