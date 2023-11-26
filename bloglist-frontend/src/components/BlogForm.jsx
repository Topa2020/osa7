import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import Togglable from './Togglable'
import { setNotification } from '../reducers/notificationReducer'

const BlogForm = ({ blogFormRef }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const dispatch = useDispatch()

  const addBlog = async (event) => {
    blogFormRef.current.toggleVisibility()
    event.preventDefault()

    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    try {
      dispatch(createBlog(newBlog))
      dispatch(setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, '', 4))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch (error) {
      if (!newBlog.title) {
        dispatch(setNotification('blog title is missing', 'error', 4))
      } else if (!newBlog.url) {
        dispatch(setNotification('blog url is missing', 'error', 4))
      } else {
        dispatch(setNotification(error.message, 'error', 4))
      }
    }
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            id="title-input"
          />
        </div>
        <div>
          author:
          <input
            value={newAuthor}
            onChange={(event) => setNewAuthor(event.target.value)}
            id="author-input"
          />
        </div>
        <div>
          url:
          <input
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            id="url-input"
          />
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  )
}
export default BlogForm
