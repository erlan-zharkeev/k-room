import './style.scss'

import { RouteNamesEnum } from 'common-types'
import { useNavigate } from 'react-router-dom'

import { LEGAL_INFO_PAGE_I18N } from 'src/pages/privacy-policy/ui/PrivacyPolicy/config'

import { useI18n } from 'src/entities/system'

import { CLIENT_ENV } from 'src/shared/config'
import { AppButton, AppScrollContainer } from 'src/shared/ui'

export const PrivacyPolicy = () => {
  const navigate = useNavigate()
  const { t } = useI18n()
  const appName = CLIENT_ENV.appName

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate(RouteNamesEnum.Main, { replace: true })
  }

  return (
    <AppScrollContainer additionalClassName="privacy-policy" height="100%">
      <h1>{t(LEGAL_INFO_PAGE_I18N.title)(appName)}</h1>
      <p>
        <strong>{t(LEGAL_INFO_PAGE_I18N.lastUpdatedLabel)}</strong> March 25, 2026
      </p>
      <p>{t(LEGAL_INFO_PAGE_I18N.intro)(appName)}</p>
      <p>
        <strong>{t(LEGAL_INFO_PAGE_I18N.warning)}</strong> {t(LEGAL_INFO_PAGE_I18N.warningText)(appName)}
      </p>
      <p>{t(LEGAL_INFO_PAGE_I18N.storageRisk)}</p>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section1Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.section1Intro)}</p>
      <ul>
        <li>{t(LEGAL_INFO_PAGE_I18N.accountData)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.profileData)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.communicationData)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.technicalData)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.diagnosticsData)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.thirdPartyData)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.mediaPermissionData)}</li>
      </ul>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section2Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.section2Text)}</p>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section3Title)}</h2>
      <ul>
        <li>{t(LEGAL_INFO_PAGE_I18N.useAccounts)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.useAuth)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.useFeatures)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.useTransactional)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.useDiagnostics)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.useProtection)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.useImprove)}</li>
      </ul>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section4Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.discloseIntro)}</p>
      <ul>
        <li>{t(LEGAL_INFO_PAGE_I18N.discloseProviders)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.discloseUsers)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.discloseLegal)}</li>
        <li>{t(LEGAL_INFO_PAGE_I18N.discloseBusiness)}</li>
      </ul>
      <p>{t(LEGAL_INFO_PAGE_I18N.discloseNote)}</p>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section5Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.section5Text)}</p>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section6Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.section6Text1)}</p>
      <p>{t(LEGAL_INFO_PAGE_I18N.section6Text2)}</p>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section7Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.section7Text)}</p>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section8Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.section8Text)}</p>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section9Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.section9Text)(appName)}</p>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section10Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.section10Text)}</p>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section11Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.section11Text)}</p>

      <h2>{t(LEGAL_INFO_PAGE_I18N.section12Title)}</h2>
      <p>{t(LEGAL_INFO_PAGE_I18N.section12Text)}</p>
      <div className="privacy-policy__footer">
        <AppButton text={t(LEGAL_INFO_PAGE_I18N.back)} onClick={handleBack} />
      </div>
    </AppScrollContainer>
  )
}
