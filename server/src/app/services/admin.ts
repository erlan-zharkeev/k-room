import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/mongoose'
import AdminJS from 'adminjs'

import { InfoNotificationModel } from 'src/entities/info-notification'
import { UserModel } from 'src/entities/user'

import { SERVER_ENV } from 'src/shared/config'

AdminJS.registerAdapter({ Database, Resource })

export const ADMIN_ROOT_PATH = '/admin-panel'

export const admin = new AdminJS({
  rootPath: ADMIN_ROOT_PATH,
  resources: [
    {
      resource: InfoNotificationModel,
      options: {
        navigation: 'Content'
      }
    },
    {
      resource: UserModel,
      options: {
        navigation: 'Users'
      }
    }
  ]
})

export const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate: async (username, password) => {
      if (username === SERVER_ENV.adminUsername && password === SERVER_ENV.adminPassword) {
        return { username }
      }

      return null
    },
    cookieName: 'k-room-admin',
    cookiePassword: SERVER_ENV.refreshTokenSecret
  },
  null,
  {
    secret: SERVER_ENV.refreshTokenSecret,
    resave: false,
    saveUninitialized: true,
    name: 'k-room-admin',
    cookie: {
      httpOnly: true,
      secure: !SERVER_ENV.isDev
    }
  }
)
