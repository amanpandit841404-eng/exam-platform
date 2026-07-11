
    -- Create alerts table for monitoring notifications
    CREATE TABLE IF NOT EXISTS alerts (
      id BIGSERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      source TEXT,
      source_url TEXT,
      exam_name TEXT,
      alert_type TEXT DEFAULT 'info',
      status TEXT DEFAULT 'new',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

    -- Allow anon select
    DROP POLICY IF EXISTS anon_select_alerts ON alerts;
    CREATE POLICY anon_select_alerts ON alerts FOR SELECT USING (true);

    -- Allow anon insert
    DROP POLICY IF EXISTS anon_insert_alerts ON alerts;
    CREATE POLICY anon_insert_alerts ON alerts FOR INSERT WITH CHECK (true);

    -- Allow anon delete
    DROP POLICY IF EXISTS anon_delete_alerts ON alerts;
    CREATE POLICY anon_delete_alerts ON alerts FOR DELETE USING (true);
    