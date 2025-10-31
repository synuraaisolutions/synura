'use client'

import { useEffect, useState, useRef } from 'react'

interface CountUpNumberProps {
  target: string
  duration?: number
  className?: string
  startOnVisible?: boolean
}

export function CountUpNumber({
  target,
  duration = 2000,
  className = '',
  startOnVisible = true
}: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState(target)
  const [hasStarted, setHasStarted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    setMounted(true)
    setDisplayValue('0')
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (!startOnVisible) {
      startAnimation()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          startAnimation()
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [hasStarted, startOnVisible, mounted])

  const startAnimation = () => {
    // Extract number and suffix from target
    const numericPart = target.match(/[\d.]+/)?.[0] || '0'
    const suffix = target.replace(numericPart, '')
    const targetNumber = parseFloat(numericPart)

    if (isNaN(targetNumber)) {
      setDisplayValue(target)
      return
    }

    const startTime = Date.now()
    const startValue = 0

    const updateValue = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (targetNumber - startValue) * easeOut

      // Format the number based on the target format
      let formattedValue: string
      if (target.includes('%')) {
        formattedValue = Math.round(currentValue).toString()
      } else if (target.includes('.')) {
        formattedValue = currentValue.toFixed(1)
      } else {
        formattedValue = Math.round(currentValue).toString()
      }

      setDisplayValue(formattedValue + suffix)

      if (progress < 1) {
        requestAnimationFrame(updateValue)
      }
    }

    requestAnimationFrame(updateValue)
  }

  return (
    <span ref={elementRef} className={className}>
      {displayValue}
    </span>
  )
}