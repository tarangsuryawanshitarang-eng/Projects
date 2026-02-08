import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/Header/Header.jsx'
import SearchBar from '../../components/SearchBar/SearchBar.jsx'
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar.jsx'
import JobList from '../../components/JobList/JobList.jsx'
import Loader from '../../components/Loader/Loader.jsx'
import { useBookmarks } from '../../context/BookmarkContext.jsx'
import { searchJobs as apiSearch } from '../../services/jobsApi'
import styles from './Home.module.css'
// import constants if needed later

export default function Home(){
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { bookmarks } = useBookmarks()

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try{
        const res = await apiSearch({ query: '', location: '', page: 1, jobType: [], remoteOnly: false, datePosted: 'any', sort: 'relevance' })
        if(mounted) setJobs(Array.isArray(res) ? res : [])
      }catch(err){
        if(mounted) setError(err)
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className={styles.page}>
      <Header bookmarkCount={bookmarks?.length ?? 0} />
      <section className={styles.hero} aria-label="Hero">
        <h1>Find Your Next Developer Job</h1>
        <p>Search thousands of developer positions from top companies</p>
        <SearchBar />
      </section>
      <div className={styles.content}>
        <FilterSidebar />
        <div className={styles.main}>
          <div className={styles.toolbar}>
            <span>Showing {jobs.length} jobs</span>
            <select aria-label="Sort" className={styles.select}>
              <option value="relevance">Relevance</option>
              <option value="date_newest">Date: Newest</option>
              <option value="date_oldest">Date: Oldest</option>
            </select>
          </div>
          {loading ? <Loader /> : (
            <JobList jobs={jobs} onBookmark={() => {}} />
          )}
          {error && <div className={styles.error}>Error loading jobs</div>}
        </div>
      </div>
    </div>
  )
}
