import { JOB_TYPES, EXPERIENCE_LEVELS } from './constants'
import { formatDate } from './helpers'

// Simple client-side filter for mock data
export function filterJobs(jobs, filters){
  if(!filters) return jobs
  const { jobType = [], experienceLevel = [], datePosted = 'any', remoteOnly = false } = filters
  return jobs.filter(job => {
    // Job type
    if(jobType.length && !jobType.includes(job.job_employment_type)) return false
    // Experience
    if(experienceLevel.length){
      const lvl = (job.job_required_experience?.experience_level) || ''
      if(!experienceLevel.includes(lvl)) return false
    }
    // Remote
    if(remoteOnly && !job.job_is_remote) return false
    // Date posted
    if(datePosted && datePosted !== 'any'){
      const postedDate = new Date(job.job_posted_at_datetime_utc)
      const now = new Date()
      const diff = Math.abs(now - postedDate)
      const dayMs = 24*60*60*1000
      if(datePosted === 'today' && diff > dayMs) return false
      if(datePosted === '3days' && diff > 3*dayMs) return false
      if(datePosted === 'week' && diff > 7*dayMs) return false
      if(datePosted === 'month' && diff > 30*dayMs) return false
    }
    return true
  })
}

export function sortJobs(jobs, sortBy){
  if(!sortBy) return jobs
  const arr = [...jobs]
  switch(sortBy){
    case 'date_newest':
      return arr.sort((a,b)=> new Date(b.job_posted_at_datetime_utc) - new Date(a.job_posted_at_datetime_utc))
    case 'date_oldest':
      return arr.sort((a,b)=> new Date(a.job_posted_at_datetime_utc) - new Date(b.job_posted_at_datetime_utc))
    default:
      // relevance fallback: by salary max desc as a proxy
      return arr.sort((a,b)=> (b.job_min_salary||0) - (a.job_min_salary||0))
  }
}

export function searchJobs(jobs, query, location){
  if(!query && !location) return jobs
  const q = (query||'').toLowerCase()
  const loc = (location||'').toLowerCase()
  return jobs.filter(j => {
    const inTitle = (j.job_title||'').toLowerCase().includes(q)
    const inCompany = (j.employer_name||'').toLowerCase().includes(q)
    const inLocation = [(j.job_city||''),(j.job_state||''),(j.job_country||'')].filter(Boolean).join(' ').toLowerCase().includes(loc)
    return inTitle || inCompany || inLocation
  })
}
