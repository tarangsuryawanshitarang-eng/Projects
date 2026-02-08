import axios from 'axios'
import mockJobs from '../data/mockJobs.json'
import { filterJobs, searchJobs as mockSearch, sortJobs } from '../utils/filterUtils.js'

// Support for both CRA-style and Vite env vars
const API_KEY = (typeof process !== 'undefined' && (process.env.REACT_APP_RAPIDAPI_KEY || process.env.VITE_RAPIDAPI_KEY)) || ''
const API_HOST = 'jsearch.p.rapidapi.com'

const instance = axios.create({
  baseURL: 'https://jsearch.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': API_HOST
  },
})

export async function searchJobs({ query = '', location = '', page = 1, jobType = [], remoteOnly = false, datePosted = 'any', sort = 'relevance' } = {}){
  try{
    const res = await instance.get('/search', {
      params: {
        query,
        location,
        page,
        num_pages: 10,
        date_posted: datePosted,
        remote_jobs_only: remoteOnly,
        employment_types: jobType
      }
    })
    // Normalize shape
    const data = res?.data?.data ?? res?.data?.jobs ?? []
    // If API returns a flat array of jobs, just return as is
    if(Array.isArray(data)){
      return data
    }
    // Fallback: try data?.data
    const items = data?.data ?? []
    return Array.isArray(items) ? items : []
  }catch(err){
    // Fallback to mock data if API fails or quota exhausted
    console.warn('API unavailable, using mock data')
    // Local filtering based on provided filters
    let results = mockJobs
    results = mockSearch(results, query, location)
    results = filterJobs(results, {
      jobType,
      remoteOnly,
      datePosted
    })
    results = sortJobs(results, sort)
    return results
  }
}

export async function getJobDetail(jobId){
  try{
    const res = await instance.get('/job-details', { params: { job_id: jobId } })
    const data = res?.data?.data ?? res?.data?.job ?? null
    if(data) return data
  }catch(err){
    // ignore and fallback to mock
  }
  const found = mockJobs.find(j => j.job_id === jobId)
  return found ?? null
}

export async function getEstimatedSalary({ jobTitle, location } = {}){
  try{
    const res = await instance.get('/estimated-salary', { params: { job_title: jobTitle, location } })
    return res?.data ?? null
  }catch(err){
    return null
  }
}

export default {
  searchJobs,
  getJobDetail,
  getEstimatedSalary
}
