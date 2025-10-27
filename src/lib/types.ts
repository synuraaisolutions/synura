// Content types to replace ContentLayer schema

export interface Service {
  title: string
  slug: string
  description: string
  category: string
  featured: boolean
  icon: string
  benefits: string[]
  outcomes: string[]
  url: string
  body?: {
    raw: string
  }
}

export interface CaseStudy {
  title: string
  slug: string
  description: string
  industry: string
  publishedAt: string
  featured: boolean
  challenge: string
  solution: string
  results: string[]
  services: string[]
  clientTestimonial: string
  clientName: string
  clientTitle: string
  companySize: string
  implementationTime: string
  roi: string
  url: string
  body?: {
    raw: string
  }
}

export interface FAQ {
  title: string
  slug: string
  description: string
  category: string
  order: number
  url: string
  body?: {
    raw: string
  }
}

export interface Pricing {
  title: string
  description: string
}