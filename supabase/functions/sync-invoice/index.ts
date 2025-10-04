import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvoicePayload {
  reservation_id: string
  transaction_type: 'revenue' | 'commission' | 'expense'
  amount: number
  category: string
  description: string
  transaction_date: string
  payment_status?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('Sync invoice endpoint called')

    const payload: InvoicePayload = await req.json()
    console.log('Received invoice payload:', payload)

    // Insert transaction into accounting_transactions table
    const { data, error } = await supabase
      .from('accounting_transactions')
      .insert([{
        reservation_id: payload.reservation_id,
        transaction_type: payload.transaction_type,
        amount: payload.amount,
        category: payload.category,
        description: payload.description,
        transaction_date: payload.transaction_date,
        payment_status: payload.payment_status || 'pending'
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Invoice created successfully:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        transaction: data,
        message: 'Facture synchronisée avec succès'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      }
    )

  } catch (error) {
    console.error('Error in sync-invoice:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
