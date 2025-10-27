import { NextRequest } from 'next/server'
import {
  analyticsDB,
  leadsDB,
  roiDB,
  serviceRecommendationsDB,
  ApiAnalytics,
  Lead,
  ROICalculation,
  ServiceRecommendation
} from './database'
import { AuthContext } from './middleware/auth-middleware'

/**
 * Analytics Logging System
 * Comprehensive tracking for API usage, leads, calculations, and recommendations
 */

// Types for analytics data
export interface APIRequestLog {
  endpoint: string
  method: string
  statusCode: number
  responseTimeMs?: number
  apiKeyId?: string
  ipAddress?: string
  userAgent?: string
  referer?: string
  requestSize?: number
  responseSize?: number
}

export interface LeadCaptureLog {
  leadId: string
  name: string
  email: string
  company?: string
  phone?: string
  intent: string
  message?: string
  source: string
  utmSource?: string
  utmCampaign?: string
  utmMedium?: string
  utmContent?: string
  utmTerm?: string
  ipAddress?: string
  userAgent?: string
  referer?: string
  apiKeyId?: string
  status: string
}

export interface ROICalculationLog {
  calculationId: string
  companySize?: string
  industry?: string
  employeeCount?: number
  averageHourlyRate?: number
  manualTaskHours?: number
  errorRate?: number
  automationAreas?: any
  primaryGoal?: string
  timeframe?: string
  estimates?: any
  recommendations?: any
  confidenceLevel?: string
  email?: string
  name?: string
  apiKeyId?: string
  ipAddress?: string
  userAgent?: string
}

export interface ServiceRecommendationLog {
  recommendationId: string
  companySize?: string
  industry?: string
  challenges?: any
  goals?: any
  budget?: string
  timeline?: string
  currentTools?: any
  recommendations?: any
  roadmap?: any
  estimatedBudget?: any
  estimatedTimeline?: any
  apiKeyId?: string
  ipAddress?: string
  userAgent?: string
}

/**
 * Extract common request metadata
 */
export function extractRequestMetadata(request: NextRequest, authContext?: AuthContext) {
  return {
    ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    referer: request.headers.get('referer') || null,
    apiKeyId: authContext?.apiKeyId || null
  }
}

/**
 * Extract UTM parameters from request URL
 */
export function extractUTMParameters(request: NextRequest) {
  const url = new URL(request.url)
  return {
    utmSource: url.searchParams.get('utm_source') || undefined,
    utmCampaign: url.searchParams.get('utm_campaign') || undefined,
    utmMedium: url.searchParams.get('utm_medium') || undefined,
    utmContent: url.searchParams.get('utm_content') || undefined,
    utmTerm: url.searchParams.get('utm_term') || undefined
  }
}

/**
 * Calculate request/response sizes
 */
export function calculateRequestSize(request: NextRequest): number {
  try {
    const headers = JSON.stringify(Object.fromEntries(request.headers.entries()))
    const contentLength = request.headers.get('content-length')
    const bodySize = contentLength ? parseInt(contentLength, 10) : 0
    return headers.length + bodySize
  } catch {
    return 0
  }
}

export function calculateResponseSize(response: any): number {
  try {
    if (typeof response === 'string') {
      return new Blob([response]).size
    }
    if (typeof response === 'object') {
      return new Blob([JSON.stringify(response)]).size
    }
    return 0
  } catch {
    return 0
  }
}

/**
 * Log API request analytics
 */
export async function logAPIRequest(
  request: NextRequest,
  response: any,
  startTime: number,
  authContext?: AuthContext
): Promise<void> {
  try {
    const endTime = Date.now()
    const responseTime = endTime - startTime
    const metadata = extractRequestMetadata(request, authContext)
    const url = new URL(request.url)

    const logData: Omit<ApiAnalytics, 'id' | 'created_at'> = {
      endpoint: url.pathname,
      method: request.method,
      status_code: response.status || 200,
      response_time_ms: responseTime,
      api_key_id: metadata.apiKeyId || undefined,
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent,
      referer: metadata.referer || undefined,
      request_size: calculateRequestSize(request),
      response_size: calculateResponseSize(response)
    }

    await analyticsDB.log(logData)
  } catch (error) {
    console.error('Error logging API request:', error)
    // Don't throw - logging failures shouldn't break the API
  }
}

/**
 * Log lead capture
 */
export async function logLeadCapture(
  leadData: LeadCaptureLog,
  request: NextRequest,
  authContext?: AuthContext
): Promise<string> {
  try {
    const metadata = extractRequestMetadata(request, authContext)
    const utmParams = extractUTMParameters(request)

    const lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'> = {
      lead_id: leadData.leadId,
      name: leadData.name,
      email: leadData.email,
      company: leadData.company,
      phone: leadData.phone,
      intent: leadData.intent,
      message: leadData.message,
      source: leadData.source,
      utm_source: leadData.utmSource || utmParams.utmSource,
      utm_campaign: leadData.utmCampaign || utmParams.utmCampaign,
      utm_medium: leadData.utmMedium || utmParams.utmMedium,
      utm_content: leadData.utmContent || utmParams.utmContent,
      utm_term: leadData.utmTerm || utmParams.utmTerm,
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent,
      referer: metadata.referer || undefined,
      api_key_id: metadata.apiKeyId || undefined,
      status: leadData.status
    }

    const savedLead = await leadsDB.create(lead)
    return savedLead.lead_id
  } catch (error) {
    console.error('Error logging lead capture:', error)
    throw error
  }
}

/**
 * Log ROI calculation
 */
