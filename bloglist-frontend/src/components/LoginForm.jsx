import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin, setUser } from '../reducers/userReducer'


const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const cleanLoginForm = () => {
    setUsername('')
    setPassword('')
  }

  const handleLogin = (event) => {
    event.preventDefault()
    const newUser = {
      username,
      password
    }
    dispatch(userLogin(newUser))
    cleanLoginForm()
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
      <button id='clear' onClick={() => cleanLoginForm()}>
          clear
      </button>
    </div>
  )
}

export default LoginForm
