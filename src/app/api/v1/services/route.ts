import { NextRequest, NextResponse } from 'next/server'
import { allServices } from 'contentlayer/generated'

// GET handler for services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const includeContent = searchParams.get('includeContent') === 'true'
    const includePricing = searchParams.get('includePricing') === 'true'

    // Filter services based on query parameters
    let filteredServices = allServices

    // Filter by category if specified
    if (category) {
      filteredServices = filteredServices.filter(service =>
        service.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Filter by featured status if specified
    if (featured === 'true') {
      filteredServices = filteredServices.filter(service => service.featured)
    } else if (featured === 'false') {
      filteredServices = filteredServices.filter(service => !service.featured)
    }

    // Sort services by title
    filteredServices.sort((a, b) => a.title.localeCompare(b.title))

    // Transform data for API response
    const transformedServices = filteredServices.map(service => ({
      id: service.slug,
      title: service.title,
      description: service.description,
      category: service.category,
      featured: service.featured,
      icon: service.icon,
      benefits: service.benefits || [],
      outcomes: service.outcomes || [],
      url: service.url,
      ...(includeContent && {
        content: service.body.raw,
        htmlContent: service.body.html,
      }),
      lastUpdated: service._raw.sourceFileModified || new Date().toISOString(),
    }))

    // Get pricing data if requested
    let pricingData = null
    if (includePricing && allPricings.length > 0) {
      const pricing = allPricings[0] // Pricing is a singleton
      pricingData = {
        title: pricing.title,
        description: pricing.description,
        content: pricing.body.raw,
        url: pricing.url,
        lastUpdated: pricing._raw.sourceFileModified || new Date().toISOString(),
      }
    }

    // Get available categories for metadata
    const availableCategories = [...new Set(allServices.map(service => service.category))]

    // Response metadata
    const metadata = {
      total: transformedServices.length,
      categories: availableCategories,
      featuredCount: allServices.filter(s => s.featured).length,
      filters: {
        category: category || null,
        featured: featured || null,
        includeContent,
        includePricing,
      },
    }

    return NextResponse.json({
      success: true,
      data: {
        services: transformedServices,
        ...(pricingData && { pricing: pricingData }),
      },
      metadata,
    })

  } catch (error) {
    console.error('Services API error:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve services',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
    }, { status: 500 })
  }
}

// POST handler for service recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      companySize,
      industry,
      challenges = [],
      goals = [],
      budget,
      timeline,
      currentTools = []
    } = body

    // Get service recommendations based on input
    const recommendations = getServiceRecommendations({
      companySize,
      industry,
      challenges,
      goals,
      budget,
      timeline,
      currentTools,
    })

    return NextResponse.json({
      success: true,
      data: recommendations,
      metadata: {
        criteria: {
          companySize,
          industry,
          challenges,
          goals,
          budget,
          timeline,
        },
      },
    })

  } catch (error) {
    console.error('Service recommendation error:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to generate service recommendations',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
    }, { status: 500 })
  }
}

// Generate service recommendations based on criteria
function getServiceRecommendations(criteria: RawRelevanceCriteria) {
  const allServicesData = allServices.map(service => ({
    id: service.slug,
    title: service.title,
    description: service.description,
    category: service.category,
    featured: service.featured,
    benefits: service.benefits || [],
    outcomes: service.outcomes || [],
    url: service.url,
  }))

  // Convert raw criteria to typed criteria
  const typedCriteria = convertToTypedCriteria(criteria)

  // Calculate relevance scores for each service
  const scoredServices = allServicesData.map(service => ({
    ...service,
    relevanceScore: calculateServiceRelevance(service, typedCriteria),
    reasons: getRecommendationReasons(service, criteria),
  }))

  // Sort by relevance score
  scoredServices.sort((a, b) => b.relevanceScore - a.relevanceScore)

  // Group recommendations
  const highlyRecommended = scoredServices.filter(s => s.relevanceScore >= 80)
  const recommended = scoredServices.filter(s => s.relevanceScore >= 60 && s.relevanceScore < 80)
  const considerLater = scoredServices.filter(s => s.relevanceScore >= 40 && s.relevanceScore < 60)

  // Generate implementation roadmap
  const roadmap = generateImplementationRoadmap(highlyRecommended, criteria)

  return {
    highlyRecommended: highlyRecommended.slice(0, 3),
    recommended: recommended.slice(0, 2),
    considerLater: considerLater.slice(0, 2),
    roadmap,
    estimatedBudget: estimateBudgetRange(highlyRecommended, criteria),
    estimatedTimeline: estimateImplementationTime(highlyRecommended, criteria),
  }
}

