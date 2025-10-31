import { NextRequest, NextResponse } from 'next/server'
import { addCORSHeaders, handleCORS } from '@/lib/middleware/auth-middleware'
import { Analytics, AnalyticsDashboard } from '@/lib/analytics'
import { getAPIKeyStats } from '@/lib/auth'

// Validate admin session from cookie or authorization header
function validateAdminSession(request: NextRequest): boolean {
  const validAdminKey = process.env.NEXT_PUBLIC_ADMIN_ACCESS_KEY || 'synura-admin-2024'

  // Check Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    if (token === validAdminKey) return true
  }

  // Check admin-session cookie
  const cookies = request.headers.get('cookie')
  if (cookies) {
    const adminSession = cookies
      .split('; ')
      .find(row => row.startsWith('admin-session='))
      ?.split('=')[1]

    if (adminSession === validAdminKey) return true
  }

  return false
}

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCORS()
}

// GET handler - Dashboard summary data
const getDashboardHandler = async (request: NextRequest) => {
  const startTime = Date.now()

  // Validate admin authentication
  if (!validateAdminSession(request)) {
    return addCORSHeaders(NextResponse.json({
      success: false,
      error: 'Unauthorized',
      message: 'Admin authentication required'
    }, { status: 401 }))
  }

  try {
    // Get last 7 days for recent activity, last 30 days for summaries
    const now = new Date()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    try {
      // Fetch all dashboard data in parallel
      const [
        monthlyUsage,
        weeklyUsage,
        recentActivity,
        keyStats,
      ] = await Promise.all([
        AnalyticsDashboard.getUsageSummary(thirtyDaysAgo, now).catch(() => null),
        AnalyticsDashboard.getUsageSummary(sevenDaysAgo, now).catch(() => null),
        AnalyticsDashboard.getRecentActivity(20).catch(() => ({ apiRequests: [], leads: [] })),
        getAPIKeyStats().catch(() => ({ total: 0, active: 0, inactive: 0, totalUsage: 0, topUsed: [] })),
      ])

      // Calculate growth rates
      const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0
        return Math.round(((current - previous) / previous) * 100)
      }

      // Process database array results into metrics
      const monthlyApiData = Array.isArray(monthlyUsage?.api) && monthlyUsage.api.length > 0 ? monthlyUsage.api[0] : {}
      const weeklyApiData = Array.isArray(weeklyUsage?.api) && weeklyUsage.api.length > 0 ? weeklyUsage.api[0] : {}
      const monthlyLeadsData = Array.isArray(monthlyUsage?.leads) && monthlyUsage.leads.length > 0 ? monthlyUsage.leads[0] : {}
      const weeklyLeadsData = Array.isArray(weeklyUsage?.leads) && weeklyUsage.leads.length > 0 ? weeklyUsage.leads[0] : {}
      const monthlyRoiData = Array.isArray(monthlyUsage?.roi) && monthlyUsage.roi.length > 0 ? monthlyUsage.roi[0] : {}
      const weeklyRoiData = Array.isArray(weeklyUsage?.roi) && weeklyUsage.roi.length > 0 ? weeklyUsage.roi[0] : {}
      const monthlyRecommendationsData = Array.isArray(monthlyUsage?.recommendations) && monthlyUsage.recommendations.length > 0 ? monthlyUsage.recommendations[0] : {}

      // Prepare dashboard metrics
      const metrics = {
        // API Usage Metrics
        totalAPIRequests: monthlyApiData.total_requests || 0,
        weeklyAPIRequests: weeklyApiData.total_requests || 0,
        apiRequestsGrowth: calculateGrowth(
          weeklyApiData.total_requests || 0,
          (monthlyApiData.total_requests || 0) - (weeklyApiData.total_requests || 0)
        ),
        averageResponseTime: weeklyApiData.avg_response_time || 0,
        errorRate: weeklyApiData.error_rate || 0,

        // Lead Metrics
        totalLeads: monthlyLeadsData.total_leads || 0,
        weeklyLeads: weeklyLeadsData.total_leads || 0,
        leadsGrowth: calculateGrowth(
          weeklyLeadsData.total_leads || 0,
          (monthlyLeadsData.total_leads || 0) - (weeklyLeadsData.total_leads || 0)
        ),
        conversionRate: weeklyLeadsData.conversion_rate || 0,

        // ROI Calculator Metrics
        totalROICalculations: monthlyRoiData.calculations_performed || 0,
        weeklyROICalculations: weeklyRoiData.calculations_performed || 0,
        roiCalculationsGrowth: calculateGrowth(
          weeklyRoiData.calculations_performed || 0,
          (monthlyRoiData.calculations_performed || 0) - (weeklyRoiData.calculations_performed || 0)
        ),
        averageROI: weeklyRoiData.average_roi || 0,

        // API Key Metrics
        totalAPIKeys: keyStats.total,
        activeAPIKeys: keyStats.active,
        inactiveAPIKeys: keyStats.inactive,
        totalAPIKeyUsage: keyStats.totalUsage,

        // Service Recommendations
        totalServiceRecommendations: monthlyRecommendationsData.total_recommendations || 0,
      }

      // System health indicators
      const healthStatus = {
        api: metrics.errorRate < 5 ? 'healthy' : metrics.errorRate < 15 ? 'warning' : 'critical',
        responseTime: metrics.averageResponseTime < 500 ? 'healthy' : metrics.averageResponseTime < 1000 ? 'warning' : 'critical',
        usage: metrics.weeklyAPIRequests > 0 ? 'active' : 'inactive',
      }

      // Top performing endpoints (mock data - would come from analytics)
      const topEndpoints = [
        { endpoint: '/api/v1/voice/leads', requests: metrics.weeklyLeads, avgResponseTime: 145 },
        { endpoint: '/api/v1/roi/estimate', requests: metrics.weeklyROICalculations, avgResponseTime: 234 },
        { endpoint: '/api/v1/services', requests: Math.floor(metrics.weeklyAPIRequests * 0.3), avgResponseTime: 98 },
        { endpoint: '/api/v1/faqs', requests: Math.floor(metrics.weeklyAPIRequests * 0.2), avgResponseTime: 67 },
      ].sort((a, b) => b.requests - a.requests).slice(0, 5)

      const responseData = {
        success: true,
        data: {
          overview: {
            metrics,
            health: healthStatus,
            lastUpdated: new Date().toISOString(),
          },
          activity: {
            recentAPIRequests: recentActivity.apiRequests?.slice(0, 10) || [],
            recentLeads: recentActivity.leads?.slice(0, 10) || [],
            topEndpoints,
          },
          keys: {
            stats: keyStats,
            topUsed: keyStats.topUsed?.slice(0, 5) || [],
          },
        },
        metadata: {
          dateRange: {
            monthly: {
              start: thirtyDaysAgo.toISOString(),
              end: now.toISOString(),
            },
            weekly: {
              start: sevenDaysAgo.toISOString(),
              end: now.toISOString(),
            },
          },
          timestamp: new Date().toISOString(),
        },
      }

      const response = NextResponse.json(responseData)
      await Analytics.logAPI(request, response, startTime, { isAuthenticated: true, apiKeyId: 'admin-session' })
      return addCORSHeaders(response)

    } catch (analyticsError) {
      console.error('Analytics error:', analyticsError)

      // Return minimal dashboard with zero values if analytics fail
      const fallbackData = {
        success: true,
        data: {
          overview: {
            metrics: {
              totalAPIRequests: 0,
              weeklyAPIRequests: 0,
              apiRequestsGrowth: 0,
              averageResponseTime: 0,
              errorRate: 0,
              totalLeads: 0,
              weeklyLeads: 0,
              leadsGrowth: 0,
              conversionRate: 0,
              totalROICalculations: 0,
              weeklyROICalculations: 0,
              roiCalculationsGrowth: 0,
              averageROI: 0,
              totalAPIKeys: 0,
              activeAPIKeys: 0,
              inactiveAPIKeys: 0,
              totalAPIKeyUsage: 0,
              totalServiceRecommendations: 0,
            },
            health: { api: 'unknown', responseTime: 'unknown', usage: 'unknown' },
            lastUpdated: new Date().toISOString(),
          },
          activity: { recentAPIRequests: [], recentLeads: [], topEndpoints: [] },
          keys: { stats: { total: 0, active: 0, inactive: 0, totalUsage: 0, topUsed: [] }, topUsed: [] },
        },
        warning: 'Analytics data unavailable - displaying fallback data',
      }

      const response = NextResponse.json(fallbackData)
      await Analytics.logAPI(request, response, startTime, { isAuthenticated: true, apiKeyId: 'admin-session' })
      return addCORSHeaders(response)
    }

  } catch (error) {
    console.error('Dashboard error:', error)

    const errorResponse = NextResponse.json({
      success: false,
      message: 'Failed to load dashboard data',
    }, { status: 500 })

    await Analytics.logAPI(request, errorResponse, startTime, { isAuthenticated: true, apiKeyId: 'admin-session' })
    return addCORSHeaders(errorResponse)
  }
}

// Export handler with admin authentication
export const GET = getDashboardHandler