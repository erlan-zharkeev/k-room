import path from 'path'

import MongoStore from 'connect-mongo'
import { WEEK_IN_MS } from 'global-shared'

import { SERVER_ENV } from 'src/app/env'
import { ADMIN_MEDIA_OPTIONS, ADMIN_MEDIA_PREVIEW_COMPONENT } from 'src/modules/media/media.admin'
import { attachAdminMediaPreviewRoute } from 'src/modules/media/media.admin-preview'
import { ADMIN_MESSAGE_OPTIONS } from 'src/modules/messages/messages.admin'
import { ADMIN_USER_OPTIONS } from 'src/modules/user/user.admin'

const adminFaviconPath = path.resolve(__dirname, '..', '..', 'public', 'admin-favicon.svg')
const adminMediaPreviewComponentPath = path.resolve(
  __dirname,
  '..',
  'modules',
  'media',
  'admin-components',
  ADMIN_MEDIA_PREVIEW_COMPONENT
)
const {
  adminjs: { adminRootPath, adminLoginPath, adminLogoutPath, adminUsername, adminPassword, adminCookie },
  secret: { refreshTokenSecret },
  mongo: { mongoHost },
  info: { appName },
  isDev
} = SERVER_ENV

const configureAdminJsBundleDir = () => {
  if (!isDev || process.env.ADMIN_JS_TMP_DIR) {
    return
  }

  process.env.ADMIN_JS_TMP_DIR = path.resolve(process.cwd(), '.adminjs', `dev-${Date.now()}`)
}

const ADMIN_JS_CONFIG = {
  rootPath: adminRootPath,
  loginPath: adminLoginPath,
  logoutPath: adminLogoutPath,
  branding: {
    companyName: appName,
    favicon: '/admin-favicon.svg'
  },
  resources: [ADMIN_USER_OPTIONS, ADMIN_MESSAGE_OPTIONS, ...ADMIN_MEDIA_OPTIONS]
}

const createAdmin = async () => {
  configureAdminJsBundleDir()

  const [{ Database, Resource }, { ComponentLoader, default: AdminJS }, { dark }] = await Promise.all([
    import('@adminjs/mongoose'),
    import('adminjs'),
    import('@adminjs/themes')
  ])
  const componentLoader = new ComponentLoader()

  componentLoader.add(ADMIN_MEDIA_PREVIEW_COMPONENT, adminMediaPreviewComponentPath)

  AdminJS.registerAdapter({ Database, Resource })

  return new AdminJS({
    ...ADMIN_JS_CONFIG,
    componentLoader,
    defaultTheme: dark.id,
    availableThemes: [dark],
    env: {
      ADMIN_ROOT_PATH: adminRootPath
    }
  })
}

export const createAdminRouter = async () => {
  configureAdminJsBundleDir()

  const admin = await createAdmin()
  const { default: AdminJSExpress } = await import('@adminjs/express')

  const router = AdminJSExpress.buildAuthenticatedRouter(
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

  attachAdminMediaPreviewRoute(router)

  return router
}

export const getAdminFaviconPath = () => adminFaviconPath
