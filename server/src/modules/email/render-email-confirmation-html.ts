import type { IRenderEmailConfirmationHtmlParams } from './email.types'

export const renderEmailConfirmationHtml = ({ appName, confirmUrl, nickname }: IRenderEmailConfirmationHtmlParams) => {
  const greeting = nickname ? `Hi, ${nickname}!` : 'Hi!'

  return `
    <div style="font-family: Arial, sans-serif; color: #101828; line-height: 1.6;">
      <h2 style="margin-bottom: 16px;">${appName}</h2>
      <p>${greeting}</p>
      <p>Please confirm your email address to finish registration.</p>
      <p>
        <a
          href="${confirmUrl}"
          style="display: inline-block; padding: 12px 18px; border-radius: 8px; background: #101828; color: #ffffff; text-decoration: none;"
        >
          Confirm email
        </a>
      </p>
      <p>If the button does not work, open this link manually:</p>
      <p><a href="${confirmUrl}">${confirmUrl}</a></p>
    </div>
  `
}
