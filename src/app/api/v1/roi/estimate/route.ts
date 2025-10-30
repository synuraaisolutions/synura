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

// Enhanced ROI calculation with opportunity cost and productivity gains
function calculateROIEstimates(data: ROIData) {
  // Base calculations
  const weeklyManualCost = data.manualTaskHours * data.averageHourlyRate
  const annualManualCost = weeklyManualCost * 52

  // Automation potential by area (efficiency gains)
  const automationPotential = calculateAutomationPotential(data.automationAreas, data.industry)

  // Direct time savings calculation
  const timeSavingsPercentage = automationPotential.efficiency
  const weeklySavedHours = data.manualTaskHours * (timeSavingsPercentage / 100)
  const weeklySavedCost = weeklySavedHours * data.averageHourlyRate
  const annualDirectSavings = weeklySavedCost * 52

  // Opportunity cost calculation - freed time used for revenue generation
  const opportunityMultiplier = calculateOpportunityMultiplier(data.industry, data.companySize)
  const annualOpportunityCost = weeklySavedHours * 52 * data.averageHourlyRate * opportunityMultiplier

  // Productivity boost calculation - company-wide efficiency gains
  const productivityBoost = calculateProductivityBoost(data)

  // Error reduction benefits
  const errorReductionValue = calculateErrorReductionValue(data)

  // Investment estimates based on complexity scoring
  const investmentEstimate = calculateInvestmentRequired(data)

  // Total value calculation
  const totalAnnualBenefit = annualDirectSavings + annualOpportunityCost + productivityBoost.annualValue + errorReductionValue.annualValue
  const sixMonthBenefit = totalAnnualBenefit / 2
  const roiPercentage = ((totalAnnualBenefit - investmentEstimate.total) / investmentEstimate.total) * 100
  const sixMonthROI = ((sixMonthBenefit - investmentEstimate.total) / investmentEstimate.total) * 100
  const paybackMonths = (investmentEstimate.total / (totalAnnualBenefit / 12))

  return {
    timeFrame: data.timeframe,

    // Time savings
    timeSavings: {
      hoursPerWeek: Math.round(weeklySavedHours * 10) / 10,
      hoursPerMonth: Math.round(weeklySavedHours * 4.3 * 10) / 10,
      hoursPerYear: Math.round(weeklySavedHours * 52 * 10) / 10,
      efficiencyGain: `${timeSavingsPercentage}%`,
    },

    // Enhanced value breakdown
    valueBreakdown: {
      directSavings: Math.round(annualDirectSavings),
      opportunityValue: Math.round(annualOpportunityCost),
      productivityGains: Math.round(productivityBoost.annualValue),
      errorReduction: Math.round(errorReductionValue.annualValue),
      totalAnnualValue: Math.round(totalAnnualBenefit),
    },

    // Cost savings (client view - simplified)
    costSavings: {
      weekly: Math.round(weeklySavedCost),
      monthly: Math.round(weeklySavedCost * 4.3),
      annual: Math.round(annualDirectSavings), // Conservative number for client
    },

    // Quality improvements
    qualityImprovements: {
      errorReduction: `${Math.round(errorReductionValue.reductionPercentage)}%`,
      annualErrorCostSavings: Math.round(errorReductionValue.annualValue),
    },

    // Investment required
    investment: {
      setup: investmentEstimate.setup,
      monthly: investmentEstimate.monthly,
      firstYearTotal: investmentEstimate.total,
      range: investmentEstimate.range,
    },

    // Enhanced ROI metrics
    roi: {
      percentage: Math.round(roiPercentage * 10) / 10,
      sixMonthROI: Math.round(sixMonthROI * 10) / 10,
      paybackPeriod: `${Math.round(paybackMonths * 10) / 10} months`,
      breakEvenPoint: calculateBreakEvenDate(paybackMonths),
      threeYearValue: Math.round((totalAnnualBenefit * 3) - (investmentEstimate.total + (investmentEstimate.monthly * 24))),
    },

    // Opportunity insights
    opportunityInsights: {
      multiplier: opportunityMultiplier,
      description: getOpportunityDescription(data.industry),
      productivityBoost: productivityBoost.percentage,
    },

    // Internal metrics (for sales team)
    internal: {
      complexityScore: calculateComplexityScore(data),
      workflowCount: data.automationAreas.length,
      profitMargin: calculateProfitMargin(investmentEstimate, totalAnnualBenefit),
      tier: getComplexityTier(data.automationAreas.length),
    },

    // Confidence and assumptions
    confidence: calculateConfidenceLevel(data),
    assumptions: getCalculationAssumptions(),
  }
}

