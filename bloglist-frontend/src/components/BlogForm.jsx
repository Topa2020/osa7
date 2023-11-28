import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
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
    if (!newBlog.title) {
      dispatch(setNotification('blog title is missing', 'error', 4))
      setNewAuthor('')
      setNewUrl('')
    } else if (!newBlog.url) {
      dispatch(setNotification('blog url is missing', 'error', 4))
      setNewTitle('')
      setNewAuthor('')
    } else {
      dispatch(createBlog(newBlog))

      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
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
