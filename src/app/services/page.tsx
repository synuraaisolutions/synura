'use client'

import Link from 'next/link'
import { allServices } from '@/data/services'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'

export default function ServicesPage() {
  const featuredServices = allServices.filter(service => service.featured)

  return (
    <PageLayout>
      {/* Hero Section with Video Background */}
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
            <source src="/videos/automation.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="synura-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comprehensive AI Automation Services
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              From AI employees that work 24/7 to seamless system integrations,
              we provide complete solutions that eliminate manual work and drive measurable business growth.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).Calendly) {
                  (window as any).Calendly.initPopupWidget({
                    url: 'https://calendly.com/synuraaisolutions/30min?hide_event_type_details=1&hide_gdpr_banner=1'
                  });
                }
              }}
            >
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-white relative">
        {/* AI Workflow Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <img
            src="/images/professional/ai-automation-workflow.png"
            alt="AI Automation Network"
            className="max-w-2xl w-full h-auto"
          />
        </div>

        <div className="synura-container relative z-10">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Our Core Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {featuredServices.map((service) => (
              <Card key={service.slug} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    {service.icon && <span className="text-3xl">{service.icon}</span>}
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {service.benefits && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-secondary-900 mb-3">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-sm text-secondary-600">
                            <span className="text-accent-500 mr-2">✓</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {service.outcomes && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-secondary-900 mb-3">Expected Outcomes:</h4>
                      <ul className="space-y-2">
                        {service.outcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-center text-sm text-secondary-600">
                            <span className="text-primary-500 mr-2">→</span>
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button variant="outline" asChild className="w-full">
                    <Link href={service.url}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Process Overview */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Our Implementation Process
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
              We follow a proven methodology to ensure successful automation deployment
              with minimal disruption to your business operations.
            </p>

          </div>

          {/* Process Visualization */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 shadow-lg">
              <img
                src="/images/professional/Untitled-1.png"
                alt="Synura Implementation Process: Discovery, Strategy, Implementation, Optimization"
                className="w-full h-auto mx-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Discovery</h3>
              <p className="text-secondary-600 text-sm">
                Analyze current processes and identify automation opportunities
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Strategy</h3>
              <p className="text-secondary-600 text-sm">
                Develop custom roadmap with ROI projections and timelines
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Implementation</h3>
              <p className="text-secondary-600 text-sm">
                Build, test, and deploy automation solutions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Optimization</h3>
              <p className="text-secondary-600 text-sm">
                Monitor performance and continuously improve results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Automate Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Start with a free consultation to discover which services would benefit your business most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).Calendly) {
                  (window as any).Calendly.initPopupWidget({
                    url: 'https://calendly.com/synuraaisolutions/30min?hide_event_type_details=1&hide_gdpr_banner=1'
                  });
                }
              }}
            >
              Book Free Consultation
            </Button>
            <Button size="lg" variant="outline" asChild className="!text-white border-white !bg-transparent hover:!bg-white hover:!text-primary-600">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}