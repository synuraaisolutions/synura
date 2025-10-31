'use client'

import Link from 'next/link'
import Image from 'next/image'
// Pricing content is loaded directly from MDX
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'
import { VoiceAgentButton } from '@/components/common/voice-agent-button'
import ConsultationButton from '@/components/booking/ConsultationButton'
// Static pricing page without MDX dependency

export default function PricingPage() {

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/images/professional/automation-workflow-diagram.jpg"
          >
            <source src="/videos/Business_growth.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-900/90"></div>
        </div>

        <div className="synura-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pricing
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Transparent pricing for AI automation solutions that deliver measurable ROI
            </p>
            <p className="text-lg text-gray-100">
              <strong>For every dollar you invest, our clients typically see 2-3x ROI</strong> within the first months of implementation.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Content */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Package */}
              <Card className="relative overflow-hidden">
                {/* Clean Image Section */}
                <div className="h-30 w-full">
                  <Image
                    src="/images/professional/Starter-Card-Header.png"
                    alt="Starter package header"
                    width={400}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Clean Text Section */}
                <CardHeader className="text-center bg-white">
                  <CardTitle className="text-2xl text-secondary-900 font-bold">Starter</CardTitle>
                  <CardDescription className="text-secondary-600">Perfect for small businesses</CardDescription>
                  <div className="text-4xl font-bold text-primary-600 mt-4 mb-1">$2,500</div>
                  <p className="text-sm text-secondary-600">Starting from</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">✓ Free consultation</li>
                    <li className="flex items-center">✓ 1-2 simple automations</li>
                    <li className="flex items-center">✓ Basic integration setup</li>
                    <li className="flex items-center">✓ 30-day support included</li>
                  </ul>
                  <ConsultationButton
                    className="w-full mt-6"
                  >
                    Get Started
                  </ConsultationButton>
                </CardContent>
              </Card>

              {/* Business Package */}
              <Card className="relative border-primary-500 border-2">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">Most Popular</span>
                </div>
                {/* Clean Image Section */}
                <div className="h-30 w-full">
                  <Image
                    src="/images/professional/Business-Card-Header.png"
                    alt="Business package header"
                    width={400}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Clean Text Section */}
                <CardHeader className="text-center bg-white">
                  <CardTitle className="text-2xl text-secondary-900 font-bold">Business</CardTitle>
                  <CardDescription className="text-secondary-600">For growing companies</CardDescription>
                  <div className="text-4xl font-bold text-primary-600 mt-4 mb-1">$8,500</div>
                  <p className="text-sm text-secondary-600">Starting from</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">✓ Everything in Starter</li>
                    <li className="flex items-center">✓ 3-5 automations</li>
                    <li className="flex items-center">✓ Advanced integrations</li>
                    <li className="flex items-center">✓ Custom workflows</li>
                    <li className="flex items-center">✓ 90-day support</li>
                  </ul>
                  <ConsultationButton
                    className="w-full mt-6"
                  >
                    Get Started
                  </ConsultationButton>
                </CardContent>
              </Card>

              {/* Enterprise Package */}
              <Card className="relative">
                {/* Clean Image Section */}
                <div className="h-30 w-full">
                  <Image
                    src="/images/professional/Enterprise-Card-Header.png"
                    alt="Enterprise package header"
                    width={400}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Clean Text Section */}
                <CardHeader className="text-center bg-white">
                  <CardTitle className="text-2xl text-secondary-900 font-bold">Enterprise</CardTitle>
                  <CardDescription className="text-secondary-600">For large organizations</CardDescription>
                  <div className="text-4xl font-bold text-primary-600 mt-4 mb-1">Custom</div>
                  <p className="text-sm text-secondary-600">Tailored pricing</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">✓ Everything in Business</li>
                    <li className="flex items-center">✓ Unlimited automations</li>
                    <li className="flex items-center">✓ Enterprise integrations</li>
                    <li className="flex items-center">✓ Dedicated support</li>
                    <li className="flex items-center">✓ SLA guarantees</li>
                  </ul>
                  <ConsultationButton
                    className="w-full mt-6"
                  >
                    Contact Sales
                  </ConsultationButton>
                </CardContent>
              </Card>
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
                <svg className="w-8 h-8 text-accent-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Proven ROI</h3>
              <p className="text-secondary-600 text-sm">
                Save time and money from day one with measurable results
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Simple Language</h3>
              <p className="text-secondary-600 text-sm">
                We speak business, not code. Clear communication throughout
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H18V2h-2v1H8V2H6v1H4.5C3.67 3 3 3.67 3 4.5v15C3 20.33 3.67 21 4.5 21h15c.83 0 1.5-.67 1.5-1.5v-15C21 3.67 20.33 3 19.5 3zm0 16h-15v-12h15v12z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Tailored Solutions</h3>
              <p className="text-secondary-600 text-sm">
                No one-size-fits-all packages. Every solution is customized
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.5 2.5 0 0 0 8 7H5.46c-.8 0-1.54.37-2.01.99L1 12h2.5v10h4v-6h2v6h4z"/>
                </svg>
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

          <div className="text-center mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/faqs">View All FAQs</Link>
              </Button>
              <VoiceAgentButton variant="outline">
                Ask our agent about pricing
              </VoiceAgentButton>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator CTA */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Calculate Your Specific ROI
            </h2>
            <p className="text-xl text-secondary-600 mb-8">
              See how much time and money automation could save your business.
              Get personalized ROI estimates based on your company size and needs.
            </p>

            <div className="bg-primary-50 rounded-lg p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">2-3x</div>
                  <p className="text-secondary-700">Average ROI within first year</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">40-60%</div>
                  <p className="text-secondary-700">Time savings on routine tasks</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">$25k+</div>
                  <p className="text-secondary-700">Average annual cost savings</p>
                </div>
              </div>
            </div>

            <Button size="lg" variant="cta" asChild className="mr-4">
              <Link href="/roi-calculator">🧮 Calculate Your ROI Now</Link>
            </Button>

            <p className="text-sm text-secondary-500 mt-4">
              Takes 2 minutes • No email required • Instant results
            </p>
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
            <ConsultationButton
              size="lg"
              variant="secondary"
            >
              Book Free Consultation
            </ConsultationButton>
            <VoiceAgentButton size="lg" variant="outline" className="!text-white border-white !bg-transparent hover:!bg-white hover:!text-primary-600">
              Speak to an agent
            </VoiceAgentButton>
            <Button size="lg" variant="outline" asChild className="!text-white border-white !bg-transparent hover:!bg-white hover:!text-primary-600">
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