type ServiceCategory = 'ai-workforce' | 'automation' | 'consulting' | 'managed-ops'
type CompanySize = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'

interface ServiceForRelevance {
  category: ServiceCategory
}

interface RelevanceCriteria {
  companySize?: CompanySize
  industry?: Industry
  challenges: Challenge[]
  goals: string[]
  budget?: string
  timeline?: string
}

interface RawRelevanceCriteria {
  companySize?: string
  industry?: string
  challenges?: string[]
  goals?: string[]
  budget?: string
  timeline?: string
  currentTools?: string[]
}

// Convert raw criteria from request to typed criteria
function convertToTypedCriteria(raw: RawRelevanceCriteria): RelevanceCriteria {
  return {
    companySize: raw.companySize as CompanySize,
    industry: raw.industry as Industry,
    challenges: (raw.challenges as Challenge[]) || [],
    goals: raw.goals || [],
    budget: raw.budget,
    timeline: raw.timeline,
  }
}

// Calculate relevance score for a service based on criteria
function calculateServiceRelevance(service: ServiceForRelevance, criteria: RelevanceCriteria): number {
  let score = 50 // Base score

  // Company size relevance
  if (criteria.companySize) {
    const sizeScores: Record<ServiceCategory, Record<CompanySize, number>> = {
      'ai-workforce': { '1-10': 70, '11-50': 85, '51-200': 90, '201-1000': 95, '1000+': 90 },
      'automation': { '1-10': 60, '11-50': 80, '51-200': 95, '201-1000': 100, '1000+': 100 },
      'consulting': { '1-10': 90, '11-50': 85, '51-200': 80, '201-1000': 75, '1000+': 70 },
      'managed-ops': { '1-10': 40, '11-50': 60, '51-200': 80, '201-1000': 95, '1000+': 100 },
    }
    const categoryScore = sizeScores[service.category]?.[criteria.companySize] || 50
    score = (score + categoryScore) / 2
  }

  // Industry relevance
  if (criteria.industry) {
    const industryBonus = getIndustryServiceBonus(service.category, criteria.industry)
    score += industryBonus
  }

  // Challenge-based scoring
  if (criteria.challenges.length > 0) {
    const challengeScore = calculateChallengeAlignment(service, criteria.challenges)
    score += challengeScore
  }

  // Goal-based scoring
  if (criteria.goals.length > 0) {
    const goalScore = calculateGoalAlignment(service, criteria.goals)
    score += goalScore
  }

  // Budget considerations
  if (criteria.budget) {
    const budgetAlignment = calculateBudgetAlignment(service.category, criteria.budget)
    score *= budgetAlignment
  }

  // Timeline considerations
  if (criteria.timeline) {
    const timelineAlignment = calculateTimelineAlignment(service.category, criteria.timeline)
    score *= timelineAlignment
  }

  return Math.min(Math.max(Math.round(score), 0), 100) // Clamp between 0-100
}

type Industry = 'professional-services' | 'healthcare' | 'ecommerce' | 'manufacturing' | 'finance'

