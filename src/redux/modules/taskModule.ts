import { Task } from "models/Task";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type State = {
  count: number
  tasks: Task[]
}

const initialState: State = {
  count: 2,
  tasks: [
    {
      id: 2,
      title: '次のtodo',
      done: false,
    },
    {
      id: 1,
      title: '最初のtodo',
      done: true,
    },
  ],
}

const taskModule = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask(state: State, action: PayloadAction<string>) {
      state.count++

      const enwTask: Task = {
        id: state.count,
        title: action.payload,
        done: false,
      }
      state.tasks = [enwTask, ...state.tasks]
    },
    deleteTask(state: State, action: PayloadAction<number>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload)
    },
  }
})

export const {
  addTask,
  deleteTask,
} = taskModule.actions

export default taskModule
