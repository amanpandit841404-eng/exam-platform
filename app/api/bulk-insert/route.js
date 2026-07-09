import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const body = await request.json()
    const { exams } = body

    if (!exams || !Array.isArray(exams) || exams.length === 0) {
      return Response.json({ error: 'No exams provided' }, { status: 400 })
    }

    // Use anon key from env (same as client) - RLS allows insert now
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ error: 'Missing Supabase credentials' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const BATCH_SIZE = 500
    let totalInserted = 0
    let totalErrors = 0

    for (let i = 0; i < exams.length; i += BATCH_SIZE) {
      const batch = exams.slice(i, i + BATCH_SIZE)
      const { error } = await supabase
        .from('exams')
        .upsert(batch, { onConflict: 'name', ignoreDuplicates: true })

      if (error) {
        totalErrors++
        console.error(`Batch ${i} error:`, error.message)
      } else {
        totalInserted += batch.length
      }
    }

    // Get final count
    const { count } = await supabase
      .from('exams')
      .select('*', { count: 'exact', head: true })

    return Response.json({
      success: true,
      examsGenerated: exams.length,
      examsAttempted: totalInserted,
      errors: totalErrors,
      totalInDatabase: count || 0
    })

  } catch (err) {
    console.error('Bulk insert error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
