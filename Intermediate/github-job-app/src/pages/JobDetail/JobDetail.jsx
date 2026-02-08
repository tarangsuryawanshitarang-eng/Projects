import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getJobDetail } from '../../services/jobsApi'
import JobDetailCard from '../../components/JobDetailCard/JobDetailCard.jsx'
import styles from './JobDetail.module.css'

export default function JobDetail(){
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)

  useEffect(() => {
    let mounted = true
    getJobDetail(jobId).then(j => {
      if(mounted) setJob(j)
    })
    return () => { mounted = false }
  }, [jobId])

  if(!job){
    return (
      <div className={styles.notfound}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <button onClick={() => navigate(-1)} className={styles.back}>← Back to search</button>
      <div className={styles.grid}>
        <section className={styles.left}>
          <JobDetailCard job={job} />
          <div className={styles.section}>
            <h3>Job Description</h3>
            <div dangerouslySetInnerHTML={{ __html: job.job_description }} />
          </div>
        </section>
        <aside className={styles.right}>
          <div className={styles.card}>Apply Link</div>
        </aside>
      </div>
    </div>
  )
}
