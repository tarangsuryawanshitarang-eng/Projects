import React from 'react'
import styles from './Pagination.module.css'

export default function Pagination({ onLoadMore, loading, show, totalShown, total }){
  if(!show) return null
  return (
    <div className={styles.pagination}>
      <button onClick={onLoadMore} disabled={loading} className={styles.btn} aria-label="Load more jobs">
        {loading ? 'Loading...' : `Load More`}
      </button>
      <div className={styles.info}>Showing {totalShown} of {total} results</div>
    </div>
  )
}
