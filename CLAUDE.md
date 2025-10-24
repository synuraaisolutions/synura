# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Synura AI Solutions Website** - AI-first marketing platform featuring conversational automation via Retell.ai (Verus agent) and content management via Contentlayer + MDX.

**Current Status:** Greenfield project in planning phase. The blueprint and specifications exist, but implementation is pending.

## Technology Stack

- **Frontend:** Next.js 14+ (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Content Management:** Contentlayer + MDX (file-based CMS)
- **Voice Integration:** Retell.ai (Verus conversational agent)
- **API Layer:** Next.js API routes with Zod validation
- **Database:** Neon Postgres (optional - primarily for lead storage)
- **Hosting:** Vercel (static builds + API routes + edge caching)
- **Automation:** n8n/Make/Zapier for CRM integration workflows
- **CRM Integration:** HubSpot or Pipedrive
- **Monitoring:** Sentry + OpenTelemetry
- **Analytics:** Plausible or GA4

## Development Commands

### Project Initialization (Required First Step)
```bash
# Initialize Next.js project with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install core dependencies
npm install contentlayer next-contentlayer next-mdx-remote @retell-ai/retell-sdk
npm install zod @hookform/resolvers react-hook-form next-seo
npm install @sentry/nextjs @opentelemetry/api @opentelemetry/sdk-node

# Install shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label textarea form

# Development dependencies
npm install -D @types/node @types/react @types/react-dom jest @testing-library/react @testing-library/jest-dom
```

### Daily Development
```bash
# Start development server
npm run dev

# Build content types and project
npm run build

# Type checking
npm run type-check

# Linting and formatting
npm run lint
npm run format

# Testing
npm test
npm run test:watch

# Content processing
npm run content:build
```

## Architecture Overview

### Content System (Contentlayer + MDX)
- **Location:** `/content/` directory with structured MDX files
- **Processing:** Contentlayer generates TypeScript types at build time
- **Usage:** Type-safe imports in Next.js pages and components
- **Structure:**
  ```
  /content
  ├── /services/        # AI workforce, automation, consulting, managed ops
  ├── /faqs/           # General, pricing/billing, technical FAQs
  ├── /case-studies/   # Customer success stories
  ├── /blog/           # Resources and thought leadership
  └── pricing.mdx      # Pricing tiers and options
  ```

### API Architecture
- **Pattern:** `/src/app/api/v1/[resource]/route.ts`
- **Validation:** Zod schemas for all inputs
- **Authentication:** JWT tokens with HMAC webhook validation
- **Rate Limiting:** Redis-based protection
- **Documentation:** OpenAPI 3.1 spec at `/api/docs`

**Key Endpoints:**
- `POST /api/v1/voice/leads` - Lead capture from Retell or forms
- `POST /api/v1/voice/meetings` - Consultation booking
- `POST /api/v1/voice/feedback` - User feedback collection
- `POST /api/v1/roi/estimate` - ROI calculator
- `GET /api/v1/faqs` - FAQ data by tag
- `GET /api/v1/services` - Service and pricing data

### Voice Integration (Retell.ai)
- **Agent Name:** "Verus"
- **Integration:** Global script tag in root layout
- **Knowledge Base:** Fed from `/content/*.mdx` files
- **Capabilities:** Lead capture, consultation booking, ROI estimates, FAQ responses
- **Environment Variable:** `NEXT_PUBLIC_RETELL_AGENT_ID=verus`

### Component Architecture
- **Base Components:** shadcn/ui (unstyled, accessible)
- **Styling:** Tailwind utility classes for Synura branding
- **Structure:**
  - `/src/components/layout/` - Header, Footer, Navigation
  - `/src/components/sections/` - Hero, Features, CTAs, etc.
  - `/src/components/forms/` - Contact, booking forms
  - `/src/components/common/` - Buttons, cards, modals

## Project Structure

```
/Synurawebsite
├── /src/
│   ├── /app/                    # Next.js App Router
│   │   ├── layout.tsx           # Root layout (includes Retell widget)
│   │   ├── page.tsx             # Homepage
│   │   ├── /(routes)/           # Page routes
│   │   │   ├── /services/       # Service pages
│   │   │   ├── /pricing/        # Pricing page
│   │   │   ├── /faqs/           # FAQ pages
│   │   │   ├── /case-studies/   # Case studies
│   │   │   └── /blog/           # Blog/resources
│   │   └── /api/v1/             # API endpoints
│   ├── /components/             # React components
│   ├── /lib/                    # Utilities and helpers
│   └── /styles/                 # Global CSS and Tailwind config
├── /content/                    # MDX content files
├── /public/                     # Static assets
├── /Company Knowledge base/     # Brand documentation and assets
├── package.json                 # Dependencies and scripts
├── contentlayer.config.ts       # Contentlayer configuration
├── next.config.js              # Next.js configuration
└── tailwind.config.js          # Tailwind customization
```

## Important File References

### Blueprint and Documentation
- **Primary Spec:** `/Company Knowledge base/synura_website_blueprint_llm_optimized_markdown.md`
- **Implementation Guide:** `/prompt.txt`
- **Brand Guidelines:** `/Company Knowledge base/Synura Brand Guide.pdf`
- **Company Overview:** `/Company Knowledge base/Synura Company Overview.pdf`
- **Marketing Copy:** `/Company Knowledge base/Synura Marketing Strategy.pdf`
- **Pricing Structure:** `/Company Knowledge base/Synura Public Pricing Page.pdf`

### Key Configuration Files (To Be Created)
- `contentlayer.config.ts` - Content processing and type generation
- `next.config.js` - Next.js configuration with Contentlayer
- `tailwind.config.js` - Synura brand colors and typography
- `tsconfig.json` - TypeScript configuration with path aliases

## Content Management Workflow

### Adding New Content
1. Create `.mdx` file in appropriate `/content/` subfolder
2. Add frontmatter with required fields (title, slug, description)
3. Write content using Markdown + optional React components
4. Run `npm run content:build` to regenerate types
5. Import and use in pages with type safety

### Example MDX Structure
```mdx
---
title: "AI Workforce Solutions"
slug: "ai-workforce"
description: "Role-specific AI employees that automate repetitive tasks"
category: "services"
featured: true
---

## Overview
AI employees for support, scheduling, lead follow-up, and reporting.

## Key Benefits
- 40-60% time savings on routine tasks
- 24/7 availability
- Consistent service quality
```

## API Development Patterns

### Creating New Endpoints
1. Create route file: `/src/app/api/v1/[resource]/route.ts`
2. Implement handler functions (GET, POST, PUT, DELETE)
3. Add Zod schema for input validation
4. Return standardized JSON responses
5. Add to OpenAPI specification
6. Update CRM integration workflows if needed

### Example API Route
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  intent: z.enum(['consultation', 'demo', 'info'])
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = leadSchema.parse(body)

    // Process lead...

    return NextResponse.json({ success: true, id: 'lead_123' })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}
