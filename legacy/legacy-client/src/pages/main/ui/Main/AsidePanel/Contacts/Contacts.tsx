import './style.scss'

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'

import { Virtuoso } from 'react-virtuoso'

import {
  AppLanguage,
  IFrontendContact,
  EventGetSearchedContact,
  EventSearchContact,
  EventUpdateInteraction,
  Interaction,
  MEDIA_ENDPOINTS,
  SocketActions,
  normalizeTimestamp
} from 'common'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'

import { socket } from 'src/shared/api'
import { DbContact } from 'src/shared/config'
import {
  createClassNameWithModifiers,
  formatLocalizedRelativeTime,
  stopPropagation,
  useAnimatedList,
  useDebounce,
  useIntervalRerender,
  useTimeout
} from 'src/shared/lib'
import { useI18n } from 'src/shared/preferences'
import {
  AppButton,
  AppClickOutside,
  AppDotsAnimatedText,
  AppDropdown,
  AppHeader,
  AppIcon,
  AppInput,
  AppLink,
  AppModal,
  ProfileInfo,
  AppScrollContainer,
  AppText
} from 'src/shared/ui'

import { useChatRoomSelect } from '../../../../model/use-chat-room-select'

import {
  CONTACT_ACTIONS_I18N,
  CONTACT_INVITATION_CONTROL_BTNS_I18N,
  CONTACT_SHARED_I18N,
  CONTACTS_WIDGET_I18N,
  DELETE_CONTACT_I18N,
  SEARCH_CONTACT_I18N
} from './i18n.ts'

const CONTACT_LIST_RERENDER_INTERVAL = 1000 * 60
const DROPDOWN_CLOSE_DURATION = 260

const NOT_DEFAULT_CONTACT_INFO_BUTTON_MAP = {
  invited: {
    name: 'loader',
    color: 'accent-color'
  },
  'invite-accepted': {
    name: 'success',
    color: 'success-color'
  },
  'invite-received': {
    name: 'loader',
    color: 'text-color'
  }
} as const

const lastSeen = (timestamp: number | undefined, language: AppLanguage) => {
  const normalizedTimestamp = normalizeTimestamp(timestamp)

  return normalizedTimestamp
    ? `${CONTACT_SHARED_I18N.lastSeen[language]} ${formatLocalizedRelativeTime(normalizedTimestamp, language)}`
    : ''
}

const getContactDescription = (contact: DbContact, language: AppLanguage) => {
  const { online, interactionType, lastSeen: timestamp } = contact

  if (interactionType === 'invite-accepted') {
    return online ? CONTACT_SHARED_I18N.online[language] : lastSeen(timestamp, language)
  }

  return ''
}

const useCreateChatRoom = ({
  onSuccess,
  onRoomCreated
}: {
  onSuccess?: () => void
  onRoomCreated?: (roomId: string) => void
} = {}) => {
  const [isLoading, setIsLoading] = useState(false)

  const createChatRoom = ({ contactIds }: { contactIds: string[] }) => {
    setIsLoading(true)
    socket.emit<SocketActions>('create-chat-room', { contactIds })
    socket.once<SocketActions>('room-created', ({ roomId }: { roomId: string }) => {
      onRoomCreated?.(roomId)
      setIsLoading(false)
      onSuccess?.()
    })
  }

  return {
    isLoading,
    createChatRoom
  }
}

const useAddContact = () => {
  const { id } = useUser()
  const [loading, setLoading] = useState(false)
  const { startTimeout } = useTimeout()

  const clickAddContactHandler = (interlocutorId: string | undefined) => {
    if (!interlocutorId) return

    setLoading(true)
    socket.emit<SocketActions>('save-contact', { userId: id, interlocutorId })
    socket.once<SocketActions>('contact-add-success', () => {
      startTimeout(() => setLoading(false), 400)
    })
  }

  return {
    clickAddContactHandler,
    loading
  }
}