export async function logROICalculation(
  calculationData: ROICalculationLog,
  request: NextRequest,
  authContext?: AuthContext
): Promise<string> {
  try {
    const metadata = extractRequestMetadata(request, authContext)

    const calculation: Omit<ROICalculation, 'id' | 'created_at'> = {
      calculation_id: calculationData.calculationId,
      company_size: calculationData.companySize,
      industry: calculationData.industry,
      employee_count: calculationData.employeeCount,
      average_hourly_rate: calculationData.averageHourlyRate,
      manual_task_hours: calculationData.manualTaskHours,
      error_rate: calculationData.errorRate,
      automation_areas: calculationData.automationAreas,
      primary_goal: calculationData.primaryGoal,
      timeframe: calculationData.timeframe,
      estimates: calculationData.estimates,
      recommendations: calculationData.recommendations,
      confidence_level: calculationData.confidenceLevel,
      email: calculationData.email,
      name: calculationData.name,
      api_key_id: metadata.apiKeyId || undefined,
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent
    }

    const savedCalculation = await roiDB.create(calculation)
    return savedCalculation.calculation_id
  } catch (error) {
    console.error('Error logging ROI calculation:', error)
    throw error
  }
}

/**
 * Log service recommendation
 */
export async function logServiceRecommendation(
  recommendationData: ServiceRecommendationLog,
  request: NextRequest,
  authContext?: AuthContext
): Promise<string> {
  try {
    const metadata = extractRequestMetadata(request, authContext)

    const recommendation: Omit<ServiceRecommendation, 'id' | 'created_at'> = {
      recommendation_id: recommendationData.recommendationId,
      company_size: recommendationData.companySize,
      industry: recommendationData.industry,
      challenges: recommendationData.challenges,
      goals: recommendationData.goals,
      budget: recommendationData.budget,
      timeline: recommendationData.timeline,
      current_tools: recommendationData.currentTools,
      recommendations: recommendationData.recommendations,
      roadmap: recommendationData.roadmap,
      estimated_budget: recommendationData.estimatedBudget,
      estimated_timeline: recommendationData.estimatedTimeline,
      api_key_id: metadata.apiKeyId || undefined,
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent
    }

    const savedRecommendation = await serviceRecommendationsDB.create(recommendation)
    return savedRecommendation.recommendation_id
  } catch (error) {
    console.error('Error logging service recommendation:', error)
    throw error
  }
}

/**
 * Performance monitoring decorator
 * Automatically logs API requests when applied to route handlers
 */
export function withAnalytics<T extends any[], R>(
  handler: (...args: T) => Promise<R>,
  endpointName?: string
) {
  return async function analyticsWrapper(...args: T): Promise<R> {
    const startTime = Date.now()
    let result: R | undefined
    let error: Error | null = null

    try {
      result = await handler(...args)
      return result
    } catch (err) {
      error = err as Error
      throw err
    } finally {
      // Log the request (you might need to extract request from args)
      if (typeof args[0] === 'object' && 'url' in args[0]) {
        const request = args[0] as NextRequest
        const authContext = args.length > 1 ? args[1] as AuthContext : undefined

        // Create a mock response object for logging
        const mockResponse = {
          status: error ? 500 : 200,
          data: error ? { error: error.message } : (result || null)
        }

        await logAPIRequest(request, mockResponse, startTime, authContext)
      }
    }
  }
}

/**
 * Generate unique IDs for tracking
 */
export function generateTrackingId(prefix: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `${prefix}_${timestamp}_${random}`
}

/**
 * Analytics helper functions
 */
export const Analytics = {
  // Generate tracking IDs
  generateLeadId: () => generateTrackingId('lead'),
  generateCalculationId: () => generateTrackingId('roi'),
  generateRecommendationId: () => generateTrackingId('rec'),

  // Log specific events
  async logLead(data: LeadCaptureLog, request: NextRequest, authContext?: AuthContext) {
    return logLeadCapture(data, request, authContext)
  },

  async logROI(data: ROICalculationLog, request: NextRequest, authContext?: AuthContext) {
    return logROICalculation(data, request, authContext)
  },

  async logRecommendation(data: ServiceRecommendationLog, request: NextRequest, authContext?: AuthContext) {
    return logServiceRecommendation(data, request, authContext)
  },

  async logAPI(request: NextRequest, response: any, startTime: number, authContext?: AuthContext) {
    return logAPIRequest(request, response, startTime, authContext)
  },

  // Extract common data
  extractMetadata: extractRequestMetadata,
  extractUTM: extractUTMParameters,

  // Performance monitoring
  withTracking: withAnalytics,

  // Utility functions
  calculateRequestSize,
  calculateResponseSize
}

/**
 * Analytics Dashboard Data Aggregation
 */
export const AnalyticsDashboard = {
  async getUsageSummary(startDate: Date, endDate: Date) {
    try {
      const [apiSummary, leadSummary, roiTrends, servicePatternsPromises] = await Promise.all([
        analyticsDB.getSummary(startDate, endDate),
        leadsDB.getSummary(startDate, endDate),
        roiDB.getTrends(startDate, endDate),
        serviceRecommendationsDB.getPatterns(startDate, endDate)
      ])

      return {
        api: apiSummary,
        leads: leadSummary,
        roi: roiTrends,
        recommendations: servicePatternsPromises,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      }
    } catch (error) {
      console.error('Error getting analytics summary:', error)
      throw error
    }
  },

  async getRecentActivity(limit: number = 50) {
    try {
      const [recentAPI, recentLeads] = await Promise.all([
        analyticsDB.getRecent(limit),
        leadsDB.getAll(0, limit)
      ])

      return {
        apiRequests: recentAPI,
        leads: recentLeads
      }
    } catch (error) {
      console.error('Error getting recent activity:', error)
      throw error
    }
  }
}