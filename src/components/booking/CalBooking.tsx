'use client'

import { BookerEmbed } from "@calcom/atoms"

interface CalBookingProps {
  username?: string
  eventSlug?: string
  view?: "month_view" | "week_view" | "column_view"
  className?: string
  onBookingSuccess?: () => void
}

export default function CalBooking({
  username = "synuraaisolutions", // Default username - update with your actual Cal.com username
  eventSlug = "30min", // Default event slug - update with your actual event slug
  view = "month_view",
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
          bookerContainer: "border-gray-200 border rounded-lg shadow-sm bg-white",
          // Add Synura brand styling
          eventMeta: "text-secondary-600",
          datePickerContainer: "border-gray-100",
          timeSlot: "hover:bg-primary-50 border-primary-200",
          selectedTimeSlot: "bg-primary-600 text-white",
          bookingForm: "space-y-4",
          submitButton: "bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        }}
        onCreateBookingSuccess={handleBookingSuccess}
      />
    </div>
  )
}