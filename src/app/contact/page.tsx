'use client'

import Link from 'next/link'
import { Button } from '@/components/common/button'
import { ConsultationButton } from '@/components/common/consultation-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'
import { ContactForm } from '@/components/forms/contact-form'

export default function ContactPage() {
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
              Let's Transform Your Business
            </h1>
            <p className="text-xl text-primary-100 mb-8">
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

                <ConsultationButton size="lg" variant="cta" className="w-full">
                  Schedule Free Consultation
                </ConsultationButton>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <ContactForm />
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
              <Button size="lg" variant="cta" asChild>
                <Link href="/roi-calculator">🧮 Calculate Your ROI Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
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
            <ConsultationButton size="lg" variant="secondary">
              Book Free Consultation
            </ConsultationButton>
            <Button size="lg" variant="outline" asChild className="!text-white border-white !bg-transparent hover:!bg-white hover:!text-primary-600">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}