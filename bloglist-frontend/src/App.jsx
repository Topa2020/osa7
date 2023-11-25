import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import { setNotification } from './reducers/notificationReducer'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [info, setInfo] = useState({ message: null })
  const [loginVisible, setLoginVisible] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => {
      setBlogs(initialBlogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const blogFormRef = useRef()

  const cleanLoginForm = () => {
    setUsername('')
    setPassword('')
  }

  const notifyWith = (message, type = 'info') => {
    setInfo({
      message,
      type
    })

    setTimeout(() => {
      setInfo({ message: null })
    }, 4000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      dispatch(setNotification('Login successful!','', 4))
      cleanLoginForm()
    } catch (exception) {
      dispatch(setNotification('wrong credentials','error', 4))
      cleanLoginForm()
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`,'', 4))
    } catch (error) {
      if (!blogObject.title) {
        dispatch(setNotification('blog title is missing','error', 4))
      } else if (!blogObject.url) {
        dispatch(setNotification('blog url is missing', 'error', 4))
      } else {
        dispatch(setNotification(error.message,'error', 4))
      }
    }
  }

  const addLike = async (blogId) => {
    const blogToModify = blogs.find((n) => n.id === blogId)
    const changedBlog = { ...blogToModify, likes: blogToModify.likes + 1 }
    const response = await blogService.update(blogId, changedBlog)
    setBlogs(blogs.map((b) => (b.id !== blogId ? b : response)))
    dispatch(setNotification(`you liked blog: ${blogToModify.title} by ${blogToModify.author}`, '', 4))
  }

  const removeBlog = (id) => {
    const blogToRemove = blogs.find((n) => n.id === id)
    if (window.confirm(`Remove blog ${blogToRemove.title}, by ${blogToRemove.author}`)) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter((blog) => blog.id !== id))
          notifyWith(`Blog ${blogToRemove.title} was removed`)
        })
        .catch((error) => {
          notifyWith(error.message)
        })
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const sortedBlogs = (blogs) => {
    const blogsCopy = [...blogs]
    blogsCopy.sort((a, b) => b.likes - a.likes)
    return blogsCopy
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification info={info} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          <button onClick={() => logout()}>logout</button>
        </div>
      )}
      {user && <div>{blogForm()}</div>}

      {user && (
        <div>
          <h2>Blogs</h2>
          {sortedBlogs(blogs).map((blog) => (
            <Blog key={blog.id} blog={blog} addLike={addLike} removeBlog={removeBlog} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
