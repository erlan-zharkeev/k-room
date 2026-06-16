import type { RenderEmailCodeHtmlParams } from '../email.types'

export const renderEmailCodeHtml = ({ code, greeting, ignoreText, text, title }: RenderEmailCodeHtmlParams) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>${title}</h2>
    <p>${greeting}</p>
    <p>${text}</p>
    <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px;">${code}</p>
    <p>${ignoreText}</p>
  </div>
`
