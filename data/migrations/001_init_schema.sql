-- Store Launch Wizard Database Schema
-- Migration: 001_init_schema.sql
-- Created: $(date)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Wizard sessions with progress tracking
CREATE TABLE wizard_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    current_step INTEGER DEFAULT 1,
    configuration JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT valid_step CHECK (current_step BETWEEN 1 AND 6),
    CONSTRAINT valid_configuration CHECK (jsonb_typeof(configuration) = 'object'),
    CONSTRAINT valid_metadata CHECK (jsonb_typeof(metadata) = 'object')
);

-- Store configurations with versioning
CREATE TABLE store_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES wizard_sessions(id) ON DELETE CASCADE,
    version INTEGER DEFAULT 1,
    business_info JSONB NOT NULL,
    product_config JSONB DEFAULT '{}',
    theme_settings JSONB DEFAULT '{}',
    integrations JSONB DEFAULT '{}',
    content_data JSONB DEFAULT '{}',
    seo_config JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_version CHECK (version > 0),
    CONSTRAINT valid_business_info CHECK (jsonb_typeof(business_info) = 'object')
);

-- AI-generated content with quality scores
CREATE TABLE generated_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES store_configs(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    content_data JSONB NOT NULL,
    prompt_used TEXT,
    model_used VARCHAR(50),
    quality_score FLOAT CHECK (quality_score BETWEEN 0.0 AND 1.0),
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    is_approved BOOLEAN DEFAULT false,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_content_type CHECK (content_type IN (
        'product_description', 'marketing_copy', 'email_template', 
        'social_media_post', 'blog_content', 'seo_metadata',
        'legal_document', 'brand_messaging'
    )),
    CONSTRAINT valid_content_data CHECK (jsonb_typeof(content_data) = 'object')
);

-- Theme recommendations with performance data
CREATE TABLE theme_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES wizard_sessions(id) ON DELETE CASCADE,
    theme_id VARCHAR(100) NOT NULL,
    theme_name VARCHAR(200) NOT NULL,
    industry_category VARCHAR(100),
    recommendation_score FLOAT CHECK (recommendation_score BETWEEN 0.0 AND 1.0),
    performance_data JSONB,
    customizations JSONB DEFAULT '{}',
    is_selected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_theme_id CHECK (length(theme_id) > 0),
    CONSTRAINT valid_theme_name CHECK (length(theme_name) > 0)
);

-- Integration tracking and status
CREATE TABLE integration_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES wizard_sessions(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    configuration JSONB DEFAULT '{}',
    credentials JSONB DEFAULT '{}', -- Encrypted sensitive data
    error_message TEXT,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_status CHECK (status IN (
        'pending', 'configuring', 'connected', 'error', 'disabled'
    )),
    CONSTRAINT valid_integration_type CHECK (integration_type IN (
        'ecommerce_platform', 'payment_gateway', 'shipping_provider',
        'email_marketing', 'analytics', 'social_media', 'advertising'
    ))
);

-- Analytics and performance tracking
CREATE TABLE wizard_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES wizard_sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_agent TEXT,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_event_type CHECK (event_type IN (
        'step_started', 'step_completed', 'content_generated', 
        'theme_selected', 'integration_added', 'wizard_completed',
        'error_occurred', 'user_feedback'
    ))
);

-- User feedback and ratings
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES wizard_sessions(id) ON DELETE CASCADE,
    step_number INTEGER,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    category VARCHAR(50),
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_step_number CHECK (step_number BETWEEN 1 AND 6),
    CONSTRAINT valid_category CHECK (category IN (
        'usability', 'content_quality', 'performance', 'features', 'other'
    ))
);

-- Store launch checklist items
CREATE TABLE launch_checklist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES wizard_sessions(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(10) DEFAULT 'medium',
    is_completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMP WITH TIME ZONE,
    automated_check BOOLEAN DEFAULT false,
    check_result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT valid_item_type CHECK (item_type IN (
        'technical', 'content', 'legal', 'seo', 'integration', 'design'
    ))
);

-- Performance indexes for optimal query execution
CREATE INDEX idx_wizard_sessions_user_id ON wizard_sessions(user_id);
CREATE INDEX idx_wizard_sessions_current_step ON wizard_sessions(current_step);
CREATE INDEX idx_wizard_sessions_updated_at ON wizard_sessions(updated_at);
CREATE INDEX idx_wizard_sessions_completed_at ON wizard_sessions(completed_at);

CREATE INDEX idx_store_configs_session_id ON store_configs(session_id);
CREATE INDEX idx_store_configs_created_at ON store_configs(created_at);

CREATE INDEX idx_generated_content_store_id ON generated_content(store_id);
CREATE INDEX idx_generated_content_type ON generated_content(content_type);
CREATE INDEX idx_generated_content_quality_score ON generated_content(quality_score);
CREATE INDEX idx_generated_content_is_approved ON generated_content(is_approved);

