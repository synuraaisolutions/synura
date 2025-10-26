'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './button'

// Import Retell SDK
let RetellWebClient: any = null
if (typeof window !== 'undefined') {
  import('retell-client-js-sdk').then((module) => {
    RetellWebClient = module.RetellWebClient
  })
}

interface VoiceAgentButtonProps {
  variant?: 'default' | 'cta' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'xl'
  className?: string
  children?: React.ReactNode
}

export function VoiceAgentButton({
  variant = 'cta',
  size = 'lg',
  className,
  children = 'Talk to Verus - Our AI Assistant'
}: VoiceAgentButtonProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSDKReady, setIsSDKReady] = useState(false)
  const retellClientRef = useRef<any>(null)
  const callRef = useRef<any>(null)

  useEffect(() => {
    // Check if SDK is loaded and initialize client
    const checkSDK = () => {
      if (RetellWebClient && !retellClientRef.current) {
        try {
          retellClientRef.current = new RetellWebClient()
          setIsSDKReady(true)
          console.log('Voice Agent Button: Retell client initialized')
        } catch (error) {
          console.error('Voice Agent Button: Failed to initialize Retell client:', error)
        }
      }
    }

    if (RetellWebClient) {
      checkSDK()
    } else {
      // Wait for SDK to load
      const interval = setInterval(() => {
        if (RetellWebClient) {
          clearInterval(interval)
          checkSDK()
        }
      }, 100)

      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(interval), 10000)

      return () => clearInterval(interval)
    }
  }, [])

  const startCall = async () => {
    // If SDK isn't ready, redirect to contact page
    if (!isSDKReady && showFallback) {
      window.location.href = '/contact'
      return
    }

    if (!retellClientRef.current || isLoading || !isSDKReady) return

    try {
      setIsLoading(true)

      console.log('Voice Agent Button: Creating call access token...')

      // Call our API to get access token
      const response = await fetch('/api/v1/voice/create-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: process.env.NEXT_PUBLIC_RETELL_AGENT_ID
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create call')
      }

      const { access_token, call_id } = await response.json()

      console.log('Voice Agent Button: Starting call with access token...')

      // Start call with access token
      const call = await retellClientRef.current.startCall({
        accessToken: access_token,
        callId: call_id,
        sampleRate: 24000,
      })

      if (call) {
        callRef.current = call
        setIsCallActive(true)

        // Handle call events
        call.on('disconnect', () => {
          setIsCallActive(false)
          setIsLoading(false)
          callRef.current = null
          console.log('Voice Agent Button: Call disconnected')
        })

        call.on('error', (error: any) => {
          console.error('Voice Agent Button: Call error:', error)
          setIsCallActive(false)
          setIsLoading(false)
          callRef.current = null
        })

        call.on('call_started', () => {
          console.log('Voice Agent Button: Call started successfully')
          setIsLoading(false)
        })

        call.on('call_ended', () => {
          console.log('Voice Agent Button: Call ended')
          setIsCallActive(false)
          setIsLoading(false)
          callRef.current = null
        })
      }
    } catch (error) {
      console.error('Voice Agent Button: Failed to start call:', error)
      setIsLoading(false)

      // Show error to user or redirect to contact page
      if (showFallback) {
        window.location.href = '/contact'
      }
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

  // Show fallback button if SDK isn't ready after 5 seconds
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!isSDKReady) {
        setShowFallback(true)
        console.log('Voice Agent Button: Showing fallback due to SDK not loading')
      }
    }, 5000)

    return () => clearTimeout(fallbackTimer)
  }, [isSDKReady])

  if (!isSDKReady && !showFallback) {
    return null // Don't render initially while waiting for SDK
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={isCallActive ? endCall : startCall}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </>
      ) : isCallActive ? (
        <>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
          End Call
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C10.89 2 10 2.89 10 4V12C10 13.11 10.89 14 12 14S14 13.11 14 12V4C14 2.89 13.11 2 12 2Z"/>
            <path d="M19 11V12C19 15.87 15.87 19 12 19S5 15.87 5 12V11H7V12C7 14.76 9.24 17 12 17S17 14.76 17 12V11H19Z"/>
            <path d="M11 21H13V24H11V21Z"/>
          </svg>
          {showFallback && !isSDKReady ? '🎙️ Contact Our Team' : children}
        </>
      )}
    </Button>
  )
}