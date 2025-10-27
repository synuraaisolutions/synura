import Link from 'next/link'
import { Button } from '@/components/common/button'
import { ConsultationButton } from '@/components/common/consultation-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'

export default function AboutPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              About Synura AI Solutions
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              We're not just another AI company. We're your partners in building intelligent systems
              that make businesses more efficient, productive, and profitable.
            </p>
            <p className="text-lg text-secondary-700">
              <strong>Smarter systems. Stronger businesses.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary-900 mb-6">Our Mission</h2>
              <p className="text-lg text-secondary-600 mb-6">
                To empower businesses through intelligent automation and AI-driven workflows that eliminate
                inefficiency and unlock human potential for strategic, high-value work.
              </p>
              <p className="text-secondary-600">
                We believe technology should amplify human intelligence, not replace it. Our solutions
                create seamless partnerships between people and AI, resulting in stronger, more
                capable organizations.
              </p>
            </div>
            <div className="bg-secondary-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">Our Approach</h3>
              <ul className="space-y-3 text-secondary-600">
                <li className="flex items-start space-x-3">
                  <span className="text-accent-500 font-bold">→</span>
                  <span><strong>Human-Centered Design:</strong> Technology that enhances, not replaces, your team</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-accent-500 font-bold">→</span>
                  <span><strong>Transparent Process:</strong> Clear communication and measurable outcomes</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-accent-500 font-bold">→</span>
                  <span><strong>Results-Driven:</strong> Focus on ROI and business impact, not just technology</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-secondary-50">
        <div className="synura-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-secondary-600">
              The principles that guide every decision and solution we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <CardTitle className="text-xl">Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  Every solution we build is designed to eliminate waste, reduce manual work,
                  and optimize your business processes for maximum productivity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  We stay at the forefront of AI technology to bring you cutting-edge solutions
                  that give your business a competitive advantage.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <CardTitle className="text-xl">Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  No black boxes or hidden processes. We explain how our solutions work,
                  provide clear pricing, and deliver measurable results.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <CardTitle className="text-xl">Partnership</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  We're not just vendors – we're partners invested in your long-term success,
                  working alongside your team to achieve your business goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📈</span>
                </div>
                <CardTitle className="text-xl">Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  Our solutions scale with your business, adapting and evolving to support
                  your growth at every stage of your company's journey.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle className="text-xl">Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary-600">
                  Everything we do is measured against real business outcomes. Our success
                  is defined by the tangible value we deliver to your organization.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">
                What Makes Synura Different
              </h2>
              <p className="text-xl text-secondary-600">
                We're not just building AI tools – we're architecting intelligent business ecosystems
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-4">Business-First Approach</h3>
                <p className="text-secondary-600 mb-4">
                  While others focus on the latest AI trends, we focus on your bottom line. Every solution
                  we build starts with understanding your specific business challenges and goals.
                </p>
                <ul className="space-y-2 text-secondary-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-accent-500">✓</span>
                    <span>ROI-focused implementation strategy</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-accent-500">✓</span>
                    <span>Custom solutions for your industry</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-accent-500">✓</span>
                    <span>Seamless integration with existing systems</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-4">Proven Methodology</h3>
                <p className="text-secondary-600 mb-4">
                  Our systematic approach ensures successful implementations that deliver measurable
                  results within the first 30-90 days.
                </p>
                <ul className="space-y-2 text-secondary-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-accent-500">✓</span>
                    <span>Comprehensive business process analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-accent-500">✓</span>
                    <span>Phased implementation with quick wins</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-accent-500">✓</span>
                    <span>Ongoing optimization and support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 bg-primary-50">
        <div className="synura-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-secondary-900 mb-6">Our Promise to You</h2>

            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <p className="text-xl text-secondary-700 leading-relaxed">
                "We guarantee that our AI automation solutions will deliver measurable ROI within 90 days
                of implementation, or we'll work with you at no additional cost until they do."
              </p>
            </div>

            <p className="text-lg text-secondary-600 mb-8">
              This isn't just a promise – it's how we do business. Your success is our success,
              and we're committed to delivering results that make a real difference to your bottom line.
            </p>

            <div className="bg-secondary-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-secondary-900 mb-3">Ready to Transform Your Business?</h3>
              <p className="text-secondary-600 mb-4">
                Join hundreds of companies that have already automated their way to greater efficiency and profitability.
              </p>
              <ConsultationButton size="lg" variant="cta">
                Schedule Your Free Consultation
              </ConsultationButton>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Whether you're looking to automate a single process or transform your entire operation,
            we're here to help you achieve your goals with intelligent AI solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/services">Explore Our Services</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-primary-600">
              <Link href="/case-studies">View Case Studies</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export const metadata = {
  title: 'About Us | Synura AI Solutions - AI Automation Agency',
  description: 'Learn about Synura AI Solutions, an AI automation agency dedicated to helping businesses achieve efficiency and growth through intelligent systems and custom AI solutions.',
  keywords: ['About Synura', 'AI automation company', 'business automation', 'AI consulting', 'intelligent systems', 'automation agency'],
}