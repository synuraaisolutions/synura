'use client'

import { Button } from '@/components/common/button'

interface ConsultationButtonProps {
  children: React.ReactNode
  size?: 'sm' | 'lg' | 'xl'
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'cta'
  className?: string
}

export function ConsultationButton({
  children,
  size = 'lg',
  variant = 'cta',
  className
}: ConsultationButtonProps) {
  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={() => {
        if (typeof window !== 'undefined' && (window as any).Calendly) {
          (window as any).Calendly.initPopupWidget({
            url: 'https://calendly.com/synuraaisolutions/30min?hide_event_type_details=1&hide_gdpr_banner=1'
          });
        }
      }}
    >
      {children}
    </Button>
  )
}