CREATE INDEX idx_theme_recommendations_session_id ON theme_recommendations(session_id);
CREATE INDEX idx_theme_recommendations_industry ON theme_recommendations(industry_category);
CREATE INDEX idx_theme_recommendations_score ON theme_recommendations(recommendation_score);

CREATE INDEX idx_integration_status_session_id ON integration_status(session_id);
CREATE INDEX idx_integration_status_type ON integration_status(integration_type);
CREATE INDEX idx_integration_status_provider ON integration_status(provider_name);
CREATE INDEX idx_integration_status_status ON integration_status(status);

CREATE INDEX idx_wizard_analytics_session_id ON wizard_analytics(session_id);
CREATE INDEX idx_wizard_analytics_event_type ON wizard_analytics(event_type);
CREATE INDEX idx_wizard_analytics_timestamp ON wizard_analytics(timestamp);

CREATE INDEX idx_user_feedback_session_id ON user_feedback(session_id);
CREATE INDEX idx_user_feedback_rating ON user_feedback(rating);
CREATE INDEX idx_user_feedback_category ON user_feedback(category);

CREATE INDEX idx_launch_checklist_session_id ON launch_checklist(session_id);
CREATE INDEX idx_launch_checklist_priority ON launch_checklist(priority);
CREATE INDEX idx_launch_checklist_completed ON launch_checklist(is_completed);

-- Composite indexes for common query patterns
CREATE INDEX idx_wizard_sessions_user_step ON wizard_sessions(user_id, current_step);
CREATE INDEX idx_generated_content_store_type ON generated_content(store_id, content_type);
CREATE INDEX idx_integration_status_session_type ON integration_status(session_id, integration_type);
CREATE INDEX idx_analytics_session_event_time ON wizard_analytics(session_id, event_type, timestamp);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_wizard_sessions_updated_at 
    BEFORE UPDATE ON wizard_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_content_updated_at 
    BEFORE UPDATE ON generated_content 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integration_status_updated_at 
    BEFORE UPDATE ON integration_status 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_launch_checklist_updated_at 
    BEFORE UPDATE ON launch_checklist 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate wizard completion percentage
CREATE OR REPLACE FUNCTION calculate_wizard_progress(session_uuid UUID)
RETURNS FLOAT AS $$
DECLARE
    total_steps INTEGER := 6;
    current_step INTEGER;
    completed_steps INTEGER;
BEGIN
    SELECT wizard_sessions.current_step INTO current_step
    FROM wizard_sessions 
    WHERE id = session_uuid;
    
    IF current_step IS NULL THEN
        RETURN 0.0;
    END IF;
    
    -- Count completed checklist items for more accurate progress
    SELECT COUNT(*) INTO completed_steps
    FROM launch_checklist 
    WHERE session_id = session_uuid AND is_completed = true;
    
    RETURN LEAST(1.0, (current_step - 1)::FLOAT / total_steps + 
                     (completed_steps::FLOAT / 20)); -- Assume 20 total checklist items
END;
$$ LANGUAGE plpgsql;

-- View for wizard session summary
CREATE VIEW wizard_session_summary AS
SELECT 
    ws.id,
    ws.user_id,
    ws.current_step,
    ws.created_at,
    ws.updated_at,
    ws.completed_at,
    calculate_wizard_progress(ws.id) as progress_percentage,
    sc.business_info->>'business_name' as business_name,
    sc.business_info->>'industry' as industry,
    COUNT(gc.id) as generated_content_count,
    COUNT(tr.id) as theme_recommendations_count,
    COUNT(ist.id) as integration_count,
    AVG(uf.rating) as average_rating
FROM wizard_sessions ws
LEFT JOIN store_configs sc ON ws.id = sc.session_id
LEFT JOIN generated_content gc ON sc.id = gc.store_id
LEFT JOIN theme_recommendations tr ON ws.id = tr.session_id
LEFT JOIN integration_status ist ON ws.id = ist.session_id
LEFT JOIN user_feedback uf ON ws.id = uf.session_id
GROUP BY ws.id, sc.business_info;

-- Insert sample data for development
INSERT INTO wizard_sessions (user_id, current_step, configuration) VALUES
(uuid_generate_v4(), 1, '{"demo": true, "user_type": "first_time"}'),
(uuid_generate_v4(), 3, '{"demo": true, "user_type": "experienced"}'),
(uuid_generate_v4(), 6, '{"demo": true, "user_type": "business_owner"}');

-- Sample theme data
INSERT INTO theme_recommendations (session_id, theme_id, theme_name, industry_category, recommendation_score)
SELECT 
    id as session_id,
    'theme_modern_minimal',
    'Modern Minimal',
    'fashion',
    0.95
FROM wizard_sessions LIMIT 1;

COMMIT; 