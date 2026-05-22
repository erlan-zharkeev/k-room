import { ChangeEvent, useState } from 'react'

import './style.scss'

import { APP_LANGUAGE, MediaFileValue, USER_ENDPOINTS } from 'common'

import { PasswordRecoveryLink } from 'src/features/password-recovery'
import { ThemeSwitcher } from 'src/features/update-theme'

import { useLiveMediaUrl, useMedia } from 'src/entities/media-file'
import { UserProfile, useUser } from 'src/entities/user'

import { socket, useApi } from 'src/shared/api'
import { CLIENT_ENV } from 'src/shared/config'
import { useI18n, useSettings } from 'src/shared/preferences'
import { useSystem } from 'src/shared/system'
import {
  AppForm,
  AppFormData,
  AppLink,
  AppModal,
  AppSwitch,
  AppText,
  AppTooltip,
  PrivacyPolicyLink,
  TechSupportLink
} from 'src/shared/ui'

import { USER_SETTINGS_I18N } from './i18n.ts'

const useEditUserData = ({ onSuccess }: { onSuccess?: () => void } = {}) => {
  const { username, shallowUpdate, id: userId } = useUser()
  const avatarPath = useLiveMediaUrl(`avatar.${userId}`)
  const { doRequest } = useApi()
  const { put, remove } = useMedia()
  const [isLoading, setIsLoading] = useState(false)

  const initialFormData = {
    username,
    avatar: avatarPath
  }

  const editUserData = async (fields: AppFormData) => {
    const { username: nextUsername, avatar } = fields as { username: string; avatar: MediaFileValue }

    const payloadFormData = new FormData()
    payloadFormData.append('username', nextUsername)
    const resetAvatar = avatar === null
    payloadFormData.append('reset-avatar', resetAvatar ? 'reset' : '')

    const fileBuffer = avatar?.fileBuffer
    if (fileBuffer) {
      const blob = new Blob([fileBuffer], { type: 'image/jpeg' })
      payloadFormData.append('file', blob, avatar.name)
    }

    try {
      setIsLoading(true)
      await doRequest('patch', USER_ENDPOINTS.editUserData, payloadFormData, {
        contentType: 'multipart/form-data'
      })
      shallowUpdate({ username: nextUsername })

      if (fileBuffer || resetAvatar) {
        const avatarId = `avatar.${userId}`

        if (resetAvatar) {
          remove(avatarId)
        } else if (fileBuffer) {
          const blob = new Blob([fileBuffer], { type: 'image/jpeg' })

          await put({
            id: avatarId,
            blob,
            contentType: blob.type,
            etag: `${Date.now()}`,
            kind: 'image',
            lastModified: new Date().toUTCString(),
            lastChecked: Date.now()
          })
        }
      }

      onSuccess?.()
    } catch {
      //
    } finally {
      setIsLoading(false)
    }
  }

  return { editUserData, initialFormData, isLoading }
}

const EditUserDataModal = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { editUserData, isLoading, initialFormData } = useEditUserData({ onSuccess })
  const { t } = useI18n()

  return (
    <div className="edit-user-data-modal">
      <AppForm
        key={`${initialFormData.username}-${initialFormData.avatar}`}
        onSubmit={editUserData}
        fields={{
          avatar: {
            inputType: 'file',
            value: initialFormData.avatar ? { name: 'avatar', src: initialFormData.avatar } : null,
            design: 'avatar',
            resetText: t(USER_SETTINGS_I18N.reset)
          },
          username: {
            inputType: 'text',
            value: initialFormData.username,
            placeholder: t(USER_SETTINGS_I18N.usernamePlaceholder),
            rule: { name: 'username' }
          }
        }}
        submitBtnText={t(USER_SETTINGS_I18N.submit)}
        actionProcessing={isLoading}
      />
    </div>
  )
}

const OpenModalEditUserDataBtn = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <AppLink prevent text={t(USER_SETTINGS_I18N.editLink)} onClick={() => setIsOpen(true)} />
      <AppModal title={t(USER_SETTINGS_I18N.editModalTitle)} open={isOpen} onClose={() => setIsOpen(false)}>
        <EditUserDataModal onSuccess={() => setIsOpen(false)} />
      </AppModal>
    </>
  )
}

const EnableSoundSwitcher = () => {
  const { soundOn, shallowUpdate } = useSettings()
  const { hasInteracted } = useSystem()
  const { t } = useI18n()
  const tooltipText = !hasInteracted ? t(USER_SETTINGS_I18N.soundTooltip) : ''

  return (
    <div className="enable-sound-switcher">
      <AppText size="small">{t(USER_SETTINGS_I18N.sound)}</AppText>
      <AppTooltip text={tooltipText} placement="right">
        <AppSwitch
          value={soundOn}
          name="sound"
          onText={t(USER_SETTINGS_I18N.soundOn)}
          offText={t(USER_SETTINGS_I18N.soundOff)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            shallowUpdate({ soundOn: event.target.checked })
          }}
          disabled={!hasInteracted}
        />
      </AppTooltip>
    </div>
  )
}

