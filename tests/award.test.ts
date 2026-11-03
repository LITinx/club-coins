import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const ME = 'a0000000-0000-4000-8000-000000000001'
const STUDENT = 'a0000000-0000-4000-8000-000000000002'
const OTHER_VOLUNTEER = 'a0000000-0000-4000-8000-000000000003'

const mocks = vi.hoisted(() => ({
  users: {} as Record<string, { id: string; role: string; status: string }>,
  insert: vi.fn(),
}))

// Every users lookup in the route is .from('users').select(...).eq('id', id).single()
vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: async () => ({ data: { user: { id: ME } } }) },
    from: () => ({
      select: () => ({
        eq: (_column: string, id: string) => ({ single: async () => ({ data: mocks.users[id] ?? null }) }),
      }),
    }),
  }),
}))
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => ({
      insert: (values: unknown) => {
        mocks.insert(values)
        return { select: () => ({ single: async () => ({ data: values, error: null }) }) }
      },
    }),
  }),
}))

import { POST } from '@/app/api/admin/members/[id]/award/route'

const award = (id: string) =>
  POST(new NextRequest('http://test', { method: 'POST', body: JSON.stringify({ amount: 5 }) }), {
    params: Promise.resolve({ id }),
  })

const setMyRole = (role: string) => {
  mocks.users = {
    [ME]: { id: ME, role, status: 'active' },
    [STUDENT]: { id: STUDENT, role: 'student', status: 'active' },
    [OTHER_VOLUNTEER]: { id: OTHER_VOLUNTEER, role: 'volunteer', status: 'active' },
  }
}

beforeEach(() => {
  mocks.insert.mockReset()
})

describe('POST /api/admin/members/[id]/award', () => {
  it('lets a volunteer award a student', async () => {
    setMyRole('volunteer')
    expect((await award(STUDENT)).status).toBe(201)
    expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({ to_user_id: STUDENT, amount: 5 }))
  })

  it('stops a volunteer awarding themselves or another volunteer', async () => {
    setMyRole('volunteer')
    expect((await award(ME)).status).toBe(403)
    expect((await award(OTHER_VOLUNTEER)).status).toBe(403)
    expect(mocks.insert).not.toHaveBeenCalled()
  })

  it('still lets an admin award a volunteer', async () => {
    setMyRole('admin')
    expect((await award(OTHER_VOLUNTEER)).status).toBe(201)
  })

  it('refuses students', async () => {
    setMyRole('student')
    expect((await award(STUDENT)).status).toBe(403)
    expect(mocks.insert).not.toHaveBeenCalled()
  })
})