```

## Environment Variables

```bash
# Retell Integration
NEXT_PUBLIC_RETELL_AGENT_ID=verus
RETELL_API_KEY=***

# Database (Optional)
DATABASE_URL=postgresql://...

# CRM Integration
HUBSPOT_API_KEY=***
# OR
PIPEDRIVE_API_KEY=***

# Authentication
NEXTAUTH_SECRET=***
JWT_SECRET=***

# Monitoring
SENTRY_DSN=***
SENTRY_ORG=***
SENTRY_PROJECT=***

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=synura.ai
# OR
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-***
```

## Deployment

### Vercel Configuration
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`
- **Development Command:** `npm run dev`

### Performance Targets
- **Lighthouse Desktop:** ≥95
- **Lighthouse Mobile:** ≥90
- **Core Web Vitals:** All "Good"
- **First Contentful Paint:** <1.5s
- **Largest Contentful Paint:** <2.5s

## Testing Strategy

### Unit Tests
- API endpoints with request/response validation
- Utility functions and helpers
- Component rendering and interactions

### Integration Tests
- Retell voice agent workflows
- CRM integration flows
- Content processing pipeline

### E2E Tests
- Lead capture and booking flows
- Navigation and page rendering
- Mobile responsiveness

## Brand Compliance

### Colors (Tailwind Classes)
- **Primary:** Custom Synura blue (to be defined in tailwind.config.js)
- **Secondary:** Professional gray scale
- **Accent:** Success green for CTAs

