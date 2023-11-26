import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin, setUser } from '../reducers/userReducer'
import { setNotification } from '../reducers/notificationReducer'
import blogService from '../services/blogs'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const cleanLoginForm = () => {
    setUsername('')
    setPassword('')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const newUser = {
        username,
        password
      }

      const user = await dispatch(userLogin(newUser))
      blogService.setToken(user.token)
      dispatch(setNotification('Login successful!', '', 4))
      cleanLoginForm()
    }
    catch (exception) {
      dispatch(setNotification('wrong credentials', 'error', 4))
      cleanLoginForm()
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          username
          <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
