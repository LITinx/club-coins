'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useBalance(userId: string) {
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Initial fetch
    const fetchBalance = async () => {
      const { data } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single()

      const typedData = data as { balance: number } | null
      if (typedData) {
        setBalance(typedData.balance)
      }
      setIsLoading(false)
    }

    fetchBalance()

    // Subscribe to balance changes
    const channel = supabase
      .channel(`balance:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new && 'balance' in payload.new) {
            setBalance(payload.new.balance as number)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return { balance, isLoading }
}