const useDeleteContact = () => {
  const [loading, setLoading] = useState(false)
  const { startTimeout } = useTimeout()

  const deleteUserHandler = (contactId: string) => {
    setLoading(true)
    socket.emit<SocketActions>('update-contact-interaction-type', { contactId, interaction: 'default' })
    socket.once<SocketActions>('contact-delete-success', () => {
      startTimeout(() => setLoading(false), 400)
    })
  }

  return {
    deleteUserHandler,
    loading
  }
}

const useContactList = () => {
  const { contacts } = useContact()

  const contactList = contacts
    ?.filter((contact) => contact.interactionType !== 'invite-hidden')
    .sort((a, b) => (b.savedAt ?? 0) - (a.savedAt ?? 0))

  return { contactList }
}

const useContactInvitationControls = () => {
  const { contacts } = useContact()
  const [loaders, setLoaders] = useState<Record<string, boolean>>({})
  const { startTimeout: inviteTimer } = useTimeout()
  const { startTimeout: contactsUpdatedTimer } = useTimeout()

  const updateInteractionType = (contactId: string, interaction: Interaction) => {
    setLoaders((prev) => ({ ...prev, [contactId]: true }))
    const payload: EventUpdateInteraction = { contactId, interaction }

    inviteTimer(() => {
      socket.emit<SocketActions>('update-contact-interaction-type', payload)
    }, 1000)
  }

  useEffect(() => {
    if (!contacts) return

    const updatedContacts = contacts.filter((contact) => loaders[contact.id])

    if (updatedContacts.length <= 0) return

    contactsUpdatedTimer(() => {
      setLoaders((prev) => {
        const nextLoaders = { ...prev }

        updatedContacts.forEach((contact) => {
          nextLoaders[contact.id] = false
        })

        return nextLoaders
      })
    }, 1000)
  }, [contacts, contactsUpdatedTimer, loaders])

  return { loaders, updateInteractionType }
}

const useSearchContact = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [nextOffset, setNextOffset] = useState(0)
  const [total, setTotal] = useState<number | null>(null)
  const [searchedContacts, setSearchedContacts] = useState<IFrontendContact[]>([])
  const currentQueryRef = useRef('')

  const resetSearch = () => {
    currentQueryRef.current = ''
    setSearchQuery('')
    setSearchedContacts([])
    setTotal(null)
    setHasMore(false)
    setNextOffset(0)
    setIsLoading(false)
    setIsLoadingMore(false)
  }

  useEffect(() => {
    const handleSearchedContacts = (payload: EventGetSearchedContact | IFrontendContact[]) => {
      if (Array.isArray(payload)) {
        setSearchedContacts(payload)
        setTotal(null)
        setHasMore(false)
        setNextOffset(0)
        setIsLoading(false)
        setIsLoadingMore(false)
        return
      }

      const { value, offset, contacts, total, hasMore, nextOffset } = payload

      if (value !== currentQueryRef.current) return

      setSearchedContacts((prev) => {
        if (offset === 0) return contacts

        const knownIds = new Set(prev.map((contact) => contact.id))
        return [...prev, ...contacts.filter((contact) => !knownIds.has(contact.id))]
      })
      setTotal(typeof total === 'number' ? total : null)
      setHasMore(hasMore)
      setNextOffset(nextOffset ?? 0)
      setIsLoading(false)
      setIsLoadingMore(false)
    }

    socket.on<SocketActions>('get-searched-contact', handleSearchedContacts)

    return () => {
      socket.off<SocketActions>('get-searched-contact', handleSearchedContacts)
    }
  }, [])

  const fetchUsers = ({ value, offset = 0 }: { value: string; offset?: number }) => {
    const payload: EventSearchContact = {
      value,
      offset
    }

    socket.emit<SocketActions>('search-contact', payload)
  }

  const debouncedSearch = useDebounce(fetchUsers, 500)

  const search = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const normalizedValue = value.trim()

    setSearchQuery(value)
    currentQueryRef.current = normalizedValue

    if (normalizedValue === '') {
      resetSearch()
      return
    }

    setIsLoading(true)
    setSearchedContacts([])
    setTotal(null)
    setHasMore(false)
    setNextOffset(0)
    debouncedSearch({ value, offset: 0 })
  }

  const loadMore = () => {
    if (!currentQueryRef.current || !hasMore || isLoading || isLoadingMore) return

    setIsLoadingMore(true)
    fetchUsers({ value: currentQueryRef.current, offset: nextOffset })
  }

  return {
    searchQuery,
    search,
    searchedContacts,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    resetSearch,
    total
  }
}

