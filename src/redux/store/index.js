import { configureStore } from '@reduxjs/toolkit'
import homepageReducer from '../slices/homepageSlice'

const store = configureStore({
  reducer: {
    homepage: homepageReducer,
  },
})

export default store