// Helper functions for recommendation scoring
function getIndustryServiceBonus(category: ServiceCategory, industry: Industry): number {
  const industryBonuses: Record<Industry, Record<ServiceCategory, number>> = {
    'professional-services': {
      'ai-workforce': 15,
      'automation': 10,
      'consulting': 20,
      'managed-ops': 5,
    },
    'healthcare': {
      'ai-workforce': 10,
      'automation': 15,
      'consulting': 15,
      'managed-ops': 10,
    },
    'ecommerce': {
      'ai-workforce': 20,
      'automation': 20,
      'consulting': 10,
      'managed-ops': 15,
    },
    'manufacturing': {
      'ai-workforce': 5,
      'automation': 25,
      'consulting': 15,
      'managed-ops': 20,
    },
    'finance': {
      'ai-workforce': 15,
      'automation': 20,
      'consulting': 20,
      'managed-ops': 15,
    },
  }

  return industryBonuses[industry]?.[category] || 0
}

type Challenge = 'manual-tasks' | 'data-entry' | 'customer-service' | 'scaling-issues' | 'quality-control' | 'reporting' | 'integration' | 'strategy'

function calculateChallengeAlignment(service: ServiceForRelevance, challenges: Challenge[]): number {
  const challengeServiceMap: Record<Challenge, ServiceCategory[]> = {
    'manual-tasks': ['ai-workforce', 'automation'],
    'data-entry': ['automation', 'ai-workforce'],
    'customer-service': ['ai-workforce'],
    'scaling-issues': ['automation', 'managed-ops'],
    'quality-control': ['automation'],
    'reporting': ['automation', 'ai-workforce'],
    'integration': ['automation'],
    'strategy': ['consulting'],
  }

  let alignmentScore = 0
  challenges.forEach(challenge => {
    if (challengeServiceMap[challenge]?.includes(service.category)) {
      alignmentScore += 10
    }
  })

  return Math.min(alignmentScore, 30) // Cap at 30 points
}

function calculateGoalAlignment(service: any, goals: string[]): number {
  const goalServiceMap = {
    'cost-reduction': ['automation', 'ai-workforce'],
    'efficiency': ['automation', 'ai-workforce', 'managed-ops'],
    'scalability': ['automation', 'managed-ops'],
    'quality': ['automation'],
    'strategy': ['consulting'],
    'compliance': ['managed-ops', 'automation'],
  }

  let alignmentScore = 0
  goals.forEach(goal => {
    if (goalServiceMap[goal]?.includes(service.category)) {
      alignmentScore += 10
    }
  })

  return Math.min(alignmentScore, 30) // Cap at 30 points
}

function calculateBudgetAlignment(category: string, budget: string): number {
  const budgetMultipliers = {
    'under-5k': {
      'consulting': 1.2,
      'ai-workforce': 0.7,
      'automation': 0.8,
      'managed-ops': 0.5,
    },
    '5k-25k': {
      'consulting': 1.0,
      'ai-workforce': 1.1,
      'automation': 1.2,
      'managed-ops': 0.8,
    },
    '25k-100k': {
      'consulting': 0.9,
      'ai-workforce': 1.2,
      'automation': 1.3,
      'managed-ops': 1.1,
    },
    'over-100k': {
      'consulting': 1.0,
      'ai-workforce': 1.1,
      'automation': 1.2,
      'managed-ops': 1.3,
    },
  }

  return budgetMultipliers[budget]?.[category] || 1.0
}

function calculateTimelineAlignment(category: string, timeline: string): number {
  const timelineMultipliers = {
    'immediate': {
      'consulting': 1.3,
      'ai-workforce': 0.8,
      'automation': 0.7,
      'managed-ops': 0.5,
    },
    '1-3-months': {
      'consulting': 1.1,
      'ai-workforce': 1.2,
      'automation': 1.1,
      'managed-ops': 0.8,
    },
    '3-6-months': {
      'consulting': 1.0,
      'ai-workforce': 1.1,
      'automation': 1.3,
      'managed-ops': 1.1,
    },
    '6-12-months': {
      'consulting': 0.9,
      'ai-workforce': 1.0,
      'automation': 1.2,
      'managed-ops': 1.3,
    },
  }

  return timelineMultipliers[timeline]?.[category] || 1.0
}

