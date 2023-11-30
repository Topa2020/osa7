import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import { initializeBlogs } from './reducers/blogReducer'
import { userLogout, setUser } from './reducers/userReducer'
import blogService from './services/blogs'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from 'react-router-dom'
import Users from './components/Users'

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const dispatch = useDispatch()

  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const blogFormRef = useRef()

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <LoginForm />
        </div>
      </div>
    )
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm blogFormRef={blogFormRef} />
    </Togglable>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(userLogout())
  }

  const sortedBlogs = (blogs) => {
    const blogsCopy = [...blogs]
    blogsCopy.sort((a, b) => b.likes - a.likes)
    return blogsCopy
  }

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding}to="/">blogs</Link>
        <Link style={padding}to="/users">users</Link>
      </div>
      <div>
        <h1>Blogs</h1>
        <Notification />
        {!user && loginForm()}
        {user && (
          <div>
            <p>{user.name} logged in</p>
            <button onClick={() => logout()}>logout</button>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <div>
                  <div>{blogForm()}</div>
                  <div>
                    <h2>Blogs</h2>
                    {sortedBlogs(blogs).map((blog) => (
                      <Blog key={blog.id} blog={blog} user={user} />
                    ))}
                  </div>
                </div>
              ) : (
                <Navigate replace to="/" />
              )
            }
          />

          <Route
            path="/users"
            element={user ? <Users blogs={blogs} user={user} /> : <Navigate replace to="/" />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
