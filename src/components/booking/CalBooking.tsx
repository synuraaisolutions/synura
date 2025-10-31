'use client'

import { BookerEmbed } from "@calcom/atoms"

interface CalBookingProps {
  username?: string
  eventSlug?: string
  view?: "MONTH_VIEW" | "WEEK_VIEW" | "COLUMN_VIEW"
  className?: string
  onBookingSuccess?: () => void
}

export default function CalBooking({
  username = "synuraaisolutions", // Default username - update with your actual Cal.com username
  eventSlug = "30min", // Default event slug - update with your actual event slug
  view = "MONTH_VIEW",
  className = "",
  onBookingSuccess
}: CalBookingProps) {
  const handleBookingSuccess = () => {
    console.log("Synura consultation booking created successfully")

    // Optional: Track booking in analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'booking_completed', {
        event_category: 'consultation',
        event_label: 'cal_com_booking'
      })
    }

    // Call custom success handler if provided
    onBookingSuccess?.()
  }

  return (
    <div className={`cal-booking-container ${className}`}>
      <BookerEmbed
        username={username}
        eventSlug={eventSlug}
        view={view}
        customClassNames={{
          bookerContainer: "border-gray-200 border rounded-lg shadow-sm bg-white"
        }}
        onCreateBookingSuccess={handleBookingSuccess}
      />
    </div>
  )
}