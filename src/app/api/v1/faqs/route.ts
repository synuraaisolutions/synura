import { NextRequest, NextResponse } from 'next/server'
import { allFAQs } from '.contentlayer/generated'

// GET handler for FAQs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = searchParams.get('limit')
    const search = searchParams.get('search')

    // Filter FAQs based on query parameters
    let filteredFAQs = allFAQs

    // Filter by category if specified
    if (category) {
      filteredFAQs = filteredFAQs.filter(faq =>
        faq.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase()
      filteredFAQs = filteredFAQs.filter(faq =>
        faq.title.toLowerCase().includes(searchLower) ||
        faq.description.toLowerCase().includes(searchLower) ||
        faq.body.raw.toLowerCase().includes(searchLower)
      )
    }

    // Sort by order, then by title
    filteredFAQs.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order
      }
      return a.title.localeCompare(b.title)
    })

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredFAQs = filteredFAQs.slice(0, limitNum)
      }
    }

    // Transform data for API response
    const transformedFAQs = filteredFAQs.map(faq => ({
      id: faq.slug,
      title: faq.title,
      description: faq.description,
      category: faq.category,
      order: faq.order,
      url: faq.url,
      content: faq.body.raw,
      lastUpdated: faq._raw.sourceFileModified || new Date().toISOString(),
    }))

    // Get available categories for metadata
    const availableCategories = [...new Set(allFAQs.map(faq => faq.category))]

    // Response metadata
    const metadata = {
      total: transformedFAQs.length,
      categories: availableCategories,
      filters: {
        category: category || null,
        search: search || null,
        limit: limit ? parseInt(limit, 10) : null,
      },
    }

    return NextResponse.json({
      success: true,
      data: transformedFAQs,
      metadata,
    })

  } catch (error) {
    console.error('FAQ API error:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to retrieve FAQs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 })
  }
}

// POST handler for FAQ search with advanced filtering
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      categories = [],
      searchTerms = [],
      limit = 50,
      includeContent = false
    } = body

    let filteredFAQs = allFAQs

    // Filter by multiple categories
    if (categories.length > 0) {
      filteredFAQs = filteredFAQs.filter(faq =>
        categories.some(cat =>
          faq.category.toLowerCase() === cat.toLowerCase()
        )
      )
    }

    // Advanced search with multiple terms
    if (searchTerms.length > 0) {
      filteredFAQs = filteredFAQs.filter(faq => {
        const searchContent = `${faq.title} ${faq.description} ${faq.body.raw}`.toLowerCase()
        return searchTerms.some(term =>
          searchContent.includes(term.toLowerCase())
        )
      })
    }

    // Sort by relevance and order
    filteredFAQs.sort((a, b) => {
      // Calculate relevance score based on search terms
      if (searchTerms.length > 0) {
        const scoreA = calculateRelevanceScore(a, searchTerms)
        const scoreB = calculateRelevanceScore(b, searchTerms)
        if (scoreA !== scoreB) {
          return scoreB - scoreA // Higher score first
        }
      }

      // Fall back to order and title
      if (a.order !== b.order) {
        return a.order - b.order
      }
      return a.title.localeCompare(b.title)
    })

    // Apply limit
    if (limit > 0) {
      filteredFAQs = filteredFAQs.slice(0, limit)
    }

    // Transform data for API response
    const transformedFAQs = filteredFAQs.map(faq => ({
      id: faq.slug,
      title: faq.title,
      description: faq.description,
      category: faq.category,
      order: faq.order,
      url: faq.url,
      ...(includeContent && { content: faq.body.raw }),
      lastUpdated: faq._raw.sourceFileModified || new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      data: transformedFAQs,
      metadata: {
        total: transformedFAQs.length,
        searchTerms,
        categories,
        includeContent,
      },
    })

  } catch (error) {
    console.error('FAQ search error:', error)

    return NextResponse.json({
      success: false,
      message: 'Failed to search FAQs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    }, { status: 500 })
  }
}

// Calculate relevance score for search results
function calculateRelevanceScore(faq: any, searchTerms: string[]): number {
  let score = 0
  const title = faq.title.toLowerCase()
  const description = faq.description.toLowerCase()
  const content = faq.body.raw.toLowerCase()

  searchTerms.forEach(term => {
    const termLower = term.toLowerCase()

    // Title matches get highest score
    if (title.includes(termLower)) {
      score += 10
      // Exact title match gets bonus
      if (title === termLower) {
        score += 20
      }
    }

    // Description matches get medium score
    if (description.includes(termLower)) {
      score += 5
    }

    // Content matches get lower score
    if (content.includes(termLower)) {
      score += 1
    }
  })

  return score
}