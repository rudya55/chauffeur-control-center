import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

export interface AuthResult {
  user: any
  supabase: SupabaseClient
  isAdmin: boolean
}

/**
 * Vérifie l'authentification de l'utilisateur et retourne le client Supabase
 * @throws Error si l'utilisateur n'est pas authentifié
 */
export async function authenticateUser(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get('Authorization')

  if (!authHeader) {
    throw new Error('Missing authorization header')
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

  // Créer un client avec le token de l'utilisateur
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader
      }
    }
  })

  // Vérifier l'authentification
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Invalid or expired token')
  }

  // Vérifier si l'utilisateur est admin
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle()

  const isAdmin = !!roleData

  return { user, supabase, isAdmin }
}

/**
 * Vérifie que l'utilisateur est admin
 * @throws Error si l'utilisateur n'est pas admin
 */
export async function requireAdmin(req: Request): Promise<AuthResult> {
  const authResult = await authenticateUser(req)

  if (!authResult.isAdmin) {
    throw new Error('Admin access required')
  }

  return authResult
}

/**
 * Retourne les headers CORS sécurisés
 */
export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') || ''
  const allowedOrigins = Deno.env.get('ALLOWED_ORIGINS')?.split(',') || []

  // En développement local, autoriser localhost
  const isDev = origin.includes('localhost') || origin.includes('127.0.0.1')

  // Vérifier si l'origine est autorisée
  const isAllowed = isDev || allowedOrigins.some(allowed => origin.includes(allowed))

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400', // 24 heures
  }
}
