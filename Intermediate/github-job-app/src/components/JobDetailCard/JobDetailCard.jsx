import React from 'react'
import { formatDate, formatSalary } from '../../utils/helpers.js'
import styles from './JobDetailCard.module.css'

export default function JobDetailCard({ job }){
  if(!job) return null
  const date = formatDate(job.job_posted_at_datetime_utc)
  const salary = formatSalary(job.job_min_salary, job.job_max_salary, job.job_salary_currency)
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{job.job_title}</h2>
      <div className={styles.meta}>{job.employer_name} • {job.job_city}{job.job_state?', '+job.job_state:''} • {date}</div>
      <div className={styles.salary}>{salary}</div>
    </div>
  )
}
