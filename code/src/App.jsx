import React from 'react'
import Clock from './components/Clock'
import SocialPopover from './components/SocialPopover'
import ProgressBars from './components/ProgressBars'
import SearchBar from './components/SearchBar'
import BookmarkBar from './components/BookmarkBar'
import SettingsPanel from './components/SettingsPanel'

import { Provider } from 'react-redux'
import { store } from './utils/redux/store'

function App() {
  return (
    <Provider store={store}>
      <div className='mx-14'>
        {/* Timer / profile */}
        <div className='flex justify-between mt-14'>
          <Clock />
          <SocialPopover />
        </div>
        <ProgressBars />
        <SearchBar />
        <BookmarkBar />
        <SettingsPanel />
      </div>
    </Provider>
  )
}

export default App