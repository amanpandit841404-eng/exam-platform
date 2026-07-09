import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const body = await request.json()
    const { exams } = body

    if (!exams || !Array.isArray(exams) || exams.length === 0) {
      return Response.json({ error: 'No exams provided' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ 
        success: false, 
        error: 'Missing Supabase credentials in Vercel env',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // First test: simple SELECT to verify connection
    const { data: testData, error: testError } = await supabase
      .from('exams')
      .select('count', { count: 'exact', head: true })

    if (testError) {
      return Response.json({
        success: false,
        error: `Connection test failed: ${testError.message}`,
        hint: 'Check if Supabase project is active (not paused) in dashboard'
      })
    }

    // Use simple INSERT (not upsert) with error handling per batch
    const BATCH_SIZE = 200
    let totalInserted = 0
    let errors = []
    let duplicates = 0

    for (let i = 0; i < exams.length; i += BATCH_SIZE) {
      const batch = exams.slice(i, i + BATCH_SIZE)
      const { error } = await supabase
        .from('exams')
        .insert(batch)
        // Using .insert() directly. If a row conflicts, we catch the error.
      
      if (error) {
        // Check if it's a duplicate key error
        if (error.code === '23505') {
          duplicates += batch.length
        } else {
          errors.push({ batch: i, message: error.message, code: error.code })
          if (errors.length > 5) break // stop after too many errors
        }
      } else {
        totalInserted += batch.length
      }
    }

    // Get final count
    const { count, error: countError } = await supabase
      .from('exams')
      .select('*', { count: 'exact', head: true })

    return Response.json({
      success: true,
      examsGenerated: exams.length,
      inserted: totalInserted,
      duplicates: duplicates,
      errors: errors,
      totalInDatabase: count || 0,
      countError: countError?.message || null
    })

  } catch (err) {
    return Response.json({ 
      success: false, 
      error: err.message,
      stack: err.stack?.substring(0, 300)
    })
  }
}
