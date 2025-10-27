import { sql } from '@vercel/postgres'
import { readFileSync } from 'fs'
import { join } from 'path'

/**
 * Database connection utility for Synura Analytics & API Management
 * Provides PostgreSQL connection via Vercel Postgres with migration support
 */

// Database configuration
export const db = sql

// Types for database records
export interface ApiKey {
  id: number
  key_id: string
  name: string
  description?: string
  key_hash: string
  is_active: boolean
  created_at: Date
  updated_at: Date
  last_used_at?: Date
  usage_count: number
}

export interface ApiAnalytics {
  id: number
  endpoint: string
  method: string
  status_code: number
  response_time_ms?: number
  api_key_id?: string
  ip_address?: string
  user_agent?: string
  referer?: string
  request_size?: number
  response_size?: number
  created_at: Date
}

export interface Lead {
  id: number
  lead_id: string
  name: string
  email: string
  company?: string
  phone?: string
  intent: string
  message?: string
  source: string
  utm_source?: string
  utm_campaign?: string
  utm_medium?: string
  utm_content?: string
  utm_term?: string
  ip_address?: string
  user_agent?: string
  referer?: string
  api_key_id?: string
  status: string
  created_at: Date
  updated_at: Date
}

export interface ROICalculation {
  id: number
  calculation_id: string
  company_size?: string
  industry?: string
  employee_count?: number
  average_hourly_rate?: number
  manual_task_hours?: number
  error_rate?: number
  automation_areas?: any
  primary_goal?: string
  timeframe?: string
  estimates?: any
  recommendations?: any
  confidence_level?: string
  email?: string
  name?: string
  api_key_id?: string
  ip_address?: string
  user_agent?: string
  created_at: Date
}

export interface ServiceRecommendation {
  id: number
  recommendation_id: string
  company_size?: string
  industry?: string
  challenges?: any
  goals?: any
  budget?: string
  timeline?: string
  current_tools?: any
  recommendations?: any
  roadmap?: any
  estimated_budget?: any
  estimated_timeline?: any
  api_key_id?: string
  ip_address?: string
  user_agent?: string
  created_at: Date
}

/**
 * Initialize database schema
 * Run the schema.sql file to create tables and indexes
 */
