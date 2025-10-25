import { authenticateUser, getCorsHeaders } from '../_shared/auth.ts'
import {
  validateUUID,
  validateEnum,
  validateRating,
  validateString,
  throwIfErrors,
  ValidationException
} from '../_shared/validation.ts'

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

const ALLOWED_STATUSES = ['pending', 'accepted', 'started', 'arrived', 'onBoard', 'completed']

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 1. Vérifier l'authentification
    const { user, supabase, isAdmin } = await authenticateUser(req)

    // 2. Récupérer et valider le payload
    const payload: StatusUpdatePayload = await req.json()

    // 3. Validation des données
    const errors = [
      validateUUID(payload.reservation_id, 'reservation_id'),
      validateEnum(payload.status, 'status', ALLOWED_STATUSES),
      payload.rating !== undefined ? validateRating(payload.rating) : null,
      payload.comment ? validateString(payload.comment, 'comment', 1000, false) : null,
    ]

    throwIfErrors(errors)

    // 4. Vérifier que l'utilisateur a le droit de modifier cette réservation
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('id, driver_id, status')
      .eq('id', payload.reservation_id)
      .single()

    if (fetchError || !reservation) {
      throw new Error('Réservation non trouvée')
    }

    // Vérifier les permissions: admin ou driver assigné
    if (!isAdmin && reservation.driver_id !== user.id) {
      throw new Error('Vous n\'êtes pas autorisé à modifier cette réservation')
    }

    // 5. Construire l'objet de mise à jour
    const updateData: any = {
      status: payload.status
    }

    if (payload.actual_pickup_time) updateData.actual_pickup_time = payload.actual_pickup_time
    if (payload.dropoff_time) updateData.dropoff_time = payload.dropoff_time
    if (payload.rating !== undefined) updateData.rating = payload.rating
    if (payload.comment) updateData.comment = payload.comment
    if (payload.distance) updateData.distance = payload.distance
    if (payload.duration) updateData.duration = payload.duration
    if (payload.route) updateData.route = payload.route

    // 6. Mettre à jour la réservation
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

    return new Response(
      JSON.stringify({
        success: true,
        reservation: data,
        message: 'Statut mis à jour avec succès'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in update-reservation-status:', error)

    // Gérer les différents types d'erreurs
    let status = 400
    let errorMessage = error.message

    if (error.message.includes('authorization') || error.message.includes('autorisé')) {
      status = 403
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
