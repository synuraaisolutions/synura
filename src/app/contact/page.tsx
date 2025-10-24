import Link from 'next/link'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'

export default function ContactPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Let's Transform Your Business
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Ready to discover how much time and money automation can save your business?
              Start with a free consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Consultation Booking */}
            <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-4xl">📅</span>
                  <div>
                    <CardTitle className="text-2xl">Free Consultation</CardTitle>
                    <CardDescription className="text-lg">
                      30-minute strategy session to explore your automation opportunities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-accent-500">✓</span>
                    <span>Process analysis and opportunity identification</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-accent-500">✓</span>
                    <span>ROI estimates for top automation opportunities</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-accent-500">✓</span>
                    <span>Clear action plan and next steps</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-accent-500">✓</span>
                    <span>No obligation or commitment required</span>
                  </div>
                </div>

                <div className="bg-primary-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-secondary-700">
                    <strong>Perfect for:</strong> Business owners, operations managers, and teams
                    looking to eliminate manual work and improve efficiency.
                  </p>
                </div>

                <Button size="lg" variant="cta" className="w-full">
                  Schedule Free Consultation
                </Button>
              </CardContent>
            </Card>

            {/* Direct Contact */}
            <Card className="border-secondary-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-4xl">💬</span>
                  <div>
                    <CardTitle className="text-2xl">Direct Contact</CardTitle>
                    <CardDescription className="text-lg">
                      Prefer to reach out directly? We're here to help.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Email */}
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-2">Email</h3>
                    <a
                      href="mailto:sales@synura.ai"
                      className="text-primary-600 hover:text-primary-800 transition-colors"
                    >
                      sales@synura.ai
                    </a>
                    <p className="text-sm text-secondary-600 mt-1">
                      We typically respond within 2 hours during business hours
                    </p>
                  </div>

                  {/* Voice Agent */}
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-2">AI Assistant</h3>
                    <p className="text-secondary-600 mb-3">
                      Chat with Verus, our AI assistant, using the voice widget on this page.
                      Available 24/7 to answer questions and help schedule consultations.
                    </p>
                    <Button variant="outline" size="sm">
                      Activate Voice Assistant
                    </Button>
                  </div>

                  {/* Business Hours */}
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-2">Business Hours</h3>
                    <div className="text-sm text-secondary-600 space-y-1">
                      <div>Monday - Friday: 9:00 AM - 6:00 PM EST</div>
                      <div>Saturday: 10:00 AM - 2:00 PM EST</div>
                      <div>Sunday: Closed</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick ROI Calculator CTA */}
      <section className="py-20 bg-secondary-50">
        <div className="synura-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Not Ready to Talk Yet?
            </h2>
            <p className="text-xl text-secondary-600 mb-8">
              Use our ROI calculator to get an instant estimate of how much automation
              could save your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/roi-calculator">Calculate ROI</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/case-studies">View Case Studies</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Common Questions
            </h2>
            <p className="text-secondary-600">
              Quick answers before your consultation
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                How much does automation cost?
              </h3>
              <p className="text-secondary-600">
                Pricing varies based on scope. Simple automations start around $2,000,
                while comprehensive programs begin at $5,000/month. We provide accurate
                estimates during your free consultation.
              </p>
            </div>

            <div className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                How quickly can I see results?
              </h3>
              <p className="text-secondary-600">
                Most clients see immediate time savings within days of implementation.
                Measurable ROI typically appears within 30-90 days, depending on the scope
                of automation.
              </p>
            </div>

            <div className="border border-secondary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Do I need technical expertise?
              </h3>
              <p className="text-secondary-600">
                Not at all. We handle all technical aspects and provide simple training
                for your team. Our solutions integrate seamlessly with your existing workflows.
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

      {/* Final CTA */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have transformed their operations with intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#consultation">Book Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-primary-600">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}