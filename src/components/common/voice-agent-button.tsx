'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './button'

declare global {
  interface Window {
    RetellAI?: any
  }
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
    // Check if SDK is loaded
    const checkSDK = () => {
      if (window.RetellAI && !retellClientRef.current) {
        try {
          const publicKey = process.env.NEXT_PUBLIC_RETELL_PUBLIC_KEY
          if (publicKey) {
            retellClientRef.current = new window.RetellAI({
              publicKey: publicKey
            })
            setIsSDKReady(true)
            console.log('Voice Agent Button: Retell client initialized')
          }
        } catch (error) {
          console.error('Voice Agent Button: Failed to initialize Retell client:', error)
        }
      }
    }

    if (window.RetellAI) {
      checkSDK()
    } else {
      // Wait for SDK to load
      const interval = setInterval(() => {
        if (window.RetellAI) {
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
    if (!retellClientRef.current || isLoading || !isSDKReady) return

    try {
      setIsLoading(true)
      const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID || 'agent_cdc03c87fdce82350a6b6c418c'

      console.log('Voice Agent Button: Starting call with agent:', agentId)

      const call = await retellClientRef.current.startCall({
        agentId: agentId,
      })

      if (call) {
        callRef.current = call
        await call.connectMedia()
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
      }
    } catch (error) {
      console.error('Voice Agent Button: Failed to start call:', error)
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

  if (!isSDKReady) {
    return null // Don't render if SDK isn't ready
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
          {children}
        </>
      )}
    </Button>
  )
}