import './style.scss'

import { CLIENT_ENV } from 'src/shared/config'
import { AppScrollContainer } from 'src/shared/ui'

export const PrivacyPolicy = () => {
  const appName = CLIENT_ENV.appName
  return (
    <AppScrollContainer additionalClassName="privacy-policy" height="100%">
      <h1>Privacy Policy for {appName}</h1>
      <p>
        <strong>Last updated:</strong> August 3rd, 2023
      </p>
      <p>
        Welcome to {appName}! We value your trust and strive to ensure maximum privacy for your personal data. In this
        Privacy Policy, we explain how we collect, use, disclose, and protect the information you provide when using
        the&nbsp;
        {appName} chat.
      </p>

      <h2>1. Collected Information</h2>
      <p>
        <strong>1.1. Personal Information:</strong> To use the {appName} chat, you may be asked to provide certain
        personal information, such as your name, email address, and possibly a profile picture. This data may be
        collected during the account registration or when filling out your profile.
      </p>
      <p>
        <strong>1.2. Chat Data:</strong> We may retain the content of your chats to provide the service, offer technical
        support, and improve the quality of our service.
      </p>
      <p>
        <strong>1.3. Usage Information:</strong> We may collect information about your use of the {appName} chat,
        including dates and times of your visits, session durations, device identifiers, and other technical data.
      </p>

      <h2>2. Use of Information</h2>
      <p>
        <strong>2.1. </strong>We use the personal information you provide to ensure the functioning of the&nbsp;
        {appName} chat, manage your account, deliver services, and respond to your requests.
      </p>
      <p>
        <strong>2.2. </strong>We may use chat data for internal analytical purposes, to improve the quality of our
        service and develop new features.
      </p>
      <p>
        <strong>2.3. </strong>Your email address may be used to send informational messages, updates, and news related
        to the {appName} chat, but we will not share your email with third parties for marketing purposes without your
        consent.
      </p>

      <h2>3. Disclosure of Information</h2>
      <p>
        <strong>3.1. </strong>We will not sell, trade, or transfer your personal information to third parties without
        your consent, except when necessary to provide the service, comply with the law, or protect our rights and
        interests.
      </p>
      <p>
        <strong>3.2. </strong>We may disclose chat data in an anonymized or aggregated form for analytical or
        statistical purposes.
      </p>

      <h2>4. Responsibility for Data Security and Confidentiality</h2>
      <p>
        <strong>4.1. </strong>It is important to note that we are not responsible for the security and confidentiality
        of data transmitted or stored on our {appName} chat. We recommend that you exercise caution when exchanging
        sensitive information and personal data while using our chat, and we advise you not to share confidential
        information that you wish to keep private.
      </p>

      <h2>5. Consent and Changes</h2>
      <p>
        <strong>5.1. </strong>By using the {appName} chat, you agree to the terms of this Privacy Policy. We may
        periodically update this Policy, and any changes will be posted on this page.
      </p>
      <p>
        <strong>5.2. </strong>If you disagree with any provisions of this Policy, please discontinue using the {appName}
        &nbsp; chat.
      </p>

      <h2>6. Cookie Usage</h2>
      <p>
        We use cookies on this website. Cookies are small text files that are placed on your device (computer or mobile
        device) when you visit our site. They help us improve the website's performance and provide you with a more
        personalized experience.
      </p>
      <p>We use various types of cookies:</p>
      <p>
        <strong>6.1</strong> Functional cookies: These cookies are necessary for the website to function properly and
        provide basic features such as authentication and saving user preferences.
      </p>
      <p>
        <strong>6.2</strong> Analytical cookies: These cookies allow us to collect anonymous information about how users
        interact with the website, helping us analyze and improve its performance and functionality.
      </p>
      <p>
        <strong>6.3</strong> Advertising cookies: We may use cookies to display relevant advertisements on our website
        or on third-party partner websites.
      </p>
      <p>
        You can manage cookie settings through your browser settings. Please note that disabling some cookies may impact
        the functionality of the website and your experience while using it.
      </p>

      <h2>7. Contacts</h2>
      <p>
        If you have any questions regarding this Privacy Policy, please&nbsp;
        <a className="link paragraph-text paragraph-text--md" href={`mailto:${CLIENT_ENV.mailApp}?subject=common`}>
          contact us ({CLIENT_ENV.mailApp})
        </a>
        .
      </p>
    </AppScrollContainer>
  )
}
