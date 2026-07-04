import { beforeEach, describe, expect, it, vi } from 'vitest'

const contactsServiceMock = vi.hoisted(() => ({
  deleteContactById: vi.fn(),
  emitSearchedContacts: vi.fn(),
  saveContact: vi.fn(),
  searchContacts: vi.fn(),
  updateContactInteractionType: vi.fn()
}))

const presenceUtilsMock = vi.hoisted(() => ({
  emitToUsers: vi.fn()
}))

vi.mock('src/shared/lib/socket-error', () => ({
  socketAckMiddleware: (_socket: unknown, handler: unknown) => handler,
  socketErrorMiddleware: (_socket: unknown, handler: unknown) => handler
}))
vi.mock('src/modules/presence/presence.utils', () => presenceUtilsMock)
vi.mock('./contacts.service', () => contactsServiceMock)

const { ContactsSocketService } = await import('./contacts.socket')

const registerContactsHandlers = () => {
  const handlers: Record<string, (payload: never) => Promise<unknown>> = {}
  const socket = {
    id: 'socket-1',
    data: {
      userId: 'user-1'
    },
    on: vi.fn((event: string, handler: (payload: never) => Promise<unknown>) => {
      handlers[event] = handler
    })
  }
  const presenceService = {}
  const notificationsService = {}

  new ContactsSocketService(presenceService as never, notificationsService as never).register(socket as never)

  return {
    handlers,
    notificationsService,
    presenceService
  }
}

describe('contacts.socket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('searches contacts and emits result to the same socket', async () => {
    const { handlers, presenceService } = registerContactsHandlers()
    const payload = { value: 'alice', offset: 2, contacts: [], total: 0, hasMore: false }

    contactsServiceMock.searchContacts.mockResolvedValue(payload)

    await handlers['search-contact']({ value: 'alice', offset: 2 } as never)

    expect(contactsServiceMock.searchContacts).toHaveBeenCalledWith('user-1', 'alice', 2, presenceService)
    expect(contactsServiceMock.emitSearchedContacts).toHaveBeenCalledWith('socket-1', payload)
  })

  it('saves contact and emits add success when payload exists', async () => {
    const { handlers, presenceService } = registerContactsHandlers()
    const payload = { contactData: { id: 'user-2' } }

    contactsServiceMock.saveContact.mockResolvedValue(payload)

    await handlers['save-contact']({ interlocutorId: 'user-2' } as never)

    expect(contactsServiceMock.saveContact).toHaveBeenCalledWith('user-1', 'user-2', presenceService)
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['user-1'], 'contact-add-success', payload)
  })

  it('wires delete and interaction updates to service layer', async () => {
    const { handlers, notificationsService, presenceService } = registerContactsHandlers()

    await handlers['delete-contact']({ deletingUserId: 'user-2' } as never)
    await handlers['update-contact-interaction-type']({ contactId: 'user-2', interaction: 'blocked' } as never)

    expect(contactsServiceMock.deleteContactById).toHaveBeenCalledWith('user-1', 'user-2')
    expect(contactsServiceMock.updateContactInteractionType).toHaveBeenCalledWith(
      'user-1',
      'user-2',
      'blocked',
      presenceService,
      notificationsService
    )
  })
})
