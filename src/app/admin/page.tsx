'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Activity,
  Users,
  Key,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Calendar,
  BarChart3,
  Database
} from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  overview: {
    metrics: {
      totalAPIRequests: number
      weeklyAPIRequests: number
      apiRequestsGrowth: number
      averageResponseTime: number
      errorRate: number
      totalLeads: number
      weeklyLeads: number
      leadsGrowth: number
      conversionRate: number
      totalROICalculations: number
      weeklyROICalculations: number
      roiCalculationsGrowth: number
      averageROI: number
      totalAPIKeys: number
      activeAPIKeys: number
      inactiveAPIKeys: number
      totalAPIKeyUsage: number
      totalServiceRecommendations: number
    }
    health: {
      api: 'healthy' | 'warning' | 'critical' | 'unknown'
      responseTime: 'healthy' | 'warning' | 'critical' | 'unknown'
      usage: 'active' | 'inactive' | 'unknown'
    }
    lastUpdated: string
  }
  activity: {
    recentAPIRequests: any[]
    recentLeads: any[]
    topEndpoints: Array<{
      endpoint: string
      requests: number
      avgResponseTime: number
    }>
  }
  keys: {
    stats: {
      total: number
      active: number
      inactive: number
      totalUsage: number
      topUsed: Array<{
        name: string
        usage_count: number
        last_used_at: string
      }>
    }
    topUsed: any[]
  }
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Note: In a real application, you would need to authenticate first
      // This is a demo implementation
      const response = await fetch('/api/v1/admin/dashboard', {
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
        setData(result.data)
        setLastRefresh(new Date())
      } else {
        throw new Error(result.message || 'Failed to load dashboard data')
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load dashboard')

      // Set fallback data for demo purposes
      setData({
        overview: {
          metrics: {
            totalAPIRequests: 1234,
            weeklyAPIRequests: 156,
            apiRequestsGrowth: 23,
            averageResponseTime: 145,
            errorRate: 2.1,
            totalLeads: 89,
            weeklyLeads: 12,
            leadsGrowth: 15,
            conversionRate: 68.5,
            totalROICalculations: 45,
            weeklyROICalculations: 8,
            roiCalculationsGrowth: 33,
            averageROI: 285,
            totalAPIKeys: 5,
            activeAPIKeys: 4,
            inactiveAPIKeys: 1,
            totalAPIKeyUsage: 2456,
            totalServiceRecommendations: 23
          },
          health: {
            api: 'healthy',
            responseTime: 'healthy',
            usage: 'active'
          },
          lastUpdated: new Date().toISOString()
        },
        activity: {
          recentAPIRequests: [],
          recentLeads: [],
          topEndpoints: [
            { endpoint: '/api/v1/voice/leads', requests: 45, avgResponseTime: 145 },
            { endpoint: '/api/v1/roi/estimate', requests: 23, avgResponseTime: 234 },
            { endpoint: '/api/v1/services', requests: 67, avgResponseTime: 98 },
          ]
        },
        keys: {
          stats: {
            total: 5,
            active: 4,
            inactive: 1,
            totalUsage: 2456,
            topUsed: []
          },
          topUsed: []
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Healthy</Badge>
      case 'warning':
        return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Warning</Badge>
      case 'critical':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Critical</Badge>
      default:
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Unknown</Badge>
    }
  }

  const formatGrowth = (growth: number) => {
    const isPositive = growth > 0
    return (
      <span className={isPositive ? 'text-green-600' : 'text-red-600'}>
        {isPositive ? '+' : ''}{growth}%
      </span>
    )
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const formatTime = (ms: number) => {
    return `${ms}ms`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading dashboard...</span>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={fetchDashboardData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link href="/admin/keys">
              <Button variant="outline">
                <Key className="w-4 h-4 mr-2" />
                Manage API Keys
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </Link>
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

        {data && (
          <>
            {/* System Health Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Status</span>
                    {getHealthBadge(data.overview.health.api)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Response Time</span>
                    {getHealthBadge(data.overview.health.responseTime)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Usage Status</span>
                    <Badge variant={data.overview.health.usage === 'active' ? 'default' : 'secondary'}>
                      {data.overview.health.usage === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* API Requests */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(data.overview.metrics.weeklyAPIRequests)}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatGrowth(data.overview.metrics.apiRequestsGrowth)} from last week
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total: {formatNumber(data.overview.metrics.totalAPIRequests)}
                  </p>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatTime(data.overview.metrics.averageResponseTime)}</div>
                  <p className="text-xs text-muted-foreground">
                    Error rate: {data.overview.metrics.errorRate}%
                  </p>
                </CardContent>
              </Card>

              {/* Leads */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(data.overview.metrics.weeklyLeads)}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatGrowth(data.overview.metrics.leadsGrowth)} from last week
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Conversion: {data.overview.metrics.conversionRate}%
                  </p>
                </CardContent>
              </Card>

              {/* ROI Calculations */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ROI Calculations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatNumber(data.overview.metrics.weeklyROICalculations)}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatGrowth(data.overview.metrics.roiCalculationsGrowth)} from last week
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg ROI: {data.overview.metrics.averageROI}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* API Keys and Top Endpoints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Keys Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="w-5 h-5 mr-2" />
                    API Keys Overview
                  </CardTitle>
                  <CardDescription>
                    Manage and monitor API key usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {data.keys.stats.active}
                        </div>
                        <div className="text-sm text-muted-foreground">Active Keys</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-600">
                          {data.keys.stats.inactive}
                        </div>
                        <div className="text-sm text-muted-foreground">Inactive Keys</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {formatNumber(data.keys.stats.totalUsage)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total API Calls</div>
                    </div>
                    <Link href="/admin/keys">
                      <Button variant="outline" className="w-full">
                        Manage API Keys
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Top Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Top API Endpoints
                  </CardTitle>
                  <CardDescription>
                    Most frequently used endpoints this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.activity.topEndpoints.map((endpoint, index) => (
                      <div key={endpoint.endpoint} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {endpoint.endpoint}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatTime(endpoint.avgResponseTime)} avg response
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {formatNumber(endpoint.requests)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            requests
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/admin/keys">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <Key className="w-6 h-6 mb-2" />
                      Create API Key
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button variant="outline" className="w-full h-20 flex flex-col">
                      <BarChart3 className="w-6 h-6 mb-2" />
                      View Analytics
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full h-20 flex flex-col" onClick={fetchDashboardData}>
                    <RefreshCw className="w-6 h-6 mb-2" />
                    Refresh Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}