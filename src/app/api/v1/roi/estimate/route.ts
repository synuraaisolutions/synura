import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withOptionalAuth, AuthContext, addCORSHeaders, handleCORS } from '@/lib/middleware/auth-middleware'
import { Analytics } from '@/lib/analytics'
import { sendROIResults, sendLeadNotification, sendROILeadNotification } from '@/lib/email'

// Validation schema for ROI calculation
const roiSchema = z.object({
  // Company information
  companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']),
  industry: z.enum(['professional-services', 'healthcare', 'ecommerce', 'manufacturing', 'finance', 'technology', 'education', 'other']),

  // Current state assessment
  employeeCount: z.number().min(1).max(10000),
  averageHourlyRate: z.number().min(10).max(200).default(50), // USD per hour

  // Process information
  manualTaskHours: z.number().min(1).max(168), // Hours per week spent on manual tasks
  errorRate: z.number().min(0).max(100).default(5), // Percentage error rate

  // Areas of interest
  automationAreas: z.array(z.enum([
    'customer-service',
    'lead-management',
    'data-entry',
    'reporting',
    'scheduling',
    'billing',
    'inventory',
    'hr-processes',
    'marketing',
    'accounting'
  ])).min(1),

  // Business goals
  primaryGoal: z.enum(['cost-reduction', 'efficiency', 'accuracy', 'scalability', 'compliance', 'other']),
  timeframe: z.enum(['immediate', '3-months', '6-months', '12-months']).default('6-months'),

  // Optional contact info for follow-up
  email: z.string().email().optional(),
  name: z.string().optional(),
})

type ROIData = z.infer<typeof roiSchema>

// Handle CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return handleCORS()
}

// Main POST handler with authentication and analytics
const postROIHandler = async (request: NextRequest, authContext: AuthContext) => {
  const startTime = Date.now()

  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = roiSchema.parse(body)

    // Calculate ROI estimates
    const estimates = calculateROIEstimates(validatedData)

    // Generate calculation ID for follow-up
    const calculationId = Analytics.generateCalculationId()

    // Log ROI calculation for analytics
    await Analytics.logROI({
      calculationId,
      companySize: validatedData.companySize,
      industry: validatedData.industry,
      employeeCount: validatedData.employeeCount,
      averageHourlyRate: validatedData.averageHourlyRate,
      manualTaskHours: validatedData.manualTaskHours,
      errorRate: validatedData.errorRate,
      automationAreas: validatedData.automationAreas,
      primaryGoal: validatedData.primaryGoal,
      timeframe: validatedData.timeframe,
      estimates,
      recommendations: generateRecommendations(validatedData, estimates),
      confidenceLevel: estimates.confidence,
      email: validatedData.email,
      name: validatedData.name,
      apiKeyId: authContext.apiKeyId,
      ipAddress: request.ip || request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }, request, authContext)

    // If email provided, save for follow-up
    if (validatedData.email) {
      await saveForFollowUp(validatedData, estimates, calculationId)
    }

    const responseData = {
      success: true,
      calculationId,
      estimates,
      recommendations: generateRecommendations(validatedData, estimates),
      nextSteps: getNextSteps(estimates),
    }

    const response = NextResponse.json(responseData)

    // Log API request analytics
    await Analytics.logAPI(request, response, startTime, authContext)

    return addCORSHeaders(response)

  } catch (error) {
    console.error('ROI calculation error:', error)

    let errorResponse
    if (error instanceof z.ZodError) {
      errorResponse = NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 })
    } else {
      errorResponse = NextResponse.json({
        success: false,
        message: 'Failed to calculate ROI estimate',
      }, { status: 500 })
    }

    // Log API request even for errors
    await Analytics.logAPI(request, errorResponse, startTime, authContext)

    return addCORSHeaders(errorResponse)
  }
}

// Export with optional authentication
export const POST = withOptionalAuth(postROIHandler)

