import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReservationPayload {
  client_name: string
  phone: string
  pickup_address: string
  destination: string
  date: string
  passengers: number
  luggage: number
  vehicle_type: string
  payment_type: string
  amount: number
  commission: number
  driver_amount: number
  dispatcher: string
  dispatcher_logo?: string
  flight_number?: string
  driver_id?: string
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

    console.log('Sync reservation endpoint called')

    const payload: ReservationPayload = await req.json()
    console.log('Received reservation payload:', payload)

    // Insert reservation into database
    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        client_name: payload.client_name,
        phone: payload.phone,
        pickup_address: payload.pickup_address,
        destination: payload.destination,
        date: payload.date,
        passengers: payload.passengers,
        luggage: payload.luggage,
        vehicle_type: payload.vehicle_type,
        payment_type: payload.payment_type,
        amount: payload.amount,
        commission: payload.commission,
        driver_amount: payload.driver_amount,
        dispatcher: payload.dispatcher,
        dispatcher_logo: payload.dispatcher_logo,
        flight_number: payload.flight_number,
        driver_id: payload.driver_id,
        status: 'pending'
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log('Reservation created successfully:', data)

    return new Response(
      JSON.stringify({ 
        success: true, 
        reservation: data,
        message: 'Réservation synchronisée avec succès'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      }
    )

  } catch (error) {
    console.error('Error in sync-reservation:', error)
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
