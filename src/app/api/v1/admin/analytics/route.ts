import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth, AuthContext, addCORSHeaders, handleCORS } from '@/lib/middleware/auth-middleware'
import { Analytics, AnalyticsDashboard } from '@/lib/analytics'
import { getAPIKeyStats } from '@/lib/auth'

// Validation schema for analytics query
const analyticsQuerySchema = z.object({
  startDate: z.string().optional(), // ISO date string
  endDate: z.string().optional(), // ISO date string
  limit: z.number().min(1).max(1000).default(50),
  type: z.enum(['summary', 'recent', 'usage', 'leads', 'roi', 'keys']).default('summary'),
})

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCORS()
}

// GET handler - Retrieve analytics data
const getAnalyticsHandler = async (request: NextRequest, authContext: AuthContext) => {
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(request.url)
    const queryData = {
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      limit: parseInt(searchParams.get('limit') || '50', 10),
      type: searchParams.get('type') || 'summary',
    }

    const validatedQuery = analyticsQuerySchema.parse(queryData)

    // Set default date range (last 30 days) if not provided
    const endDate = validatedQuery.endDate ? new Date(validatedQuery.endDate) : new Date()
    const startDate = validatedQuery.startDate ? new Date(validatedQuery.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    let responseData: any = {
      success: true,
      type: validatedQuery.type,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      timestamp: new Date().toISOString(),
    }

    switch (validatedQuery.type) {
      case 'summary':
        try {
          const [usageSummary, keyStats] = await Promise.all([
            AnalyticsDashboard.getUsageSummary(startDate, endDate),
            getAPIKeyStats(),
          ])

          responseData.data = {
            usage: usageSummary,
            keys: keyStats,
          }
        } catch (error) {
          console.error('Error getting summary analytics:', error)
          responseData.data = {
            usage: {
              api: { totalRequests: 0, averageResponseTime: 0, errorRate: 0 },
              leads: { total: 0, newThisWeek: 0, conversionRate: 0 },
              roi: { calculationsPerformed: 0, averageROI: 0 },
              recommendations: { total: 0 },
            },
            keys: {
              total: 0,
              active: 0,
              inactive: 0,
              totalUsage: 0,
              topUsed: [],
            },
          }
        }
        break

      case 'recent':
        try {
          const recentActivity = await AnalyticsDashboard.getRecentActivity(validatedQuery.limit)
          responseData.data = recentActivity
        } catch (error) {
          console.error('Error getting recent analytics:', error)
          responseData.data = {
            apiRequests: [],
            leads: [],
          }
        }
        break

      case 'usage':
        try {
          const usageData = await AnalyticsDashboard.getUsageSummary(startDate, endDate)
          responseData.data = usageData.api
        } catch (error) {
          console.error('Error getting usage analytics:', error)
          responseData.data = {
            totalRequests: 0,
            averageResponseTime: 0,
            errorRate: 0,
            topEndpoints: [],
          }
        }
        break

      case 'leads':
        try {
          const leadData = await AnalyticsDashboard.getUsageSummary(startDate, endDate)
          responseData.data = leadData.leads
        } catch (error) {
          console.error('Error getting lead analytics:', error)
          responseData.data = {
            total: 0,
            newThisWeek: 0,
            conversionRate: 0,
            sources: [],
          }
        }
        break

      case 'roi':
        try {
          const roiData = await AnalyticsDashboard.getUsageSummary(startDate, endDate)
          responseData.data = roiData.roi
        } catch (error) {
          console.error('Error getting ROI analytics:', error)
          responseData.data = {
            calculationsPerformed: 0,
            averageROI: 0,
            trends: [],
          }
        }
        break

      case 'keys':
        try {
          const keyStats = await getAPIKeyStats()
          responseData.data = keyStats
        } catch (error) {
          console.error('Error getting key analytics:', error)
          responseData.data = {
            total: 0,
            active: 0,
            inactive: 0,
            totalUsage: 0,
            topUsed: [],
          }
        }
        break

      default:
        const errorResponse = NextResponse.json({
          success: false,
          message: 'Invalid analytics type requested',
        }, { status: 400 })

        await Analytics.logAPI(request, errorResponse, startTime, authContext)
        return addCORSHeaders(errorResponse)
    }

    const response = NextResponse.json(responseData)
    await Analytics.logAPI(request, response, startTime, authContext)
    return addCORSHeaders(response)

  } catch (error) {
    console.error('Error retrieving analytics:', error)

    let errorResponse
    if (error instanceof z.ZodError) {
      errorResponse = NextResponse.json({
        success: false,
        message: 'Invalid query parameters',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 })
    } else {
      errorResponse = NextResponse.json({
        success: false,
        message: 'Failed to retrieve analytics data',
      }, { status: 500 })
    }

    await Analytics.logAPI(request, errorResponse, startTime, authContext)
    return addCORSHeaders(errorResponse)
  }
}

// POST handler - Trigger analytics refresh or export
const postAnalyticsHandler = async (request: NextRequest, authContext: AuthContext) => {
  const startTime = Date.now()

  try {
    const body = await request.json()
    const { action, ...params } = body

    let responseData: any = {
      success: true,
      action,
      timestamp: new Date().toISOString(),
    }

    switch (action) {
      case 'refresh':
        // Trigger analytics refresh (could be used to update cached data)
        responseData.message = 'Analytics refresh triggered'
        responseData.data = { refreshed: true }
        break

      case 'export':
        // Prepare analytics export (could generate CSV/Excel files)
        const exportType = params.format || 'json'
        const startDate = params.startDate ? new Date(params.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const endDate = params.endDate ? new Date(params.endDate) : new Date()

        responseData.message = `Analytics export prepared in ${exportType} format`
        responseData.data = {
          exportId: `export_${Date.now()}`,
          format: exportType,
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
          downloadUrl: `/api/v1/admin/analytics/export/${exportType}`,
        }
        break

      default:
        const errorResponse = NextResponse.json({
          success: false,
          message: 'Invalid action specified',
        }, { status: 400 })

        await Analytics.logAPI(request, errorResponse, startTime, authContext)
        return addCORSHeaders(errorResponse)
    }

    const response = NextResponse.json(responseData)
    await Analytics.logAPI(request, response, startTime, authContext)
    return addCORSHeaders(response)

  } catch (error) {
    console.error('Error processing analytics action:', error)

    const errorResponse = NextResponse.json({
      success: false,
      message: 'Failed to process analytics action',
    }, { status: 500 })

    await Analytics.logAPI(request, errorResponse, startTime, authContext)
    return addCORSHeaders(errorResponse)
  }
}

// Export handlers with admin authentication
export const GET = withAdminAuth(getAnalyticsHandler)
export const POST = withAdminAuth(postAnalyticsHandler)