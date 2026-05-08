import MongoStore from 'connect-mongo'
import type { Router } from 'express'

import { SERVER_ENV } from 'src/shared/config'

import { ADMIN_USER_OPTIONS } from '../modules/user'

const ADMIN_JS_CONFIG = {
  rootPath: SERVER_ENV.adminRootPath,
  loginPath: SERVER_ENV.adminLoginPath,
  logoutPath: SERVER_ENV.adminLogoutPath,
  branding: {
    companyName: SERVER_ENV.appName,
    favicon: '/admin-favicon.svg'
  },
  resources: [ADMIN_USER_OPTIONS]
}

const createAdmin = async () => {
  const [{ Database, Resource }, { default: AdminJS }] = await Promise.all([
    import('@adminjs/mongoose'),
    import('adminjs')
  ])

  AdminJS.registerAdapter({ Database, Resource })

  return new AdminJS(ADMIN_JS_CONFIG)
}

const ADMIN_JS_ROUTER_OPTIONS = {
  secret: SERVER_ENV.refreshTokenSecret,
  resave: false,
  saveUninitialized: false,
  name: SERVER_ENV.adminCookie,
  store: MongoStore.create({
    mongoUrl: SERVER_ENV.mongoHost,
    collectionName: 'admin-session'
  }),
  cookie: {
    httpOnly: true,
    secure: !SERVER_ENV.isDev,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}

export const createAdminRouter = async (): Promise<Router> => {
  const [{ default: AdminJSExpress }, admin] = await Promise.all([import('@adminjs/express'), createAdmin()])

  return AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (username, password) => {
        if (username === SERVER_ENV.adminUsername && password === SERVER_ENV.adminPassword) {
          return { username }
        }

        return null
      },
      cookieName: SERVER_ENV.adminCookie,
      cookiePassword: SERVER_ENV.refreshTokenSecret
    },
    null,
    ADMIN_JS_ROUTER_OPTIONS
  )
}
