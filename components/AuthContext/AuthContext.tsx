import { createContext, useContext, useState } from 'react'

const AuthContext = createContext<string>('');
const AuthUpdateContext = createContext<any>('');

export function useAuth() {
  return useContext(AuthContext)
}

export function useUpdateAuth() {
  return useContext(AuthUpdateContext)
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState('')

  function handleAuth(token: string) {
    setAuth(token)
  }

  return (
    <AuthContext.Provider value={auth}>
      <AuthUpdateContext.Provider value={handleAuth}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  )
}

export default AuthProvider
