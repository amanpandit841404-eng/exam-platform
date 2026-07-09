import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  const results = { steps: [] }

  try {
    const body = await request.json()
    const { exams } = body

    if (!exams || !Array.isArray(exams)) {
      return Response.json({ success: false, error: 'Invalid data', steps: results.steps })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    results.steps.push({ step: 'env_check', hasUrl: !!supabaseUrl, hasKey: !!supabaseKey })

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ success: false, error: 'Missing env vars', steps: results.steps })
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    // Step 1: Test SELECT count
    const { count: beforeCount, error: selectErr } = await supabase
      .from('exams')
      .select('*', { count: 'exact', head: true })

    results.steps.push({ step: 'select_test', count: beforeCount, error: selectErr?.message || null })

    if (selectErr) {
      return Response.json({ success: false, error: `SELECT failed: ${selectErr.message}`, steps: results.steps })
    }

    // Step 2: Try a single insert first
    const single = exams[0]
    const { error: insertErr } = await supabase
      .from('exams')
      .upsert(single, { onConflict: 'name', ignoreDuplicates: true })

    results.steps.push({ step: 'single_insert_test', error: insertErr?.message || null, code: insertErr?.code || null })

    // If single insert fails, return early
    if (insertErr) {
      return Response.json({ 
        success: false, 
        error: `Insert failed: ${insertErr.message} (code: ${insertErr.code})`,
        hint: 'Check RLS policy or Supabase project settings',
        steps: results.steps 
      })
    }

    // Step 3: Bulk insert in batches
    const BATCH_SIZE = 300
    let inserted = 0
    let dupes = 0
    let insertErrors = []

    for (let i = 0; i < exams.length; i += BATCH_SIZE) {
      const batch = exams.slice(i, i + BATCH_SIZE)
      const { error } = await supabase
        .from('exams')
        .upsert(batch, { onConflict: 'name', ignoreDuplicates: true })

      if (error) {
        if (error.code === '23505') dupes += batch.length
        else {
          insertErrors.push(error.message)
          if (insertErrors.length >= 3) break
        }
      } else {
        inserted += batch.length
      }
    }

    results.steps.push({ step: 'bulk_insert', inserted, dupes, errors: insertErrors.length })

    // Final count
    const { count: finalCount } = await supabase
      .from('exams')
      .select('*', { count: 'exact', head: true })

    return Response.json({
      success: true,
      totalInDatabase: finalCount || 0,
      steps: results.steps
    })

  } catch (err) {
    return Response.json({ success: false, error: err.message, steps: results.steps })
  }
}
