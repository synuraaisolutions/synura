import Link from 'next/link'
import { allCaseStudies } from '@/data/case-studies'
import { Button } from '@/components/common/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/card'
import { PageLayout } from '@/components/layout/page-layout'
// Removed MDX dependency to eliminate parsing issues
import { notFound } from 'next/navigation'

interface CaseStudyPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return allCaseStudies.map((caseStudy) => ({
    slug: caseStudy.slug,
  }))
}

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const caseStudy = allCaseStudies.find((caseStudy) => caseStudy.slug === params.slug)

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found | Synura AI Solutions',
    }
  }

  return {
    title: `${caseStudy.title} | Case Study | Synura AI Solutions`,
    description: caseStudy.description,
    keywords: [
      'case study',
      caseStudy.industry,
      'AI automation',
      'business transformation',
      ...caseStudy.services,
    ],
  }
}

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const caseStudy = allCaseStudies.find((caseStudy) => caseStudy.slug === params.slug)

  if (!caseStudy) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const otherCaseStudies = allCaseStudies
    .filter(cs => cs.slug !== caseStudy.slug)
    .slice(0, 3)

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <section className="bg-secondary-50 py-6">
        <div className="synura-container">
          <nav className="text-sm text-secondary-600">
            <Link href="/" className="hover:text-primary-600">Home</Link>
            <span className="mx-2">→</span>
            <Link href="/case-studies" className="hover:text-primary-600">Case Studies</Link>
            <span className="mx-2">→</span>
            <span className="text-secondary-900">{caseStudy.title}</span>
          </nav>
        </div>
      </section>

      {/* Header */}
      <section className="py-16 bg-white">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {caseStudy.industry}
                </span>
                <span className="text-secondary-500 text-sm">
                  Published {formatDate(caseStudy.publishedAt)}
                </span>
              </div>
              {caseStudy.featured && (
                <div className="mb-4">
                  <span className="bg-accent-100 text-accent-800 px-3 py-1 rounded-full text-sm font-medium">
                    ⭐ Featured Case Study
                  </span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
              {caseStudy.title}
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              {caseStudy.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-secondary-900">Industry</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-600">{caseStudy.industry}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-secondary-900">Company Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-600">{caseStudy.companySize}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-secondary-900">ROI Achieved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-600 font-semibold">{caseStudy.roi}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge & Solution Overview */}
      <section className="py-16 bg-secondary-50">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-2xl text-red-900 flex items-center">
                    <span className="mr-3">🎯</span>
                    Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-800 text-lg leading-relaxed">
                    {caseStudy.challenge}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900 flex items-center">
                    <span className="mr-3">💡</span>
                    Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-800 text-lg leading-relaxed">
                    {caseStudy.solution}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Used */}
      <section className="py-16 bg-white">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
              Services Implemented
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {caseStudy.services.map((service: string, index: number) => (
                <span
                  key={index}
                  className="bg-primary-100 text-primary-800 px-4 py-2 rounded-lg font-medium text-lg"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Results */}
      <section className="py-16 bg-accent-50">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary-900 mb-8 text-center">
              Key Results Achieved
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudy.results.map((result: string, index: number) => (
                <Card key={index} className="border-accent-200 bg-white">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-secondary-700 text-lg">{result}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonial */}
      <section className="py-16 bg-primary-50">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-secondary-900 mb-8">What Our Client Says</h2>
            <Card className="bg-white border-primary-200">
              <CardContent className="p-8">
                <svg className="w-12 h-12 text-primary-600 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                </svg>
                <blockquote className="text-xl text-secondary-700 leading-relaxed mb-6">
                  "{caseStudy.clientTestimonial}"
                </blockquote>
                <div className="border-t border-secondary-200 pt-6">
                  <p className="font-semibold text-secondary-900 text-lg">{caseStudy.clientName}</p>
                  <p className="text-secondary-600">{caseStudy.clientTitle}</p>
                  <div className="mt-2 flex items-center justify-center space-x-4 text-sm text-primary-600 font-medium">
                    <span>{caseStudy.companySize}</span>
                    <span>•</span>
                    <span>{caseStudy.roi} achieved</span>
                    <span>•</span>
                    <span>{caseStudy.implementationTime} implementation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Implementation Summary */}
      <section className="py-16 bg-white">
        <div className="synura-container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-secondary-900 mb-8">
              Implementation Success
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary-600 mb-2">{caseStudy.implementationTime}</div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Implementation Time</h3>
                  <p className="text-secondary-600 text-sm">From planning to full deployment</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-accent-600 mb-2">{caseStudy.roi}</div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Return on Investment</h3>
                  <p className="text-secondary-600 text-sm">Measurable business impact achieved</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-secondary-600 mb-2">{caseStudy.companySize}</div>
                  <h3 className="font-semibold text-secondary-900 mb-2">Company Scale</h3>
                  <p className="text-secondary-600 text-sm">Organization size and complexity</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Other Case Studies */}
      {otherCaseStudies.length > 0 && (
        <section className="py-20 bg-secondary-50">
          <div className="synura-container">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-secondary-900 mb-12 text-center">
                More Success Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {otherCaseStudies.map((cs) => (
                  <Card key={cs.slug} className="border-secondary-200 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="text-sm text-secondary-500 mb-2">{cs.industry}</div>
                      <CardTitle className="text-lg">
                        <Link href={cs.url} className="hover:text-primary-600">
                          {cs.title}
                        </Link>
                      </CardTitle>
                      <CardDescription>{cs.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={cs.url}>Read Case Study</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button variant="outline" asChild>
                  <Link href="/case-studies">View All Case Studies</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Similar Results?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Every business is unique, but the results are consistently impressive.
            Let's discuss how we can transform your operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Schedule Free Consultation</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-primary-600">
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}