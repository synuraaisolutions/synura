import { NextRequest, NextResponse } from 'next/server'
import { withAdminAuth, AuthContext, addCORSHeaders, handleCORS } from '@/lib/middleware/auth-middleware'
import { Analytics, AnalyticsDashboard } from '@/lib/analytics'
import { getAPIKeyStats } from '@/lib/auth'

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCORS()
}

// GET handler - Dashboard summary data
const getDashboardHandler = async (request: NextRequest, authContext: AuthContext) => {
  const startTime = Date.now()

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

      // Prepare dashboard metrics
      const metrics = {
        // API Usage Metrics
        totalAPIRequests: monthlyUsage?.api?.totalRequests || 0,
        weeklyAPIRequests: weeklyUsage?.api?.totalRequests || 0,
        apiRequestsGrowth: calculateGrowth(
          weeklyUsage?.api?.totalRequests || 0,
          (monthlyUsage?.api?.totalRequests || 0) - (weeklyUsage?.api?.totalRequests || 0)
        ),
        averageResponseTime: weeklyUsage?.api?.averageResponseTime || 0,
        errorRate: weeklyUsage?.api?.errorRate || 0,

        // Lead Metrics
        totalLeads: monthlyUsage?.leads?.total || 0,
        weeklyLeads: weeklyUsage?.leads?.total || 0,
        leadsGrowth: calculateGrowth(
          weeklyUsage?.leads?.total || 0,
          (monthlyUsage?.leads?.total || 0) - (weeklyUsage?.leads?.total || 0)
        ),
        conversionRate: weeklyUsage?.leads?.conversionRate || 0,

        // ROI Calculator Metrics
        totalROICalculations: monthlyUsage?.roi?.calculationsPerformed || 0,
        weeklyROICalculations: weeklyUsage?.roi?.calculationsPerformed || 0,
        roiCalculationsGrowth: calculateGrowth(
          weeklyUsage?.roi?.calculationsPerformed || 0,
          (monthlyUsage?.roi?.calculationsPerformed || 0) - (weeklyUsage?.roi?.calculationsPerformed || 0)
        ),
        averageROI: weeklyUsage?.roi?.averageROI || 0,

        // API Key Metrics
        totalAPIKeys: keyStats.total,
        activeAPIKeys: keyStats.active,
        inactiveAPIKeys: keyStats.inactive,
        totalAPIKeyUsage: keyStats.totalUsage,

        // Service Recommendations
        totalServiceRecommendations: monthlyUsage?.recommendations?.total || 0,
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
      await Analytics.logAPI(request, response, startTime, authContext)
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
      await Analytics.logAPI(request, response, startTime, authContext)
      return addCORSHeaders(response)
    }

  } catch (error) {
    console.error('Dashboard error:', error)

    const errorResponse = NextResponse.json({
      success: false,
      message: 'Failed to load dashboard data',
    }, { status: 500 })

    await Analytics.logAPI(request, errorResponse, startTime, authContext)
    return addCORSHeaders(errorResponse)
  }
}

// Export handler with admin authentication
export const GET = withAdminAuth(getDashboardHandler)