import { configureStore } from '@reduxjs/toolkit'
import homepageReducer from '../slices/homepageSlice'
import authReducer from '../slices/authSlice'

const store = configureStore({
  reducer: {
    homepage: homepageReducer,
    auth: authReducer,
  },
})

export default store


