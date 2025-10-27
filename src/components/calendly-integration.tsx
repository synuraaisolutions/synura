'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Calendly: any
  }
}

export function CalendlyIntegration() {
  useEffect(() => {
    // Load Calendly CSS (same as your provided code)
    const link = document.createElement('link')
    link.href = 'https://assets.calendly.com/assets/external/widget.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    // Load Calendly JavaScript (same as your provided code)
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.type = 'text/javascript'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      // Simple function to convert consultation buttons to Calendly popups
      const convertConsultationButtons = () => {
        const consultationButtons = document.querySelectorAll('a[href="/contact"]')

        consultationButtons.forEach(button => {
          const buttonText = button.textContent?.toLowerCase() || ''
          const isConsultationButton = buttonText.includes('consultation') ||
                                     buttonText.includes('book') ||
                                     buttonText.includes('schedule') ||
                                     buttonText.includes('get started')

          if (isConsultationButton && !button.hasAttribute('data-calendly-converted')) {
            button.setAttribute('data-calendly-converted', 'true')
            button.setAttribute('href', '')
            button.setAttribute('onclick', "Calendly.initPopupWidget({url: 'https://calendly.com/synuraaisolutions/30min'}); return false;")
          }
        })
      }

      // Convert buttons immediately and after a delay
      convertConsultationButtons()
      setTimeout(convertConsultationButtons, 1000)
      setTimeout(convertConsultationButtons, 2000)
    }

    script.onerror = () => {
      console.error('Failed to load Calendly script')
    }

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    }
  }, [])

  return null
}