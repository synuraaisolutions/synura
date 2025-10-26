'use client'

import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    RetellAI?: any
  }
}

interface RetellWidgetProps {
  publicKey: string
  agentId: string
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme?: 'synura' | 'light' | 'dark'
  autoLoad?: boolean
}

export function RetellWidget({
  publicKey,
  agentId,
  position = 'bottom-right',
  theme = 'synura',
  autoLoad = true,
}: RetellWidgetProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const retellClientRef = useRef<any>(null)
  const callRef = useRef<any>(null)

  useEffect(() => {
    if (!autoLoad || !publicKey || !agentId) return

    // Initialize Retell client when SDK is loaded
    const initRetellClient = () => {
      try {
        if (window.RetellAI && !retellClientRef.current) {
          retellClientRef.current = new window.RetellAI({
            publicKey: publicKey
          })
          console.log('Retell AI client initialized')
        }
      } catch (error) {
        console.error('Failed to initialize Retell client:', error)
      }
    }

    // Check if SDK is already loaded
    if (window.RetellAI) {
      initRetellClient()
    } else {
      // Wait for SDK to load (it's loaded in layout.tsx)
      const checkForRetell = setInterval(() => {
        if (window.RetellAI) {
          clearInterval(checkForRetell)
          initRetellClient()
        }
      }, 100)

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkForRetell), 10000)
    }
  }, [publicKey, agentId, autoLoad])

  const startCall = async () => {
    if (!retellClientRef.current || isLoading) return

    try {
      setIsLoading(true)
      console.log('Starting Retell AI call with agent:', agentId)

      const call = await retellClientRef.current.startCall({
        agentId: agentId,
      })

      if (call) {
        callRef.current = call
        await call.connectMedia() // Connect microphone and speaker
        setIsCallActive(true)

        // Handle call events
        call.on('disconnect', () => {
          setIsCallActive(false)
          setIsLoading(false)
          callRef.current = null
          console.log('Call disconnected')
        })

        call.on('error', (error: any) => {
          console.error('Call error:', error)
          setIsCallActive(false)
          setIsLoading(false)
          callRef.current = null
        })
      }
    } catch (error) {
      console.error('Failed to start call:', error)
      setIsLoading(false)
    }
  }

  const endCall = () => {
    if (callRef.current) {
      callRef.current.disconnect()
      callRef.current = null
      setIsCallActive(false)
      setIsLoading(false)
    }
  }

  // Position styles
  const positionStyles = {
    'bottom-right': { bottom: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'top-left': { top: '20px', left: '20px' },
  }

  // Theme colors
  const themeColors = {
    synura: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      text: 'white'
    },
    light: {
      primary: '#f3f4f6',
      secondary: '#e5e7eb',
      text: '#1f2937'
    },
    dark: {
      primary: '#1f2937',
      secondary: '#111827',
      text: 'white'
    }
  }

  const colors = themeColors[theme]

  if (!publicKey || !agentId) {
    return null // Don't render if credentials are missing
  }

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        zIndex: 1000,
      }}
    >
      {/* Main Voice Button */}
      <button
        onClick={isCallActive ? endCall : startCall}
        disabled={isLoading}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          background: isCallActive
            ? `linear-gradient(135deg, #ef4444, #dc2626)`
            : `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
          color: colors.text,
          cursor: isLoading ? 'wait' : 'pointer',
          boxShadow: isCallActive
            ? '0 4px 12px rgba(239, 68, 68, 0.4)'
            : `0 4px 12px rgba(59, 130, 246, 0.4)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          animation: isCallActive ? 'pulse 1s infinite' : 'none',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = isCallActive
              ? '0 6px 20px rgba(239, 68, 68, 0.6)'
              : '0 6px 20px rgba(59, 130, 246, 0.6)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = isCallActive
            ? '0 4px 12px rgba(239, 68, 68, 0.4)'
            : '0 4px 12px rgba(59, 130, 246, 0.4)'
        }}
      >
        {isLoading ? (
          // Loading spinner
          <div
            style={{
              width: '24px',
              height: '24px',
              border: `2px solid ${colors.text}`,
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        ) : isCallActive ? (
          // Stop/End call icon
          <svg width="24" height="24" fill={colors.text} viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
        ) : (
          // Microphone icon
          <svg width="24" height="24" fill={colors.text} viewBox="0 0 24 24">
            <path d="M12 2C10.89 2 10 2.89 10 4V12C10 13.11 10.89 14 12 14S14 13.11 14 12V4C14 2.89 13.11 2 12 2Z"/>
            <path d="M19 11V12C19 15.87 15.87 19 12 19S5 15.87 5 12V11H7V12C7 14.76 9.24 17 12 17S17 14.76 17 12V11H19Z"/>
            <path d="M11 21H13V24H11V21Z"/>
          </svg>
        )}
      </button>

      {/* Call Status Indicator */}
      {isCallActive && (
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
          }}
        >
          🔴 Live Call
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Fallback component when Retell integration fails
export function RetellFallback() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: '#1f2937',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.9rem',
        maxWidth: '200px',
      }}
      onClick={() => window.location.href = '/contact'}
    >
      <strong>Need Help?</strong>
      <br />
      Click to contact us directly
    </div>
  )
}