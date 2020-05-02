import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Circle from "models/Circle";

type State = {
  rootCircle: Circle
}

  // roles: Role[]
  // circles: Circle[]
const initialState: State = {
  rootCircle: {
    name: 'sikmi',
    roles: [
      {
        name: 'Circle Lead',
        members: [
          {
            name: 'kuruma'
          }
        ]
      }
    ],
    circles: [
      {
        name: 'TV Div',
        roles: [
          {
            name: 'Circle Lead',
            members: [
              {
                name: 'kuruma'
              }
            ]
          },
          {
            name: 'Circle Rep',
            members: [
              {
                name: 'kamoc'
              }
            ]
          },
          {
            name: '技術おじさん',
            members: [
              {
                name: 'ynishi'
              }
            ]
          }
        ],
        circles: [
        ]
      }
    ]
  }
}

const circleModule = createSlice({
  name: 'circles',
  initialState,
  reducers: {
  }
})

export const {
} = circleModule.actions

export default circleModule
