import { describe, it, expect, vi, beforeEach } from 'vitest'

const ADMIN_ID = 'a0000000-0000-4000-8000-000000000001'
const MEMBER_ID = 'a0000000-0000-4000-8000-000000000002'

const mocks = vi.hoisted(() => ({
  adminCheck: { status: 200 } as { error?: string; status: number; userId?: string },
  transactionCount: 0,
  deleteUser: vi.fn(async () => ({ error: null })),
  update: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({ createClient: async () => ({}) }))
vi.mock('@/lib/middleware/admin-check', () => ({ checkAdminRole: async () => mocks.adminCheck }))
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => ({
      select: () => ({ or: async () => ({ count: mocks.transactionCount, error: null }) }),
      update: (values: unknown) => {
        mocks.update(values)
        return { eq: () => ({ select: () => ({ single: async () => ({ data: values, error: null }) }) }) }
      },
    }),
    auth: { admin: { deleteUser: mocks.deleteUser } },
  }),
}))

import { DELETE } from '@/app/api/admin/members/[id]/route'
import { PATCH } from '@/app/api/admin/members/[id]/role/route'

const deleteMember = (id: string) =>
  DELETE(new Request('http://test', { method: 'DELETE' }), { params: Promise.resolve({ id }) })

const setRole = (id: string, role: string) =>
  PATCH(new Request('http://test', { method: 'PATCH', body: JSON.stringify({ role }) }), {
    params: Promise.resolve({ id }),
  })

beforeEach(() => {
  mocks.adminCheck = { status: 200, userId: ADMIN_ID }
  mocks.transactionCount = 0
  mocks.deleteUser.mockClear()
  mocks.update.mockClear()
})

describe('DELETE /api/admin/members/[id]', () => {
  it('deletes a member without transactions', async () => {
    const response = await deleteMember(MEMBER_ID)
    expect(response.status).toBe(204)
    expect(mocks.deleteUser).toHaveBeenCalledWith(MEMBER_ID)
  })

  it('rejects non-admins', async () => {
    mocks.adminCheck = { error: 'Доступ только для администраторов', status: 403 }
    expect((await deleteMember(MEMBER_ID)).status).toBe(403)
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })

  it('refuses to delete the current admin', async () => {
    expect((await deleteMember(ADMIN_ID)).status).toBe(400)
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })

  it('refuses to delete a member with transactions', async () => {
    mocks.transactionCount = 3
    expect((await deleteMember(MEMBER_ID)).status).toBe(409)
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })

  it('rejects ids that are not UUIDs before they reach the filter', async () => {
    expect((await deleteMember(`${MEMBER_ID},amount.gt.0`)).status).toBe(400)
    expect(mocks.deleteUser).not.toHaveBeenCalled()
  })
})

describe('PATCH /api/admin/members/[id]/role', () => {
  it('promotes a member to admin', async () => {
    expect((await setRole(MEMBER_ID, 'admin')).status).toBe(200)
    expect(mocks.update).toHaveBeenCalledWith({ role: 'admin' })
  })

  it('refuses to change the current admin role', async () => {
    expect((await setRole(ADMIN_ID, 'student')).status).toBe(400)
    expect(mocks.update).not.toHaveBeenCalled()
  })

  it('rejects unknown roles', async () => {
    expect((await setRole(MEMBER_ID, 'owner')).status).toBe(400)
    expect(mocks.update).not.toHaveBeenCalled()
  })
})
