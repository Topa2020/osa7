import React, { useState, useEffect } from 'react'
import userService from '../services/users'

const Users = ({ blogs, user }) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const getUsers = async () => {
      try {
        const userData = await userService.getAll()
        setUsers(userData)
      } catch (error) {
        console.error(error)
      }
    }
    getUsers()
  }, [])

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map((user) => (
            <tr key={user.name}>
              <td>{user.name}</td>
              <td>{blogs.filter((blog) => blog.user.name === user.name).length} </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Users
