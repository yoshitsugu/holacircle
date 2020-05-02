import { combineReducers } from '@reduxjs/toolkit'
import taskModule from './modules/taskModule'

const rootReducer = combineReducers({
  task: taskModule.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
