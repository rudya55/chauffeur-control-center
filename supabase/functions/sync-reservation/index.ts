import { requireAdmin, getCorsHeaders } from '../_shared/auth.ts'
import {
  validateString,
  validatePhone,
  validatePositiveInteger,
  validateAmount,
  validateDate,
  validateEnum,
  validateUUID,
  throwIfErrors,
  ValidationException
} from '../_shared/validation.ts'

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

const ALLOWED_VEHICLE_TYPES = ['berline', 'van', 'premium']
const ALLOWED_PAYMENT_TYPES = ['card', 'cash', 'account']

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 1. Vérifier l'authentification et les permissions (admin seulement)
    const { supabase } = await requireAdmin(req)

    // 2. Récupérer et valider le payload
    const payload: ReservationPayload = await req.json()

    // 3. Validation complète des données
    const errors = [
      validateString(payload.client_name, 'client_name', 100),
      validatePhone(payload.phone),
      validateString(payload.pickup_address, 'pickup_address', 500),
      validateString(payload.destination, 'destination', 500),
      validateDate(payload.date, 'date'),
      validatePositiveInteger(payload.passengers, 'passengers', 1, 20),
      validatePositiveInteger(payload.luggage, 'luggage', 0, 50),
      validateEnum(payload.vehicle_type, 'vehicle_type', ALLOWED_VEHICLE_TYPES),
      validateEnum(payload.payment_type, 'payment_type', ALLOWED_PAYMENT_TYPES),
      validateAmount(payload.amount, 'amount', 0, 10000),
      validateAmount(payload.commission, 'commission', 0, 10000),
      validateAmount(payload.driver_amount, 'driver_amount', 0, 10000),
      validateString(payload.dispatcher, 'dispatcher', 100),
      payload.dispatcher_logo ? validateString(payload.dispatcher_logo, 'dispatcher_logo', 500, false) : null,
      payload.flight_number ? validateString(payload.flight_number, 'flight_number', 50, false) : null,
      payload.driver_id ? validateUUID(payload.driver_id, 'driver_id') : null,
    ]

    throwIfErrors(errors)

    // 4. Vérifier la cohérence des montants
    if (Math.abs((payload.amount - payload.driver_amount - payload.commission)) > 0.01) {
      throw new Error('Incohérence: amount doit égaler driver_amount + commission')
    }

    // 5. Si driver_id est fourni, vérifier qu'il existe
    if (payload.driver_id) {
      const { data: driverExists } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', payload.driver_id)
        .single()

      if (!driverExists) {
        throw new Error('Driver ID invalide')
      }
    }

    // 6. Insérer la réservation
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

    return new Response(
      JSON.stringify({
        success: true,
        reservation: data,
        message: 'Réservation créée avec succès'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      }
    )

  } catch (error) {
    console.error('Error in sync-reservation:', error)

    // Gérer les différents types d'erreurs
    let status = 400
    let errorMessage = error.message

    if (error.message.includes('authorization') || error.message.includes('Admin')) {
      status = 401
      errorMessage = 'Non autorisé'
    } else if (error instanceof ValidationException) {
      status = 422
      return new Response(
        JSON.stringify({
          success: false,
          errors: error.errors
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status
      }
    )
  }
})
