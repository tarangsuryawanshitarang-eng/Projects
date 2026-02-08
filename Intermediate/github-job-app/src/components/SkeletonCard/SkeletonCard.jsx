import React from 'react'
import styles from './SkeletonCard.module.css'

export default function SkeletonCard(){
  return (
    <div className={styles.card}>
      <div className={styles.thumb}></div>
      <div className={styles.content}>
        <div className={styles.line}></div>
        <div className={styles.line short}></div>
      </div>
    </div>
  )
}
