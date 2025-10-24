'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    RetellWebClient?: any
    retellConfig?: {
      agentId: string
      position: string
      theme: string
    }
  }
}

interface RetellWidgetProps {
  agentId?: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme?: 'synura' | 'light' | 'dark'
  autoLoad?: boolean
}

export function RetellWidget({
  agentId = 'verus',
  position = 'bottom-right',
  theme = 'synura',
  autoLoad = true,
}: RetellWidgetProps) {
  useEffect(() => {
    if (!autoLoad) return

    // Set global config for Retell
    window.retellConfig = {
      agentId,
      position,
      theme,
    }

    // Initialize Retell widget
    const initRetell = () => {
      // This is a placeholder for actual Retell initialization
      // In production, this would use the actual Retell SDK
      console.log('Retell (Verus) widget initialized with config:', window.retellConfig)

      // Simulate widget creation
      createMockWidget()
    }

    // Load Retell script if not already loaded
    if (!window.RetellWebClient) {
      const script = document.createElement('script')
      script.src = 'https://cdn.retell.ai/web-client/latest/retell-web-client.js'
      script.async = true
      script.onload = initRetell
      script.onerror = (error) => {
        console.error('Failed to load Retell widget:', error)
        // Fallback: show contact form or phone number
        showFallbackContact()
      }
      document.head.appendChild(script)
    } else {
      initRetell()
    }

    // Cleanup
    return () => {
      if (window.RetellWebClient) {
        // Cleanup Retell instance if needed
        console.log('Cleaning up Retell widget')
      }
    }
  }, [agentId, position, theme, autoLoad])

  return null // This component doesn't render anything visible
}

// Mock widget for development/demonstration
function createMockWidget() {
  // Remove existing mock widget
  const existingWidget = document.getElementById('retell-mock-widget')
  if (existingWidget) {
    existingWidget.remove()
  }

  // Create mock widget element
  const widget = document.createElement('div')
  widget.id = 'retell-mock-widget'
  widget.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: all 0.3s ease;
    animation: pulse 2s infinite;
  `

  // Add icon
  widget.innerHTML = `
    <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
      <path d="M12 1C10.6 1 9.5 2.1 9.5 3.5V11.5C9.5 12.9 10.6 14 12 14S14.5 12.9 14.5 11.5V3.5C14.5 2.1 13.4 1 12 1Z"/>
      <path d="M19 10V11.5C19 15.6 15.6 19 11.5 19H11V22H13V19.9C16.5 19.4 19.4 16.5 19.9 13H22V11H19.9C19.4 7.5 16.5 4.6 13 4.1V7H11V4.1C7.5 4.6 4.6 7.5 4.1 11H7V13H4.1C4.6 16.5 7.5 19.4 11 19.9V22H13V19H12.5C16.6 19 20 15.6 20 11.5V10H19Z"/>
    </svg>
  `

  // Add hover effect
  widget.addEventListener('mouseenter', () => {
    widget.style.transform = 'scale(1.1)'
    widget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)'
  })

  widget.addEventListener('mouseleave', () => {
    widget.style.transform = 'scale(1)'
    widget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
  })

  // Add click handler
  widget.addEventListener('click', () => {
    // In production, this would open the Retell voice interface
    console.log('Retell voice agent (Verus) activated')
    showMockVoiceInterface()
  })

  // Add CSS animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes pulse {
      0% {
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }
      50% {
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.8);
      }
      100% {
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }
    }
  `
  document.head.appendChild(style)

  document.body.appendChild(widget)
}

// Mock voice interface for demonstration
function showMockVoiceInterface() {
  // Create modal overlay
  const overlay = document.createElement('div')
  overlay.id = 'retell-voice-modal'
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `

  // Create modal content
  const modal = document.createElement('div')
  modal.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  `

  modal.innerHTML = `
    <div style="margin-bottom: 1rem;">
      <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;">
        <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
          <path d="M12 1C10.6 1 9.5 2.1 9.5 3.5V11.5C9.5 12.9 10.6 14 12 14S14.5 12.9 14.5 11.5V3.5C14.5 2.1 13.4 1 12 1Z"/>
        </svg>
      </div>
      <h3 style="margin: 0 0 0.5rem; color: #1f2937; font-size: 1.5rem; font-weight: 600;">Hi! I'm Verus</h3>
      <p style="margin: 0 0 1.5rem; color: #6b7280; font-size: 1rem;">Your AI assistant from Synura. I'm here to help you discover how automation can transform your business.</p>
    </div>

    <div style="background: #f3f4f6; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
      <p style="margin: 0; color: #374151; font-size: 0.9rem;">
        🎤 <strong>Voice Interface Demo</strong><br>
        In production, this would be a live voice conversation where you can ask me about:
      </p>
      <ul style="margin: 0.5rem 0 0; padding-left: 1rem; color: #374151; font-size: 0.85rem; text-align: left;">
        <li>Automation opportunities for your business</li>
        <li>ROI estimates and pricing</li>
        <li>Scheduling consultations</li>
        <li>Service recommendations</li>
      </ul>
    </div>

    <div style="display: flex; gap: 0.5rem; justify-content: center;">
      <button id="start-consultation" style="background: #3b82f6; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 500; cursor: pointer;">
        Start Consultation
      </button>
      <button id="close-modal" style="background: #e5e7eb; color: #374151; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 500; cursor: pointer;">
        Close
      </button>
    </div>
  `

  overlay.appendChild(modal)
  document.body.appendChild(overlay)

  // Add event listeners
  const closeModal = () => {
    document.body.removeChild(overlay)
  }

  const startConsultation = () => {
    // In production, this would start the Retell voice session
    console.log('Starting voice consultation with Verus...')
    closeModal()
    // Redirect to contact form or start voice session
    window.location.href = '/contact'
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal()
  })

  modal.querySelector('#close-modal')?.addEventListener('click', closeModal)
  modal.querySelector('#start-consultation')?.addEventListener('click', startConsultation)
}

// Fallback contact options when Retell fails to load
function showFallbackContact() {
  console.log('Retell unavailable, showing fallback contact options')

  // Create simple contact button as fallback
  const fallbackButton = document.createElement('div')
  fallbackButton.id = 'retell-fallback-contact'
  fallbackButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1f2937;
    color: white;
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    font-family: system-ui, sans-serif;
    font-size: 0.9rem;
    max-width: 200px;
  `

  fallbackButton.innerHTML = `
    <strong>Need Help?</strong><br>
    Click to contact us directly
  `

  fallbackButton.addEventListener('click', () => {
    window.location.href = '/contact'
  })

  document.body.appendChild(fallbackButton)
}