const FoundContact = ({
  id,
  username,
  interactionType,
  onAddContact,
  loading = false
}: IFrontendContact & { onAddContact?: (id: string) => void; loading?: boolean }) => {
  const { isExist } = useContact()

  if (interactionType === 'invite-hidden') return null

  return (
    <div className="search-contact__list-element" key={id}>
      <ProfileInfo avatar={`api${MEDIA_ENDPOINTS.getMediaFile}/avatar.${id}`} title={username} showBadge={false} />
      {interactionType === 'default' ? (
        !isExist(id) && (
          <AppButton
            prefixIconName="plus"
            color="accent-color"
            loading={loading}
            onClick={() => onAddContact?.(id)}
            borderless
          />
        )
      ) : (
        <div className="search-contact__list-element-interaction-icon">
          <AppIcon
            {...NOT_DEFAULT_CONTACT_INFO_BUTTON_MAP[
              interactionType as keyof typeof NOT_DEFAULT_CONTACT_INFO_BUTTON_MAP
            ]}
          />
        </div>
      )}
    </div>
  )
}

const SearchContact = ({
  onAddContact,
  addContactLoading = false
}: {
  onAddContact?: (id: string) => void
  addContactLoading?: boolean
}) => {
  const { searchQuery, search, searchedContacts, isLoading, isLoadingMore, hasMore, loadMore, resetSearch, total } =
    useSearchContact()
  const { t } = useI18n()
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const [isDropdownClosing, setIsDropdownClosing] = useState(false)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (searchedContacts.length > 0) {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }

      setIsDropdownClosing(false)
      setIsDropdownVisible(true)
      return
    }

    if (!isDropdownClosing) {
      setIsDropdownVisible(false)
    }
  }, [isDropdownClosing, searchedContacts.length])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const closeDropdown = () => {
    if (!isDropdownVisible || isDropdownClosing) return

    setIsDropdownClosing(true)
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false)
      setIsDropdownClosing(false)
      resetSearch()
      closeTimeoutRef.current = null
    }, DROPDOWN_CLOSE_DURATION)
  }

  return (
    <AppClickOutside
      active={isDropdownVisible && !isDropdownClosing}
      additionalClassName="search-contact"
      onClickOutside={closeDropdown}
    >
      <AppInput
        showClearButton={Boolean(searchQuery)}
        placeholder={t(SEARCH_CONTACT_I18N.placeholder)}
        onChange={search}
        name="contact"
        value={searchQuery}
        loading={isLoading}
      />
      {isDropdownVisible && (
        <div
          className={`search-contact__dropdown ${
            isDropdownClosing ? 'search-contact__dropdown--closing' : 'search-contact__dropdown--open'
          }`}
        >
          {typeof total === 'number' && (
            <AppText tag="p" align="right" additionalClassName="search-contact__found-el-quantity">
              {t(SEARCH_CONTACT_I18N.found)(total)}
            </AppText>
          )}
          <div className="search-contact__list">
            <Virtuoso
              data={searchedContacts}
              style={{ height: '320px' }}
              endReached={loadMore}
              computeItemKey={(_, contact) => contact.id}
              itemContent={(_, contact) => (
                <FoundContact {...contact} onAddContact={onAddContact} loading={addContactLoading} />
              )}
              components={{
                Footer: () =>
                  isLoadingMore && hasMore ? (
                    <div className="search-contact__footer-loader">
                      <AppDotsAnimatedText text={t(SEARCH_CONTACT_I18N.loadingMore)} />
                    </div>
                  ) : null
              }}
            />
          </div>
        </div>
      )}
    </AppClickOutside>
  )
}

