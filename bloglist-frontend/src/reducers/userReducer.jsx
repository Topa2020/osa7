import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

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
    const user = await loginService.login(content)
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    dispatch(setUser(user))
  }
}

export const userLogout = () => {
  return async dispatch => {
    dispatch(setLogout(''))
  }
}

export const { setUser, setLogout } = userSlice.actions
export default userSlice.reducer