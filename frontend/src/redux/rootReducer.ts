import { combineReducers } from '@reduxjs/toolkit';
import focusModule from './modules/focusModule';

const rootReducer = combineReducers({
  focus: focusModule.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
