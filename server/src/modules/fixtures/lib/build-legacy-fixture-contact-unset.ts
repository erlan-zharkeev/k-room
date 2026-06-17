import { LEGACY_FIXTURE_USER_IDS } from '../fixtures.constants'

export const buildLegacyFixtureContactUnset = () =>
  Object.fromEntries(LEGACY_FIXTURE_USER_IDS.map((id) => [`personal.contacts.${id}`, '']))
