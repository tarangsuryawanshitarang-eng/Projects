import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home/Home.jsx'
import JobDetail from './pages/JobDetail/JobDetail.jsx'
import Bookmarks from './pages/Bookmarks/Bookmarks.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { BookmarkProvider } from './context/BookmarkContext.jsx'
import { JobsProvider } from './context/JobsContext.jsx'
import './styles/global.css'

export default function App(){
  return (
    <ThemeProvider>
      <BookmarkProvider>
        <JobsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/job/:jobId" element={<JobDetail />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </JobsProvider>
      </BookmarkProvider>
      </ThemeProvider>
  )
}
