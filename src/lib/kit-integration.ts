/**
 * Kit (ConvertKit) CRM Integration Service
 * Handles automatic lead creation, tagging, and custom field management
 */

interface KitConfig {
  apiKey: string
  baseUrl: string
}

interface KitSubscriber {
  email: string
  first_name?: string
  tags?: string[]
  custom_fields?: Record<string, any>
}

interface KitTag {
  id?: number
  name: string
  created_at?: string
}

interface KitCustomField {
  id?: number
  name: string
  label: string
  created_at?: string
}

interface ROILeadData {
  email: string
  name?: string
  companySize: string
  industry: string
  calculatedROI: number
  annualSavings: number
  setupInvestment: number
  complexityScore: number
  leadSource: 'roi-calculator' | 'contact-form' | 'voice-agent'
  calculationId: string
}

class KitIntegration {
  private config: KitConfig

  constructor(apiKey: string) {
    this.config = {
      apiKey,
      baseUrl: 'https://api.kit.com/v4'
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseUrl}/account`, {
        headers: {
          'X-Kit-Api-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Kit API connection successful:', data)
        return true
      } else {
        console.error('Kit API connection failed:', response.status, await response.text())
        return false
      }
    } catch (error) {
      console.error('Kit API connection error:', error)
      return false
    }
  }

  /**
   * Create or get existing tag
   */
  async createTag(tagName: string): Promise<KitTag | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/tags`, {
        method: 'POST',
        headers: {
          'X-Kit-Api-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: tagName
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Tag created:', data.tag)
        return data.tag
      } else if (response.status === 422) {
        // Tag might already exist, try to find it
        console.log(`Tag "${tagName}" might already exist`)
        return await this.findTag(tagName)
      } else {
        console.error('Failed to create tag:', response.status, await response.text())
        return null
      }
    } catch (error) {
      console.error('Error creating tag:', error)
      return null
    }
  }