const LanguageSwitcher = () => {
  const { language, shallowUpdate } = useSettings()
  const { t } = useI18n()

  return (
    <div className="language-switcher">
      <AppText size="small">{t(USER_SETTINGS_I18N.language)}</AppText>
      <AppSwitch
        name="language"
        value={language === APP_LANGUAGE.Ru}
        onText={t(USER_SETTINGS_I18N.ru)}
        offText={t(USER_SETTINGS_I18N.en)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const nextLanguage = event.target.checked ? APP_LANGUAGE.Ru : APP_LANGUAGE.En
          shallowUpdate({ language: nextLanguage })
          document.documentElement.lang = nextLanguage
          socket.auth = {
            ...(typeof socket.auth === 'object' && socket.auth ? socket.auth : {}),
            language: nextLanguage
          }
          socket.emit('update-language', { language: nextLanguage })
        }}
      />
    </div>
  )
}

const ShowNotificationSwitcher = () => {
  const { showNotification, shallowUpdate } = useSettings()
  const { t } = useI18n()

  return (
    <div className="show-notification-switcher">
      <AppText size="small">{t(USER_SETTINGS_I18N.notification)}</AppText>
      <AppTooltip text={t(USER_SETTINGS_I18N.notificationTooltip)} placement="bottom">
        <AppSwitch
          value={showNotification}
          name="notification"
          onText={t(USER_SETTINGS_I18N.show)}
          offText={t(USER_SETTINGS_I18N.hide)}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            shallowUpdate({ showNotification: event.target.checked })
          }}
        />
      </AppTooltip>
    </div>
  )
}

const ShowTooltipsSwitcher = () => {
  const { showTooltips, shallowUpdate } = useSettings()
  const { t } = useI18n()

  return (
    <div className="show-tooltips-switcher">
      <AppText size="small">{t(USER_SETTINGS_I18N.tooltips)}</AppText>
      <AppSwitch
        value={showTooltips}
        name="tooltips"
        onText={t(USER_SETTINGS_I18N.show)}
        offText={t(USER_SETTINGS_I18N.hide)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          shallowUpdate({ showTooltips: event.target.checked })
        }}
      />
    </div>
  )
}

const ShowWallpaperSwitcher = () => {
  const { showWallpaper, shallowUpdate } = useSettings()
  const { t } = useI18n()

  return (
    <div className="show-wallpaper-switcher">
      <AppText size="small">{t(USER_SETTINGS_I18N.wallpaper)}</AppText>
      <AppSwitch
        value={showWallpaper}
        name="wallpaper"
        onText={t(USER_SETTINGS_I18N.show)}
        offText={t(USER_SETTINGS_I18N.hide)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          shallowUpdate({ showWallpaper: event.target.checked })
        }}
      />
    </div>
  )
}

const UserProfileData = () => {
  const { id } = useUser()
  const avatarPath = useLiveMediaUrl(`avatar.${id}`)

  return (
    <div className="user-profile-data">
      <UserProfile avatarPath={avatarPath} horizontal avatarSize="large" />
      <AppText size="small">#{id}</AppText>
      <div className="user-profile-data__actions">
        <OpenModalEditUserDataBtn />
        <PasswordRecoveryLink />
      </div>
    </div>
  )
}

export const Settings = () => {
  const { appName, appVersion } = CLIENT_ENV

  const switchers = [
    <ThemeSwitcher key="theme" />,
    <EnableSoundSwitcher key="sound" />,
    <ShowTooltipsSwitcher key="tooltips" />,
    <ShowWallpaperSwitcher key="wallpaper" />,
    <ShowNotificationSwitcher key="notification" />,
    <LanguageSwitcher key="language" />
  ]

  return (
    <div className="user-settings">
      <div className="user-settings__body">
        <div className="user-settings__top-side">
          <UserProfileData />
          <div className="user-settings__switchers">
            {switchers.map((setting) => (
              <div className="user-settings__element" key={setting.key}>
                {setting}
              </div>
            ))}
          </div>
        </div>
        <div className="user-settings__info">
          <TechSupportLink />
          <PrivacyPolicyLink />
          <div className="user-settings__info-package-data">
            <AppText size="small">{appName}</AppText>
            <AppText size="small">v.{appVersion}</AppText>
          </div>
        </div>
      </div>
    </div>
  )
}