// Calculate automation potential based on selected areas and industry
function calculateAutomationPotential(areas: string[], industry: string) {
  // Proven efficiency gains from automation implementations
  const areaEfficiencies: Record<string, number> = {
    'customer-service': 65,  // Chatbots, auto-responses, ticket routing
    'lead-management': 75,   // CRM automation, scoring, follow-ups
    'data-entry': 85,        // OCR, form automation, data validation
    'reporting': 80,         // Dashboard automation, scheduled reports
    'scheduling': 80,        // Calendar integration, automated booking
    'billing': 70,           // Invoice automation, payment processing
    'inventory': 65,         // Tracking automation, reorder alerts
    'hr-processes': 60,      // Onboarding automation, payroll integration
    'marketing': 60,         // Email automation, social media, campaigns
    'accounting': 65,        // Expense tracking, reconciliation, categorization
  }

  // Industry multipliers based on automation readiness and opportunity
  const industryMultipliers: Record<string, number> = {
    'professional-services': 1.25,  // Strong automation potential
    'healthcare': 1.15,             // Good potential despite regulations
    'ecommerce': 1.35,              // Very high automation potential
    'manufacturing': 1.20,          // Good automation opportunities
    'finance': 1.30,                // High automation potential
    'technology': 1.40,             // Highest automation readiness
    'education': 1.10,              // Moderate automation potential
    'other': 1.15,                  // Default with good potential
  }

  const averageEfficiency = areas.reduce((sum, area) => sum + (areaEfficiencies[area] || 65), 0) / areas.length
  const industryAdjusted = averageEfficiency * (industryMultipliers[industry] || 1.15)

  return {
    efficiency: Math.min(Math.round(industryAdjusted), 85), // Increased cap to 85%
    complexity: areas.length > 3 ? 'high' : areas.length > 1 ? 'medium' : 'low',
  }
}

// Calculate error reduction value
function calculateErrorReductionValue(data: ROIData) {
  const errorCostMultiplier = 2.5 // Errors typically cost 2.5x more to fix than prevent
  const currentErrorCost = (data.manualTaskHours * data.averageHourlyRate * 52) * (data.errorRate / 100) * errorCostMultiplier
  const errorReductionPercentage = Math.min(90, data.errorRate * 8) // Automation can reduce errors by up to 90%
  const annualErrorSavings = currentErrorCost * (errorReductionPercentage / 100)

  return {
    reductionPercentage: errorReductionPercentage,
    annualValue: annualErrorSavings,
  }
}

