import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notification(state, action) {
      const content = action.payload
      return content
    }
  }
})

export const setNotification = (content, type, time) => {
  return async dispatch => {
    const notification1 = {
      'content': content,
      'type': type
    }
    dispatch(notification(notification1))
    setTimeout(() => {
      dispatch(notification(''))
    }, 1000 * time)
  }
}

export const { notification } = notificationSlice.actions
export default notificationSlice.reducer