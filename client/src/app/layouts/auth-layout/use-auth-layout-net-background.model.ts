import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'

import { AUTH_LAYOUT_NET_EFFECT_OPTIONS, AUTH_LAYOUT_NET_EFFECT_POINT_SPEED_MULTIPLIER } from './constants'
import { resolveAuthLayoutNetEffectColor } from './resolve-auth-layout-net-effect-color'
import type { AuthLayoutVantaEffect, AuthLayoutVantaNetModule } from './types'

export const useAuthLayoutNetBackground = () => {
  const authLayoutNetBackgroundRef = useTemplateRef<HTMLElement>('authLayoutNetBackground')
  let netEffect: AuthLayoutVantaEffect | null = null
  let disposed = false

  const destroyAuthLayoutNetBackground = () => {
    netEffect?.destroy()
    netEffect = null
  }

  const slowAuthLayoutNetBackground = (effect: AuthLayoutVantaEffect) => {
    effect.points.forEach((point) => {
      point.r *= AUTH_LAYOUT_NET_EFFECT_POINT_SPEED_MULTIPLIER
    })
  }

  const initializeAuthLayoutNetBackground = async () => {
    if (!authLayoutNetBackgroundRef.value) {
      return
    }

    // @ts-expect-error У Vanta нет деклараций типов для dist-модулей.
    const vantaNetModule = (await import('vanta/dist/vanta.net.min')) as AuthLayoutVantaNetModule
    const three = await import('three')

    if (disposed || !authLayoutNetBackgroundRef.value) {
      return
    }

    const effectColor = resolveAuthLayoutNetEffectColor(authLayoutNetBackgroundRef.value)

    const createdNetEffect = vantaNetModule.default({
      ...AUTH_LAYOUT_NET_EFFECT_OPTIONS,
      THREE: three,
      backgroundColor: effectColor,
      color: effectColor,
      el: authLayoutNetBackgroundRef.value
    })

    slowAuthLayoutNetBackground(createdNetEffect)
    netEffect = createdNetEffect
  }

  onMounted(() => {
    void initializeAuthLayoutNetBackground()
  })

  onBeforeUnmount(() => {
    disposed = true
    destroyAuthLayoutNetBackground()
  })
}
