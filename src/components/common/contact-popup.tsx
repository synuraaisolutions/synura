'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from './button'

export function ContactPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Show popup after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`fixed right-4 bottom-20 z-40 transition-all duration-300 ${
        isMinimized ? 'transform scale-75 opacity-75' : ''
      }`}
    >
      {isMinimized ? (
        // Minimized state - just a button
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      ) : (
        // Expanded popup
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C10.89 2 10 2.89 10 4V12C10 13.11 10.89 14 12 14S14 13.11 14 12V4C14 2.89 13.11 2 12 2Z"/>
                  <path d="M19 11V12C19 15.87 15.87 19 12 19S5 15.87 5 12V11H7V12C7 14.76 9.24 17 12 17S17 14.76 17 12V11H19Z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Need Help?</h3>
                <p className="text-xs text-gray-500">We're here to assist</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Have questions about AI automation? Get instant answers or schedule a consultation.
            </p>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button variant="cta" size="sm" asChild className="w-full">
                <Link href="/contact">Schedule Free Consultation</Link>
              </Button>

              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/faqs">View FAQs</Link>
              </Button>
            </div>

            {/* Contact Options */}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Or contact us directly:</p>
              <div className="space-y-1">
                <a
                  href="mailto:sales@synura.ai"
                  className="flex items-center text-xs text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  sales@synura.ai
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}