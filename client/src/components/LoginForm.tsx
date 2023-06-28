import { FC, useContext, useState } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";


const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { store } = useContext(Context)

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' />
      <button onClick={() => store.register(email, password)} type="submit">Регистрация</button>
      <button onClick={() => store.login(email, password)} type="submit">Логин</button>
    </form>
  )
}

export default observer(LoginForm)