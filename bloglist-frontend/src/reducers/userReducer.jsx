import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import { setNotification } from '../reducers/notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: '',
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    setLogout(state, action) {
      return action.payload
    }
  }
})

export const userLogin = (content) => {
  return async dispatch => {
    try {
      const user = await loginService.login(content)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      dispatch(setUser(user))
      dispatch(setNotification('login successful', '', 4))
    } catch (error) {
      dispatch(setNotification('wrong credentials', 'error', 4))
    }
  }
}

export const userLogout = () => {
  return async dispatch => {
    dispatch(setLogout(''))
  }
}

export const { setUser, setLogout } = userSlice.actions
export default userSlice.reducer