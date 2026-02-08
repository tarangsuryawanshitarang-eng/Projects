import React from 'react'
import JobCard from '../JobCard/JobCard'
import styles from './JobList.module.css'

export default function JobList({ jobs, onBookmark }){
  if(!jobs || jobs.length === 0){
    return <div className={styles.empty}>No jobs found.</div>
  }
  return (
    <div className={styles.list}>
      {jobs.map(job => (
        <JobCard key={job.job_id} job={job} onBookmark={onBookmark} />
      ))}
    </div>
  )
}