  /**
   * Find existing tag by name
   */
  async findTag(tagName: string): Promise<KitTag | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/tags`, {
        headers: {
          'X-Kit-Api-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const tag = data.tags?.find((t: KitTag) => t.name === tagName)
        return tag || null
      } else {
        console.error('Failed to fetch tags:', response.status)
        return null
      }
    } catch (error) {
      console.error('Error finding tag:', error)
      return null
    }
  }

  /**
   * Create or get existing custom field
   */
  async createCustomField(name: string, label: string): Promise<KitCustomField | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/custom_fields`, {
        method: 'POST',
        headers: {
          'X-Kit-Api-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          label
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Custom field created:', data.custom_field)
        return data.custom_field
      } else if (response.status === 422) {
        // Field might already exist
        console.log(`Custom field "${name}" might already exist`)
        return await this.findCustomField(name)
      } else {
        console.error('Failed to create custom field:', response.status, await response.text())
        return null
      }
    } catch (error) {
      console.error('Error creating custom field:', error)
      return null
    }
  }

  /**
   * Find existing custom field by name
   */
  async findCustomField(name: string): Promise<KitCustomField | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/custom_fields`, {
        headers: {
          'X-Kit-Api-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const field = data.custom_fields?.find((f: KitCustomField) => f.name === name)
        return field || null
      } else {
        console.error('Failed to fetch custom fields:', response.status)
        return null
      }
    } catch (error) {
      console.error('Error finding custom field:', error)
      return null
    }
  }

  /**
   * Create subscriber with tags and custom fields
   */
  async createSubscriber(subscriberData: KitSubscriber): Promise<any> {
    try {
      // Format data according to Kit API v4 spec (flat structure)
      const payload: any = {
        email_address: subscriberData.email,
        state: 'active'
      }

      // Add optional fields
      if (subscriberData.first_name) {
        payload.first_name = subscriberData.first_name
      }

      if (subscriberData.tags && subscriberData.tags.length > 0) {
        payload.tags = subscriberData.tags
      }

      if (subscriberData.custom_fields) {
        payload.fields = subscriberData.custom_fields
      }

      console.log('Creating subscriber with payload:', JSON.stringify(payload, null, 2))

      const response = await fetch(`${this.config.baseUrl}/subscribers`, {
        method: 'POST',
        headers: {
          'X-Kit-Api-Key': this.config.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Subscriber created successfully:', data.subscriber)
        return data.subscriber
      } else {
        const errorText = await response.text()
        console.error('Failed to create subscriber:', response.status, errorText)
        return null
      }
    } catch (error) {
      console.error('Error creating subscriber:', error)
      return null
    }
  }

  /**
   * Initialize standard tags for Synura business
   */
  async initializeStandardTags(): Promise<void> {
    const standardTags = [
      // Company sizes
      'company-1-10',
      'company-11-50',
      'company-51-200',
      'company-201-1000',
      'company-1000-plus',

      // Industries
      'industry-professional-services',
      'industry-healthcare',
      'industry-ecommerce',
      'industry-manufacturing',
      'industry-finance',
      'industry-technology',
      'industry-education',
      'industry-other',

      // Lead sources
      'roi-calculator',
      'contact-form',
      'voice-agent',
      'website-form',

      // Priority levels
      'high-roi-lead',
      'medium-roi-lead',
      'standard-lead',

      // Complexity tiers
      'complexity-low',
      'complexity-medium',
      'complexity-high'
    ]

    console.log('Initializing standard tags...')

    for (const tagName of standardTags) {
      await this.createTag(tagName)
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('Standard tags initialization complete')
  }

  /**
   * Initialize custom fields for marketing intelligence
   */
  async initializeCustomFields(): Promise<void> {
    const customFields = [
      { name: 'calculated_roi', label: 'Calculated ROI (%)' },
      { name: 'annual_savings', label: 'Annual Savings ($)' },
      { name: 'setup_investment', label: 'Setup Investment ($)' },
      { name: 'complexity_score', label: 'Complexity Score (1-10)' },
      { name: 'company_size', label: 'Company Size' },
      { name: 'industry_type', label: 'Industry' },
      { name: 'lead_source', label: 'Lead Source' },
      { name: 'calculation_id', label: 'Calculation ID' },
      { name: 'manual_hours_week', label: 'Manual Hours/Week' },
      { name: 'automation_areas', label: 'Automation Areas' }
    ]

    console.log('Initializing custom fields...')

    for (const field of customFields) {
      await this.createCustomField(field.name, field.label)
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('Custom fields initialization complete')
  }

  /**
   * Process ROI calculator lead and add to Kit
   */
  async processROILead(leadData: ROILeadData): Promise<boolean> {
    try {
      // Generate tags based on lead data
      const tags = this.generateLeadTags(leadData)

      // Generate custom fields data
      const customFields = this.generateCustomFieldsData(leadData)

      // Create subscriber
      const subscriberData: KitSubscriber = {
        email: leadData.email,
        first_name: leadData.name,
        tags,
        custom_fields: customFields
      }

      const result = await this.createSubscriber(subscriberData)

      if (result) {
        console.log(`ROI lead processed successfully: ${leadData.email}`)
        return true
      } else {
        console.error(`Failed to process ROI lead: ${leadData.email}`)
        return false
      }
    } catch (error) {
      console.error('Error processing ROI lead:', error)
      return false
    }
  }

  /**
   * Generate appropriate tags for lead
   */
  private generateLeadTags(leadData: ROILeadData): string[] {
    const tags: string[] = []

    // Company size tag
    tags.push(`company-${leadData.companySize}`.replace(/\+/, '-plus'))

    // Industry tag
    tags.push(`industry-${leadData.industry}`)

    // Lead source tag
    tags.push(leadData.leadSource)

    // Priority based on ROI
    if (leadData.calculatedROI > 300) {
      tags.push('high-roi-lead')
    } else if (leadData.calculatedROI > 150) {
      tags.push('medium-roi-lead')
    } else {
      tags.push('standard-lead')
    }

    // Complexity tag
    if (leadData.complexityScore >= 7) {
      tags.push('complexity-high')
    } else if (leadData.complexityScore >= 4) {
      tags.push('complexity-medium')
    } else {
      tags.push('complexity-low')
    }

    return tags
  }

  /**
   * Generate custom fields data for lead
   */
  private generateCustomFieldsData(leadData: ROILeadData): Record<string, any> {
    return {
      calculated_roi: leadData.calculatedROI,
      annual_savings: leadData.annualSavings,
      setup_investment: leadData.setupInvestment,
      complexity_score: leadData.complexityScore,
      company_size: leadData.companySize,
      industry_type: leadData.industry,
      lead_source: leadData.leadSource,
      calculation_id: leadData.calculationId
    }
  }

  /**
   * Initialize complete Kit setup
   */
  async initializeKitSetup(): Promise<boolean> {
    try {
      console.log('Starting Kit CRM setup...')

      // Test connection first
      const connected = await this.testConnection()
      if (!connected) {
        throw new Error('Kit API connection failed')
      }

      // Initialize tags and custom fields
      await this.initializeStandardTags()
      await this.initializeCustomFields()

      console.log('Kit CRM setup completed successfully!')
      return true
    } catch (error) {
      console.error('Kit setup failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const kitIntegration = new KitIntegration(process.env.KIT_API_KEY || 'kit_ab2d14214a3e0b027a62b0ea74468578')

export type { ROILeadData, KitSubscriber, KitTag, KitCustomField }