const ContactInvitationControlBtns = ({ contactData }: { contactData: DbContact }) => {
  const { t } = useI18n()
  const { loaders, updateInteractionType } = useContactInvitationControls()

  return (
    <div
      className={createClassNameWithModifiers({
        rootClass: 'contact-invitation-control-btns',
        modifiers: [contactData.interactionType]
      })}
    >
      {loaders[contactData.id] ? (
        <div className="contact-invitation-control-btns__loader">
          <AppDotsAnimatedText text={t(CONTACT_INVITATION_CONTROL_BTNS_I18N.updatingStatus)} textSize="small" />
        </div>
      ) : (
        <>
          {contactData.interactionType === 'default' && (
            <AppLink
              prevent
              onClick={() => updateInteractionType(contactData.id, 'invited')}
              text={t(CONTACT_INVITATION_CONTROL_BTNS_I18N.sendInvite)}
            />
          )}
          {contactData.interactionType === 'invited' && (
            <AppText tag="p" size="small" color="accent-color">
              {t(CONTACT_INVITATION_CONTROL_BTNS_I18N.invited)}
            </AppText>
          )}
          {contactData.interactionType === 'invite-received' && (
            <>
              <AppLink
                prevent
                onClick={() => updateInteractionType(contactData.id, 'invite-accepted')}
                text={t(CONTACT_INVITATION_CONTROL_BTNS_I18N.accept)}
              />
              <AppLink
                prevent
                onClick={() => updateInteractionType(contactData.id, 'default')}
                text={t(CONTACT_INVITATION_CONTROL_BTNS_I18N.decline)}
                color="error-color"
              />
              <AppLink
                prevent
                onClick={() => updateInteractionType(contactData.id, 'invite-hidden')}
                text={t(CONTACT_INVITATION_CONTROL_BTNS_I18N.hide)}
                color="text-color"
              />
            </>
          )}
        </>
      )}
    </div>
  )
}

const DeleteContactConfirmModal = ({
  open,
  onConfirm,
  onClose,
  loading
}: {
  open: boolean
  onConfirm: () => void
  onClose: () => void
  loading: boolean
}) => {
  const { t } = useI18n()

  return (
    <AppModal
      title={t(DELETE_CONTACT_I18N.modalTitle)}
      open={open}
      onClose={onClose}
      cancelAction={{ onClick: onClose }}
      okAction={{
        text: t(DELETE_CONTACT_I18N.confirm),
        color: 'error-color',
        loading,
        onClick: onConfirm
      }}
    >
      <div className="delete-contact-confirm-modal">
        <AppText tag="p">{t(DELETE_CONTACT_I18N.confirmText)}</AppText>
      </div>
    </AppModal>
  )
}