// Clean, conservative ROI calculation that delivers realistic 2-4x returns
function calculateROIEstimates(data: ROIData) {
  // 1. Calculate direct time and cost savings (conservative, realistic)
  const timeSavingsPercentage = calculateTimeSavingsPercentage(data.automationAreas, data.industry)
  const weeklySavedHours = data.manualTaskHours * (timeSavingsPercentage / 100)
  const weeklySavedCost = weeklySavedHours * data.averageHourlyRate
  const annualDirectSavings = weeklySavedCost * 52

  // 2. Add modest error reduction benefits (based on actual error rate)
  const errorReductionValue = calculateErrorReductionBenefit(data)

  // 3. Calculate setup investment ONLY (no retainer)
  const setupInvestment = calculateSetupInvestment(data)

  // 4. Total annual benefit (conservative)
  const totalAnnualBenefit = annualDirectSavings + errorReductionValue

  // 5. ROI calculations (proper logic - annual benefits vs setup costs)
  const annualROI = ((totalAnnualBenefit - setupInvestment) / setupInvestment) * 100
  const sixMonthBenefit = totalAnnualBenefit / 2
  const sixMonthROI = ((sixMonthBenefit - setupInvestment) / setupInvestment) * 100
  const paybackMonths = setupInvestment / (totalAnnualBenefit / 12)

  // Calculate possible additional value (distinct from core savings)
  const possibleOpportunityValue = Math.round(annualDirectSavings * 0.20) // 20% of direct savings

  return {
    timeFrame: data.timeframe,

    // Time savings (simple, clear)
    timeSavings: {
      hoursPerWeek: Math.round(weeklySavedHours * 10) / 10,
      hoursPerMonth: Math.round(weeklySavedHours * 4.3 * 10) / 10,
      hoursPerYear: Math.round(weeklySavedHours * 52 * 10) / 10,
      efficiencyGain: `${timeSavingsPercentage}%`,
    },

    // Cost savings (client view - direct savings only)
    costSavings: {
      weekly: Math.round(weeklySavedCost),
      monthly: Math.round(weeklySavedCost * 4.3),
      annual: Math.round(annualDirectSavings),
    },

    // Quality improvements (based on actual error rate)
    qualityImprovements: {
      errorReduction: `${Math.round((errorReductionValue / annualDirectSavings) * 100)}%`,
      annualErrorCostSavings: Math.round(errorReductionValue),
    },

    // Investment required (setup only, no retainer)
    investment: {
      setup: setupInvestment,
      monthly: 0, // No retainer in pricing
      firstYearTotal: setupInvestment,
      range: getSetupRange(data),
    },

    // ROI metrics (realistic 2-4x)
    roi: {
      percentage: Math.round(annualROI * 10) / 10,
      sixMonthROI: Math.round(sixMonthROI * 10) / 10,
      paybackPeriod: `${Math.round(paybackMonths * 10) / 10} months`,
      breakEvenPoint: calculateBreakEvenDate(paybackMonths),
      threeYearValue: Math.round(totalAnnualBenefit * 3 - setupInvestment),
    },

    // Possible additional value (distinct from core savings)
    possibleAdditionalValue: {
      opportunityValue: possibleOpportunityValue,
      description: "Potential additional value when team uses freed time for higher-value work",
      caveat: "Depends on how efficiently freed time is utilized - not guaranteed",
      percentageOfSavings: "20%",
    },

    // Internal metrics (for sales team)
    internal: {
      complexityScore: calculateComplexityScore(data),
      workflowCount: data.automationAreas.length,
      profitMargin: Math.round(((setupInvestment - (setupInvestment * 0.4)) / setupInvestment) * 100),
      tier: getComplexityTier(data.automationAreas.length),
    },

    // Simple value breakdown
    valueBreakdown: {
      directSavings: Math.round(annualDirectSavings),
      errorReduction: Math.round(errorReductionValue),
      totalAnnualValue: Math.round(totalAnnualBenefit),
    },

    // Confidence and assumptions
    confidence: calculateConfidenceLevel(data),
    assumptions: [
      'Conservative estimates based on typical automation implementations',
      'Setup cost only - ongoing retainer discussed separately',
      'Time savings based on proven automation efficiency rates',
      'ROI calculated using first-year benefits vs setup investment',
      'Additional opportunity value requires effective use of freed time'
    ],
  }
}

