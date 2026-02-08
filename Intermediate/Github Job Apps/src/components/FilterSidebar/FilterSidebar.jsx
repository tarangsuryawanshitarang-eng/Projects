import React, { useContext } from 'react'
import { JobsContext } from '../../context/JobsContext.jsx'
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants.js'
import styles from './FilterSidebar.module.css'

export default function FilterSidebar(){
  const { state, dispatch } = useContext(JobsContext)
  const { filters } = state

  const toggleJobType = (t) => {
    const list = filters.jobType.includes(t) ? filters.jobType.filter(x => x !== t) : [...filters.jobType, t]
    dispatch({ type: 'SET_FILTERS', payload: { jobType: list } })
  }

  const toggleExperience = (e) => {
    const list = filters.experienceLevel.includes(e) ? filters.experienceLevel.filter(x => x !== e) : [...filters.experienceLevel, e]
    dispatch({ type: 'SET_FILTERS', payload: { experienceLevel: list } })
  }

  const toggleRemote = () => {
    dispatch({ type: 'SET_FILTERS', payload: { remoteOnly: !filters.remoteOnly } })
  }

  const clearAll = () => dispatch({ type: 'RESET_FILTERS' })

  return (
    <aside className={styles.sidebar} aria-label="Filters">
      <h3 className={styles.title}>Filters</h3>
      <section>
        <h4>Job Type</h4>
        {Object.entries(JOB_TYPES).map(([key, label]) => (
          <label key={key} className={styles.checkbox}>
            <input type="checkbox" checked={filters.jobType.includes(key)} onChange={() => toggleJobType(key)} /> {label}
          </label>
        ))}
      </section>
      <section>
        <h4>Experience</h4>
        {Object.entries(EXPERIENCE_LEVELS).map(([key, label]) => (
          <label key={key} className={styles.checkbox}>
            <input type="checkbox" checked={filters.experienceLevel.includes(key)} onChange={() => toggleExperience(key)} /> {label}
          </label>
        ))}
      </section>
      <section>
        <h4>Date Posted</h4>
        <div className={styles.radioGroup}>
          {['any','today','3days','week','month'].map(opt => (
            <label key={opt} className={styles.radioLabel}>
              <input type="radio" name="datePosted" checked={filters.datePosted===opt} onChange={() => dispatch({ type: 'SET_FILTERS', payload: { datePosted: opt } })} /> {opt}
            </label>
          ))}
        </div>
      </section>
      <section>
        <h4>Remote</h4>
        <button aria-label="Remote only" className={styles.toggle} onClick={toggleRemote}>{filters.remoteOnly ? 'On' : 'Off'}</button>
      </section>
      <button className={styles.clear} onClick={clearAll} type="button">Clear All Filters</button>
    </aside>
  )
}
