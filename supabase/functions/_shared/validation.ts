/**
 * Utilitaires de validation des données
 */

export interface ValidationError {
  field: string
  message: string
}

export class ValidationException extends Error {
  constructor(public errors: ValidationError[]) {
    super('Validation failed')
    this.name = 'ValidationException'
  }
}

/**
 * Valide qu'une chaîne n'est pas vide et respecte une longueur max
 */
export function validateString(
  value: any,
  fieldName: string,
  maxLength: number = 255,
  required: boolean = true
): ValidationError | null {
  if (required && (!value || typeof value !== 'string' || value.trim() === '')) {
    return { field: fieldName, message: `${fieldName} est requis` }
  }

  if (value && typeof value === 'string' && value.length > maxLength) {
    return { field: fieldName, message: `${fieldName} ne peut pas dépasser ${maxLength} caractères` }
  }

  return null
}

/**
 * Valide un numéro de téléphone
 */
export function validatePhone(phone: any): ValidationError | null {
  if (!phone || typeof phone !== 'string') {
    return { field: 'phone', message: 'Numéro de téléphone requis' }
  }

  // Accepter les formats internationaux
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  if (!phoneRegex.test(phone)) {
    return { field: 'phone', message: 'Format de téléphone invalide' }
  }

  const digitsOnly = phone.replace(/\D/g, '')
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { field: 'phone', message: 'Le téléphone doit contenir entre 10 et 15 chiffres' }
  }

  return null
}

/**
 * Valide un nombre entier positif
 */
export function validatePositiveInteger(
  value: any,
  fieldName: string,
  min: number = 0,
  max: number = 999999
): ValidationError | null {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return { field: fieldName, message: `${fieldName} doit être un nombre entier` }
  }

  if (value < min || value > max) {
    return { field: fieldName, message: `${fieldName} doit être entre ${min} et ${max}` }
  }

  return null
}

/**
 * Valide un montant monétaire
 */
export function validateAmount(
  value: any,
  fieldName: string,
  min: number = 0,
  max: number = 999999
): ValidationError | null {
  if (typeof value !== 'number' || isNaN(value)) {
    return { field: fieldName, message: `${fieldName} doit être un nombre` }
  }

  if (value < min || value > max) {
    return { field: fieldName, message: `${fieldName} doit être entre ${min}€ et ${max}€` }
  }

  // Vérifier max 2 décimales
  if ((value * 100) % 1 !== 0) {
    return { field: fieldName, message: `${fieldName} ne peut avoir plus de 2 décimales` }
  }

  return null
}

/**
 * Valide une date
 */
export function validateDate(value: any, fieldName: string): ValidationError | null {
  if (!value || typeof value !== 'string') {
    return { field: fieldName, message: `${fieldName} est requis` }
  }

  const date = new Date(value)
  if (isNaN(date.getTime())) {
    return { field: fieldName, message: `${fieldName} n'est pas une date valide` }
  }

  return null
}

/**
 * Valide un UUID
 */
export function validateUUID(value: any, fieldName: string): ValidationError | null {
  if (!value || typeof value !== 'string') {
    return { field: fieldName, message: `${fieldName} est requis` }
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(value)) {
    return { field: fieldName, message: `${fieldName} n'est pas un UUID valide` }
  }

  return null
}

/**
 * Valide un rating (note de 1 à 5)
 */
export function validateRating(value: any): ValidationError | null {
  if (value === undefined || value === null) {
    return null // Rating optionnel
  }

  return validatePositiveInteger(value, 'rating', 1, 5)
}

/**
 * Valide une énumération
 */
export function validateEnum<T>(
  value: any,
  fieldName: string,
  allowedValues: T[]
): ValidationError | null {
  if (!allowedValues.includes(value as T)) {
    return {
      field: fieldName,
      message: `${fieldName} doit être une valeur parmi: ${allowedValues.join(', ')}`
    }
  }

  return null
}

/**
 * Lance une exception si des erreurs de validation existent
 */
export function throwIfErrors(errors: (ValidationError | null)[]): void {
  const validErrors = errors.filter(e => e !== null) as ValidationError[]
  if (validErrors.length > 0) {
    throw new ValidationException(validErrors)
  }
}
