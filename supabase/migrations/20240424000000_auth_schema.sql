-- 🔐 Ulla Britta Authentication System - Database Schema

-- Enable Row Level Security
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.github_installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_log ENABLE ROW LEVEL SECURITY;

-- 1. public.profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Basic info
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  
  -- Provider-specific data
  github_username VARCHAR(255),
  github_id INTEGER,
  google_email VARCHAR(255),
  
  -- Subscription
  subscription_tier VARCHAR(20) DEFAULT 'hobby', -- hobby, pro, enterprise
  subscription_status VARCHAR(20) DEFAULT 'active', -- active, cancelled, expired
  stripe_customer_id VARCHAR(255),
  
  -- Metadata
  onboarding_completed BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_subscription_tier CHECK (
    subscription_tier IN ('hobby', 'pro', 'enterprise')
  )
);

-- RLS Policies for Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- 2. public.user_preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Notification channels
  email VARCHAR(255),
  email_enabled BOOLEAN DEFAULT true,
  discord_webhook_url TEXT,
  discord_enabled BOOLEAN DEFAULT false,
  telegram_chat_id VARCHAR(255),
  telegram_enabled BOOLEAN DEFAULT false,
  slack_webhook_url TEXT,
  slack_enabled BOOLEAN DEFAULT false,
  
  -- Preferences
  report_type VARCHAR(50) DEFAULT 'technical', -- executive, technical, security
  notification_frequency VARCHAR(50) DEFAULT 'immediate', -- immediate, daily, weekly
  auto_merge_threshold INTEGER DEFAULT 90, -- confidence %
  time_zone VARCHAR(50) DEFAULT 'UTC',
  language VARCHAR(10) DEFAULT 'en',
  
  -- GitHub installations (array of installation IDs)
  github_installations INTEGER[],
  
  -- Advanced settings (JSONB for flexibility)
  notification_settings JSONB DEFAULT '{
    "email_on_success": true,
    "email_on_failure": true,
    "email_on_warning": true,
    "discord_on_merge": true,
    "telegram_daily_digest": false
  }'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS for User Preferences
CREATE POLICY "Users can manage own preferences"
  ON public.user_preferences
  USING (auth.uid() = user_id);

-- 3. public.github_installations
CREATE TABLE IF NOT EXISTS public.github_installations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- GitHub App installation data
  installation_id INTEGER NOT NULL UNIQUE,
  account_login VARCHAR(255) NOT NULL, -- GitHub username or org name
  account_type VARCHAR(20) NOT NULL, -- User or Organization
  
  -- Permissions
  repositories_access VARCHAR(20) DEFAULT 'selected', -- all or selected
  repository_selection INTEGER[], -- Array of repo IDs if selected
  
  -- Status
  status VARCHAR(20) DEFAULT 'active', -- active, suspended, deleted
  
  -- Metadata
  installed_at TIMESTAMP DEFAULT NOW(),
  last_sync_at TIMESTAMP,
  
  UNIQUE(user_id, installation_id)
);

-- RLS for GitHub Installations
CREATE POLICY "Users can view own installations"
  ON public.github_installations FOR SELECT
  USING (auth.uid() = user_id);

-- 4. public.api_keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Key data
  key_prefix VARCHAR(20) NOT NULL, -- ulla_live_abc... (first 20 chars for display)
  key_hash VARCHAR(255) NOT NULL, -- SHA-256 hash of full key
  
  -- Metadata
  name VARCHAR(100) NOT NULL, -- User-friendly name
  description TEXT,
  
  -- Permissions
  scopes TEXT[] DEFAULT ARRAY['read'], -- read, write, admin
  rate_limit INTEGER DEFAULT 1000, -- requests per hour
  
  -- Usage tracking
  last_used_at TIMESTAMP,
  usage_count INTEGER DEFAULT 0,
  
  -- Lifecycle
  expires_at TIMESTAMP,
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS for API Keys
CREATE POLICY "Users can manage own API keys"
  ON public.api_keys
  USING (auth.uid() = user_id);

-- 5. public.audit_log
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Event details
  event_type VARCHAR(50) NOT NULL, -- login, logout, api_key_created, settings_updated
  event_category VARCHAR(50) NOT NULL, -- auth, settings, api, admin
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  location VARCHAR(255), -- City, Country
  
  -- Metadata
  metadata JSONB, -- Additional context
  
  -- Status
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- RLS for Audit Log
CREATE POLICY "Users can view own audit logs"
  ON public.audit_log FOR SELECT
  USING (auth.uid() = user_id);

-- --- Utility Functions ---

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_github_installations_user_id ON public.github_installations(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id, created_at DESC);

-- Automated Cleanup (Requires pg_cron)
-- Note: Run these separately if pg_cron is enabled in your Supabase instance
-- SELECT cron.schedule('delete-expired-api-keys', '0 0 * * *', $$UPDATE public.api_keys SET revoked = true, revoked_at = NOW() WHERE expires_at < NOW() AND revoked = false$$);
-- SELECT cron.schedule('delete-old-audit-logs', '0 2 * * *', $$DELETE FROM public.audit_log WHERE created_at < NOW() - INTERVAL '90 days'$$);