// Calculate realistic time savings percentage (simple, conservative)
function calculateTimeSavingsPercentage(areas: string[], industry: string): number {
  // Conservative efficiency gains based on proven implementations
  const areaEfficiencies: Record<string, number> = {
    'customer-service': 50,  // Conservative automation estimates
    'lead-management': 60,   // CRM automation, follow-ups
    'data-entry': 70,        // High automation potential for data entry
    'reporting': 65,         // Dashboard automation, scheduled reports
    'scheduling': 70,        // Calendar integration, automated booking
    'billing': 60,           // Invoice automation, payment processing
    'inventory': 55,         // Tracking automation, reorder alerts
    'hr-processes': 45,      // Conservative for HR processes
    'marketing': 50,         // Email automation, social media
    'accounting': 55,        // Expense tracking, reconciliation
  }

  // Simple average efficiency calculation (conservative)
  const averageEfficiency = areas.reduce((sum, area) => sum + (areaEfficiencies[area] || 50), 0) / areas.length

  // Return conservative percentage (no aggressive multipliers)
  return Math.min(Math.round(averageEfficiency), 70) // Cap at 70% for conservatism
}

// Calculate simple error reduction benefit (conservative)
function calculateErrorReductionBenefit(data: ROIData): number {
  // Simple error reduction calculation - only significant if error rate is high
  if (data.errorRate <= 2) return 0 // Very low error rate = minimal savings

  // Conservative error cost calculation
  const annualTaskCost = data.manualTaskHours * data.averageHourlyRate * 52
  const currentErrorCost = annualTaskCost * (data.errorRate / 100) * 1.5 // Conservative 1.5x multiplier

  // Conservative error reduction (50% improvement max)
  const errorReductionPercentage = Math.min(50, data.errorRate * 5)

  return currentErrorCost * (errorReductionPercentage / 100)
}

// Calculate setup investment only (NO retainer) - realistic pricing
function calculateSetupInvestment(data: ROIData): number {
  const workflowCount = data.automationAreas.length

  // Setup pricing based purely on work complexity (no automatic discounts)
  let setupPrice = 0

  // Base price by workflow count
  if (workflowCount <= 2) {
    setupPrice = 1500 // Simple automation setup
  } else if (workflowCount <= 4) {
    setupPrice = 3000 // Medium complexity
  } else {
    setupPrice = 4500 // Higher complexity
  }

  return setupPrice // Pure work-based pricing
}

// Get setup range description for display
function getSetupRange(data: ROIData): string {
  const workflowCount = data.automationAreas.length

  if (workflowCount <= 2) {
    return '$1.5K setup' // Simple automation
  } else if (workflowCount <= 4) {
    return '$3K setup' // Medium complexity
  } else {
    return '$4.5K setup' // Higher complexity
  }
}

// Generate recommendations based on calculation
function generateRecommendations(data: ROIData, estimates: any) {
  const recommendations = []

  // High ROI recommendations
  if (estimates.roi.percentage > 200) {
    recommendations.push({
      type: 'priority',
      title: 'Excellent ROI Potential',
      description: 'Your automation potential shows exceptional returns. We recommend starting immediately with a phased approach.',
    })
  }

  // Time savings focus
  if (estimates.timeSavings.hoursPerWeek > 20) {
    recommendations.push({
      type: 'efficiency',
      title: 'Significant Time Savings',
      description: `Automating ${data.manualTaskHours} hours per week could free up substantial time for strategic work.`,
    })
  }

  // Error reduction focus
  if (data.errorRate > 10) {
    recommendations.push({
      type: 'quality',
      title: 'Quality Improvement Opportunity',
      description: 'Your current error rate suggests significant quality improvements through automation.',
    })
  }

  // Scalability recommendations
  if (['51-200', '201-1000', '1000+'].includes(data.companySize)) {
    recommendations.push({
      type: 'scalability',
      title: 'Scalability Benefits',
      description: 'At your company size, automation provides scalability benefits beyond direct cost savings.',
    })
  }

  return recommendations
}

// Calculate confidence level
function calculateConfidenceLevel(data: ROIData): 'low' | 'medium' | 'high' {
  let confidenceScore = 50

  // Industry familiarity
  if (['professional-services', 'ecommerce', 'technology'].includes(data.industry)) {
    confidenceScore += 15
  }

  // Automation area clarity
  if (data.automationAreas.length >= 2 && data.automationAreas.length <= 4) {
    confidenceScore += 20
  }

  // Reasonable manual task hours
  if (data.manualTaskHours >= 5 && data.manualTaskHours <= 40) {
    confidenceScore += 15
  }

  if (confidenceScore >= 80) return 'high'
  if (confidenceScore >= 60) return 'medium'
  return 'low'
}