const ContactActions = ({ contactData }: { contactData: DbContact }) => {
  const { deleteUserHandler, loading } = useDeleteContact()
  const { delay } = useTimeout()
  const { isLoading: isChatCreating, createChatRoom } = useCreateChatRoom()
  const { getPersonalByContactId, chatRooms } = useChatRoom()
  const { selectChatWithAsideById } = useChatRoomSelect()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { t } = useI18n()

  const contactRoom = useMemo(
    () => getPersonalByContactId(contactData.id),
    [chatRooms, contactData.id, getPersonalByContactId]
  )

  const items = [
    {
      label: t(CONTACT_ACTIONS_I18N.call),
      handler: () => {},
      value: 'call'
    },
    {
      label: t(CONTACT_ACTIONS_I18N.createChat),
      loadingLabel: t(CONTACT_ACTIONS_I18N.creatingChat),
      handler: (evt: unknown) => {
        stopPropagation(evt)
        createChatRoom({ contactIds: [contactData.id] })
      },
      loading: isChatCreating,
      value: 'create-chat'
    },
    {
      label: t(CONTACT_ACTIONS_I18N.text),
      handler: () => {
        selectChatWithAsideById(contactRoom?.id)
      },
      value: 'text'
    },
    {
      label: t(CONTACT_ACTIONS_I18N.delete),
      handler: async (evt: unknown) => {
        stopPropagation(evt)
        await delay(400)
        setIsConfirmOpen(true)
      },
      value: 'delete'
    }
  ]

  const filteredItems = items.filter((item) => {
    if (contactData.interactionType === 'default') {
      return item.value === 'delete'
    }
    if (item.value === 'create-chat') {
      return !contactRoom
    }
    if (item.value === 'text') {
      return contactRoom
    }
    return true
  })

  return (
    <>
      <AppDropdown
        additionalClassName="contact-menu"
        items={filteredItems.map((item, idx) => ({
          type: 'item',
          onClick: item.handler,
          label: item.loading ? <AppDotsAnimatedText text={item.loadingLabel} /> : <AppText>{item.label}</AppText>,
          key: idx
        }))}
      >
        <AppButton prefixIconName="three-dots" borderless small />
      </AppDropdown>
      <DeleteContactConfirmModal
        open={isConfirmOpen}
        loading={loading}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          deleteUserHandler(contactData.id)
          setIsConfirmOpen(false)
        }}
      />
    </>
  )
}

const ContactListItem = ({ contactData }: { contactData: DbContact }) => {
  const { getLiveMediaUrl } = useMedia()
  const { language } = useI18n()

  useIntervalRerender(CONTACT_LIST_RERENDER_INTERVAL)

  const avatar = getLiveMediaUrl(`avatar.${contactData.id}`)
  const description = getContactDescription(contactData, language) ?? ''

  return (
    <ProfileInfo
      avatar={avatar}
      title={contactData.username}
      showBadge={false}
      description={description}
      isDescriptionAccent={Boolean(contactData.online)}
      descriptionNode={
        contactData.interactionType !== 'invite-accepted' && <ContactInvitationControlBtns contactData={contactData} />
      }
    >
      {(contactData.interactionType === 'invite-accepted' || contactData.interactionType === 'default') && (
        <ContactActions contactData={contactData} />
      )}
    </ProfileInfo>
  )
}

export const Contacts = () => {
  const { t } = useI18n()
  const { contactList } = useContactList()
  const { clickAddContactHandler, loading: addContactLoading } = useAddContact()
  const { renderedItems } = useAnimatedList(contactList ?? [], 'id')

  return (
    <div className="contacts">
      <SearchContact onAddContact={clickAddContactHandler} addContactLoading={addContactLoading} />
      <div className="divider" />
      <AppHeader tag="h4">{t(CONTACTS_WIDGET_I18N.title)}</AppHeader>
      <div className="contact-list">
        {contactList.length <= 0 && <AppText>{t(CONTACT_ACTIONS_I18N.empty)}</AppText>}
        <AppScrollContainer height="100%" additionalClassName="contact-list__scroll-controller">
          <div className="contact-list__items animated-list">
            {renderedItems.map(({ item, key, state }) => (
              <div
                className={createClassNameWithModifiers({
                  rootClass: 'contact-list__list-item animated-list__item',
                  modifiers: [state],
                  additionalClassName: `animated-list__item--${state}`
                })}
                key={key}
              >
                <ContactListItem contactData={item} />
              </div>
            ))}
          </div>
        </AppScrollContainer>
      </div>
    </div>
  )
}
