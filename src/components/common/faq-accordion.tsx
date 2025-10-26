'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  title: string
  faqs: FAQItem[]
  defaultOpen?: boolean
}

export function FAQAccordion({ title, faqs, defaultOpen = false }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(
    defaultOpen ? new Set(faqs.map((_, index) => index)) : new Set()
  )

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-secondary-900 text-center mb-8">
        {title}
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-secondary-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-secondary-50 transition-colors duration-200 rounded-lg"
              aria-expanded={openItems.has(index)}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-lg font-semibold text-secondary-900 pr-4">
                {faq.question}
              </span>
              <div className="flex-shrink-0">
                {openItems.has(index) ? (
                  <ChevronDownIcon className="h-5 w-5 text-primary-600 transform transition-transform duration-200" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 text-secondary-400 transform transition-transform duration-200" />
                )}
              </div>
            </button>

            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openItems.has(index)
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-4">
                <div className="prose prose-secondary max-w-none">
                  <p className="text-secondary-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Heroicons alternative - using simpler SVG icons if Heroicons not available
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

// Fallback component without Heroicons dependency
export function FAQAccordionSimple({ title, faqs, defaultOpen = false }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(
    defaultOpen ? new Set(faqs.map((_, index) => index)) : new Set()
  )

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-secondary-900 text-center mb-8">
        {title}
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-secondary-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-secondary-50 transition-colors duration-200 rounded-lg"
              aria-expanded={openItems.has(index)}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-lg font-semibold text-secondary-900 pr-4">
                {faq.question}
              </span>
              <div className="flex-shrink-0">
                {openItems.has(index) ? (
                  <ChevronDown className="h-5 w-5 text-primary-600 transform transition-transform duration-200" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-secondary-400 transform transition-transform duration-200" />
                )}
              </div>
            </button>

            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openItems.has(index)
                  ? 'max-h-96 opacity-100'
                  : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-4">
                <div className="prose prose-secondary max-w-none">
                  <p className="text-secondary-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}