export interface AuthLayoutProps {
  blockNavigation?: boolean
}

export type AuthLayoutThree = typeof import('three')

export interface AuthLayoutVantaNetOptions {
  THREE: AuthLayoutThree
  backgroundAlpha: number
  backgroundColor: number
  color: number
  el: HTMLElement
  forceAnimate: boolean
  gyroControls: boolean
  maxDistance: number
  minHeight: number
  minWidth: number
  mouseControls: boolean
  points: number
  scale: number
  scaleMobile: number
  showDots: boolean
  spacing: number
  touchControls: boolean
}

export interface AuthLayoutVantaEffect {
  destroy: () => void
  points: AuthLayoutVantaPoint[]
  resize: () => void
  setOptions: (options: Partial<AuthLayoutVantaNetOptions>) => void
}

export interface AuthLayoutVantaPoint {
  r: number
}

export type AuthLayoutVantaNetFactory = (options: AuthLayoutVantaNetOptions) => AuthLayoutVantaEffect

export interface AuthLayoutVantaNetModule {
  default: AuthLayoutVantaNetFactory
}
