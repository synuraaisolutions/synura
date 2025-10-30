import { NextRequest, NextResponse } from 'next/server'
import { kitIntegration } from '@/lib/kit-integration'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Kit API connection...')

    // Test basic connection
    const connectionTest = await kitIntegration.testConnection()

    if (!connectionTest) {
      return NextResponse.json({
        success: false,
        message: 'Kit API connection failed'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Kit API connection successful',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Kit test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Kit test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'initialize') {
      console.log('Initializing Kit CRM setup...')

      const setupResult = await kitIntegration.initializeKitSetup()

      if (setupResult) {
        return NextResponse.json({
          success: true,
          message: 'Kit CRM setup completed successfully!',
          timestamp: new Date().toISOString()
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'Kit CRM setup failed'
        }, { status: 500 })
      }
    }

    if (action === 'test-lead') {
      console.log('Testing ROI lead creation...')

      const testLeadData = {
        email: 'test@example.com',
        name: 'Test User',
        companySize: '1-10',
        industry: 'professional-services',
        calculatedROI: 350.5,
        annualSavings: 25000,
        setupInvestment: 3000,
        complexityScore: 5,
        leadSource: 'roi-calculator' as const,
        calculationId: 'test_calc_123'
      }

      const result = await kitIntegration.processROILead(testLeadData)

      if (result) {
        return NextResponse.json({
          success: true,
          message: 'Test ROI lead created successfully!',
          leadData: testLeadData
        })
      } else {
        return NextResponse.json({
          success: false,
          message: 'Failed to create test ROI lead'
        }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action. Use "initialize" or "test-lead"'
    }, { status: 400 })

  } catch (error) {
    console.error('Kit test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Kit test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}