import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StatusUpdatePayload {
  reservation_id: string
  status: 'pending' | 'accepted' | 'started' | 'arrived' | 'onBoard' | 'completed'
  actual_pickup_time?: string
  dropoff_time?: string
  rating?: number
  comment?: string
  distance?: string
  duration?: string
  route?: any
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

    console.log('Update reservation status endpoint called')

    const payload: StatusUpdatePayload = await req.json()
    console.log('Received status update payload:', payload)

    // Build update object dynamically
    const updateData: any = {
      status: payload.status
    }

    if (payload.actual_pickup_time) updateData.actual_pickup_time = payload.actual_pickup_time
    if (payload.dropoff_time) updateData.dropoff_time = payload.dropoff_time
    if (payload.rating) updateData.rating = payload.rating
    if (payload.comment) updateData.comment = payload.comment
    if (payload.distance) updateData.distance = payload.distance
    if (payload.duration) updateData.duration = payload.duration
    if (payload.route) updateData.route = payload.route

    // Update reservation status
    const { data, error } = await supabase
      .from('reservations')
      .update(updateData)
      .eq('id', payload.reservation_id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Reservation status updated successfully:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        reservation: data,
        message: 'Statut de réservation mis à jour avec succès'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in update-reservation-status:', error)
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
