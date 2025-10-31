'use client'

import { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  threshold?: number
  duration?: number
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.1,
  duration = 600
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, delay])

  const getTransformStyle = () => {
    if (isVisible) return 'translate3d(0, 0, 0)'

    switch (direction) {
      case 'up':
        return 'translate3d(0, 30px, 0)'
      case 'down':
        return 'translate3d(0, -30px, 0)'
      case 'left':
        return 'translate3d(30px, 0, 0)'
      case 'right':
        return 'translate3d(-30px, 0, 0)'
      default:
        return 'translate3d(0, 0, 0)'
    }
  }

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransformStyle(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </div>
  )
}