'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Calendar,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  BarChart3,
  PieChart,
  Clock,
  Target
} from 'lucide-react'
import Link from 'next/link'

interface AnalyticsData {
  type: string
  dateRange: {
    start: string
    end: string
  }
  data: any
  timestamp: string
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState('summary')
  const [dateRange, setDateRange] = useState('30d')

  const fetchAnalytics = async (type: string = selectedType) => {
    try {
      setLoading(true)
      setError(null)

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
        default:
          startDate.setDate(endDate.getDate() - 30)
      }

      const params = new URLSearchParams({
        type,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: '100'
      })

      const response = await fetch(`/api/v1/admin/analytics?${params}`, {
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
        setData(result)
      } else {
        throw new Error(result.message || 'Failed to load analytics data')
      }
    } catch (err) {
      console.error('Analytics fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load analytics')

      // Set demo data for testing
      setData({
        type: selectedType,
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString()
        },
        data: getDemoData(selectedType),
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const getDemoData = (type: string) => {
    switch (type) {
      case 'summary':
        return {
          usage: {
            api: {
              totalRequests: 2456,
              averageResponseTime: 145,
              errorRate: 2.1,
              topEndpoints: [
                { endpoint: '/api/v1/voice/leads', requests: 567, avgResponseTime: 134 },
                { endpoint: '/api/v1/roi/estimate', requests: 234, avgResponseTime: 178 },
                { endpoint: '/api/v1/services', requests: 456, avgResponseTime: 89 },
              ]
            },
            leads: {
              total: 89,
              newThisWeek: 12,
              conversionRate: 68.5,
              sources: [
                { source: 'website', count: 45 },
                { source: 'retell', count: 23 },
                { source: 'referral', count: 21 }
              ]
            },
            roi: {
              calculationsPerformed: 45,
              averageROI: 285,
              trends: [
                { date: '2024-10-20', calculations: 8 },
                { date: '2024-10-21', calculations: 12 },
                { date: '2024-10-22', calculations: 6 },
                { date: '2024-10-23', calculations: 15 },
                { date: '2024-10-24', calculations: 4 }
              ]
            },
            recommendations: { total: 34 }
          },
          keys: {
            total: 5,
            active: 4,
            inactive: 1,
            totalUsage: 2456,
            topUsed: [
              { name: 'Production API', usage_count: 1245, last_used_at: '2024-10-26T14:22:00Z' },
              { name: 'Testing Environment', usage_count: 567, last_used_at: '2024-10-25T16:45:00Z' }
            ]
          }
        }
      case 'usage':
        return {
          totalRequests: 2456,
          averageResponseTime: 145,
          errorRate: 2.1,
          topEndpoints: [
            { endpoint: '/api/v1/voice/leads', requests: 567, avgResponseTime: 134 },
            { endpoint: '/api/v1/roi/estimate', requests: 234, avgResponseTime: 178 },
            { endpoint: '/api/v1/services', requests: 456, avgResponseTime: 89 },
            { endpoint: '/api/v1/faqs', requests: 234, avgResponseTime: 67 },
            { endpoint: '/api/v1/voice/meetings', requests: 123, avgResponseTime: 145 }
          ],
          hourlyUsage: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            requests: Math.floor(Math.random() * 100) + 20
          }))
        }
      case 'leads':
        return {
          total: 89,
          newThisWeek: 12,
          conversionRate: 68.5,
          sources: [
            { source: 'website', count: 45, percentage: 50.6 },
            { source: 'retell', count: 23, percentage: 25.8 },
            { source: 'referral', count: 21, percentage: 23.6 }
          ],
          intents: [
            { intent: 'consultation', count: 34 },
            { intent: 'demo', count: 28 },
            { intent: 'info', count: 19 },
            { intent: 'pricing', count: 8 }
          ]
        }
      case 'roi':
        return {
          calculationsPerformed: 45,
          averageROI: 285,
          trends: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            calculations: Math.floor(Math.random() * 5) + 1,
            avgROI: Math.floor(Math.random() * 200) + 150
          })),
          industries: [
            { industry: 'technology', calculations: 15, avgROI: 320 },
            { industry: 'professional-services', calculations: 12, avgROI: 285 },
            { industry: 'ecommerce', calculations: 8, avgROI: 245 },
            { industry: 'manufacturing', calculations: 6, avgROI: 190 },
            { industry: 'healthcare', calculations: 4, avgROI: 175 }
          ]
        }
      default:
        return {}
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [selectedType, dateRange])

  const handleExport = async () => {
    try {
      const response = await fetch('/api/v1/admin/analytics', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer YOUR_ADMIN_API_KEY',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'export',
          format: 'csv',
          type: selectedType,
          startDate: data?.dateRange.start,
          endDate: data?.dateRange.end
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert(`Export prepared: ${result.data.exportId}`)
      }
    } catch (err) {
      console.error('Export error:', err)
      alert('Export functionality would be implemented here')
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const formatPercent = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const renderTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="w-4 h-4 text-green-500" />
    } else if (current < previous) {
      return <TrendingDown className="w-4 h-4 text-red-500" />
    }
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading analytics...</span>
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
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-1">
                Detailed insights and performance metrics
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="usage">API Usage</SelectItem>
                <SelectItem value="leads">Leads</SelectItem>
                <SelectItem value="roi">ROI Calculator</SelectItem>
                <SelectItem value="keys">API Keys</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => fetchAnalytics()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-800">
                <Activity className="w-5 h-5 mr-2" />
                <span>{error} (Showing demo data)</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Date Range Info */}
        {data && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {formatDate(data.dateRange.start)} - {formatDate(data.dateRange.end)}
                  </span>
                  <Badge variant="secondary">{selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}</Badge>
                </div>
                <span className="text-xs text-gray-500">
                  Last updated: {new Date(data.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Content */}
        {data && (
          <div className="space-y-6">
            {selectedType === 'summary' && data.data.usage && (
              <>
                {/* Summary Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total API Requests</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(data.data.usage.api.totalRequests)}</div>
                      <p className="text-xs text-muted-foreground">
                        Avg response: {data.data.usage.api.averageResponseTime}ms
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(data.data.usage.leads.total)}</div>
                      <p className="text-xs text-muted-foreground">
                        {formatPercent(data.data.usage.leads.conversionRate)} conversion rate
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">ROI Calculations</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(data.data.usage.roi.calculationsPerformed)}</div>
                      <p className="text-xs text-muted-foreground">
                        Avg ROI: {formatPercent(data.data.usage.roi.averageROI)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatPercent(data.data.usage.api.errorRate)}</div>
                      <p className="text-xs text-muted-foreground">
                        API health status
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Endpoints and Lead Sources */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Top API Endpoints
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.data.usage.api.topEndpoints.map((endpoint: any, index: number) => (
                          <div key={endpoint.endpoint} className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {endpoint.endpoint}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {endpoint.avgResponseTime}ms avg
                              </div>
                            </div>
                            <div className="text-sm font-bold">
                              {formatNumber(endpoint.requests)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PieChart className="w-5 h-5 mr-2" />
                        Lead Sources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {data.data.usage.leads.sources.map((source: any, index: number) => (
                          <div key={source.source} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-3 ${
                                index === 0 ? 'bg-blue-500' :
                                index === 1 ? 'bg-green-500' : 'bg-yellow-500'
                              }`} />
                              <span className="text-sm font-medium capitalize">
                                {source.source}
                              </span>
                            </div>
                            <div className="text-sm font-bold">
                              {formatNumber(source.count)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {selectedType === 'usage' && (
              <>
                {/* API Usage Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(data.data.totalRequests)}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{data.data.averageResponseTime}ms</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatPercent(data.data.errorRate)}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Endpoints */}
                <Card>
                  <CardHeader>
                    <CardTitle>Endpoint Performance</CardTitle>
                    <CardDescription>
                      Request volume and response times by endpoint
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.data.topEndpoints.map((endpoint: any, index: number) => (
                        <div key={endpoint.endpoint} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {endpoint.endpoint}
                            </code>
                            <Badge variant="outline">
                              {formatNumber(endpoint.requests)} requests
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Avg Response Time: {endpoint.avgResponseTime}ms</span>
                            <span>Performance: {endpoint.avgResponseTime < 200 ? 'Excellent' : endpoint.avgResponseTime < 500 ? 'Good' : 'Needs Attention'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Add similar sections for other analytics types */}
            {selectedType === 'leads' && data.data.sources && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Sources</CardTitle>
                    <CardDescription>Where your leads are coming from</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.data.sources.map((source: any, index: number) => (
                        <div key={source.source} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded mr-3 ${
                              index === 0 ? 'bg-blue-500' :
                              index === 1 ? 'bg-green-500' : 'bg-yellow-500'
                            }`} />
                            <span className="font-medium capitalize">{source.source}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{formatNumber(source.count)}</div>
                            <div className="text-sm text-gray-500">{formatPercent(source.percentage)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lead Intents</CardTitle>
                    <CardDescription>What leads are interested in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.data.intents.map((intent: any) => (
                        <div key={intent.intent} className="flex items-center justify-between">
                          <span className="font-medium capitalize">{intent.intent}</span>
                          <Badge variant="outline">{formatNumber(intent.count)}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}