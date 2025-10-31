'use client'

import { useState } from 'react'
import { Button } from '@/components/common/button'
import CalBooking from './CalBooking'
import { X } from 'lucide-react'

interface ConsultationButtonProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline'
  children?: React.ReactNode
  className?: string
  // Cal.com specific props
  username?: string
  eventSlug?: string
  view?: "month_view" | "week_view" | "column_view"
}

export default function ConsultationButton({
  size = 'lg',
  variant = 'secondary',
  children = 'Schedule Free Consultation',
  className = '',
  username,
  eventSlug,
  view = 'month_view'
}: ConsultationButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleBookingSuccess = () => {
    // Close modal on successful booking
    closeModal()

    // Optional: Show success message or redirect
    // You can add custom logic here
  }

  return (
    <>
      {/* Consultation Button */}
      <Button
        size={size}
        variant={variant}
        onClick={openModal}
        className={className}
      >
        {children}
      </Button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-secondary-900">
                  Schedule Your Free Consultation
                </h2>
                <p className="text-secondary-600 mt-1">
                  Let's discuss how AI automation can transform your business
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={closeModal}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Calendar Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <CalBooking
                username={username}
                eventSlug={eventSlug}
                view={view}
                onBookingSuccess={handleBookingSuccess}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}