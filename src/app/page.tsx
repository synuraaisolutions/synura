import Link from 'next/link'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'
import { VoiceAgentButton } from '@/components/common/voice-agent-button'

const services = [
  {
    title: 'AI Workforce Solutions',
    description: 'Digital team members that work 24/7 handling customer support, scheduling, lead follow-up, and reporting.',
    icon: '🤖',
    href: '/services/ai-workforce',
    benefits: ['40-60% time savings', '24/7 availability', 'Consistent quality'],
  },
  {
    title: 'Automation & Integration',
    description: 'Connect your systems and eliminate manual work with intelligent workflow automation.',
    icon: '🔄',
    href: '/services/automation-integration',
    benefits: ['Seamless integrations', 'Error reduction', 'Process efficiency'],
  },
  {
    title: 'AI Consulting & Strategy',
    description: 'Strategic roadmaps and optimization to maximize your automation ROI and business impact.',
    icon: '🎯',
    href: '/services/ai-consulting',
    benefits: ['Strategic planning', 'ROI optimization', 'Expert guidance'],
  },
  {
    title: 'Managed AI Operations',
    description: 'Ongoing monitoring, optimization, and scaling of your automation ecosystem.',
    icon: '⚙️',
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
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
              Smarter systems.{' '}
              <span className="synura-text-gradient">Stronger businesses.</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              AI automation agency that helps businesses save time, reduce costs, and eliminate inefficiency
              through intelligent systems and custom-built AI agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="cta" asChild>
                <Link href="/contact">Book Free Consultation</Link>
              </Button>
              <VoiceAgentButton size="xl" variant="outline">
                🎙️ Speak to Verus
              </VoiceAgentButton>
              <Button size="xl" variant="outline" asChild>
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
            <p className="text-sm text-secondary-500 mt-4">
              ✓ Free consultation ✓ No obligation ✓ Clear ROI projections
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="synura-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              For every dollar you invest, our clients typically see
            </h2>
            <p className="text-6xl font-bold synura-text-gradient">2-3x ROI</p>
            <p className="text-secondary-600 mt-2">within the first months of implementation</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-secondary-900 mb-1">{stat.label}</div>
                <div className="text-xs text-secondary-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              🎙️ Ask Verus About Our Services
            </VoiceAgentButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl">{service.icon}</span>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">1. Free Consultation</h3>
              <p className="text-secondary-600">
                We analyze your processes and identify automation opportunities with clear ROI projections.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">2. Custom Development</h3>
              <p className="text-secondary-600">
                We build and deploy tailored automation solutions that integrate with your existing systems.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">3. Ongoing Optimization</h3>
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
            <Button size="xl" variant="secondary" asChild>
              <Link href="/contact">Book Free Consultation</Link>
            </Button>
            <VoiceAgentButton size="xl" variant="outline" className="text-white border-white hover:bg-white hover:text-primary-600">
              🎙️ Talk to Verus
            </VoiceAgentButton>
            <Button size="xl" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-primary-600">
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