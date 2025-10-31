'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminAuthState {
  isAuthenticated: boolean
  isLoading: boolean
}

export function useAdminAuth(): AdminAuthState {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isLoading: true
  })
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      // Check for admin session cookie
      const adminSession = document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-session='))
        ?.split('=')[1]

      // Check for admin access key header (for API calls)
      const validAdminKey = 'synura-admin-2024' // This should match your middleware

      const isAuthenticated = adminSession === validAdminKey

      if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        router.push('/admin/login')
        return
      }

      setAuthState({
        isAuthenticated: true,
        isLoading: false
      })
    }

    checkAuth()
  }, [router])

  return authState
}

export default useAdminAuth