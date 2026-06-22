import path from 'path'

import MongoStore from 'connect-mongo'
import { WEEK_IN_MS } from 'global-shared'

import { SERVER_ENV } from 'src/app/env'
import { ADMIN_USER_OPTIONS } from 'src/modules/user/user.admin'

const adminFaviconPath = path.resolve(__dirname, '..', '..', 'public', 'admin-favicon.svg')
const {
  adminjs: { adminRootPath, adminLoginPath, adminLogoutPath, adminUsername, adminPassword, adminCookie },
  secret: { refreshTokenSecret },
  mongo: { mongoHost },
  info: { appName },
  isDev
} = SERVER_ENV

const ADMIN_JS_CONFIG = {
  rootPath: adminRootPath,
  loginPath: adminLoginPath,
  logoutPath: adminLogoutPath,
  branding: {
    companyName: appName,
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

export const createAdminRouter = async () => {
  const [{ default: AdminJSExpress }, admin] = await Promise.all([import('@adminjs/express'), createAdmin()])

  return AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (nickname, password) => {
        if (nickname === adminUsername && password === adminPassword) {
          return { nickname }
        }

        return null
      },
      cookieName: adminCookie,
      cookiePassword: refreshTokenSecret
    },
    null,
    {
      secret: refreshTokenSecret,
      resave: false,
      saveUninitialized: false,
      name: adminCookie,
      store: MongoStore.create({
        mongoUrl: mongoHost,
        collectionName: 'admin-session'
      }),
      cookie: {
        httpOnly: true,
        secure: !isDev,
        sameSite: 'lax',
        maxAge: WEEK_IN_MS
      }
    }
  )
}

export const getAdminFaviconPath = () => adminFaviconPath
