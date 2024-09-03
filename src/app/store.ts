import { configureStore  } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice'
import canvasReducer from '../features/canvas/canvasSlice'

// Assuming `ignoredPaths` is defined as an array of strings:
const ignoredPaths: string[] = ['canvas.editor'];

export default configureStore({
  reducer: {
    user : userReducer,
    canvas : canvasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredPaths },
    }),
})