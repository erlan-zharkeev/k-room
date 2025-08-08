import type { SharpConfig, SharpSettingsKey } from 'shared-config'

export interface ISystemDataConstants {
  sharp: Record<SharpSettingsKey, SharpConfig>
  maxMbQuantityTransfer: number
}
