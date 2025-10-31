'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'

export default function AdminLogin() {
  const [accessKey, setAccessKey] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Set admin session cookie
      document.cookie = `admin-session=${accessKey}; path=/; max-age=86400; secure; samesite=strict`

      // Redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch (error) {
      setError('Authentication failed. Please check your access key.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <Card>
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>
              Enter your admin access key to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="accessKey" className="block text-sm font-medium text-secondary-700 mb-2">
                  Access Key
                </label>
                <input
                  type="password"
                  id="accessKey"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter admin access key"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                variant="cta"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-secondary-600">
                Contact system administrator if you need access
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}