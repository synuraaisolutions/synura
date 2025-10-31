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
    customRequirements: ''
  })

  const [showResults, setShowResults] = useState(false)

  // Complex pricing logic based on multiple factors
  const calculation = useMemo((): CalculationResult => {
    const employees = parseInt(inputs.employeeCount) || 0
    const revenue = parseInt(inputs.monthlyRevenue) || 0
    const processCount = inputs.targetProcesses.length
    const complexityScore = inputs.complexityFactors.length

    // Base package determination
    let packageType = 'Starter'
    let basePrice = 5000
    let monthlyFee = 1200

    if (employees > 100 || revenue > 500000 || processCount > 3) {
      packageType = 'Business'
      basePrice = 15000
      monthlyFee = 2500
    }

    if (employees > 500 || revenue > 2000000 || processCount > 6 || complexityScore > 3) {
      packageType = 'Enterprise'
      basePrice = 35000
      monthlyFee = 5000
    }

    // Complexity adjustments
    const complexityMultiplier = 1 + (complexityScore * 0.15)
    const processMultiplier = 1 + (Math.max(0, processCount - 2) * 0.1)

    const adjustedBasePrice = Math.round(basePrice * complexityMultiplier * processMultiplier)
    const adjustedMonthlyFee = Math.round(monthlyFee * complexityMultiplier)

    // Setup fee calculation
    const setupFee = Math.round(adjustedBasePrice * 0.3)

    // ROI calculations
    const hoursSavedPerMonth = processCount * 40 * employees * 0.1 // Conservative estimate
    const hourlyCost = 35 // Average loaded hourly cost
    const monthlySavings = hoursSavedPerMonth * hourlyCost
    const annualSavings = monthlySavings * 12
    const netAnnualSavings = annualSavings - (adjustedMonthlyFee * 12)

    const paybackMonths = Math.ceil(adjustedBasePrice / monthlySavings)
    const expectedROI = Math.round(((netAnnualSavings / adjustedBasePrice) * 100))

    // Implementation timeline
    let implementationTime = '6-8 weeks'
    if (packageType === 'Business') implementationTime = '8-12 weeks'
    if (packageType === 'Enterprise') implementationTime = '12-16 weeks'
    if (complexityScore > 2) {
      const [min, max] = implementationTime.split('-').map(s => parseInt(s))
      implementationTime = `${min + 2}-${max + 4} weeks`
    }

    // Generate insights
    const insights = [
      `Current automation level suggests ${100 - parseInt(inputs.currentAutomationLevel || '20')}% efficiency opportunity`,
      `Target processes could save approximately ${Math.round(hoursSavedPerMonth)} hours monthly`,
      `Industry benchmarks show ${packageType} package fits ${inputs.industry || 'your industry'} requirements`,
      `${inputs.timelinePreference === 'urgent' ? 'Expedited implementation available with dedicated resources' : 'Standard timeline allows for thorough testing and training'}`
    ]

    // Generate talking points
    const talkingPoints = [
      `"Based on your ${employees} employees, you're looking at ${Math.round(hoursSavedPerMonth)} hours saved monthly"`,
      `"The ${packageType} package typically delivers ${expectedROI}% ROI within the first year"`,
      `"Implementation includes dedicated project management and ${implementationTime} timeline"`,
      `"Monthly savings of $${Math.round(monthlySavings).toLocaleString()} justify the investment quickly"`,
      `"Your industry peers typically see ${paybackMonths < 12 ? 'immediate' : '12-month'} payback periods"`
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

  const handleCalculate = useCallback(() => {
    setShowResults(true)
  }, [])

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
      customRequirements: ''
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