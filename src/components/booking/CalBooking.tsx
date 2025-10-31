'use client'

import Cal, { getCalApi } from "@calcom/embed-react"
import { useEffect } from 'react'

interface CalBookingProps {
  username?: string
  eventSlug?: string
  className?: string
  onBookingSuccess?: () => void
}

export default function CalBooking({
  username = "synuraaisolutions", // Update with your actual Cal.com username
  eventSlug = "30min", // Update with your actual Cal.com event slug
  className = "",
  onBookingSuccess
}: CalBookingProps) {
  useEffect(() => {
    (async function () {
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
    })()
  }, [onBookingSuccess])

  return (
    <div className={`cal-booking-container ${className}`} style={{ minHeight: '600px' }}>
      <Cal
        calLink={`${username}/${eventSlug}`}
        config={{
          layout: 'month_view',
          theme: 'light'
        }}
        style={{
          width: "100%",
          height: "100%",
          overflow: "scroll"
        }}
      />
    </div>
  )
}