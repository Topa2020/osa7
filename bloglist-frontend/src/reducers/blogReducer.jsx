import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlog(state, action) {
      return action.payload
    },
    updateBlog(state, action) {
      const id = action.payload.id
      const object = action.payload
      return state.map((blog) => (blog.id !== id ? blog : object))
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload)
    }
  }
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlog(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(content)
      dispatch(appendBlog(newBlog))
      dispatch(setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, '', 4))
    } catch (error) {
      dispatch(setNotification(error.message, 'error', 4))
    }
  }
}

export const like = (id) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    const blogToChange = blogs.find((b) => b.id === id)
    const changedBlog = {
      ...blogToChange,
      likes: blogToChange.likes + 1
    }
    const updatedBlog = await blogService.update(id, changedBlog)
    dispatch(updateBlog(updatedBlog))
  }
}

export const remove = (id, title) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id)
      dispatch(removeBlog(id))
      dispatch(setNotification(`blog '${title}' was removed`, '', 4))
    } catch (error) {
      dispatch(setNotification(error.message, 'error', 4))
    }
  }
}

export const { appendBlog, setBlog, removeBlog, updateBlog } = blogSlice.actions
export default blogSlice.reducer
