import { combineReducers } from '@reduxjs/toolkit'
import circleModule from './modules/circleModule'

const rootReducer = combineReducers({
  circle: circleModule.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
