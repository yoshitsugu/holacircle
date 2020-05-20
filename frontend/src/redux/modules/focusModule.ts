import { createSlice, createAction, createReducer } from '@reduxjs/toolkit';

type FocusState = {
  focus: number | null;
};

const initialState: FocusState = {
  focus: null,
};

export const SET_FOCUS = 'setFocus';
export const setFocus = createAction<number | null>(SET_FOCUS);
export type CircleAction = typeof SET_FOCUS;

const focusModule = createSlice({
  name: 'focus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setFocus, (_state, action) => {
      return { focus: action.payload };
    });
  },
});

export default focusModule;
