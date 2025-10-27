'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Plus,
  Key,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowLeft,
  Calendar,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

interface APIKey {
  id: string
  key_id: string
  name: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
  last_used_at?: string
  usage_count: number
}

interface NewAPIKey {
  keyId: string
  key: string
  name: string
  description?: string
  created: string
}

export default function APIKeysManagement() {
  const [keys, setKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<NewAPIKey | null>(null)
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [formLoading, setFormLoading] = useState(false)

  const fetchAPIKeys = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/v1/admin/keys', {
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_API_KEY', // Would come from auth context
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.success) {
        setKeys(result.data)
      } else {
        throw new Error(result.message || 'Failed to load API keys')
      }
    } catch (err) {
      console.error('API keys fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load API keys')

      // Set demo data for testing
      setKeys([
        {
          id: '1',
          key_id: 'syn_demo_key_1',
          name: 'Production API',
          description: 'Main production API key for external integrations',
          is_active: true,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          last_used_at: '2024-10-26T14:22:00Z',
          usage_count: 1245
        },
        {
          id: '2',
          key_id: 'syn_demo_key_2',
          name: 'Testing Environment',
          description: 'API key for testing and development',
          is_active: true,
          created_at: '2024-02-01T09:15:00Z',
          updated_at: '2024-02-01T09:15:00Z',
          last_used_at: '2024-10-25T16:45:00Z',
          usage_count: 567
        },
        {
          id: '3',
          key_id: 'syn_demo_key_3',
          name: 'Legacy Integration',
          description: 'Deprecated API key for old system',
          is_active: false,
          created_at: '2023-12-10T11:00:00Z',
          updated_at: '2024-03-15T14:30:00Z',
          last_used_at: '2024-03-15T14:30:00Z',
          usage_count: 2340
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAPIKeys()
  }, [])

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setFormLoading(true)

      const response = await fetch('/api/v1/admin/keys', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_API_KEY',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setNewlyCreatedKey(result.data)
        setShowCreateDialog(false)
        setShowNewKeyDialog(true)
        setFormData({ name: '', description: '' })
        fetchAPIKeys() // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to create API key')
      }
    } catch (err) {
      console.error('Create API key error:', err)
      alert(err instanceof Error ? err.message : 'Failed to create API key')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteKey = async (keyId: string, permanent: boolean = false) => {
    try {
      const response = await fetch(`/api/v1/admin/keys${permanent ? '?permanent=true' : ''}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_API_KEY',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyId }),
      })

      const result = await response.json()

      if (result.success) {
        fetchAPIKeys() // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to delete API key')
      }
    } catch (err) {
      console.error('Delete API key error:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete API key')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading API keys...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Keys Management</h1>
              <p className="text-gray-600 mt-1">
                Create and manage API keys for external integrations
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button onClick={fetchAPIKeys} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Create a new API key for external integrations. The key will only be shown once.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateKey} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Production API, Testing Environment"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Optional description of what this key is used for"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={formLoading}>
                      {formLoading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Key className="w-4 h-4 mr-2" />}
                      Create Key
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error} (Showing demo data)</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Keys</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{keys.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Keys</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {keys.filter(key => key.is_active).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(keys.reduce((sum, key) => sum + key.usage_count, 0))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Used</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(Math.max(...keys.map(key => key.usage_count), 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* API Keys List */}
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Manage your API keys and monitor their usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keys.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys found</h3>
                  <p className="text-gray-600 mb-4">Create your first API key to get started.</p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create API Key
                  </Button>
                </div>
              ) : (
                keys.map((key) => (
                  <div key={key.id} className="border rounded-lg p-6 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{key.name}</h3>
                          <Badge variant={key.is_active ? 'default' : 'secondary'}>
                            {key.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>

                        {key.description && (
                          <p className="text-gray-600 mb-3">{key.description}</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">Key ID:</span>
                            <div className="flex items-center mt-1">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                {key.key_id}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(key.key_id)}
                                className="ml-2 h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <span className="font-medium text-gray-500">Usage:</span>
                            <div className="mt-1 font-semibold">
                              {formatNumber(key.usage_count)} requests
                            </div>
                          </div>

                          <div>
                            <span className="font-medium text-gray-500">Created:</span>
                            <div className="mt-1">
                              {formatDate(key.created_at)}
                            </div>
                          </div>

                          <div>
                            <span className="font-medium text-gray-500">Last Used:</span>
                            <div className="mt-1">
                              {key.last_used_at ? formatDate(key.last_used_at) : 'Never'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {key.is_active ? 'Deactivate' : 'Delete'} API Key
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {key.is_active
                                  ? `Are you sure you want to deactivate "${key.name}"? This will stop it from working but preserve the record.`
                                  : `Are you sure you want to permanently delete "${key.name}"? This action cannot be undone.`
                                }
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteKey(key.key_id, !key.is_active)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {key.is_active ? 'Deactivate' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* New Key Created Dialog */}
        <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                API Key Created Successfully
              </DialogTitle>
              <DialogDescription>
                Your API key has been created. <strong>This is the only time it will be shown.</strong> Please copy and store it securely.
              </DialogDescription>
            </DialogHeader>
            {newlyCreatedKey && (
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <div className="mt-1 font-semibold">{newlyCreatedKey.name}</div>
                </div>
                <div>
                  <Label>API Key</Label>
                  <div className="flex items-center mt-1">
                    <code className="flex-1 text-xs bg-gray-100 p-3 rounded font-mono break-all">
                      {newlyCreatedKey.key}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(newlyCreatedKey.key)}
                      className="ml-2"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <strong>Important:</strong> Save this API key now. For security reasons, it won't be shown again.
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    copyToClipboard(newlyCreatedKey.key)
                    setShowNewKeyDialog(false)
                    setNewlyCreatedKey(null)
                  }}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Key and Close
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}