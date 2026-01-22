'use client'

import { createClient } from './client'

export async function signOut() {
  const supabase = createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw error
  }

  // Redirect to login page
  window.location.href = '/login'
}

export async function getCurrentUser() {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return user
}

export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  const supabase = createClient()
  return supabase.auth.onAuthStateChange(callback)
}
