import React from 'react'
import Clock from './components/Clock'
import SocialPopover from './components/SocialPopover'
import ProgressBars from './components/ProgressBars'
import SearchBar from './components/SearchBar'
import BookmarkBar from './components/BookmarkBar'
import IntegratedSearch from './components/IntegratedSearch'

function App() {
  return (
    <div className='mx-14'>
      {/* Timer / profile */}
      <div className='flex justify-between mt-14'>
        <Clock />
        <SocialPopover/>
      </div>
      <ProgressBars/>
      <SearchBar/>
      {/* <IntegratedSearch/> */}
      <BookmarkBar/>
    </div>
  )
}

export default App