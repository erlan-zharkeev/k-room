import { CONTACT_INTERACTION, CONTACT_SEARCH_QUERY_MAX_LENGTH, REQ_STATUS } from 'global-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const ioMock = vi.hoisted(() => ({
  emit: vi.fn(),
  to: vi.fn()
}))

const persistenceMock = vi.hoisted(() => ({
  createUserContactInteraction: vi.fn(),
  deleteUserContact: vi.fn(),
  loadContactSearchUsersById: vi.fn(),
  loadContactSearchUsersByNickname: vi.fn(),
  loadUserById: vi.fn(),
  loadUserContactInteraction: vi.fn(),
  loadUserContactInteractionDocument: vi.fn(),
  loadUserContactsById: vi.fn(),
  setDefaultUserContact: vi.fn(),
  setExistingUserContactInteraction: vi.fn()
}))

const presenceUtilsMock = vi.hoisted(() => ({
  emitToUsers: vi.fn()
}))

vi.mock('src/shared/lib/io', () => ({
  getIO: () => ioMock
}))

vi.mock('../presence/presence.utils', () => presenceUtilsMock)
vi.mock('../user/lib/user-persistence', () => persistenceMock)

const contactsService = await import('./contacts.service')
const { deleteContactById, emitSearchedContacts, saveContact, searchContacts, updateContactInteractionType } =
  contactsService

const createUser = (id: string, nickname: string) => ({
  _id: id,
  public: {
    nickname,
    avatarId: null,
    lastSeen: 0
  },
  personal: {
    contacts: {}
  }
})

const presenceService = {
  isUserOnline: vi.fn(),
  onlineMapByUserIds: vi.fn()
}

