import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkAdminRole } from '@/lib/middleware/admin-check'

export async function GET() {
  const supabase = await createClient()

  const adminCheck = await checkAdminRole(supabase)
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status })
  }

  // Get member stats
  const { count: totalMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: activeMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Get coin stats
  const { data: coinStats } = await supabase
    .from('users')
    .select('balance')

  const totalCoinsInCirculation = coinStats?.reduce((sum, user) => sum + user.balance, 0) ?? 0

  // Get transaction stats
  const { data: awardStats } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'award')

  const totalCoinsAwarded = awardStats?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0

  const { data: redemptionStats } = await supabase
    .from('transactions')
    .select('amount')
    .eq('type', 'redemption')

  const totalCoinsRedeemed = redemptionStats?.reduce((sum, tx) => sum + tx.amount, 0) ?? 0

  return NextResponse.json({
    totalMembers: totalMembers ?? 0,
    activeMembers: activeMembers ?? 0,
    totalCoinsInCirculation,
    totalCoinsAwarded,
    totalCoinsRedeemed,
  })
}
