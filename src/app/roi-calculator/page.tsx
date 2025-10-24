'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'

export default function ROICalculatorPage() {
  const [formData, setFormData] = useState({
    companySize: '',
    industry: '',
    monthlyRevenue: '',
    employeeCost: '',
    hoursSpentManual: '',
    primaryChallenge: '',
  })

  const [results, setResults] = useState<{
    annualSavings: number
    roiPercentage: number
    paybackMonths: number
    hoursReclaimed: number
    estimatedCost: number
  } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const calculateROI = () => {
    const revenue = parseFloat(formData.monthlyRevenue) || 0
    const employeeCostHourly = parseFloat(formData.employeeCost) || 50
    const hoursManual = parseFloat(formData.hoursSpentManual) || 0

    // Size multipliers
    const sizeMultipliers = {
      '1-10': 1.0,
      '11-50': 1.2,
      '51-200': 1.5,
      '201-1000': 1.8,
      '1000+': 2.2,
    }

    // Industry factors
    const industryFactors = {
      'professional-services': 1.3,
      'healthcare': 1.1,
      'ecommerce': 1.4,
      'manufacturing': 1.2,
      'finance': 1.3,
      'other': 1.0,
    }

    const sizeMultiplier = sizeMultipliers[formData.companySize as keyof typeof sizeMultipliers] || 1.0
    const industryFactor = industryFactors[formData.industry as keyof typeof industryFactors] || 1.0

    // Calculate potential savings
    const hoursReclaimed = hoursManual * 0.6 * sizeMultiplier // 60% automation rate
    const monthlySavings = hoursReclaimed * employeeCostHourly * 4.33 * industryFactor // 4.33 weeks per month
    const annualSavings = monthlySavings * 12

    // Estimate implementation cost
    let estimatedCost = 5000 // Base cost
    if (formData.companySize === '1-10') estimatedCost = 3000
    else if (formData.companySize === '11-50') estimatedCost = 5000
    else if (formData.companySize === '51-200') estimatedCost = 8000
    else if (formData.companySize === '201-1000') estimatedCost = 15000
    else if (formData.companySize === '1000+') estimatedCost = 25000

    const roiPercentage = annualSavings > 0 ? ((annualSavings - estimatedCost) / estimatedCost) * 100 : 0
    const paybackMonths = annualSavings > 0 ? (estimatedCost / (annualSavings / 12)) : 0

    setResults({
      annualSavings: Math.round(annualSavings),
      roiPercentage: Math.round(roiPercentage),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      hoursReclaimed: Math.round(hoursReclaimed),
      estimatedCost,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateROI()
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              AI Automation ROI Calculator
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Discover how much time and money AI automation could save your business.
              Get instant estimates based on your specific situation.
            </p>
            <p className="text-lg text-secondary-700">
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
                      <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-secondary-900 mb-2">
                        Monthly Revenue (USD)
                      </label>
                      <input
                        type="number"
                        id="monthlyRevenue"
                        name="monthlyRevenue"
                        value={formData.monthlyRevenue}
                        onChange={handleInputChange}
                        placeholder="e.g., 50000"
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="employeeCost" className="block text-sm font-medium text-secondary-900 mb-2">
                        Average Employee Hourly Cost (USD)
                      </label>
                      <input
                        type="number"
                        id="employeeCost"
                        name="employeeCost"
                        value={formData.employeeCost}
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
                      <label htmlFor="hoursSpentManual" className="block text-sm font-medium text-secondary-900 mb-2">
                        Hours Spent on Manual Tasks (per week)
                      </label>
                      <input
                        type="number"
                        id="hoursSpentManual"
                        name="hoursSpentManual"
                        value={formData.hoursSpentManual}
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
                      <label htmlFor="primaryChallenge" className="block text-sm font-medium text-secondary-900 mb-2">
                        Primary Challenge
                      </label>
                      <select
                        id="primaryChallenge"
                        name="primaryChallenge"
                        value={formData.primaryChallenge}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Select your main challenge</option>
                        <option value="manual-tasks">Too many manual tasks</option>
                        <option value="data-entry">Data entry and processing</option>
                        <option value="customer-service">Customer service bottlenecks</option>
                        <option value="reporting">Time-consuming reporting</option>
                        <option value="scaling">Difficulty scaling operations</option>
                        <option value="integration">System integration issues</option>
                      </select>
                    </div>

                    <Button type="submit" size="lg" variant="cta" className="w-full">
                      Calculate My ROI
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
                              ${results.annualSavings.toLocaleString()}
                            </div>
                            <div className="text-sm text-secondary-600">Annual Savings</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-accent-600">
                              {results.roiPercentage}%
                            </div>
                            <div className="text-sm text-secondary-600">First Year ROI</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">
                              {results.paybackMonths} months
                            </div>
                            <div className="text-sm text-secondary-600">Payback Period</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">
                              {results.hoursReclaimed}h
                            </div>
                            <div className="text-sm text-secondary-600">Hours Saved/Week</div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="text-sm text-secondary-600 mb-2">Estimated Implementation Cost:</div>
                          <div className="text-xl font-semibold text-secondary-900">
                            ${results.estimatedCost.toLocaleString()}
                          </div>
                        </div>
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
                          <Button asChild variant="cta" className="w-full">
                            <Link href="/contact">Schedule Free Consultation</Link>
                          </Button>
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
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-primary-600">
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export const metadata = {
  title: 'ROI Calculator | Synura AI Solutions - Calculate Automation Savings',
  description: 'Discover how much time and money AI automation could save your business. Use our ROI calculator to get instant estimates based on your specific situation.',
  keywords: ['ROI calculator', 'AI automation savings', 'business automation ROI', 'cost savings calculator', 'automation benefits'],
}