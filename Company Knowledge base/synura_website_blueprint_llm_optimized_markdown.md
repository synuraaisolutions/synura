# Synura Website Blueprint — LLM-Optimized Markdown Version

## SUMMARY FOR MACHINES

**Entity:** Synura AI Solutions  
**Tagline:** Smarter systems. Stronger businesses.  
**Purpose:** This document defines Synura’s AI-first website, API infrastructure, and automation integrations. It is structured for clear LLM parsing and can be fed directly into language models for knowledge ingestion or code generation.  
**Primary Outcomes:** time savings, cost reduction, productivity, scalability.  
**Sections:** [1. Overview] [2. Stack] [3. Content System] [4. API Endpoints] [5. Voice Integration] [6. Implementation Plan] [7. SEO & Accessibility] [8. Deployment]

---

## 1. OVERVIEW

### 1.1 Mission
Empower businesses with automation that unlocks efficiency, innovation, and sustainable growth.

### 1.2 Vision
A world where every repetitive process is automated — and every team focuses on meaningful work.

### 1.3 Services
- AI Workforce Solutions
- Automation & Integration
- AI Consulting & Strategy
- Managed AI Operations

### 1.4 Primary CTA
**Book a free consultation.**

### 1.5 Voice Agent
**Verus (Retell.ai)** — handles all conversational experiences using Synura’s knowledge base.

---

## 2. TECHNOLOGY STACK

[STACK]
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- **Content System:** Contentlayer + MDX (file-based content)
- **API Layer:** Next.js API Routes
- **Voice Agent:** Retell (Verus)
- **Automation Tools:** n8n / Make / Zapier
- **CRM:** HubSpot or Pipedrive
- **Database:** Neon Postgres (optional)
- **Hosting:** Vercel (Edge + Node)
- **Monitoring:** Sentry + OpenTelemetry

---

## 3. CONTENT SYSTEM

### 3.1 Purpose
Provides all page content in local `.mdx` files for speed, portability, and easy LLM training ingestion.

### 3.2 Folder Structure
```bash
/content
  /services/ai-workforce.mdx
  /services/automation-integration.mdx
  /services/ai-consulting.mdx
  /pricing.mdx
  /faqs/*.mdx
  /case-studies/*.mdx
```

### 3.3 Example File (services/ai-workforce.mdx)
```mdx
---
title: AI Workforce Solutions
slug: ai-workforce
description: Role-specific AI employees and assistants that automate repetitive tasks.
---

## Overview
AI employees for support, scheduling, lead follow-up, and reporting.

## Outcomes
- Time savings
- Cost reduction
- Improved customer experience
```

### 3.4 Benefits
- No external CMS dependencies.
- Ideal for early-stage static sites.
- Type-safe imports into Next.js.
- Easy to convert into JSON or feed to LLMs.

---

## 4. API ENDPOINTS

[ENDPOINTS]
| Endpoint | Method | Purpose |
|-----------|---------|----------|
| `/api/v1/voice/leads` | POST | Capture lead info from Retell or forms |
| `/api/v1/voice/meetings` | POST | Create consultation booking |
| `/api/v1/voice/feedback` | POST | Store user feedback |
| `/api/v1/roi/estimate` | POST | Return automation ROI estimates |
| `/api/v1/faqs` | GET | Fetch FAQs by tag |
| `/api/v1/services` | GET | Return service and pricing data |

### 4.1 Security
- HTTPS/TLS 1.3
- JWT authentication
- Rate limiting via Redis
- HMAC validation for webhooks

### 4.2 Documentation
- `/openapi.json` (OpenAPI 3.1 spec)
- Swagger UI: `/api/docs`

### 4.3 Example Request (JSON)
```json
{
  "name": "Jane Doe",
  "email": "jane@synura.ai",
  "company": "Example Co",
  "intent": "book_consultation"
}
```

---

## 5. VOICE INTEGRATION (RETELL)

### 5.1 Platform
Retell.ai provides embedded voice and conversational interfaces.

### 5.2 Agent
**Verus** — trained on all website content, FAQs, and brand tone.

### 5.3 Functionality
- Answer questions about Synura services.
- Book consultations or collect lead details.
- Perform ROI estimates.
- Provide summaries or guidance.

### 5.4 Integration Method
Embed the Retell widget on all pages (floating button or CTA). Example:
```html
<script src="https://cdn.retell.ai/widget.js" data-agent="verus"></script>
```

### 5.5 Knowledge Management
All site content from `/content/*.mdx` is included in the Retell knowledge base.

---

## 6. IMPLEMENTATION PLAN

[PHASES]

**Phase 1 — Setup (2–3 days)**
- Initialize Next.js + Tailwind + Contentlayer.
- Configure routing and layouts.
- Add sample content pages.

**Phase 2 — API & Automations (1 week)**
- Implement `/api/v1` endpoints.
- Connect CRM via n8n or Make.

**Phase 3 — Voice Integration (2–3 days)**
- Embed Retell widget.
- Verify lead/meeting flows.

**Phase 4 — SEO & Optimization (3 days)**
- Add metadata, JSON-LD, and accessibility tuning.

**Phase 5 — Launch & Monitoring (2 days)**
- Deploy to Vercel.
- Connect Sentry + analytics.

---

## 7. SEO & ACCESSIBILITY

### 7.1 SEO Essentials
- Title and meta description per page.
- JSON-LD structured data for Organization, Service, and FAQ.
- AI Summary meta block on every page.

### 7.2 Accessibility
- Semantic HTML.
- Focus states.
- Color contrast ≥ 4.5:1.
- Reduced-motion compliance.

---

## 8. DEPLOYMENT & MONITORING

### 8.1 Hosting
Vercel — handles static builds, API routes, and edge caching.

### 8.2 Monitoring Tools
- Sentry (errors)
- Plausible or GA4 (analytics)
- Lighthouse score targets: ≥95 desktop, ≥90 mobile

### 8.3 CI/CD Pipeline
- GitHub Actions for testing and deployment.
- Automatic rebuilds on content or API change.

---

## 9. NEXT STEPS
1. Scaffold repository with Next.js and Contentlayer.
2. Add MDX content for core pages.
3. Implement API endpoints.
4. Connect Retell and CRM workflows.
5. Deploy to Vercel.

---

**END OF DOCUMENT — Synura Website Blueprint (LLM-Optimized)**

