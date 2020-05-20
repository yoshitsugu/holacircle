import { combineReducers } from '@reduxjs/toolkit';
import circleModule from './modules/circleModule';
import focusModule from './modules/focusModule';

const rootReducer = combineReducers({
  circle: circleModule.reducer,
  focus: focusModule.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
