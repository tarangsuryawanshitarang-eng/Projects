import React, { createContext, useReducer, useCallback, useEffect } from 'react'
import { searchJobs as apiSearch, getJobDetail } from '../services/jobsApi'
import { APP_NAME } from '../utils/constants'
import { filterJobs, searchJobs, sortJobs } from '../utils/filterUtils'
import useDocumentTitle from '../hooks/useDocumentTitle'

export const JobsContext = createContext()

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  searchQuery: '',
  location: '',
  filters: {
    jobType: [],
    experienceLevel: [],
    datePosted: 'any',
    remoteOnly: false
  },
  sort: 'relevance',
  page: 1,
  totalResults: 0,
  hasMore: true
}

const reducer = (state, action) => {
  switch(action.type){
    case 'SET_LOADING': return { ...state, loading: action.payload }
    case 'SET_JOBS': return { ...state, jobs: action.payload.jobs, totalResults: action.payload.total ?? action.payload.jobs.length, hasMore: action.payload.hasMore ?? false, loading: false }
    case 'APPEND_JOBS': return { ...state, jobs: [...state.jobs, ...action.payload.jobs], totalResults: action.payload.total ?? state.totalResults, hasMore: action.payload.hasMore ?? false, loading: false }
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false }
    case 'SET_SEARCH': return { ...state, searchQuery: action.payload, page: 1 }
    case 'SET_LOCATION': return { ...state, location: action.payload, page: 1 }
    case 'SET_FILTERS': return { ...state, filters: { ...state.filters, ...action.payload }, page: 1 }
    case 'RESET_FILTERS': return { ...state, filters: { jobType: [], experienceLevel: [], datePosted: 'any', remoteOnly: false }, page: 1 }
    case 'SET_SORT': return { ...state, sort: action.payload, page: 1 }
    case 'SET_PAGE': return { ...state, page: action.payload }
    case 'SET_HAS_MORE': return { ...state, hasMore: action.payload }
    default: return state
  }
}

export function JobsProvider({ children }){
  const [state, dispatch] = useReducer(reducer, initialState)

  // Update document title on route/page changes
  useDocumentTitle(`${APP_NAME} Jobs`)

  const fetchJobs = useCallback(async (append = false) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try{
      const results = await apiSearch({
        query: state.searchQuery,
        location: state.location,
        page: state.page,
        jobType: state.filters.jobType,
        remoteOnly: state.filters.remoteOnly,
        datePosted: state.filters.datePosted,
        sort: state.sort
      })
      const jobs = Array.isArray(results) ? results : []
      if(append){
        dispatch({ type: 'APPEND_JOBS', payload: { jobs } })
      }else{
        dispatch({ type: 'SET_JOBS', payload: { jobs, total: jobs.length, hasMore: jobs.length >= 10 } })
      }
    }catch(err){
      dispatch({ type: 'SET_ERROR', payload: err.message || 'Error' })
    }
  }, [state.searchQuery, state.location, state.page, state.filters, state.sort])

  // Effect to fetch when state changes (except on initial render?) We'll trigger on changes.
  useEffect(() => {
    fetchJobs(false)
  }, [fetchJobs])

  const setSearch = (q) => dispatch({ type: 'SET_SEARCH', payload: q })
  const setLocation = (loc) => dispatch({ type: 'SET_LOCATION', payload: loc })
  const setFilters = (f) => dispatch({ type: 'SET_FILTERS', payload: f })
  const resetFilters = () => dispatch({ type: 'RESET_FILTERS' })
  const setSort = (s) => dispatch({ type: 'SET_SORT', payload: s })
  const setPage = (p) => dispatch({ type: 'SET_PAGE', payload: p })
  const setHasMore = (v) => dispatch({ type: 'SET_HAS_MORE', payload: v })

  const value = {
    state,
    dispatch,
    fetchJobs,
    setSearch,
    setLocation,
    setFilters,
    resetFilters,
    setSort,
    setPage,
    setHasMore
  }

  return (
    <JobsContext.Provider value={value}>{children}</JobsContext.Provider>
  )
}

export default JobsContext
