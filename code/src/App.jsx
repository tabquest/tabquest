import React from 'react'
import Clock from './components/Clock'
import SocialPopover from './components/SocialPopover'
import ProgressBars from './components/ProgressBars'
import Weather from './components/Weather'

function App() {
  return (
    <div className='mx-14'>
      {/* Timer / profile */}
      <div className='flex justify-between mt-14'>
        <Clock />
        <SocialPopover/>
      </div>
      <ProgressBars/>
    </div>
  )
}

export default App