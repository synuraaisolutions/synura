import Link from 'next/link'
import { allCaseStudies } from '.contentlayer/generated'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'

export default function CaseStudiesPage() {
  // Sort case studies by publication date (newest first)
  const sortedCaseStudies = allCaseStudies.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const featuredCaseStudies = sortedCaseStudies.filter(caseStudy => caseStudy.featured)
  const otherCaseStudies = sortedCaseStudies.filter(caseStudy => !caseStudy.featured)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const CaseStudyCard = ({ caseStudy, featured = false }: { caseStudy: any, featured?: boolean }) => (
    <Card className={`border-secondary-200 hover:shadow-lg transition-shadow duration-300 ${featured ? 'ring-2 ring-primary-200' : ''}`}>
      {featured && (
        <div className="bg-primary-600 text-white text-sm font-medium px-4 py-2 rounded-t-lg">
          Featured Case Study
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <span className="text-sm text-secondary-500">{caseStudy.industry}</span>
          <span className="text-sm text-secondary-500">{formatDate(caseStudy.publishedAt)}</span>
        </div>
        <CardTitle className="text-2xl text-secondary-900 mb-2">
          {caseStudy.title}
        </CardTitle>
        <CardDescription className="text-lg">
          {caseStudy.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h4 className="font-semibold text-secondary-900 mb-2">Challenge:</h4>
          <p className="text-secondary-600 mb-4">{caseStudy.challenge}</p>

          <h4 className="font-semibold text-secondary-900 mb-2">Solution:</h4>
          <p className="text-secondary-600 mb-4">{caseStudy.solution}</p>

          <h4 className="font-semibold text-secondary-900 mb-2">Key Results:</h4>
          <ul className="space-y-1 mb-6">
            {caseStudy.results.map((result: string, index: number) => (
              <li key={index} className="flex items-center space-x-2 text-secondary-600">
                <span className="text-accent-500 font-bold">→</span>
                <span>{result}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {caseStudy.services.map((service: string, index: number) => (
            <span
              key={index}
              className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full"
            >
              {service}
            </span>
          ))}
        </div>

        <Button variant="outline" className="w-full" asChild>
          <Link href={caseStudy.url}>Read Full Case Study</Link>
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              Success Stories
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Real businesses, real results. See how our AI automation solutions
              have transformed operations and delivered measurable ROI.
            </p>
            <p className="text-lg text-secondary-700">
              <strong>Average Client ROI: 2-3x within the first 6 months</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Featured Case Studies */}
      {featuredCaseStudies.length > 0 && (
        <section className="py-20 bg-white">
          <div className="synura-container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary-900 mb-4">Featured Success Stories</h2>
              <p className="text-xl text-secondary-600">
                Highlighted transformations that showcase the power of intelligent automation
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredCaseStudies.map((caseStudy) => (
                <CaseStudyCard
                  key={caseStudy.slug}
                  caseStudy={caseStudy}
                  featured={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Case Studies */}
      <section className="py-20 bg-secondary-50">
        <div className="synura-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              {featuredCaseStudies.length > 0 ? 'More Success Stories' : 'Our Success Stories'}
            </h2>
            <p className="text-xl text-secondary-600">
              Explore how businesses across different industries have achieved remarkable results
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {(featuredCaseStudies.length > 0 ? otherCaseStudies : sortedCaseStudies).map((caseStudy) => (
              <CaseStudyCard
                key={caseStudy.slug}
                caseStudy={caseStudy}
              />
            ))}
          </div>

          {sortedCaseStudies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-secondary-600 mb-8">
                We're currently updating our case study library with fresh success stories.
              </p>
              <Button variant="cta" asChild>
                <Link href="/contact">Contact Us for References</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Industries We Transform
            </h2>
            <p className="text-xl text-secondary-600">
              Our AI automation solutions deliver results across diverse business sectors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { name: 'Professional Services', icon: '💼' },
              { name: 'Healthcare', icon: '🏥' },
              { name: 'E-commerce', icon: '🛒' },
              { name: 'Manufacturing', icon: '🏭' },
              { name: 'Finance', icon: '🏦' },
              { name: 'Real Estate', icon: '🏢' },
              { name: 'Education', icon: '🎓' },
              { name: 'Technology', icon: '💻' },
              { name: 'Retail', icon: '🏪' },
              { name: 'Logistics', icon: '📦' }
            ].map((industry) => (
              <div key={industry.name} className="text-center">
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="font-semibold text-secondary-900">{industry.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-20 bg-white">
        <div className="synura-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-secondary-600">
              Real feedback from business leaders who transformed their operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 - Brightstone Consulting */}
            <div className="bg-secondary-50 p-8 rounded-lg">
              <div className="mb-6">
                <svg className="w-8 h-8 text-primary-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
                <p className="text-secondary-700 text-lg leading-relaxed mb-6">
                  "Synura transformed how we operate. Our consultants now focus on high-value strategy work instead of admin tasks, and our clients are noticing the difference."
                </p>
              </div>
              <div className="border-t border-secondary-200 pt-4">
                <p className="font-semibold text-secondary-900">Sarah Chen</p>
                <p className="text-secondary-600">Managing Partner</p>
                <p className="text-sm text-secondary-500">Brightstone Consulting</p>
                <div className="mt-2">
                  <span className="text-sm font-medium text-primary-600">280% ROI • 45 employees</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Nordic Home Goods */}
            <div className="bg-secondary-50 p-8 rounded-lg">
              <div className="mb-6">
                <svg className="w-8 h-8 text-primary-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
                <p className="text-secondary-700 text-lg leading-relaxed mb-6">
                  "The automation solutions from Synura allowed us to scale rapidly without losing the personal touch our customers love. Our growth has been incredible."
                </p>
              </div>
              <div className="border-t border-secondary-200 pt-4">
                <p className="font-semibold text-secondary-900">Marcus Lindberg</p>
                <p className="text-secondary-600">Co-Founder & CEO</p>
                <p className="text-sm text-secondary-500">Nordic Home Goods</p>
                <div className="mt-2">
                  <span className="text-sm font-medium text-primary-600">340% ROI • 28 employees</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 - Precision Components */}
            <div className="bg-secondary-50 p-8 rounded-lg">
              <div className="mb-6">
                <svg className="w-8 h-8 text-primary-600 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
                <p className="text-secondary-700 text-lg leading-relaxed mb-6">
                  "The automation system paid for itself in 8 months. We're now the most efficient manufacturer in our sector while maintaining the highest quality standards."
                </p>
              </div>
              <div className="border-t border-secondary-200 pt-4">
                <p className="font-semibold text-secondary-900">David Park</p>
                <p className="text-secondary-600">Operations Director</p>
                <p className="text-sm text-secondary-500">Precision Components</p>
                <div className="mt-2">
                  <span className="text-sm font-medium text-primary-600">385% ROI • 85 employees</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-secondary-600 mb-6">
              Join these successful companies and start your automation journey today
            </p>
            <Button variant="cta" size="lg" asChild>
              <Link href="/contact">Get Your Free Assessment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Results Overview */}
      <section className="py-20 bg-primary-50">
        <div className="synura-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              By the Numbers
            </h2>
            <p className="text-xl text-secondary-600">
              The measurable impact of our AI automation solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">2-3x</div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-1">Average ROI</h3>
              <p className="text-secondary-600">Within first 6 months</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">40-60%</div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-1">Time Savings</h3>
              <p className="text-secondary-600">On routine tasks</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">90%</div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-1">Client Satisfaction</h3>
              <p className="text-secondary-600">Would recommend us</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">30-90</div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-1">Days to Value</h3>
              <p className="text-secondary-600">Time to see results</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join the growing number of businesses transforming their operations with intelligent automation.
            Your success story could be next.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Schedule Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="!text-white border-white !bg-transparent hover:!bg-white hover:!text-primary-600">
              <Link href="/roi-calculator">Calculate Your ROI</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

export const metadata = {
  title: 'Case Studies & Success Stories | Synura AI Solutions',
  description: 'Real businesses, real results. See how our AI automation solutions have transformed operations and delivered measurable ROI across different industries.',
  keywords: ['case studies', 'AI automation success stories', 'business transformation', 'ROI results', 'automation examples', 'client testimonials'],
}