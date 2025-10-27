-- Synura Analytics & API Management Database Schema
-- PostgreSQL schema for analytics tracking and API key management

-- API Keys table for authentication
CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  key_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  key_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0
);

-- Index for fast key lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key_id ON api_keys(key_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);

-- API Analytics table for endpoint usage tracking
CREATE TABLE IF NOT EXISTS api_analytics (
  id SERIAL PRIMARY KEY,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER,
  api_key_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  request_size INTEGER,
  response_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_api_analytics_endpoint ON api_analytics(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_analytics_created_at ON api_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_api_analytics_api_key_id ON api_analytics(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_analytics_status_code ON api_analytics(status_code);

-- Leads table for lead capture data
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  lead_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  intent VARCHAR(50) DEFAULT 'consultation',
  message TEXT,
  source VARCHAR(50) DEFAULT 'website',
  utm_source VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_content VARCHAR(255),
  utm_term VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  api_key_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for lead management
CREATE INDEX IF NOT EXISTS idx_leads_lead_id ON leads(lead_id);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- ROI Calculations table for ROI calculation data
CREATE TABLE IF NOT EXISTS roi_calculations (
  id SERIAL PRIMARY KEY,
  calculation_id VARCHAR(255) UNIQUE NOT NULL,
  company_size VARCHAR(50),
  industry VARCHAR(50),
  employee_count INTEGER,
  average_hourly_rate DECIMAL(10,2),
  manual_task_hours DECIMAL(10,2),
  error_rate DECIMAL(5,2),
  automation_areas JSONB,
  primary_goal VARCHAR(50),
  timeframe VARCHAR(50),
  estimates JSONB,
  recommendations JSONB,
  confidence_level VARCHAR(20),
  email VARCHAR(255),
  name VARCHAR(255),
  api_key_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for ROI analysis
CREATE INDEX IF NOT EXISTS idx_roi_calculation_id ON roi_calculations(calculation_id);
CREATE INDEX IF NOT EXISTS idx_roi_company_size ON roi_calculations(company_size);
CREATE INDEX IF NOT EXISTS idx_roi_industry ON roi_calculations(industry);
CREATE INDEX IF NOT EXISTS idx_roi_created_at ON roi_calculations(created_at);
CREATE INDEX IF NOT EXISTS idx_roi_email ON roi_calculations(email);

-- Service Recommendations table for recommendation tracking
CREATE TABLE IF NOT EXISTS service_recommendations (
  id SERIAL PRIMARY KEY,
  recommendation_id VARCHAR(255) UNIQUE NOT NULL,
  company_size VARCHAR(50),
  industry VARCHAR(50),
  challenges JSONB,
  goals JSONB,
  budget VARCHAR(50),
  timeline VARCHAR(50),
  current_tools JSONB,
  recommendations JSONB,
  roadmap JSONB,
  estimated_budget JSONB,
  estimated_timeline JSONB,
  api_key_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for service recommendation analysis
CREATE INDEX IF NOT EXISTS idx_service_rec_id ON service_recommendations(recommendation_id);
CREATE INDEX IF NOT EXISTS idx_service_rec_company_size ON service_recommendations(company_size);
CREATE INDEX IF NOT EXISTS idx_service_rec_industry ON service_recommendations(industry);
CREATE INDEX IF NOT EXISTS idx_service_rec_created_at ON service_recommendations(created_at);

-- Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to tables with updated_at columns
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for analytics dashboards

-- API usage summary view
CREATE OR REPLACE VIEW api_usage_summary AS
SELECT
  DATE(created_at) as date,
  endpoint,
  COUNT(*) as total_requests,
  COUNT(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 END) as successful_requests,
  COUNT(CASE WHEN status_code >= 400 THEN 1 END) as error_requests,
  AVG(response_time_ms) as avg_response_time,
  COUNT(DISTINCT api_key_id) as unique_api_keys
FROM api_analytics
GROUP BY DATE(created_at), endpoint
ORDER BY date DESC, total_requests DESC;

-- Lead source summary view
CREATE OR REPLACE VIEW lead_source_summary AS
SELECT
  DATE(created_at) as date,
  source,
  COUNT(*) as total_leads,
  COUNT(DISTINCT email) as unique_leads,
  COUNT(CASE WHEN utm_source IS NOT NULL THEN 1 END) as tracked_leads
FROM leads
GROUP BY DATE(created_at), source
ORDER BY date DESC, total_leads DESC;

-- ROI calculation trends view
CREATE OR REPLACE VIEW roi_trends AS
SELECT
  DATE(created_at) as date,
  industry,
  company_size,
  COUNT(*) as total_calculations,
  AVG((estimates->>'roi'->>'percentage')::NUMERIC) as avg_roi_percentage,
  AVG((estimates->>'investment'->>'firstYearTotal')::NUMERIC) as avg_investment
FROM roi_calculations
WHERE estimates IS NOT NULL
GROUP BY DATE(created_at), industry, company_size
ORDER BY date DESC, total_calculations DESC;

-- Service recommendation patterns view
CREATE OR REPLACE VIEW service_recommendation_patterns AS
SELECT
  DATE(created_at) as date,
  industry,
  company_size,
  COUNT(*) as total_recommendations,
  COUNT(CASE WHEN jsonb_array_length(recommendations->'highlyRecommended') > 0 THEN 1 END) as high_confidence_recs
FROM service_recommendations
WHERE recommendations IS NOT NULL
GROUP BY DATE(created_at), industry, company_size
ORDER BY date DESC, total_recommendations DESC;

-- Comments for documentation
COMMENT ON TABLE api_keys IS 'API key management for authentication and authorization';
COMMENT ON TABLE api_analytics IS 'Comprehensive API usage analytics and monitoring';
COMMENT ON TABLE leads IS 'Lead capture and tracking with UTM and source attribution';
COMMENT ON TABLE roi_calculations IS 'ROI calculator results with input parameters and estimates';
COMMENT ON TABLE service_recommendations IS 'Service recommendation engine results and criteria';

-- Initial data can be inserted here if needed
-- Example: Create a default admin API key (will be generated via admin interface in production)