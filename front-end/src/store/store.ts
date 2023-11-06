import { useSelector as useReduxSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import flowSlice from './flowSlice'

export const store = configureStore({
  reducer: {
    flow: flowSlice
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useSelector = useReduxSelector<RootState>
