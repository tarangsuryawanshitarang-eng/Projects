import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { useBookmarks } from '../../context/BookmarkContext.jsx'
import JobCard from '../../components/JobCard/JobCard.jsx'
import styles from './Bookmarks.module.css'

function BookmarksList(){
  const { bookmarks, removeBookmark } = useBookmarks()
  return (
    <div>
      {bookmarks.length === 0 ? (
        <div className={styles.empty}>
          <p>No saved jobs yet.</p>
          <Link to="/">Explore Jobs</Link>
        </div>
      ) : (
        bookmarks.map(b => (
          <div key={b.job_id} className={styles.cardWrap}>
            <JobCard job={b} onBookmark={(job)=> removeBookmark(job.job_id)} />
          </div>
        ))
      )}
    </div>
  )
}

export default function Bookmarks(){
  return (
      <div className={styles.page}>
        <h2>Saved Jobs</h2>
        <BookmarksList />
      </div>
  )
}