describe('contacts.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ioMock.to.mockReturnValue(ioMock)
    presenceService.isUserOnline.mockResolvedValue(false)
    presenceService.onlineMapByUserIds.mockResolvedValue(new Map())
  })

  it('emits searched contacts to requested socket only', () => {
    const payload = {
      value: 'alice',
      offset: 0,
      contacts: [],
      total: 0,
      hasMore: false
    }

    emitSearchedContacts('socket-1', payload)

    expect(ioMock.to).toHaveBeenCalledWith('socket-1')
    expect(ioMock.emit).toHaveBeenCalledWith('get-searched-contact', payload)
  })

  it('searches by nickname, filters current user, sorts accepted contacts last, and paginates', async () => {
    const currentUser = {
      _id: 'user-1',
      personal: {
        contacts: {
          'user-2': { interaction: CONTACT_INTERACTION.INVITE_RECEIVED },
          'user-3': { interaction: CONTACT_INTERACTION.INVITE_ACCEPTED }
        }
      }
    }
    const onlineMap = new Map([
      ['user-2', true],
      ['user-3', false]
    ])

    persistenceMock.loadContactSearchUsersByNickname.mockResolvedValue([
      createUser('user-3', 'Zed'),
      createUser('user-1', 'Self'),
      createUser('user-2', 'Alice')
    ])
    persistenceMock.loadUserContactsById.mockResolvedValue(currentUser)
    presenceService.onlineMapByUserIds.mockResolvedValue(onlineMap)

    const result = await searchContacts('user-1', '  al  ', 0, presenceService as never)

    expect(persistenceMock.loadContactSearchUsersByNickname).toHaveBeenCalledWith('al')
    expect(result.contacts.map((contact) => contact.id)).toEqual(['user-2', 'user-3'])
    expect(result.contacts[0]).toMatchObject({
      id: 'user-2',
      nickname: 'Alice',
      interactionType: CONTACT_INTERACTION.INVITE_RECEIVED,
      online: true
    })
    expect(result.total).toBe(2)
    expect(result.hasMore).toBe(false)
  })

  it('searches by id when query starts with mongo id marker', async () => {
    const contactId = '68a09410778b70d522ea8faa'

    persistenceMock.loadContactSearchUsersById.mockResolvedValue([createUser(contactId, 'Alice')])
    persistenceMock.loadUserContactsById.mockResolvedValue({ personal: { contacts: {} } })

    await searchContacts('user-1', `#${contactId}`, -10, presenceService as never)

    expect(persistenceMock.loadContactSearchUsersById).toHaveBeenCalledWith(contactId)
  })

  it('rejects too long search query', async () => {
    await expect(
      searchContacts('user-1', 'x'.repeat(CONTACT_SEARCH_QUERY_MAX_LENGTH + 1), 0, presenceService as never)
    ).rejects.toMatchObject({
      status: REQ_STATUS.badRequest
    })
  })

  it('saves default contact and returns online contact data', async () => {
    const contact = createUser('user-2', 'Alice')

    persistenceMock.loadUserContactsById.mockResolvedValue({ personal: { contacts: {} } })
    persistenceMock.loadUserById.mockResolvedValue(contact)
    presenceService.isUserOnline.mockResolvedValue(true)

    const result = await saveContact('user-1', 'user-2', presenceService as never)

    expect(persistenceMock.setDefaultUserContact).toHaveBeenCalledWith('user-1', 'user-2')
    expect(result?.contactData).toMatchObject({
      id: 'user-2',
      nickname: 'Alice',
      interactionType: CONTACT_INTERACTION.DEFAULT,
      online: true
    })
  })

  it('sends invite to contact side and emits both interaction updates', async () => {
    const author = createUser('user-1', 'Author')
    const contactSide = createUser('user-2', 'Contact')

    persistenceMock.loadUserContactsById.mockResolvedValue({
      personal: {
        contacts: {}
      }
    })
    persistenceMock.loadUserContactInteraction.mockResolvedValue(CONTACT_INTERACTION.DEFAULT)
    persistenceMock.createUserContactInteraction.mockResolvedValue(contactSide)
    persistenceMock.setExistingUserContactInteraction.mockResolvedValue(author)
    presenceService.isUserOnline.mockResolvedValue(true)

    await updateContactInteractionType('user-1', 'user-2', CONTACT_INTERACTION.INVITED, presenceService as never)

    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(
      ['user-2'],
      'invite-received',
      expect.objectContaining({
        id: 'user-1',
        interactionType: CONTACT_INTERACTION.INVITE_RECEIVED,
        online: true
      })
    )
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['user-1'], 'contact-interaction-updated', {
      contactId: 'user-2',
      interaction: CONTACT_INTERACTION.INVITED
    })
  })

  it('restores current interaction when blocked contact update is ignored', async () => {
    persistenceMock.loadUserContactInteraction
      .mockResolvedValueOnce(CONTACT_INTERACTION.BLOCKED)
      .mockResolvedValueOnce(CONTACT_INTERACTION.DEFAULT)
      .mockResolvedValueOnce(CONTACT_INTERACTION.BLOCKED)

    await updateContactInteractionType('user-1', 'user-2', CONTACT_INTERACTION.INVITED, presenceService as never)

    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['user-1'], 'contact-interaction-updated', {
      contactId: 'user-2',
      interaction: CONTACT_INTERACTION.BLOCKED
    })
  })

  it('deleting accepted contact resets reciprocal interaction to default', async () => {
    persistenceMock.loadUserContactInteractionDocument.mockResolvedValue({
      _id: 'user-2',
      personal: {
        contacts: {
          'user-1': {
            interaction: CONTACT_INTERACTION.INVITE_ACCEPTED
          }
        }
      }
    })

    await deleteContactById('user-1', 'user-2')

    expect(persistenceMock.deleteUserContact).toHaveBeenCalledWith('user-1', 'user-2')
    expect(persistenceMock.setExistingUserContactInteraction).toHaveBeenCalledWith(
      'user-2',
      'user-1',
      CONTACT_INTERACTION.DEFAULT
    )
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['user-1'], 'contact-delete-success', {
      deletedContactId: 'user-2',
      silent: false
    })
    expect(presenceUtilsMock.emitToUsers).toHaveBeenCalledWith(['user-2'], 'contact-interaction-updated', {
      contactId: 'user-1',
      interaction: CONTACT_INTERACTION.DEFAULT
    })
  })
})
