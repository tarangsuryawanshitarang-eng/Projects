import React from 'react'
import { Link } from 'react-router-dom'
import CompanyLogo from '../CompanyLogo/CompanyLogo'
import { getJobTypeColor, formatDate, formatSalary } from '../../utils/helpers.js'
import styles from './JobCard.module.css'

export default function JobCard({ job, onBookmark }){
  const color = getJobTypeColor(job.job_employment_type)
  const date = formatDate(job.job_posted_at_datetime_utc)
  const salary = formatSalary(job.job_min_salary, job.job_max_salary, job.job_salary_currency)
  const isRemote = job.job_is_remote
  return (
    <article className={styles.card} style={{ borderLeftColor: color }}>
      <div className={styles.left}>
        <CompanyLogo name={job.employer_name} logo={job.employer_logo} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>
          <Link to={`/job/${job.job_id}`} className={styles.titleLink}>{job.job_title}</Link>
        </h3>
        <div className={styles.meta}>
          <span className={styles.company}>{job.employer_name}</span>
          <span className={styles.sep}>•</span>
          <span className={styles.location}>{job.job_city}{job.job_state ? ', ' + job.job_state : ''}</span>
          <span className={styles.sep}>•</span>
          <span className={styles.remote}>{isRemote ? 'Remote' : 'On-site'}</span>
          <span className={styles.sep}>•</span>
          <span className={styles.date}>{date}</span>
        </div>
        <div className={styles.tags} aria-label="Job type">
          <span className={styles.tag} style={{ background: color, color: '#fff' }}>{job.job_employment_type}</span>
          {salary && <span className={styles.salary}>{salary}</span>}
        </div>
      </div>
      <div className={styles.actions}>
        <button aria-label="Bookmark" className={styles.bookmark} onClick={() => onBookmark?.(job)}>🔖</button>
      </div>
    </article>
  )
}
