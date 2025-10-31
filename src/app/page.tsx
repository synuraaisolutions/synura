'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'
import { VoiceAgentButton } from '@/components/common/voice-agent-button'
import { AutomationExplainer } from '@/components/common/automation-explainer'
import ConsultationButton from '@/components/booking/ConsultationButton'

const services = [
  {
    title: 'AI Workforce Solutions',
    description: 'Digital team members that work 24/7 handling customer support, scheduling, lead follow-up, and reporting.',
    icon: '🤖',
    image: '/images/professional/industrial-robotics-automation.jpg',
    href: '/services/ai-workforce',
    benefits: ['40-60% time savings', '24/7 availability', 'Consistent quality'],
  },
  {
    title: 'Automation & Integration',
    description: 'Connect your systems and eliminate manual work with intelligent workflow automation.',
    icon: '🔄',
    image: '/images/professional/social-media-automation-workflow.jpg',
    href: '/services/automation-integration',
    benefits: ['Seamless integrations', 'Error reduction', 'Process efficiency'],
  },
  {
    title: 'AI Consulting & Strategy',
    description: 'Strategic roadmaps and optimization to maximize your automation ROI and business impact.',
    icon: '🎯',
    image: '/images/professional/strategic-team-meeting-automation.jpg',
    href: '/services/ai-consulting',
    benefits: ['Strategic planning', 'ROI optimization', 'Expert guidance'],
  },
  {
    title: 'Managed AI Operations',
    description: 'Ongoing monitoring, optimization, and scaling of your automation ecosystem.',
    icon: '⚙️',
    image: '/images/professional/data-center-professional.jpg',
    href: '/services/managed-operations',
    benefits: ['24/7 monitoring', 'Continuous optimization', 'Scalable growth'],
  },
]

const stats = [
  { label: 'Time Savings', value: '40-60%', description: 'reduction in manual tasks' },
  { label: 'ROI', value: '2-3x', description: 'return on investment' },
  { label: 'Response Time', value: '50-70%', description: 'faster processes' },
  { label: 'Accuracy', value: '90%+', description: 'improvement in data quality' },
]

export default function HomePage() {
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
            poster="/images/professional/hero-person-laptop-synura.jpg"
          >
            <source src="/videos/automation.mp4" type="video/mp4" />
            {/* Fallback for browsers that don't support video */}
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-secondary-900/90"></div>
        </div>

        <div className="synura-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Smarter systems.{' '}
                <span className="text-accent-300">Stronger businesses.</span>
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                AI automation agency that helps businesses save time, reduce costs, and eliminate inefficiency
                through intelligent systems and custom-built AI agents.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <ConsultationButton
                  size="lg"
                  className="sm:size-xl"
                  variant="cta"
                >
                  Book Free Consultation
                </ConsultationButton>
                <VoiceAgentButton size="lg" className="sm:size-xl" variant="outline">
                  Speak to an agent
                </VoiceAgentButton>
                <Button size="lg" className="sm:size-xl hidden sm:inline-flex" variant="outline" asChild>
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>
              {/* Mobile-only secondary button */}
              <div className="sm:hidden mt-3">
                <Button size="lg" variant="outline" asChild className="w-full">
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>
              <p className="text-sm text-gray-300 mt-4">
                ✓ Free consultation ✓ No obligation ✓ Clear ROI projections
              </p>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl p-4 md:p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <Image
                  src="/images/professional/hero-person-laptop-synura.jpg"
                  alt="Professional viewing Synura AI Solutions website showing ROI metrics and automation benefits"
                  width={800}
                  height={600}
                  className="rounded-lg object-cover w-full h-auto"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-accent-500 text-white p-2 md:p-3 rounded-full shadow-lg">
                  <span className="text-xs md:text-sm font-bold">2-3x ROI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/images/professional/network-connectivity-visualization.jpg"
            alt="Network connections and digital connectivity visualization background"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="synura-container relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              For every dollar you invest, our clients typically see
            </h2>
            <p className="text-6xl font-bold synura-text-gradient">2-3x ROI</p>
            <p className="text-secondary-600 mt-2">within the first months of implementation</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-secondary-900 mb-1">{stat.label}</div>
                <div className="text-xs text-secondary-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Explainer */}
      <AutomationExplainer />

      {/* Services Section */}
      <section className="py-20 bg-secondary-50">
        <div className="synura-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              Transform Your Business with AI Automation
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-6">
              From AI employees that work 24/7 to seamless system integrations,
              we provide comprehensive solutions that eliminate manual work and drive growth.
            </p>
            <VoiceAgentButton size="lg" variant="outline">
              Ask our agent about services
            </VoiceAgentButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-48 w-full">
                    <Image
                      src={service.image}
                      alt={`${service.title} - Professional automation and AI services visualization`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <CardTitle className="text-xl text-white mb-2">{service.title}</CardTitle>
                    </div>
                  </div>
                  <div className="p-6 pb-0">
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2 mb-6">
                    {service.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-sm text-secondary-600">
                        <span className="text-accent-500 mr-2">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={service.href}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="cta" asChild>
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary-900 mb-4">
              How We Work
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Every business has unique challenges. We start with understanding your goals
              and show where automation can create the biggest impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/professional/business-consultation-meeting.jpg"
                  alt="Professional business consultation meeting discussing automation strategies"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-primary-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-bold bg-primary-600/80 px-3 py-1 rounded-full">1</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Free Consultation</h3>
              <p className="text-secondary-600">
                We analyze your processes and identify automation opportunities with clear ROI projections.
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/professional/development-coding-screen.jpg"
                  alt="Professional software development and coding for custom automation solutions"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-primary-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-bold bg-primary-600/80 px-3 py-1 rounded-full">2</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Custom Development</h3>
              <p className="text-secondary-600">
                We build and deploy tailored automation solutions that integrate with your existing systems.
              </p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/professional/data-center-professional.jpg"
                  alt="Professional data center operations representing ongoing monitoring and optimization"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-primary-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-lg font-bold bg-primary-600/80 px-3 py-1 rounded-full">3</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">Ongoing Optimization</h3>
              <p className="text-secondary-600">
                Continuous monitoring and improvement to ensure maximum ROI and sustainable growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Let's find out how much time and money your business could save with intelligent automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationButton
              size="xl"
              variant="secondary"
            >
              Book Free Consultation
            </ConsultationButton>
            <Button size="xl" variant="outline" asChild className="!text-white border-white !bg-transparent hover:!bg-white hover:!text-primary-600">
              <Link href="/pricing">View Pricing</Link>
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