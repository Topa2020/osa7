import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { like, remove } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const blogStyle = {
  paddingTop: 10,
  background: 'lightgrey',
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const Blog = ({ blog, user }) => {
  const [allInfo, setAllInfo] = useState(false)
  const dispatch = useDispatch()

  const blogs = useSelector(state => state.blogs)

  const addLike = (blogId) => {
    const blogToChange = blogs.find(b => b.id === blogId)
    dispatch(like(blogId))
    dispatch(setNotification(`you liked blog: ${blogToChange.title} by ${blogToChange.author}`, '', 4))
  }

  const removeB = (id) => {
    const blogToRemove = blogs.find((n) => n.id === id)
    if (window.confirm(`Remove blog ${blogToRemove.title}, by ${blogToRemove.author}`)) {
      dispatch(remove(id, blogToRemove.title))
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <p>
        {blog.title}, {blog.author}{' '}
        <span onClick={() => setAllInfo(!allInfo)}>
          <button>{allInfo ? 'hide' : 'view'}</button>
        </span>
      </p>
      {allInfo ? (
        <div>
          <p>{blog.url} </p>
          <p>likes {blog.likes} </p>
          <button id="like-button" onClick={() => addLike(blog.id)}>
            like
          </button>
          <p>{blog.user.name}</p>
          {user.username === blog.user.username && (
            <button onClick={() => removeB(blog.id)}>remove</button>
          )}
        </div>
      ) : null}
    </div>
  )
}

export default Blog
