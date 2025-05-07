"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface AuthContextType {
  userId: string | null
  orgId: string | null
  role: string | null
  user: any
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  orgId: null,
  role: null,
  user: null,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession()
  const [auth, setAuth] = useState<AuthContextType>({ userId: null, orgId: null, role: null, user: null })

  useEffect(() => {
    if (session?.user) {
      const user = session.user as any
      setAuth({
        userId: user.id,
        orgId: user.organizationId,
        role: user.role,
        user,
      })
    }
  }, [session])

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext) 