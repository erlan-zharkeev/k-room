export const firebaseProviders = ['google', 'facebook'] as const

export const providers = [...firebaseProviders, 'app'] as const
