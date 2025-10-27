import Link from 'next/link'
// Pricing content is loaded directly from MDX
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'
import { VoiceAgentButton } from '@/components/common/voice-agent-button'
// Static pricing page without MDX dependency

export default function PricingPage() {

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Pricing
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Transparent pricing for AI automation solutions that deliver measurable ROI
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
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter Package */}
              <Card className="relative">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Starter</CardTitle>
                  <CardDescription>Perfect for small businesses</CardDescription>
                  <div className="text-4xl font-bold text-primary-600 mt-4">$2,500</div>
                  <p className="text-sm text-secondary-600">Starting from</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-center">✓ Free consultation</li>
                    <li className="flex items-center">✓ 1-2 simple automations</li>
                    <li className="flex items-center">✓ Basic integration setup</li>
                    <li className="flex items-center">✓ 30-day support included</li>
                  </ul>
                  <Button className="w-full mt-6" asChild>
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Business Package */}
              <Card className="relative border-primary-500 border-2">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm">Most Popular</span>
                </div>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Business</CardTitle>
                  <CardDescription>For growing companies</CardDescription>
                  <div className="text-4xl font-bold text-primary-600 mt-4">$8,500</div>
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
                  <Button className="w-full mt-6" asChild>
                    <Link href="/contact">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Package */}
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Enterprise</CardTitle>
                  <CardDescription>For large organizations</CardDescription>
                  <div className="text-4xl font-bold text-primary-600 mt-4">Custom</div>
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
                  <Button className="w-full mt-6" asChild>
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
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
            <VoiceAgentButton size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600">
              Speak to an agent
            </VoiceAgentButton>
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