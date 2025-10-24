import Link from 'next/link'
import { allPricings } from '.contentlayer/generated'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'
import { MDXContent } from '@/components/mdx-content'

export default function PricingPage() {
  const pricingData = allPricings[0] // Pricing is a singleton

  if (!pricingData) {
    return (
      <PageLayout>
        <div className="synura-container py-20 text-center">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">Pricing information not available</h1>
          <p className="text-secondary-600">Please contact us for pricing information.</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              {pricingData.title}
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              {pricingData.description}
            </p>
            <p className="text-lg text-secondary-700">
              <strong>For every dollar you invest, our clients typically see 2-3x ROI</strong> within the first months of implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Content */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <MDXContent code={pricingData.body.raw} />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Why Businesses Choose Synura
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              We deliver measurable results through proven automation solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Proven ROI</h3>
              <p className="text-secondary-600 text-sm">
                Save time and money from day one with measurable results
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Simple Language</h3>
              <p className="text-secondary-600 text-sm">
                We speak business, not code. Clear communication throughout
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Tailored Solutions</h3>
              <p className="text-secondary-600 text-sm">
                No one-size-fits-all packages. Every solution is customized
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">End-to-End Support</h3>
              <p className="text-secondary-600 text-sm">
                From planning to implementation and ongoing optimization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-secondary-50">
        <div className="synura-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Common Questions
            </h2>
            <p className="text-secondary-600">
              Quick answers to pricing and investment questions
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                How much does automation cost?
              </h3>
              <p className="text-secondary-600">
                Pricing varies based on scope and complexity. Simple automations start around $2,000,
                while comprehensive programs begin at $5,000/month. We always start with a free consultation
                to provide accurate estimates.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                What kind of ROI can I expect?
              </h3>
              <p className="text-secondary-600">
                Our clients typically see 2-3x ROI within the first year through time savings,
                cost reduction, and efficiency improvements. We provide detailed ROI projections
                during our free consultation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Are there any hidden fees?
              </h3>
              <p className="text-secondary-600">
                No hidden fees. We provide transparent pricing upfront including all development,
                implementation, and support costs. Any third-party software fees are clearly outlined.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/faqs">View All FAQs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Let's find out how much time and money your business could save with intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-primary-600">
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
          <p className="text-primary-100 text-sm mt-4">
            No jargon. No tech overwhelm. Just practical solutions that make work easier.
          </p>
        </div>
      </section>
    </PageLayout>
  )
}