import type { Contact } from 'global-shared'

import type { ContactRecord } from 'src/shared/lib'

import { getRequiredContactSystemData } from './get-required-contact-system-data'

export const mergeContactLocalState = (current: ContactRecord | undefined, incoming: Contact): ContactRecord => {
  const systemData = getRequiredContactSystemData()

  return {
    ...incoming,
    savedAt: current?.savedAt ?? systemData.savedAt,
    isTyping: current?.isTyping ?? systemData.isTyping
  }
}
