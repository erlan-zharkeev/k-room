import './style.scss'

import { RouteNamesEnum } from 'common-types'
import { useNavigate } from 'react-router-dom'

import { CLIENT_ENV } from 'src/shared/config'
import { AppButton, AppScrollContainer } from 'src/shared/ui'

export const PrivacyPolicy = () => {
  const navigate = useNavigate()
  const appName = CLIENT_ENV.appName

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate(RouteNamesEnum.Main, { replace: true })
  }

  return (
    <AppScrollContainer additionalClassName="privacy-policy" height="100%">
      <h1>Privacy Policy for {appName}</h1>
      <p>
        <strong>Last updated:</strong> March 25, 2026
      </p>
      <p>
        This Privacy Policy explains what information may be collected when you use {appName}, how that information may
        be used, and the limits of our responsibility.
      </p>
      <p>
        <strong>Important warning:</strong> {appName} is a general-purpose chat and calling service. It is{' '}
        <strong>not</strong> designed for storing, transmitting, or protecting highly sensitive, confidential,
        regulated, financial, medical, government-issued, or otherwise mission-critical information. Do not use {appName}{' '}
        as a secure vault, legal archive, or protected communications channel.
      </p>
      <p>
        Messages, files, account data, and technical data may be processed and stored on systems controlled by us or by
        our service providers. Although we may use reasonable operational measures, we do <strong>not</strong> promise
        or guarantee absolute security, confidentiality, availability, or loss prevention. Any use of the service is at
        your own risk.
      </p>

      <h2>1. Information We Collect</h2>
      <p>
        Depending on how you use the service, we may collect or receive the following categories of information:
      </p>
      <ul>
        <li>Account data such as username, email address, password hash, authentication provider, and confirmation status.</li>
        <li>Profile and social data such as avatar, contact relationships, chat-room membership, and basic status data such as online/last seen.</li>
        <li>Communication data such as message content, message timestamps, reactions, replies, attachments, and related metadata.</li>
        <li>Technical/session data such as cookies, refresh tokens, device identifiers, socket identifiers, browser/device details, timestamps, and similar operational logs.</li>
        <li>Support, diagnostic, and security data such as crash/error events and troubleshooting information.</li>
        <li>Third-party sign-in data if you use social login providers.</li>
        <li>Device permission and media-related data when you use call features, such as audio/video device availability, permissions, and media streams needed to establish calls.</li>
      </ul>

      <h2>2. Sources of Information</h2>
      <p>
        We may collect information directly from you, automatically from your browser or device, from your use of the
        service, from cookies or similar session mechanisms, and from third-party providers you choose to use, such as
        social login or email delivery providers.
      </p>

      <h2>3. How We Use Information</h2>
      <ul>
        <li>To create and maintain accounts.</li>
        <li>To authenticate users and maintain sessions.</li>
        <li>To deliver chat, file, and calling functionality.</li>
        <li>To send transactional messages such as email confirmation or account-related notices.</li>
        <li>To diagnose bugs, investigate abuse, monitor stability, and maintain security.</li>
        <li>To enforce our rules, protect our systems, and comply with legal requests.</li>
        <li>To improve, debug, or restructure the service.</li>
      </ul>

      <h2>4. Disclosure of Information</h2>
      <p>
        We may disclose information:
      </p>
      <ul>
        <li>To service providers that help us operate the product, such as hosting, database, email, authentication, and error-monitoring providers.</li>
        <li>To other users as part of the normal operation of the product, for example when your username, avatar, messages, reactions, or status are shown in chats and contact flows.</li>
        <li>When required by law, subpoena, court order, legal process, or a good-faith belief that disclosure is necessary to protect rights, users, or systems.</li>
        <li>In connection with a merger, sale, restructuring, financing, acquisition, or similar transaction.</li>
      </ul>
      <p>
        We do not intentionally sell personal information for third-party advertising. We also do not promise that any
        information disclosed to service providers, network operators, platform vendors, or other users will remain
        confidential once processed outside our direct control.
      </p>

      <h2>5. Cookies, Sessions, and Local Storage</h2>
      <p>
        We use cookies and similar mechanisms primarily for authentication, session continuity, device identification,
        and core application operation. We may also store settings or related technical data in browser storage. If you
        block or delete such data, some parts of the service may stop working correctly.
      </p>

      <h2>6. Security and No Guarantee of Confidentiality</h2>
      <p>
        We may use HTTPS, access controls, password hashing, operational logging, and other ordinary technical measures.
        However, no internet service is fully secure. We do not warrant that the service will be free from breaches,
        outages, interception, unauthorized access, malware, data loss, misdelivery, or security failures.
      </p>
      <p>
        In particular, you should assume that chat content, attachments, account data, and technical data may be
        exposed, lost, corrupted, or accessed without authorization at some point. If that level of risk is not
        acceptable to you, do not use the service.
      </p>

      <h2>7. Your Choices and Rights</h2>
      <p>
        Depending on your location and applicable law, you may have rights to request access, correction, deletion, or
        other actions regarding your information. Some requests may be limited by technical feasibility, account
        integrity, security, fraud prevention, legal obligations, backup retention, or our inability to verify the
        request.
      </p>

      <h2>8. Data Retention</h2>
      <p>
        We may retain information for as long as reasonably necessary to operate the service, maintain accounts,
        investigate abuse, comply with legal obligations, resolve disputes, enforce agreements, or maintain backups and
        audit records. Retention periods may vary by data type and operational need.
      </p>

      <h2>9. Children</h2>
      <p>
        {appName} is not intended for children under 13, and we do not knowingly design the service for children. If
        you believe a child has provided personal information, contact us through the app support flow so we can review
        the report.
      </p>

      <h2>10. Third-Party Services</h2>
      <p>
        The service may rely on third-party providers, including providers for authentication, transactional email,
        error monitoring, infrastructure, and browser/device capabilities. Their privacy practices, terms, outages, and
        security incidents are outside our direct control. When you interact with third-party services, their terms and
        privacy policies may also apply.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may change this Privacy Policy at any time. The latest version posted in the app or on the relevant page
        will control. Continued use of the service after changes means you accept the updated policy.
      </p>

      <h2>12. Contact</h2>
      <p>If you have questions or requests related to this Privacy Policy, contact support through the app settings.</p>
      <div className="privacy-policy__footer">
        <AppButton text="Back" onClick={handleBack} />
      </div>
    </AppScrollContainer>
  )
}
