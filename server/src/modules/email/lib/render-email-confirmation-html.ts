import type { RenderEmailConfirmationHtmlParams } from '../email.types'

export const renderEmailConfirmationHtml = ({
  appName,
  confirmEmailButtonText,
  confirmationText,
  confirmUrl,
  fallbackLinkText,
  greeting
}: RenderEmailConfirmationHtmlParams) => `
  <div style="font-family: Arial, sans-serif; color: #101828; line-height: 1.6;">
    <h2 style="margin-bottom: 16px;">${appName}</h2>
    <p>${greeting}</p>
    <p>${confirmationText}</p>
    <p>
      <a
        href="${confirmUrl}"
        style="display: inline-block; padding: 12px 18px; border-radius: 8px; background: #101828; color: #ffffff; text-decoration: none;"
      >
        ${confirmEmailButtonText}
      </a>
    </p>
    <p>${fallbackLinkText}</p>
    <p><a href="${confirmUrl}">${confirmUrl}</a></p>
  </div>
`
