import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allServices } from '@/data/services'
import { Button } from '@/components/common/button'
import { ConsultationButton } from '@/components/common/consultation-button'
import { PageLayout } from '@/components/layout/page-layout'
// import { MDXContent } from '@/components/mdx-content' // Temporarily disabled

interface ServicePageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return allServices.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: ServicePageProps) {
  const service = allServices.find((service) => service.slug === params.slug)

  if (!service) {
    return {}
  }

  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
      type: 'article',
    },
  }
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = allServices.find((service) => service.slug === params.slug)

  if (!service) {
    notFound()
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-16">
        <div className="synura-container">
          <div className="max-w-4xl">
            <nav className="flex items-center space-x-2 text-sm text-secondary-600 mb-6">
              <Link href="/services" className="hover:text-primary-600 transition-colors">
                Services
              </Link>
              <span>→</span>
              <span className="text-secondary-900">{service.title}</span>
            </nav>

            <div className="flex items-center space-x-4 mb-6">
              {service.icon && <span className="text-4xl">{service.icon}</span>}
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900">
                {service.title}
              </h1>
            </div>

            <p className="text-xl text-secondary-600 mb-8 max-w-3xl">
              {service.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <ConsultationButton size="lg" variant="cta">
                Get Started
              </ConsultationButton>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits & Outcomes */}
      <section className="py-16 bg-white">
        <div className="synura-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {service.benefits && (
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Key Benefits</h2>
                <ul className="space-y-4">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-accent-500 mt-1">✓</span>
                      <span className="text-secondary-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.outcomes && (
              <div>
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Expected Outcomes</h2>
                <ul className="space-y-4">
                  {service.outcomes.map((outcome, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-primary-500 mt-1">→</span>
                      <span className="text-secondary-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Automation Examples */}
      <section className="py-16 bg-secondary-50">
        <div className="synura-container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary-900 text-center mb-4">
              {service.slug === 'ai-workforce' && 'Positions & Roles We Can Automate'}
              {service.slug === 'automation-integration' && 'Business Processes We Automate'}
              {service.slug === 'ai-consulting' && 'Strategic Areas We Optimize'}
              {service.slug === 'managed-operations' && 'Operational Areas We Manage'}
            </h2>
            <p className="text-lg text-secondary-600 text-center mb-12 max-w-3xl mx-auto">
              {service.slug === 'ai-workforce' && 'Transform these common business roles into AI-powered employees that work 24/7 with consistent quality and unlimited scalability.'}
              {service.slug === 'automation-integration' && 'Streamline these critical business processes to eliminate manual work and ensure seamless operations across your organization.'}
              {service.slug === 'ai-consulting' && 'Our strategic consulting covers these essential areas to maximize your automation ROI and minimize implementation risks.'}
              {service.slug === 'managed-operations' && 'We provide comprehensive management across these operational areas to ensure your AI systems deliver consistent value.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.slug === 'ai-workforce' && [
                { category: 'Customer Service', items: ['Inbound call agents', 'Live chat support', 'Email support specialists', 'Help desk technicians', 'Customer success managers'] },
                { category: 'Sales & Marketing', items: ['Outbound sales callers', 'Lead qualification agents', 'Email marketing specialists', 'Social media managers', 'Content creators'] },
                { category: 'Administrative', items: ['Data entry clerks', 'Administrative assistants', 'Appointment schedulers', 'Document processors', 'Report generators'] },
                { category: 'Operations', items: ['Order processing staff', 'Inventory coordinators', 'Quality assurance agents', 'Compliance monitors', 'Workflow coordinators'] },
                { category: 'Human Resources', items: ['Recruitment coordinators', 'Employee onboarding', 'Benefits administrators', 'Performance trackers', 'Training coordinators'] },
                { category: 'Finance & Accounting', items: ['Invoice processors', 'Expense coordinators', 'Payment collectors', 'Financial reporters', 'Budget analysts'] }
              ].map((category, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <span className="text-primary-500 mt-1 text-sm">•</span>
                        <span className="text-secondary-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {service.slug === 'automation-integration' && [
                { category: 'Sales & CRM', items: ['Lead capture & routing', 'Contact data sync', 'Pipeline management', 'Proposal generation', 'Follow-up sequences'] },
                { category: 'E-commerce', items: ['Order processing', 'Inventory updates', 'Customer notifications', 'Returns management', 'Shipping coordination'] },
                { category: 'Finance & Billing', items: ['Invoice generation', 'Payment processing', 'Expense tracking', 'Financial reporting', 'Budget monitoring'] },
                { category: 'Marketing', items: ['Email campaigns', 'Lead nurturing', 'Social media posting', 'Content distribution', 'Analytics reporting'] },
                { category: 'Operations', items: ['Document workflows', 'Approval processes', 'Task assignments', 'Quality checks', 'Compliance tracking'] },
                { category: 'Customer Success', items: ['Onboarding workflows', 'Support ticket routing', 'Customer health scoring', 'Renewal notifications', 'Feedback collection'] }
              ].map((category, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <span className="text-primary-500 mt-1 text-sm">•</span>
                        <span className="text-secondary-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {service.slug === 'ai-consulting' && [
                { category: 'Strategic Planning', items: ['Automation roadmapping', 'ROI analysis & projections', 'Priority identification', 'Resource allocation', 'Timeline development'] },
                { category: 'Technology Selection', items: ['Platform evaluation', 'Vendor comparison', 'Integration assessment', 'Scalability planning', 'Cost optimization'] },
                { category: 'Process Design', items: ['Workflow mapping', 'Efficiency analysis', 'Bottleneck identification', 'Quality assurance', 'Performance metrics'] },
                { category: 'Change Management', items: ['Team training programs', 'Adoption strategies', 'Communication plans', 'Resistance management', 'Success measurement'] },
                { category: 'Risk Management', items: ['Security assessment', 'Compliance planning', 'Backup strategies', 'Failure mitigation', 'Recovery procedures'] },
                { category: 'Performance Optimization', items: ['KPI development', 'Success tracking', 'Continuous improvement', 'Value measurement', 'ROI maximization'] }
              ].map((category, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <span className="text-primary-500 mt-1 text-sm">•</span>
                        <span className="text-secondary-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {service.slug === 'managed-operations' && [
                { category: 'System Monitoring', items: ['Performance tracking', 'Uptime monitoring', 'Error detection', 'Capacity planning', 'Health alerts'] },
                { category: 'Security & Compliance', items: ['Access control', 'Threat detection', 'Vulnerability scanning', 'Compliance reporting', 'Audit trails'] },
                { category: 'Maintenance & Updates', items: ['Software updates', 'Performance tuning', 'Bug fixes', 'Feature rollouts', 'System optimization'] },
                { category: 'Support & Training', items: ['User support', 'Technical assistance', 'Training programs', 'Documentation updates', 'Best practices'] },
                { category: 'Backup & Recovery', items: ['Data protection', 'Disaster recovery', 'System restoration', 'Business continuity', 'Recovery testing'] },
                { category: 'Analytics & Reporting', items: ['Performance dashboards', 'Usage analytics', 'ROI tracking', 'Trend analysis', 'Improvement recommendations'] }
              ].map((category, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">{category.category}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <span className="text-primary-500 mt-1 text-sm">•</span>
                        <span className="text-secondary-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {service.slug === 'ai-workforce' && (
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-8 mt-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                    Complete AI Teams & Departments
                  </h3>
                  <p className="text-lg text-secondary-700 mb-6 max-w-3xl mx-auto">
                    We don't just deploy individual AI agents - we create entire AI workforces with proper organizational structure, including managers, supervisors, and specialized team members working together seamlessly.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-secondary-900 mb-2">Individual Agents</h4>
                      <p className="text-sm text-secondary-600">Single AI employees for specific tasks</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-secondary-900 mb-2">Team Structure</h4>
                      <p className="text-sm text-secondary-600">Coordinated teams with managers & supervisors</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="font-semibold text-secondary-900 mb-2">Full Departments</h4>
                      <p className="text-sm text-secondary-600">Up to 10 AI employees in complete organizational hierarchy</p>
                    </div>
                  </div>
                  <p className="text-secondary-600 mb-4">
                    Scale from a single AI assistant to an entire virtual department that operates with the coordination and efficiency of a human team, but with 24/7 availability and unlimited capacity.
                  </p>
                </div>
              </div>
            )}

            <div className="text-center mt-12">
              <div className="bg-white rounded-lg p-6 border border-primary-200">
                <p className="text-lg text-secondary-700 mb-4">
                  {service.slug === 'ai-workforce' && 'Don\'t see your specific role listed? We can automate virtually any position that involves repetitive tasks, customer interactions, or data processing - from individual roles to complete departments.'}
                  {service.slug === 'automation-integration' && 'Have a unique process that needs automation? We specialize in creating custom solutions for any business workflow or integration requirement.'}
                  {service.slug === 'ai-consulting' && 'Need guidance in a specific area not mentioned? Our consultants have experience across all industries and automation scenarios.'}
                  {service.slug === 'managed-operations' && 'Have specific operational requirements? We customize our management services to match your exact needs and service level requirements.'}
                </p>
                <ConsultationButton variant="cta" size="lg">
                  Discuss Your Specific Needs
                </ConsultationButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16 bg-white">
        <div className="synura-container">
          <h2 className="text-3xl font-bold text-secondary-900 text-center mb-12">
            Related Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allServices
              .filter((s) => s.slug !== service.slug)
              .slice(0, 3)
              .map((relatedService) => (
                <div
                  key={relatedService.slug}
                  className="border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
                >
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {relatedService.title}
                  </h3>
                  <p className="text-secondary-600 text-sm mb-4">
                    {relatedService.description}
                  </p>
                  <Button variant="ghost" asChild className="p-0 h-auto text-primary-600">
                    <Link href={relatedService.url}>
                      Learn More →
                    </Link>
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 synura-gradient">
        <div className="synura-container text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started with {service.title}?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Schedule a free consultation to discuss how this service can transform your business operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ConsultationButton size="lg" variant="secondary">
              Book Free Consultation
            </ConsultationButton>
            <Button size="lg" variant="outline" asChild className="text-white border-white hover:bg-white hover:text-primary-600">
              <Link href="/case-studies">View Case Studies</Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}