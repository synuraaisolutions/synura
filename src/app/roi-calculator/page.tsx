'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/button'
import { ConsultationButton } from '@/components/common/consultation-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'

export default function ROICalculatorPage() {
  const [formData, setFormData] = useState({
    companySize: '',
    industry: '',
    averageHourlyRate: '',
    manualTaskHours: '',
    automationAreas: [] as string[],
    primaryGoal: '',
    email: '',
    name: '',
  })

  const [results, setResults] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calculationError, setCalculationError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        automationAreas: [...formData.automationAreas, value]
      })
    } else {
      setFormData({
        ...formData,
        automationAreas: formData.automationAreas.filter(area => area !== value)
      })
    }
  }

  const calculateROI = async () => {
    setIsCalculating(true)
    setCalculationError(null)

    try {
      // Derive employee count from company size
      const employeeCountMap: Record<string, number> = {
        '1-10': 5,
        '11-50': 25,
        '51-200': 100,
        '201-1000': 500,
        '1000+': 2000
      }

      // Prepare API payload
      const payload = {
        companySize: formData.companySize,
        industry: formData.industry,
        employeeCount: employeeCountMap[formData.companySize] || 25,
        averageHourlyRate: parseFloat(formData.averageHourlyRate) || 50,
        manualTaskHours: parseFloat(formData.manualTaskHours) || 1,
        automationAreas: formData.automationAreas.length > 0 ? formData.automationAreas : ['data-entry'],
        primaryGoal: formData.primaryGoal || 'efficiency',
        email: formData.email || undefined,
        name: formData.name || undefined,
      }

      // Call API
      const response = await fetch('/api/v1/roi/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to calculate ROI')
      }

      const data = await response.json()

      if (data.success) {
        setResults(data.estimates)

        // Show success message if email was provided
        if (formData.email) {
          setCalculationError('✅ Results calculated! Check your email for a detailed report.')
        }
      } else {
        throw new Error(data.message || 'Calculation failed')
      }

    } catch (error) {
      console.error('ROI calculation error:', error)
      setCalculationError('Failed to calculate ROI. Please try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateROI()
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(10, 35, 66, 0.8), rgba(10, 35, 66, 0.6)), url('/images/professional/Synura_AI_Default.jpg')"
        }}
      >
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              AI Automation ROI Calculator
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Discover how much time and money AI automation could save your business.
              Get instant estimates based on your specific situation.
            </p>
            <p className="text-lg text-accent-200">
              <strong>Average client ROI: 2-3x within the first 6 months</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Calculator Form */}
              <Card className="border-primary-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-secondary-900">
                    Tell Us About Your Business
                  </CardTitle>
                  <CardDescription>
                    Provide some basic information to get your personalized ROI estimate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="companySize" className="block text-sm font-medium text-secondary-900 mb-2">
                        Company Size
                      </label>
                      <select
                        id="companySize"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select company size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-secondary-900 mb-2">
                        Industry
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select your industry</option>
                        <option value="professional-services">Professional Services</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="finance">Finance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>


                    <div>
                      <label htmlFor="averageHourlyRate" className="block text-sm font-medium text-secondary-900 mb-2">
                        Average Employee Hourly Cost (USD)
                      </label>
                      <input
                        type="number"
                        id="averageHourlyRate"
                        name="averageHourlyRate"
                        value={formData.averageHourlyRate}
                        onChange={handleInputChange}
                        placeholder="e.g., 50"
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                      <p className="text-sm text-secondary-500 mt-1">
                        Include salary, benefits, and overhead costs
                      </p>
                    </div>

                    <div>
                      <label htmlFor="manualTaskHours" className="block text-sm font-medium text-secondary-900 mb-2">
                        Hours Spent on Manual Tasks (per week)
                      </label>
                      <input
                        type="number"
                        id="manualTaskHours"
                        name="manualTaskHours"
                        value={formData.manualTaskHours}
                        onChange={handleInputChange}
                        placeholder="e.g., 20"
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                      <p className="text-sm text-secondary-500 mt-1">
                        Time spent on repetitive tasks that could be automated
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-secondary-900 mb-2">
                        Automation Areas (select all that apply)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'customer-service', label: 'Customer Service' },
                          { value: 'lead-management', label: 'Lead Management' },
                          { value: 'data-entry', label: 'Data Entry' },
                          { value: 'reporting', label: 'Reporting' },
                          { value: 'scheduling', label: 'Scheduling' },
                          { value: 'billing', label: 'Billing' },
                          { value: 'inventory', label: 'Inventory' },
                          { value: 'hr-processes', label: 'HR Processes' },
                          { value: 'marketing', label: 'Marketing' },
                          { value: 'accounting', label: 'Accounting' },
                        ].map((area) => (
                          <label key={area.value} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.automationAreas.includes(area.value)}
                              onChange={(e) => handleCheckboxChange(area.value, e.target.checked)}
                              className="text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm">{area.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="primaryGoal" className="block text-sm font-medium text-secondary-900 mb-2">
                        Primary Goal
                      </label>
                      <select
                        id="primaryGoal"
                        name="primaryGoal"
                        value={formData.primaryGoal}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select your primary goal</option>
                        <option value="cost-reduction">Cost Reduction</option>
                        <option value="efficiency">Efficiency Improvement</option>
                        <option value="accuracy">Accuracy Improvement</option>
                        <option value="scalability">Scalability</option>
                        <option value="compliance">Compliance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Email field moved up and made more prominent */}
                    <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                      <label htmlFor="email" className="block text-sm font-medium text-secondary-900 mb-2">
                        📧 Email Address (Get Your Results Emailed!)
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g., john@company.com"
                        className="w-full p-3 border border-primary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                      <p className="text-sm text-primary-600 mt-1 font-medium">
                        ✨ Get a detailed ROI report with your specific savings calculations sent directly to your inbox!
                      </p>
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-900 mb-2">
                        Your Name (optional)
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., John Smith"
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    {calculationError && (
                      <div className={`p-3 rounded-lg text-sm ${
                        calculationError.includes('✅')
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {calculationError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      variant="cta"
                      className="w-full"
                      disabled={isCalculating}
                    >
                      {isCalculating ? 'Calculating...' : 'Calculate My ROI'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    <Card className="border-accent-200 bg-accent-50">
                      <CardHeader>
                        <CardTitle className="text-2xl text-secondary-900">
                          Your ROI Estimate
                        </CardTitle>
                        <CardDescription>
                          Based on industry benchmarks and similar implementations
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-accent-600">
                              ${results.costSavings?.annual?.toLocaleString() || '0'}
                            </div>
                            <div className="text-sm text-secondary-600">Annual Savings</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-accent-600">
                              {results.roi?.percentage || 0}%
                            </div>
                            <div className="text-sm text-secondary-600">First Year ROI</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">
                              {results.roi?.paybackPeriod || 'N/A'}
                            </div>
                            <div className="text-sm text-secondary-600">Payback Period</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">
                              {results.timeSavings?.hoursPerWeek || 0}h
                            </div>
                            <div className="text-sm text-secondary-600">Hours Saved/Week</div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="text-sm text-secondary-600 mb-2">Estimated Implementation Cost:</div>
                          <div className="text-xl font-semibold text-secondary-900">
                            ${results.investment?.firstYearTotal?.toLocaleString() || '0'}
                          </div>
                        </div>

                        {results.qualityImprovements && (
                          <div className="border-t pt-4">
                            <div className="text-sm text-secondary-600 mb-2">Quality Improvements:</div>
                            <div className="text-sm">
                              <span className="font-semibold">Error Reduction:</span> {results.qualityImprovements.errorReduction}
                            </div>
                            <div className="text-sm">
                              <span className="font-semibold">Annual Error Cost Savings:</span> ${results.qualityImprovements.annualErrorCostSavings?.toLocaleString() || '0'}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-primary-200">
                      <CardHeader>
                        <CardTitle className="text-xl">Ready to Get Started?</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-secondary-600 mb-4">
                          These are conservative estimates. Many of our clients see even higher returns.
                          Schedule a free consultation to discuss your specific needs.
                        </p>
                        <div className="space-y-3">
                          <ConsultationButton variant="cta" className="w-full">
                            Schedule Free Consultation
                          </ConsultationButton>
                          <Button asChild variant="outline" className="w-full">
                            <Link href="/case-studies">See Real Results</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="border-secondary-200">
                    <CardHeader>
                      <CardTitle className="text-2xl text-secondary-900">
                        Your ROI Results
                      </CardTitle>
                      <CardDescription>
                        Fill out the form to see your personalized savings estimate
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="text-secondary-600">
                          Complete the form to discover how much AI automation could save your business
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary-50">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                How We Calculate Your ROI
              </h2>
              <p className="text-xl text-secondary-600">
                Our estimates are based on real client data and industry benchmarks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Time Savings</h3>
                <p className="text-secondary-600">
                  We calculate 40-60% time savings on routine tasks based on your industry and company size.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Cost Reduction</h3>
                <p className="text-secondary-600">
                  Convert saved hours to dollar savings using your hourly employee costs and productivity factors.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">Implementation ROI</h3>
                <p className="text-secondary-600">
                  Factor in implementation costs and timeline to show realistic payback period and ROI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Turn Estimates into Reality?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Get a detailed analysis of your automation opportunities with a free consultation.
            No obligations, just actionable insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationButton size="lg" variant="secondary">
              Book Free Consultation
            </ConsultationButton>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-primary-600">
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}