function getRecommendationReasons(service: any, criteria: any): string[] {
  const reasons = []

  // Add specific reasons based on service and criteria
  if (service.category === 'ai-workforce' && criteria.challenges?.includes('manual-tasks')) {
    reasons.push('Perfect for eliminating repetitive manual tasks')
  }

  if (service.category === 'automation' && criteria.goals?.includes('efficiency')) {
    reasons.push('Directly addresses efficiency improvement goals')
  }

  if (service.category === 'consulting' && ['1-10', '11-50'].includes(criteria.companySize)) {
    reasons.push('Ideal starting point for smaller organizations')
  }

  if (service.category === 'managed-ops' && criteria.companySize === '1000+') {
    reasons.push('Enterprise-grade operation management')
  }

  return reasons
}

function generateImplementationRoadmap(services: any[], criteria: any) {
  // Generate a basic implementation roadmap
  const phases = []

  if (services.find(s => s.category === 'consulting')) {
    phases.push({
      phase: 1,
      title: 'Strategy & Planning',
      duration: '2-4 weeks',
      services: ['AI Consulting & Strategy'],
      deliverables: ['Automation roadmap', 'ROI projections', 'Implementation plan'],
    })
  }

  if (services.find(s => s.category === 'ai-workforce') || services.find(s => s.category === 'automation')) {
    phases.push({
      phase: phases.length + 1,
      title: 'Core Implementation',
      duration: '4-8 weeks',
      services: services.filter(s => ['ai-workforce', 'automation'].includes(s.category)).map(s => s.title),
      deliverables: ['Automated workflows', 'AI agents', 'System integrations'],
    })
  }

  if (services.find(s => s.category === 'managed-ops')) {
    phases.push({
      phase: phases.length + 1,
      title: 'Optimization & Management',
      duration: 'Ongoing',
      services: ['Managed AI Operations'],
      deliverables: ['24/7 monitoring', 'Performance optimization', 'Scaling support'],
    })
  }

  return phases
}

function estimateBudgetRange(services: any[], criteria: any) {
  // Simple budget estimation logic
  const baseCosts = {
    'consulting': 5000,
    'ai-workforce': 15000,
    'automation': 20000,
    'managed-ops': 5000, // per month
  }

  let totalSetup = 0
  let monthlyOngoing = 0

  services.forEach(service => {
    if (service.category === 'managed-ops') {
      monthlyOngoing += baseCosts[service.category]
    } else {
      totalSetup += baseCosts[service.category] || 0
    }
  })

  return {
    setup: {
      min: Math.round(totalSetup * 0.8),
      max: Math.round(totalSetup * 1.5),
    },
    monthly: {
      min: Math.round(monthlyOngoing * 0.8),
      max: Math.round(monthlyOngoing * 1.3),
    },
  }
}

function estimateImplementationTime(services: any[], criteria: any) {
  const baseDurations = {
    'consulting': 4, // weeks
    'ai-workforce': 8,
    'automation': 12,
    'managed-ops': 2, // setup time
  }

  let totalWeeks = 0
  services.forEach(service => {
    totalWeeks += baseDurations[service.category] || 0
  })

  // Parallel implementation can reduce total time
  const parallelFactor = services.length > 1 ? 0.7 : 1
  totalWeeks = Math.round(totalWeeks * parallelFactor)

  return {
    weeks: totalWeeks,
    months: Math.ceil(totalWeeks / 4),
    description: totalWeeks <= 8 ? 'Quick implementation' : totalWeeks <= 16 ? 'Standard timeline' : 'Extended implementation',
  }
}