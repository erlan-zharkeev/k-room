export const AUTH_FIXTURE_PASSWORD = 'Asdf1234'

export const LOGIN_FIXTURE_USER = {
  nickname: 'ethan',
  email: 'ethan@gmail.com',
  password: AUTH_FIXTURE_PASSWORD
} as const

export const NICKNAME_LOGIN_FIXTURE_USER = {
  nickname: 'alex',
  email: 'alex@gmail.com',
  password: AUTH_FIXTURE_PASSWORD
} as const

export const SETTINGS_FIXTURE_USER = {
  email: 'sam@gmail.com',
  password: AUTH_FIXTURE_PASSWORD,
  nextPassword: 'Asdf12345',
  nickname: 'sam'
} as const
