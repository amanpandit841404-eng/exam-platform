export async function POST(request) {
  try {
    const body = await request.json()
    const { exams } = body

    if (!exams || !Array.isArray(exams) || exams.length === 0) {
      return Response.json({ success: false, error: 'No exams data' })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return Response.json({ success: false, error: 'Missing env vars', url: !!supabaseUrl, key: !!supabaseKey })
    }

    const apiUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/exams`
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    }

    // Test connection first: simple count
    try {
      const testRes = await fetch(`${apiUrl}?select=count&head=true`, { headers })
      if (!testRes.ok) {
        const testText = await testRes.text()
        return Response.json({ 
          success: false, 
          error: `API test failed: ${testRes.status} ${testRes.statusText}`,
          detail: testText.substring(0, 200),
          url: apiUrl.substring(0, 40) + '...'
        })
      }
    } catch (testErr) {
      return Response.json({ 
        success: false, 
        error: `Cannot reach Supabase: ${testErr.message}`,
        url: apiUrl.substring(0, 40) + '...'
      })
    }

    // Insert in batches using raw REST API
    const BATCH_SIZE = 400
    let inserted = 0
    let errors = []

    for (let i = 0; i < exams.length; i += BATCH_SIZE) {
      const batch = exams.slice(i, i + BATCH_SIZE)
      
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            ...headers,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify(batch)
        })

        if (!res.ok) {
          const errText = await res.text()
          errors.push(`Batch ${i}: ${res.status} - ${errText.substring(0, 100)}`)
          if (errors.length > 3) break
        } else {
          inserted += batch.length
        }
      } catch (batchErr) {
        errors.push(`Batch ${i}: ${batchErr.message}`)
        if (errors.length > 3) break
      }
    }

    // Get final count
    let finalCount = 0
    try {
      const countRes = await fetch(`${apiUrl}?select=count&head=true`, { headers })
      if (countRes.ok) {
        finalCount = parseInt(countRes.headers.get('content-range')?.split('/')?.[1] || '0')
      }
    } catch (e) {}

    return Response.json({
      success: true,
      totalInDatabase: finalCount,
      inserted: inserted,
      errors: errors,
      generated: exams.length
    })

  } catch (err) {
    return Response.json({ success: false, error: err.message })
  }
}
