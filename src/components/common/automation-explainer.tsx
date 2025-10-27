'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from './button'

export function AutomationExplainer() {
  const [isOpen, setIsOpen] = useState(false)

  const explanations = [
    {
      question: "What does automation actually mean?",
      answer: "Think of automation like having a super-efficient assistant that never sleeps, never makes mistakes, and can handle boring, repetitive tasks. Instead of you or your team doing the same thing over and over, the computer does it for you automatically."
    },
    {
      question: "Why do businesses need it?",
      answer: "Every day, people spend hours on tasks like copying data between systems, sending follow-up emails, or creating reports. This time could be spent growing the business instead. Automation frees up your team to focus on creative, strategic work that actually makes money."
    },
    {
      question: "How does it save money?",
      answer: "When you pay someone $20/hour to do data entry for 10 hours a week, that's $10,400 per year. Automation can do the same work for a few hundred dollars, working 24/7 without breaks, sick days, or mistakes. The math is simple."
    },
    {
      question: "Is it complicated to set up?",
      answer: "Not for you! We handle all the technical stuff. You tell us what takes up your time, and we build systems that do it automatically. Most clients see results within weeks, and the systems work behind the scenes so you don't have to think about them."
    }
  ]

  return (
    <section className="py-20 bg-primary-25">
      <div className="synura-container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-secondary-900 mb-6">
            New to Business Automation?
          </h2>
          <p className="text-xl text-secondary-600 mb-8">
            Here's everything you need to know, explained in simple terms.
          </p>

          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="mb-8 bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
          >
            {isOpen ? 'Hide Explanation' : 'Why Do Companies Need Automation?'}
            <span className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              ↓
            </span>
          </Button>

          {isOpen && (
            <div className="bg-white rounded-lg shadow-lg p-8 text-left animate-in slide-in-from-top duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  {explanations.map((item, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-6">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-3">
                        {item.question}
                      </h3>
                      <p className="text-secondary-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                    Real Automation Example
                  </h3>
                  <div className="bg-secondary-50 rounded-lg p-3 md:p-4 mb-4">
                    <Image
                      src="/images/professional/automation-workflow-diagram.jpg"
                      alt="Complex automation workflow showing Google Sheets triggers, data processing, filtering, and multi-step integration"
                      width={500}
                      height={300}
                      className="rounded-lg object-cover w-full h-auto"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <p className="text-sm text-secondary-600">
                    This workflow automatically processes data, applies filters, and integrates with multiple systems -
                    saving 15+ hours per week of manual work.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-accent-50 rounded-lg">
                <h3 className="text-lg font-semibold text-accent-800 mb-3">
                  The Bottom Line
                </h3>
                <p className="text-accent-700">
                  Automation isn't about replacing people—it's about freeing them up to do work that
                  actually matters. Instead of spending time on repetitive tasks, your team can focus
                  on growing the business, serving customers, and being creative.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}