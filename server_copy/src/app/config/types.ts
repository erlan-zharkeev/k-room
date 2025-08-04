import { SharpSettingsKey, SharpConfig } from 'shared/*'

export interface ISystemDataConstants {
  sharp: Record<SharpSettingsKey, SharpConfig>
  maxMbQuantityTransfer: number
}
