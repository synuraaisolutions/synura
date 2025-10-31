'use client'

import { useState, useCallback, useMemo } from 'react'
import { useAdminAuth } from '@/hooks/useAdminAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Calculator,
  Download,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Lightbulb,
  FileText,
  Target
} from 'lucide-react'

interface CalculationInputs {
  companyName: string
  industry: string
  employeeCount: string
  currentAutomationLevel: string
  targetProcesses: string[]
  monthlyRevenue: string
  timelinePreference: string
  complexityFactors: string[]
  customRequirements: string
  // New realistic inputs
  weeklyHoursOnProcesses: string
  peopleInvolvedInProcesses: string
  averageHourlyRate: string
  currentSoftwareCosts: string
  automationEfficiency: string
}

interface CalculationResult {
  recommendedPackage: string
  basePrice: number
  setupFee: number
  monthlyFee: number
  implementationTime: string
  expectedROI: number
  paybackPeriod: string
  annualSavings: number
  insights: string[]
  talkingPoints: string[]
  riskFactors: string[]
}

const PROCESS_OPTIONS = [
  'Customer Support Automation',
  'Lead Qualification & Scoring',
  'Data Entry & Processing',
  'Report Generation',
  'Email Marketing Automation',
  'Invoice & Payment Processing',
  'Inventory Management',
  'HR & Recruitment Processes',
  'Social Media Management',
  'Quality Control & Monitoring'
]

const COMPLEXITY_FACTORS = [
  'Legacy System Integration',
  'Multiple Department Coordination',
  'Regulatory Compliance Requirements',
  'Custom API Development',
  'Data Migration Needs',
  'Third-party Tool Integration',
  'Advanced Analytics Requirements',
  'Multi-location Implementation'
]

// Industry default hourly rates (loaded cost including benefits)
const getIndustryDefaultRate = (industry: string): number => {
  const rates: Record<string, number> = {
    'technology': 75,
    'healthcare': 65,
    'finance': 85,
    'manufacturing': 55,
    'retail': 35,
    'professional-services': 95,
    'real-estate': 45,
    'other': 50
  }
  return rates[industry] || 50
}