// Calculate investment required based on pricing rubric
function calculateInvestmentRequired(data: ROIData) {
  const complexityScore = calculateComplexityScore(data)
  const tier = getComplexityTier(data.automationAreas.length)

  // Pricing based on internal rubric
  let setupRange, monthlyRange

  if (complexityScore <= 3) { // Low complexity
    setupRange = { min: 2000, max: 4000 }
    monthlyRange = { min: 1500, max: 3000 }
  } else if (complexityScore <= 6) { // Medium complexity
    setupRange = { min: 5000, max: 10000 }
    monthlyRange = { min: 3500, max: 7000 }
  } else { // High complexity
    setupRange = { min: 10000, max: 25000 }
    monthlyRange = { min: 8000, max: 15000 }
  }

  // Calculate specific price within range based on complexity factors
  const setupFactor = (complexityScore - (tier === 'low' ? 1 : tier === 'medium' ? 4 : 7)) / 3
  const setup = Math.round(setupRange.min + (setupRange.max - setupRange.min) * setupFactor)
  const monthly = Math.round(monthlyRange.min + (monthlyRange.max - monthlyRange.min) * setupFactor)

  return {
    setup,
    monthly,
    total: setup + (monthly * 12), // First year total
    range: `$${Math.round(setupRange.min / 1000)}K-$${Math.round(setupRange.max / 1000)}K setup`,
    tier,
    complexityScore,
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
    'Estimates based on industry averages and Synura client data',
    'Assumes dedicated implementation and training period',
    'ROI calculations include setup costs and first year operational costs',
    'Time savings assume 80-90% automation efficiency for selected processes',
    'Error reduction based on typical manual vs. automated process accuracy',
    'Actual results may vary based on specific implementation and adoption',
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

// Calculate opportunity cost multiplier - value when person does higher-value work
function calculateOpportunityMultiplier(industry: string, companySize: string): number {
  const industryMultipliers: Record<string, number> = {
    'professional-services': 3.5, // Billable hour rates much higher
    'technology': 4.0,            // High-value engineering/product work
    'finance': 3.0,               // Investment/advisory work
    'ecommerce': 2.5,             // Revenue-generating activities
    'healthcare': 2.0,            // Patient care vs admin
    'manufacturing': 1.8,         // Production optimization
    'education': 1.5,             // Teaching vs admin
    'other': 2.0,                 // Conservative default
  }

  const sizeMultipliers: Record<string, number> = {
    '1-10': 1.0,     // Limited alternative work
    '11-50': 1.2,    // More opportunities
    '51-200': 1.4,   // Diverse roles available
    '201-1000': 1.6, // Many high-value positions
    '1000+': 1.8,    // Strategic roles available
  }

  return (industryMultipliers[industry] || 2.0) * (sizeMultipliers[companySize] || 1.2)
}

// Calculate productivity boost from automation
function calculateProductivityBoost(data: ROIData) {
  const baseBoost = 0.15 // 15% productivity increase
  const areaBoost = data.automationAreas.length * 0.03 // 3% per automation area
  const totalBoost = Math.min(baseBoost + areaBoost, 0.30) // Cap at 30%

  const annualRevenue = estimateAnnualRevenue(data)
  const annualValue = annualRevenue * totalBoost

  return {
    percentage: Math.round(totalBoost * 100),
    annualValue,
    description: 'Company-wide efficiency gains from automation',
  }
}

// Estimate annual revenue based on company size and hourly rates
function estimateAnnualRevenue(data: ROIData): number {
  const employeeCount = getEmployeeCount(data.companySize)
  const revenuePerEmployee = data.averageHourlyRate * 2000 * 2.5 // Rough revenue multiple
  return employeeCount * revenuePerEmployee
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

// Calculate profit margin for internal use
function calculateProfitMargin(investment: any, totalBenefit: number): number {
  const revenue = investment.total
  const cost = revenue * 0.4 // Assume 40% cost basis
  const profit = revenue - cost
  return Math.round((profit / revenue) * 100)
}

// Get opportunity description by industry
function getOpportunityDescription(industry: string): string {
  const descriptions: Record<string, string> = {
    'professional-services': 'Team can focus on billable client work and business development',
    'technology': 'Engineers can focus on product development and innovation',
    'finance': 'Staff can focus on investment analysis and client advisory work',
    'ecommerce': 'Team can focus on marketing, product, and customer experience',
    'healthcare': 'Staff can focus on patient care and clinical improvements',
    'manufacturing': 'Team can focus on production optimization and quality control',
    'education': 'Staff can focus on teaching and student engagement',
    'other': 'Team can focus on core business activities and growth initiatives',
  }
  return descriptions[industry] || descriptions['other']
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