
import React, { FC, useContext, useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import { Context } from '.'
import { IUsers } from './models/IUser'
import UsersService from './service/UsersService'
import { observer } from 'mobx-react-lite'

const App: FC = () => {
  const { store } = useContext(Context)
  const [users, setUsers] = useState<IUsers[]>([])

  async function fetchUsers() {
    try {
      const response = await UsersService.fetchUsers()
      setUsers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  if (store.isLoading) {
    return <h1>Loading...</h1>
  }

  if (!store.isAuth) {
    return (
      <div>
        <h1>Авторизуйтесь</h1>
        <LoginForm />
        <button onClick={fetchUsers}>Get Users</button>
      </div>
    )
  }


  return (
    <div>
      <h1>{store.user.isActivated ? 'Аккаунт подтвержден' : `Пожалуйста, подтвердите ваш аккаунт по почте ${store.user.email}`}</h1>
      <div>
        <button onClick={() => store.logout()}>Logout</button>
      </div>
      <button onClick={fetchUsers}>Get Users</button>
      {users ? (<ul>
        {users.map(user =>
          <li key={user.email}>
            <span>Email: {user.email} ---- </span>
            <span>Created: {user.created.slice(0, 10)}</span>
          </li>
        )}
      </ul>) : <h2>Пользователей нет</h2>}
    </div>
  )
}


export default observer(App)