-- Enhanced agent_logs table with user filtering
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User association
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Context
  repo VARCHAR(255) NOT NULL, -- "owner/repo"
  event_id VARCHAR(100), -- Unique ID for this webhook event
  commit_sha VARCHAR(40),
  
  -- Log data
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  level VARCHAR(20) NOT NULL, -- debug, info, warn, error, success
  service VARCHAR(50) NOT NULL, -- receiver, worker, processor
  message TEXT NOT NULL,
  metadata JSONB, -- Additional context
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', message)
  ) STORED,
  
  CONSTRAINT valid_level CHECK (level IN ('debug', 'info', 'warn', 'error', 'success'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agent_logs_user_id ON agent_logs(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_repo ON agent_logs(repo, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_agent_logs_level ON agent_logs(level);
CREATE INDEX IF NOT EXISTS idx_agent_logs_event_id ON agent_logs(event_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_search ON agent_logs USING GIN(search_vector);

-- Enable Row Level Security
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own logs" ON agent_logs;
CREATE POLICY "Users can view own logs"
  ON agent_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service can insert all logs" ON agent_logs;
CREATE POLICY "Service can insert all logs"
  ON agent_logs FOR INSERT
  WITH CHECK (true);

-- Enable Realtime (This usually needs to be done via dashboard or SQL)
-- ALTER PUBLICATION supabase_realtime ADD TABLE agent_logs;