export async function initializeDatabase(): Promise<void> {
  try {
    console.log('Initializing database schema...')

    // Read the schema file
    const schemaPath = join(process.cwd(), 'database', 'schema.sql')
    const schema = readFileSync(schemaPath, 'utf-8')

    // Execute the schema SQL
    await sql.unsafe(schema)

    console.log('Database schema initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1 as test`
    console.log('Database connection successful')
    return result.rows.length > 0
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

/**
 * API Keys operations
 */
export const apiKeysDB = {
  // Create a new API key record
  async create(data: Omit<ApiKey, 'id' | 'created_at' | 'updated_at' | 'usage_count'>): Promise<ApiKey> {
    const result = await sql`
      INSERT INTO api_keys (key_id, name, description, key_hash, is_active)
      VALUES (${data.key_id}, ${data.name}, ${data.description || null}, ${data.key_hash}, ${data.is_active})
      RETURNING *
    `
    return result.rows[0] as ApiKey
  },

  // Find API key by key_id
  async findByKeyId(keyId: string): Promise<ApiKey | null> {
    const result = await sql`
      SELECT * FROM api_keys WHERE key_id = ${keyId} AND is_active = true
    `
    return result.rows[0] as ApiKey || null
  },

  // Get all API keys
  async getAll(): Promise<ApiKey[]> {
    const result = await sql`
      SELECT * FROM api_keys ORDER BY created_at DESC
    `
    return result.rows as ApiKey[]
  },

  // Update last used timestamp and increment usage count
  async updateUsage(keyId: string): Promise<void> {
    await sql`
      UPDATE api_keys
      SET last_used_at = CURRENT_TIMESTAMP, usage_count = usage_count + 1
      WHERE key_id = ${keyId}
    `
  },

  // Deactivate API key
  async deactivate(keyId: string): Promise<void> {
    await sql`
      UPDATE api_keys SET is_active = false WHERE key_id = ${keyId}
    `
  },

  // Delete API key
  async delete(keyId: string): Promise<void> {
    await sql`
      DELETE FROM api_keys WHERE key_id = ${keyId}
    `
  }
}

/**
 * API Analytics operations
 */
export const analyticsDB = {
  // Log API request
  async log(data: Omit<ApiAnalytics, 'id' | 'created_at'>): Promise<void> {
    await sql`
      INSERT INTO api_analytics (
        endpoint, method, status_code, response_time_ms, api_key_id,
        ip_address, user_agent, referer, request_size, response_size
      )
      VALUES (
        ${data.endpoint}, ${data.method}, ${data.status_code}, ${data.response_time_ms || null},
        ${data.api_key_id || null}, ${data.ip_address || null}, ${data.user_agent || null},
        ${data.referer || null}, ${data.request_size || null}, ${data.response_size || null}
      )
    `
  },

  // Get analytics summary for date range
  async getSummary(startDate: Date, endDate: Date): Promise<any[]> {
    const result = await sql`
      SELECT * FROM api_usage_summary
      WHERE date >= ${startDate.toISOString().split('T')[0]}
      AND date <= ${endDate.toISOString().split('T')[0]}
      ORDER BY date DESC, total_requests DESC
    `
    return result.rows
  },

  // Get recent analytics
  async getRecent(limit: number = 100): Promise<ApiAnalytics[]> {
    const result = await sql`
      SELECT * FROM api_analytics
      ORDER BY created_at DESC
      LIMIT ${limit}
    `
    return result.rows as ApiAnalytics[]
  }
}

/**
 * Leads operations
 */
export const leadsDB = {
  // Create a new lead
  async create(data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const result = await sql`
      INSERT INTO leads (
        lead_id, name, email, company, phone, intent, message, source,
        utm_source, utm_campaign, utm_medium, utm_content, utm_term,
        ip_address, user_agent, referer, api_key_id, status
      )
      VALUES (
        ${data.lead_id}, ${data.name}, ${data.email}, ${data.company || null},
        ${data.phone || null}, ${data.intent}, ${data.message || null}, ${data.source},
        ${data.utm_source || null}, ${data.utm_campaign || null}, ${data.utm_medium || null},
        ${data.utm_content || null}, ${data.utm_term || null}, ${data.ip_address || null},
        ${data.user_agent || null}, ${data.referer || null}, ${data.api_key_id || null}, ${data.status}
      )
      RETURNING *
    `
    return result.rows[0] as Lead
  },

  // Get all leads with pagination
  async getAll(offset: number = 0, limit: number = 50): Promise<Lead[]> {
    const result = await sql`
      SELECT * FROM leads
      ORDER BY created_at DESC
      OFFSET ${offset} LIMIT ${limit}
    `
    return result.rows as Lead[]
  },

  // Get leads summary
  async getSummary(startDate: Date, endDate: Date): Promise<any[]> {
    const result = await sql`
      SELECT * FROM lead_source_summary
      WHERE date >= ${startDate.toISOString().split('T')[0]}
      AND date <= ${endDate.toISOString().split('T')[0]}
      ORDER BY date DESC, total_leads DESC
    `
    return result.rows
  }
}

/**
 * ROI Calculations operations
 */
export const roiDB = {
  // Save ROI calculation
  async create(data: Omit<ROICalculation, 'id' | 'created_at'>): Promise<ROICalculation> {
    const result = await sql`
      INSERT INTO roi_calculations (
        calculation_id, company_size, industry, employee_count, average_hourly_rate,
        manual_task_hours, error_rate, automation_areas, primary_goal, timeframe,
        estimates, recommendations, confidence_level, email, name, api_key_id,
        ip_address, user_agent
      )
      VALUES (
        ${data.calculation_id}, ${data.company_size || null}, ${data.industry || null},
        ${data.employee_count || null}, ${data.average_hourly_rate || null},
        ${data.manual_task_hours || null}, ${data.error_rate || null},
        ${JSON.stringify(data.automation_areas) || null}, ${data.primary_goal || null},
        ${data.timeframe || null}, ${JSON.stringify(data.estimates) || null},
        ${JSON.stringify(data.recommendations) || null}, ${data.confidence_level || null},
        ${data.email || null}, ${data.name || null}, ${data.api_key_id || null},
        ${data.ip_address || null}, ${data.user_agent || null}
      )
      RETURNING *
    `
    return result.rows[0] as ROICalculation
  },

  // Get ROI trends
  async getTrends(startDate: Date, endDate: Date): Promise<any[]> {
    const result = await sql`
      SELECT * FROM roi_trends
      WHERE date >= ${startDate.toISOString().split('T')[0]}
      AND date <= ${endDate.toISOString().split('T')[0]}
      ORDER BY date DESC, total_calculations DESC
    `
    return result.rows
  }
}

/**
 * Service Recommendations operations
 */
export const serviceRecommendationsDB = {
  // Save service recommendation
  async create(data: Omit<ServiceRecommendation, 'id' | 'created_at'>): Promise<ServiceRecommendation> {
    const result = await sql`
      INSERT INTO service_recommendations (
        recommendation_id, company_size, industry, challenges, goals, budget,
        timeline, current_tools, recommendations, roadmap, estimated_budget,
        estimated_timeline, api_key_id, ip_address, user_agent
      )
      VALUES (
        ${data.recommendation_id}, ${data.company_size || null}, ${data.industry || null},
        ${JSON.stringify(data.challenges) || null}, ${JSON.stringify(data.goals) || null},
        ${data.budget || null}, ${data.timeline || null}, ${JSON.stringify(data.current_tools) || null},
        ${JSON.stringify(data.recommendations) || null}, ${JSON.stringify(data.roadmap) || null},
        ${JSON.stringify(data.estimated_budget) || null}, ${JSON.stringify(data.estimated_timeline) || null},
        ${data.api_key_id || null}, ${data.ip_address || null}, ${data.user_agent || null}
      )
      RETURNING *
    `
    return result.rows[0] as ServiceRecommendation
  },

  // Get recommendation patterns
  async getPatterns(startDate: Date, endDate: Date): Promise<any[]> {
    const result = await sql`
      SELECT * FROM service_recommendation_patterns
      WHERE date >= ${startDate.toISOString().split('T')[0]}
      AND date <= ${endDate.toISOString().split('T')[0]}
      ORDER BY date DESC, total_recommendations DESC
    `
    return result.rows
  }
}

/**
 * Health check function
 */
export async function healthCheck(): Promise<{
  database: boolean
  tables: string[]
  timestamp: string
}> {
  try {
    const isConnected = await testConnection()

    // Check if all required tables exist
    const tablesResult = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `

    const tables = tablesResult.rows.map(row => row.table_name as string)

    return {
      database: isConnected,
      tables,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Health check failed:', error)
    return {
      database: false,
      tables: [],
      timestamp: new Date().toISOString()
    }
  }
}