// Helper functions
function calculateBreakEvenDate(paybackMonths: number): string {
  const date = new Date()
  date.setMonth(date.getMonth() + Math.ceil(paybackMonths))
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

function getCalculationAssumptions(): string[] {
  return [
    'Conservative estimates based on proven automation implementations',
    'Setup cost only - ongoing retainer discussed separately',
    'Time savings based on realistic automation efficiency rates (50-70%)',
    'ROI calculated using annual benefits vs setup investment only',
    'Error reduction based on actual error rates and conservative improvements',
    'Results may vary based on specific implementation and team adoption',
  ]
}

function getNextSteps(estimates: any): string[] {
  const steps = [
    'Schedule a free consultation to discuss your specific needs',
    'Receive a detailed automation plan tailored to your business',
    'Review implementation timeline and resource requirements',
  ]

  if (estimates.roi.percentage > 150) {
    steps.push('Consider priority implementation for high-impact areas')
  }

  if (estimates.investment.firstYearTotal > 50000) {
    steps.push('Explore phased implementation options to manage investment')
  }

  return steps
}


// Calculate complexity score for pricing (1-10 scale)
function calculateComplexityScore(data: ROIData): number {
  let score = 1

  // Automation areas count (1-4 points)
  const areaCount = data.automationAreas.length
  if (areaCount <= 2) score += 1
  else if (areaCount <= 4) score += 2
  else if (areaCount <= 6) score += 3
  else score += 4

  // Industry complexity (0-2 points)
  const industryComplexity: Record<string, number> = {
    'technology': 2,
    'finance': 2,
    'healthcare': 2,
    'professional-services': 1,
    'ecommerce': 1,
    'manufacturing': 1,
    'education': 0,
    'other': 1,
  }
  score += industryComplexity[data.industry] || 1

  // Company size complexity (0-3 points)
  const sizeComplexity: Record<string, number> = {
    '1-10': 0,
    '11-50': 1,
    '51-200': 2,
    '201-1000': 2,
    '1000+': 3,
  }
  score += sizeComplexity[data.companySize] || 1

  return Math.min(score, 10)
}

// Get complexity tier
function getComplexityTier(areaCount: number): 'low' | 'medium' | 'high' {
  if (areaCount <= 3) return 'low'
  if (areaCount <= 6) return 'medium'
  return 'high'
}

// Get employee count from company size
function getEmployeeCount(companySize: string): number {
  const employeeMap: Record<string, number> = {
    '1-10': 5,
    '11-50': 25,
    '51-200': 100,
    '201-1000': 500,
    '1000+': 2000,
  }
  return employeeMap[companySize] || 25
}


// Save calculation for follow-up
async function saveForFollowUp(data: ROIData, estimates: any, calculationId: string) {
  const followUpData = {
    calculationId,
    contact: {
      email: data.email,
      name: data.name,
    },
    estimates,
    companyProfile: {
      size: data.companySize,
      industry: data.industry,
      automationAreas: data.automationAreas,
      primaryGoal: data.primaryGoal,
    },
    nextAction: 'schedule_consultation',
    timestamp: new Date().toISOString(),
  }

  console.log('ROI calculation saved for follow-up:', followUpData)

  // Send ROI results email to the visitor
  if (data.email) {
    try {
      const roiEmailData = {
        calculationId,
        companySize: data.companySize,
        industry: data.industry,
        employeeCount: data.employeeCount,
        averageHourlyRate: data.averageHourlyRate,
        manualTaskHours: data.manualTaskHours,
        errorRate: data.errorRate,
        automationAreas: data.automationAreas,
        primaryGoal: data.primaryGoal,
        timeframe: data.timeframe,
        estimates,
        recommendations: undefined,
        confidenceLevel: estimates.confidence,
        email: data.email,
        name: data.name,
        apiKeyId: undefined,
        ipAddress: 'roi-calculator',
        userAgent: 'roi-calculator'
      }

      await sendROIResults(roiEmailData, estimates)
      console.log('ROI results email sent successfully')

      // Send enhanced notification to sales team with detailed ROI analysis
      await sendROILeadNotification(roiEmailData, estimates)
      console.log('Enhanced sales team notification sent successfully')

    } catch (error) {
      console.error('Failed to send ROI follow-up emails:', error)
      // Don't throw - email failure shouldn't break the API response
    }
  }

  // TODO: Save to CRM and trigger follow-up sequence
  // TODO: Schedule follow-up reminder
}