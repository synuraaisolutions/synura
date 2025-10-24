import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

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
  primaryGoal: z.enum(['cost-reduction', 'efficiency', 'accuracy', 'scalability', 'compliance']),
  timeframe: z.enum(['immediate', '3-months', '6-months', '12-months']).default('6-months'),

  // Optional contact info for follow-up
  email: z.string().email().optional(),
  name: z.string().optional(),
})

type ROIData = z.infer<typeof roiSchema>

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = roiSchema.parse(body)

    // Calculate ROI estimates
    const estimates = calculateROIEstimates(validatedData)

    // Generate calculation ID for follow-up
    const calculationId = `roi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Log calculation for analytics
    console.log('ROI calculation performed:', {
      calculationId,
      input: validatedData,
      estimates,
      timestamp: new Date().toISOString(),
    })

    // If email provided, save for follow-up
    if (validatedData.email) {
      await saveForFollowUp(validatedData, estimates, calculationId)
    }

    return NextResponse.json({
      success: true,
      calculationId,
      estimates,
      recommendations: generateRecommendations(validatedData, estimates),
      nextSteps: getNextSteps(estimates),
    })

  } catch (error) {
    console.error('ROI calculation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to calculate ROI estimate',
    }, { status: 500 })
  }
}

// Main ROI calculation function
function calculateROIEstimates(data: ROIData) {
  // Base calculations
  const weeklyManualCost = data.manualTaskHours * data.averageHourlyRate
  const annualManualCost = weeklyManualCost * 52

  // Automation potential by area (efficiency gains)
  const automationPotential = calculateAutomationPotential(data.automationAreas, data.industry)

  // Time savings calculation
  const timeSavingsPercentage = automationPotential.efficiency
  const weeklySavedHours = data.manualTaskHours * (timeSavingsPercentage / 100)
  const weeklySavedCost = weeklySavedHours * data.averageHourlyRate
  const annualSavedCost = weeklySavedCost * 52

  // Error reduction benefits
  const errorReductionValue = calculateErrorReductionValue(data)

  // Investment estimates based on scope
  const investmentEstimate = calculateInvestmentRequired(data)

  // ROI calculation
  const totalAnnualBenefit = annualSavedCost + errorReductionValue.annualValue
  const roiPercentage = ((totalAnnualBenefit - investmentEstimate.total) / investmentEstimate.total) * 100
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

    // Cost savings
    costSavings: {
      weekly: Math.round(weeklySavedCost),
      monthly: Math.round(weeklySavedCost * 4.3),
      annual: Math.round(annualSavedCost),
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
    },

    // ROI metrics
    roi: {
      percentage: Math.round(roiPercentage * 10) / 10,
      paybackPeriod: `${Math.round(paybackMonths * 10) / 10} months`,
      breakEvenPoint: calculateBreakEvenDate(paybackMonths),
      threeYearValue: Math.round((totalAnnualBenefit * 3) - (investmentEstimate.total + (investmentEstimate.monthly * 24))),
    },

    // Confidence and assumptions
    confidence: calculateConfidenceLevel(data),
    assumptions: getCalculationAssumptions(),
  }
}

// Calculate automation potential based on selected areas and industry
function calculateAutomationPotential(areas: string[], industry: string) {
  const areaEfficiencies: Record<string, number> = {
    'customer-service': 60,
    'lead-management': 70,
    'data-entry': 80,
    'reporting': 75,
    'scheduling': 85,
    'billing': 70,
    'inventory': 65,
    'hr-processes': 60,
    'marketing': 55,
    'accounting': 70,
  }

  const industryMultipliers: Record<string, number> = {
    'professional-services': 1.2,
    'healthcare': 1.0,
    'ecommerce': 1.3,
    'manufacturing': 1.1,
    'finance': 1.15,
    'technology': 1.25,
    'education': 0.9,
    'other': 1.0,
  }

  const averageEfficiency = areas.reduce((sum, area) => sum + (areaEfficiencies[area] || 50), 0) / areas.length
  const industryAdjusted = averageEfficiency * (industryMultipliers[industry] || 1.0)

  return {
    efficiency: Math.min(Math.round(industryAdjusted), 85), // Cap at 85% efficiency gain
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

// Calculate investment required
function calculateInvestmentRequired(data: ROIData) {
  const complexityMultipliers = {
    '1-10': 0.7,
    '11-50': 1.0,
    '51-200': 1.3,
    '201-1000': 1.6,
    '1000+': 2.0,
  }

  const areaComplexity = data.automationAreas.length
  const baseSetup = 3000 + (areaComplexity * 1500) // Base cost per automation area
  const setupCost = baseSetup * (complexityMultipliers[data.companySize] || 1.0)

  const baseMonthlyCost = Math.max(500, areaComplexity * 400) // Minimum $500/month
  const monthlyCost = baseMonthlyCost * (complexityMultipliers[data.companySize] || 1.0)

  return {
    setup: Math.round(setupCost),
    monthly: Math.round(monthlyCost),
    total: Math.round(setupCost + (monthlyCost * 12)), // First year total
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

  // TODO: Save to CRM and trigger follow-up sequence
  console.log('ROI calculation saved for follow-up:', followUpData)

  // TODO: Send ROI report email
  // TODO: Schedule follow-up reminder
}