export default function SalesCalculatorPage() {
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth()

  const [inputs, setInputs] = useState<CalculationInputs>({
    companyName: '',
    industry: '',
    employeeCount: '',
    currentAutomationLevel: '',
    targetProcesses: [],
    monthlyRevenue: '',
    timelinePreference: '',
    complexityFactors: [],
    customRequirements: '',
    // New realistic inputs
    weeklyHoursOnProcesses: '',
    peopleInvolvedInProcesses: '',
    averageHourlyRate: '',
    currentSoftwareCosts: '',
    automationEfficiency: '70' // Default to 70%
  })

  const [showResults, setShowResults] = useState(false)

  // Realistic pricing logic based on actual hours and industry rates
  const calculation = useMemo((): CalculationResult => {
    const employees = parseInt(inputs.employeeCount) || 0
    const revenue = parseInt(inputs.monthlyRevenue) || 0
    const processCount = inputs.targetProcesses.length
    const complexityScore = inputs.complexityFactors.length

    // NEW: Realistic hour-based calculations
    const weeklyHours = parseFloat(inputs.weeklyHoursOnProcesses) || 0
    const peopleInvolved = parseInt(inputs.peopleInvolvedInProcesses) || 1
    const hourlyRate = parseFloat(inputs.averageHourlyRate) || getIndustryDefaultRate(inputs.industry)
    const currentSoftwareCosts = parseFloat(inputs.currentSoftwareCosts) || 0
    const automationEfficiency = parseFloat(inputs.automationEfficiency) || 70

    // REALISTIC ROI calculations based on actual hours (calculate savings FIRST)
    const currentWeeklyHours = weeklyHours
    const automationEfficiencyDecimal = automationEfficiency / 100
    const hoursSavedPerWeek = currentWeeklyHours * automationEfficiencyDecimal
    const monthlySavings = (hoursSavedPerWeek * 4.33 * hourlyRate) + (currentSoftwareCosts / 12)
    const annualSavings = monthlySavings * 12

    // Package determination based on SAVINGS POTENTIAL (not current costs)
    // Monthly fee should not exceed 25% of monthly savings per user feedback
    let packageType = 'Starter'
    let basePrice = 3000
    let monthlyFeePercentage = 0.20 // 20% of monthly savings

    // Determine package based on monthly savings and complexity
    if (monthlySavings > 4000 || processCount > 2 || complexityScore > 1) {
      packageType = 'Business'
      basePrice = 6000
      monthlyFeePercentage = 0.22 // 22% of monthly savings for more complex projects
    }

    if (monthlySavings > 10000 || processCount > 4 || complexityScore > 3) {
      packageType = 'Enterprise'
      basePrice = 12000
      monthlyFeePercentage = 0.25 // 25% of monthly savings for enterprise complexity (max cap)
    }

    // Complexity adjustments (reduced impact)
    const complexityMultiplier = 1 + (complexityScore * 0.15)
    const processMultiplier = 1 + (Math.max(0, processCount - 1) * 0.10)

    const adjustedBasePrice = Math.round(basePrice * complexityMultiplier * processMultiplier)

    // CRITICAL FIX: Monthly fee based on savings, not fixed amounts
    const calculatedMonthlyFee = Math.round(monthlySavings * monthlyFeePercentage)

    // Set minimum monthly fees to ensure business viability, but never exceed 60% of savings
    let adjustedMonthlyFee = Math.max(calculatedMonthlyFee,
      packageType === 'Starter' ? 500 :
      packageType === 'Business' ? 800 : 1200)

    // SAFETY CHECK: Never let monthly fee exceed 25% of monthly savings per user feedback
    const maxAllowedFee = Math.floor(monthlySavings * 0.25)
    adjustedMonthlyFee = Math.min(adjustedMonthlyFee, maxAllowedFee)

    // Setup fee (reduced to 15% of base price)
    const setupFee = Math.round(adjustedBasePrice * 0.15)

    // Net savings calculation
    const netAnnualSavings = annualSavings - (adjustedMonthlyFee * 12)

    // Calculate payback period and ROI
    const netMonthlySavings = monthlySavings - adjustedMonthlyFee
    const paybackMonths = netMonthlySavings > 0 ? Math.ceil(adjustedBasePrice / netMonthlySavings) : 999
    const expectedROI = adjustedBasePrice > 0 ? Math.round(((netAnnualSavings / adjustedBasePrice) * 100)) : 0

    // Implementation timeline
    let implementationTime = '6-8 weeks'
    if (packageType === 'Business') implementationTime = '8-12 weeks'
    if (packageType === 'Enterprise') implementationTime = '12-16 weeks'
    if (complexityScore > 2) {
      const [min, max] = implementationTime.split('-').map(s => parseInt(s))
      implementationTime = `${min + 2}-${max + 4} weeks`
    }

    // Generate insights based on actual hours
    const insights = [
      `Current ${Math.round(weeklyHours)} weekly hours spent on processes can be reduced by ${automationEfficiency}%`,
      `Target processes could save approximately ${Math.round(hoursSavedPerWeek * 4.33)} hours monthly`,
      `At $${hourlyRate}/hour, you're spending $${Math.round(totalMonthlyCostToAutomate).toLocaleString()}/month on these processes`,
      `${inputs.industry} industry average rates justify ${packageType} package selection`,
      `${currentSoftwareCosts > 0 ? `Eliminating $${Math.round(currentSoftwareCosts)} in current software costs` : 'No current software costs to eliminate'}`,
      `${inputs.timelinePreference === 'urgent' ? 'Expedited implementation available with dedicated resources' : 'Standard timeline allows for thorough testing and training'}`
    ]

    // Generate realistic talking points
    const talkingPoints = [
      `"Your team spends ${Math.round(weeklyHours)} hours weekly on these processes - we can automate ${automationEfficiency}% of that"`,
      `"At $${hourlyRate}/hour, that's $${Math.round(monthlySavings).toLocaleString()} in monthly savings"`,
      `"The ${packageType} package delivers ${expectedROI}% ROI ${paybackMonths < 12 ? 'in under a year' : `with ${paybackMonths}-month payback`}"`,
      `"Implementation takes ${implementationTime} with dedicated project management"`,
      `"Total investment of $${(adjustedBasePrice + setupFee).toLocaleString()} pays for itself through time savings"`,
      `"Your ${inputs.industry} industry peers typically see similar efficiency gains"`
    ]

    // Risk factors
    const riskFactors = []
    if (complexityScore > 3) riskFactors.push('High complexity may extend timeline')
    if (inputs.currentAutomationLevel === 'high') riskFactors.push('Diminishing returns with existing automation')
    if (paybackMonths > 18) riskFactors.push('Extended payback period requires careful ROI tracking')
    if (inputs.timelinePreference === 'urgent') riskFactors.push('Accelerated timeline may increase costs')

    return {
      recommendedPackage: packageType,
      basePrice: adjustedBasePrice,
      setupFee,
      monthlyFee: adjustedMonthlyFee,
      implementationTime,
      expectedROI,
      paybackPeriod: `${paybackMonths} months`,
      annualSavings: Math.round(annualSavings),
      insights,
      talkingPoints,
      riskFactors
    }
  }, [inputs])

  const handleInputChange = useCallback((field: keyof CalculationInputs, value: string | string[]) => {
    setInputs(prev => ({ ...prev, [field]: value }))
  }, [])

  // Validation function
  const validateInputs = useCallback((): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    // Required fields validation
    if (!inputs.companyName.trim()) errors.push('Company name is required')
    if (!inputs.industry) errors.push('Industry selection is required')
    if (!inputs.employeeCount || parseInt(inputs.employeeCount) < 1) errors.push('Valid employee count is required')
    if (!inputs.weeklyHoursOnProcesses || parseFloat(inputs.weeklyHoursOnProcesses) < 1) errors.push('Weekly hours on processes is required (minimum 1 hour)')
    if (inputs.targetProcesses.length === 0) errors.push('At least one target process must be selected')

    // Economic viability validation
    const weeklyHours = parseFloat(inputs.weeklyHoursOnProcesses) || 0
    const hourlyRate = parseFloat(inputs.averageHourlyRate) || getIndustryDefaultRate(inputs.industry)
    const automationEfficiency = parseFloat(inputs.automationEfficiency) || 70
    const currentSoftwareCosts = parseFloat(inputs.currentSoftwareCosts) || 0

    const hoursSavedPerWeek = weeklyHours * (automationEfficiency / 100)
    const monthlySavings = (hoursSavedPerWeek * 4.33 * hourlyRate) + (currentSoftwareCosts / 12)

    if (monthlySavings < 600) {
      errors.push('Insufficient savings potential. Minimum $600/month in savings required for automation to be cost-effective.')
    }

    return { isValid: errors.length === 0, errors }
  }, [inputs])

  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleCalculate = useCallback(() => {
    const validation = validateInputs()

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      setShowResults(false)
      return
    }

    setValidationErrors([])
    setShowResults(true)
  }, [validateInputs])

  const handleExportPDF = useCallback(async () => {
    // Generate PDF export logic
    const exportData = {
      ...inputs,
      ...calculation,
      generatedAt: new Date().toISOString(),
      generatedBy: 'Synura Sales Team'
    }

    // Create downloadable content
    const content = `
SYNURA AI SOLUTIONS - SALES PROPOSAL
Generated: ${new Date().toLocaleDateString()}

CLIENT INFORMATION:
Company: ${inputs.companyName}
Industry: ${inputs.industry}
Employees: ${inputs.employeeCount}
Monthly Revenue: $${parseInt(inputs.monthlyRevenue || '0').toLocaleString()}

RECOMMENDATION:
Package: ${calculation.recommendedPackage}
Base Price: $${calculation.basePrice.toLocaleString()}
Setup Fee: $${calculation.setupFee.toLocaleString()}
Monthly Fee: $${calculation.monthlyFee.toLocaleString()}
Implementation: ${calculation.implementationTime}

ROI ANALYSIS:
Expected ROI: ${calculation.expectedROI}%
Annual Savings: $${calculation.annualSavings.toLocaleString()}
Payback Period: ${calculation.paybackPeriod}

KEY INSIGHTS:
${calculation.insights.map(insight => `• ${insight}`).join('\n')}

TALKING POINTS:
${calculation.talkingPoints.map(point => `• ${point}`).join('\n')}

RISK CONSIDERATIONS:
${calculation.riskFactors.map(risk => `• ${risk}`).join('\n')}
    `

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `synura-proposal-${inputs.companyName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [inputs, calculation])

  const handleReset = useCallback(() => {
    setInputs({
      companyName: '',
      industry: '',
      employeeCount: '',
      currentAutomationLevel: '',
      targetProcesses: [],
      monthlyRevenue: '',
      timelinePreference: '',
      complexityFactors: [],
      customRequirements: '',
      // Reset new realistic inputs
      weeklyHoursOnProcesses: '',
      peopleInvolvedInProcesses: '',
      averageHourlyRate: '',
      currentSoftwareCosts: '',
      automationEfficiency: '70' // Default to 70%
    })
    setShowResults(false)
  }, [])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading sales calculator...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Calculator className="w-8 h-8 mr-3 text-blue-600" />
              Sales Calculator
            </h1>
            <p className="text-gray-600 mt-1">
              Internal pricing tool for sales team - Data not stored
            </p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={handleReset} variant="outline">
              Reset Form
            </Button>
            {showResults && (
              <Button onClick={handleExportPDF} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export Proposal
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                Collect key details for accurate pricing calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={inputs.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    placeholder="Acme Corporation"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={inputs.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="professional-services">Professional Services</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeCount">Employee Count</Label>
                  <Input
                    id="employeeCount"
                    type="number"
                    value={inputs.employeeCount}
                    onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyRevenue">Monthly Revenue ($)</Label>
                  <Input
                    id="monthlyRevenue"
                    type="number"
                    value={inputs.monthlyRevenue}
                    onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                    placeholder="100000"
                  />
                </div>
              </div>

              {/* Automation Assessment */}
              <div>
                <Label>Current Automation Level</Label>
                <Select value={inputs.currentAutomationLevel} onValueChange={(value) => handleInputChange('currentAutomationLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select current automation level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal (0-20%)</SelectItem>
                    <SelectItem value="basic">Basic (20-40%)</SelectItem>
                    <SelectItem value="moderate">Moderate (40-60%)</SelectItem>
                    <SelectItem value="high">High (60-80%)</SelectItem>
                    <SelectItem value="advanced">Advanced (80%+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Processes */}
              <div>
                <Label>Target Processes for Automation</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {PROCESS_OPTIONS.map((process) => (
                    <label key={process} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={inputs.targetProcesses.includes(process)}
                        onChange={(e) => {
                          const newProcesses = e.target.checked
                            ? [...inputs.targetProcesses, process]
                            : inputs.targetProcesses.filter(p => p !== process)
                          handleInputChange('targetProcesses', newProcesses)
                        }}
                        className="rounded border-gray-300"
                      />
                      <span>{process}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* REALISTIC HOUR-BASED INPUTS */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">⏱️ Time & Cost Analysis</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weeklyHoursOnProcesses">Hours per week spent on target processes</Label>
                    <Input
                      id="weeklyHoursOnProcesses"
                      type="number"
                      step="0.5"
                      value={inputs.weeklyHoursOnProcesses}
                      onChange={(e) => handleInputChange('weeklyHoursOnProcesses', e.target.value)}
                      placeholder="40"
                    />
                    <p className="text-xs text-gray-600 mt-1">Total across all people involved</p>
                  </div>
                  <div>
                    <Label htmlFor="peopleInvolvedInProcesses">Number of people involved</Label>
                    <Input
                      id="peopleInvolvedInProcesses"
                      type="number"
                      value={inputs.peopleInvolvedInProcesses}
                      onChange={(e) => handleInputChange('peopleInvolvedInProcesses', e.target.value)}
                      placeholder="3"
                    />
                    <p className="text-xs text-gray-600 mt-1">Who work on these specific processes</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="averageHourlyRate">Average hourly rate ($ including benefits)</Label>
                    <Input
                      id="averageHourlyRate"
                      type="number"
                      value={inputs.averageHourlyRate}
                      onChange={(e) => handleInputChange('averageHourlyRate', e.target.value)}
                      placeholder={getIndustryDefaultRate(inputs.industry).toString()}
                    />
                    <p className="text-xs text-gray-600 mt-1">Industry default: ${getIndustryDefaultRate(inputs.industry)}/hour</p>
                  </div>
                  <div>
                    <Label htmlFor="currentSoftwareCosts">Current software costs ($ annual)</Label>
                    <Input
                      id="currentSoftwareCosts"
                      type="number"
                      value={inputs.currentSoftwareCosts}
                      onChange={(e) => handleInputChange('currentSoftwareCosts', e.target.value)}
                      placeholder="2400"
                    />
                    <p className="text-xs text-gray-600 mt-1">Software you'd eliminate (optional)</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="automationEfficiency">Expected automation efficiency (%)</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <input
                      type="range"
                      id="automationEfficiency"
                      min="40"
                      max="90"
                      step="5"
                      value={inputs.automationEfficiency}
                      onChange={(e) => handleInputChange('automationEfficiency', e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-lg font-semibold text-blue-600 min-w-[60px]">
                      {inputs.automationEfficiency}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">40% = Some manual oversight needed, 90% = Fully automated</p>
                </div>
              </div>

              {/* Timeline and Complexity */}
              <div>
                <Label>Timeline Preference</Label>
                <Select value={inputs.timelinePreference} onValueChange={(value) => handleInputChange('timelinePreference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible (Cost-optimized)</SelectItem>
                    <SelectItem value="standard">Standard (Balanced)</SelectItem>
                    <SelectItem value="urgent">Urgent (Fast-track)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Complexity Factors */}
              <div>
                <Label>Complexity Factors</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {COMPLEXITY_FACTORS.map((factor) => (
                    <label key={factor} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={inputs.complexityFactors.includes(factor)}
                        onChange={(e) => {
                          const newFactors = e.target.checked
                            ? [...inputs.complexityFactors, factor]
                            : inputs.complexityFactors.filter(f => f !== factor)
                          handleInputChange('complexityFactors', newFactors)
                        }}
                        className="rounded border-gray-300"
                      />
                      <span>{factor}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Requirements */}
              <div>
                <Label htmlFor="customRequirements">Custom Requirements / Notes</Label>
                <Textarea
                  id="customRequirements"
                  value={inputs.customRequirements}
                  onChange={(e) => handleInputChange('customRequirements', e.target.value)}
                  placeholder="Any specific requirements, integrations, or considerations..."
                  rows={3}
                />
              </div>

              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-red-800 font-semibold mb-2">Please fix the following issues:</h4>
                  <ul className="space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-red-700 text-sm flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Pricing & Generate Insights
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {showResults && (
            <div className="space-y-6">
              {/* Pricing Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Pricing Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Recommended Package:</span>
                      <Badge variant="default" className="bg-blue-600">
                        {calculation.recommendedPackage}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Base Price</div>
                        <div className="text-xl font-bold">${calculation.basePrice.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Setup Fee</div>
                        <div className="text-xl font-bold">${calculation.setupFee.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Monthly Fee</div>
                        <div className="text-xl font-bold">${calculation.monthlyFee.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="text-sm text-gray-600">Implementation</div>
                        <div className="text-xl font-bold">{calculation.implementationTime}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ROI Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    ROI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Positive ROI Guarantee */}
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="font-semibold text-green-800">Guaranteed Positive ROI</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      Monthly fees are capped at 25% of your savings, ensuring you keep at least 75% of the value we create.
                      Net monthly savings: <strong>${Math.round((calculation.annualSavings/12) - calculation.monthlyFee).toLocaleString()}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{calculation.expectedROI}%</div>
                      <div className="text-sm text-gray-600">Expected ROI</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{calculation.paybackPeriod}</div>
                      <div className="text-sm text-gray-600">Payback Period</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">${calculation.annualSavings.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Annual Savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sales Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                    Sales Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {calculation.insights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Talking Points */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-orange-600" />
                    Key Talking Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {calculation.talkingPoints.map((point, index) => (
                      <div key={index} className="bg-orange-50 p-3 rounded border-l-4 border-orange-400">
                        <span className="text-sm font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Risk Factors */}
              {calculation.riskFactors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-red-600" />
                      Risk Considerations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {calculation.riskFactors.map((risk, index) => (
                        <div key={index} className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                          <span className="text-sm text-red-800">{risk}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}