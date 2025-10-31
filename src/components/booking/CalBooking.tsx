'use client'

import Cal, { getCalApi } from "@calcom/embed-react"
import { useEffect, useState } from 'react'

interface CalBookingProps {
  username?: string
  eventSlug?: string
  className?: string
  onBookingSuccess?: () => void
}

export default function CalBooking({
  username = "synuraai", // Your actual Cal.com username
  eventSlug = "30000", // Your actual Cal.com event slug
  className = "",
  onBookingSuccess
}: CalBookingProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi()

        // Set up event listeners
        cal("on", {
          action: "bookingSuccessful",
          callback: () => {
            console.log("Synura consultation booking created successfully")

            // Track booking in analytics
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'booking_completed', {
                event_category: 'consultation',
                event_label: 'cal_com_booking'
              })
            }

            // Call custom success handler if provided
            onBookingSuccess?.()
          }
        })

        // Listen for embed ready event
        cal("on", {
          action: "linkReady",
          callback: () => {
            setIsLoading(false)
          }
        })

        // Listen for errors
        cal("on", {
          action: "error",
          callback: (e) => {
            console.warn("Cal.com embed error:", e)
            setIsLoading(false)
            setHasError(true)
          }
        })

      } catch (error) {
        console.error("Failed to initialize Cal.com:", error)
        setIsLoading(false)
        setHasError(true)
      }
    })()
  }, [onBookingSuccess])

  if (hasError) {
    return (
      <div className={`cal-booking-container ${className} flex items-center justify-center`} style={{ minHeight: '600px' }}>
        <div className="text-center p-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h2a1 1 0 011 1v11a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Booking Calendar Setup Required
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Our booking calendar is currently being configured. Please contact us directly to schedule your consultation.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Contact us:</p>
            <p className="text-sm text-blue-600">hello@synura.ai</p>
            <p className="text-sm text-gray-600">We'll get back to you within 24 hours</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`cal-booking-container ${className} relative`} style={{ minHeight: '600px' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading booking calendar...</p>
          </div>
        </div>
      )}
      <Cal
        calLink={`${username}/${eventSlug}`}
        config={{
          layout: 'month_view',
          theme: 'light'
        }}
        style={{
          width: "100%",
          height: "100%",
          overflow: "scroll",
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  )
}