### Typography
- **Headings:** Clean, modern sans-serif
- **Body:** Readable font optimized for web
- **Code:** Monospace for technical content

### Voice and Tone
- **Professional yet approachable**
- **Technically knowledgeable without jargon**
- **Outcome-focused messaging**
- **Emphasis on measurable business impact**

## Integration Points

### CRM Workflow (n8n/Make)
1. Lead captured via Retell or form
2. Data validated and enriched
3. Contact created/updated in CRM
4. Follow-up sequences triggered
5. Meeting scheduled if applicable

### Automation Examples
- **Lead scoring** based on company size and intent
- **Email sequences** for different service interests
- **Meeting reminders** and preparation materials
- **ROI reports** generated post-consultation

## Common Development Tasks

### Adding a New Service Page
1. Create `/content/services/new-service.mdx`
2. Add to services navigation component
3. Update API endpoint to include new service data
4. Add to Retell knowledge base
5. Test lead capture flow for new service

### Implementing New API Endpoint
1. Define Zod schema for validation
2. Create route handler in `/src/app/api/v1/`
3. Add authentication/rate limiting
4. Update OpenAPI documentation
5. Configure CRM integration workflow
6. Add monitoring and error handling

### Content Updates
1. Edit relevant MDX files in `/content/`
2. Run `npm run content:build` to regenerate types
3. Test pages locally with `npm run dev`
4. Deploy via git push (auto-deployment on Vercel)

## Monitoring and Debugging

### Error Tracking (Sentry)
- Frontend errors and performance issues
- API endpoint failures and slow queries
- Build and deployment problems

### Observability (OpenTelemetry)
- API response times and throughput
- Database query performance
- External service integration health

### Analytics (Plausible/GA4)
- Page views and user journeys
- Conversion funnel analysis
- Voice agent interaction rates
- Lead quality and source tracking

## Security Considerations

### API Security
- Rate limiting on all endpoints
- JWT token validation
- HMAC signature verification for webhooks
- Input sanitization and validation

### Data Protection
- No sensitive data in client-side code
- Secure environment variable management
- HTTPS/TLS 1.3 enforcement
- GDPR-compliant data handling

## Key Success Metrics

### Technical Performance
- **Page Speed:** <2s load time
- **Uptime:** >99.9% availability
- **API Response:** <200ms average

### Business Metrics
- **Conversion Rate:** Voice interactions to qualified leads
- **Lead Quality:** MQL to SQL conversion
- **User Engagement:** Time on site and page depth
- **ROI Calculator Usage:** Completion rates

## Next Steps for Implementation

When starting development on this project:

1. **Initialize:** Run project setup commands above
2. **Content:** Create MDX files from brand documentation
3. **Components:** Build page layouts using shadcn/ui + Tailwind
4. **API:** Implement endpoints with proper validation
5. **Integration:** Connect Retell widget and CRM workflows
6. **Testing:** Add comprehensive test coverage
7. **Deploy:** Configure Vercel with environment variables
8. **Monitor:** Set up Sentry and analytics tracking

This architecture prioritizes developer experience, type safety, performance, and seamless AI integration while maintaining flexibility for future enhancements.