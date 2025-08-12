;(() => {
  'use strict'
  var e = {
      1356: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      9348: function (e, t, r) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, o) {
                  void 0 === o && (o = r)
                  var a = Object.getOwnPropertyDescriptor(t, r)
                  ;(a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
                    (a = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      }
                    }),
                    Object.defineProperty(e, o, a)
                }
              : function (e, t, r, o) {
                  void 0 === o && (o = r), (e[o] = t[r])
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r)
            }
        Object.defineProperty(t, '__esModule', { value: !0 }),
          a(r(7195), t),
          a(r(4280), t),
          a(r(9841), t),
          a(r(6945), t),
          a(r(4577), t),
          a(r(2123), t),
          a(r(1356), t)
      },
      4280: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      9841: (e, t) => {
        var r
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.ServerNotificationMessage = void 0),
          ((r = t.ServerNotificationMessage || (t.ServerNotificationMessage = {})).TokensPairUpdated =
            'Token pair is updated'),
          (r.Success = 'success'),
          (r.PasswordReset = 'Password changed successfully'),
          (r.LoginSuccess = 'Login successfully'),
          (r.LoginWithProvider = 'Login and register successfully'),
          (r.UserDataUpdated = 'User data updated'),
          (r.EmailConfirmed = 'Email confirmed'),
          (r.CheckEmailForCode = 'Check your email, we have sent you a code'),
          (r.FailedGetUserData = 'Failed to get user data'),
          (r.FailedResetPassword = 'Failed to change password'),
          (r.InvalidConfirmCode = 'Invalid confirmation code'),
          (r.FailedCodeSend = 'Code send failed'),
          (r.CommonServerError = 'Server error, the operation could not be performed. Try later'),
          (r.FailedRegistration = 'Registration failed, try register later'),
          (r.FailedLogin = 'Login failed, try register later'),
          (r.NonAuthorized = 'User not authorized'),
          (r.FailedUserDataUpdate = 'Failed to update user data'),
          (r.UserWithCurrentNameAlreadyExist = 'The user with the current username is already registered'),
          (r.UserWithCurrentEmailAlreadyExist = 'The user with the current email address is already registered'),
          (r.FailedPassHash = 'Password hashing failed'),
          (r.FailedSendConfirmEmail = 'Failed to send confirmation email'),
          (r.UserNotFound = 'User not found'),
          (r.WrongPass = 'Invalid password'),
          (r.FailedEmailConfirm = 'Email confirm failed'),
          (r.EmailNotConfirm = 'Please, confirm email'),
          (r.UsersFind = 'Error while finding user(s)'),
          (r.NextTimeRequestNotPossible = 'The code was sent earlier'),
          (r.NoFilesExist = 'No files exist'),
          (r.NotImage = 'File is not an image'),
          (r.FailedSendConfirmationLink = 'Failed to send confirmation link, please try later'),
          (r.CouldNotFindEmail = 'Could not find the current email address'),
          (r.ImageConverterError = 'Server could not process the image, please choose another image file'),
          (r.FailedToDecodeAdminId = 'Failed to decode admin id'),
          (r.ForbiddenDoNotHavePermission = "Forbidden. You don't have permission to get access"),
          (r.FailedToGetData = 'Failed to get data'),
          (r.DBRestored = 'Data base restored'),
          (r.DBResetFailed = 'Data base reset failed'),
          (r.FixturesAreApplied = 'The fixtures are applied'),
          (r.UserDeleteSuccess = 'The user has been successfully deleted'),
          (r.DeleteUserFailed = "Couldn't delete user"),
          (r.UserUpdateSuccess = 'User update success')
      },
      4577: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      6945: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      2123: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      4784: function (e, t, r) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.ENV = void 0)
        const a = o(r(5142)).default.config({ path: './.env.production' }).parsed
        ;(a.IS_DEV = !1),
          (a.SERVER_ASSETS_PATH = a.IS_DEV ? './src/assets/' : './build/assets/'),
          (a.SERVER_URL = a.IS_DEV ? `${a.HOST}:${a.SERVER_PORT}/api` : `${a.HOST}/api`),
          (a.CLIENT_URL = a.IS_DEV ? `${a.HOST}:${a.CLIENT_PORT}` : `${a.HOST}`)
        const { K_ROOM_ACCESS_TOKEN_SECRET: n, K_ROOM_MAIL_PASS: s, K_ROOM_REFRESH_TOKEN_SECRET: i } = process.env
        t.ENV = { ...a, K_ROOM_ACCESS_TOKEN_SECRET: n, K_ROOM_MAIL_PASS: s, K_ROOM_REFRESH_TOKEN_SECRET: i }
      },
      6605: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.controller = void 0)
        const o = r(4386),
          a = r(9348),
          n = r(7525),
          s = r(3827)
        t.controller = new (class {
          async getAppData(e, t) {
            try {
              const e = await o.UserModel.find(),
                r = await o.CallModel.find(),
                a = await o.ChatRoomModel.find(),
                n = await o.MessageModel.find()
              if (!(e && r && a && n)) throw new Error()
              return t.json({ users: e, calls: r, chatRooms: a, messages: n })
            } catch (e) {
              ;(0, n.throwError)(a.Status.BadRequest, t, a.ServerNotificationMessage.FailedToGetData)
            }
          }
          async resetDB(e, t) {
            try {
              return (
                await Promise.all([
                  o.UserModel.deleteMany({ role: { $ne: 'admin' } }),
                  o.CallModel.deleteMany({}),
                  o.ChatRoomModel.deleteMany({}),
                  o.MessageModel.deleteMany({})
                ]),
                t.json({ message: a.ServerNotificationMessage.DBRestored })
              )
            } catch (e) {
              ;(0, n.throwError)(a.Status.BadRequest, t, a.ServerNotificationMessage.DBResetFailed)
            }
          }
          async applyFixtures(e, t) {
            try {
              return (0, s.loadFixtures)(!1), t.json({ message: a.ServerNotificationMessage.FixturesAreApplied })
            } catch (e) {
              ;(0, n.throwError)(a.Status.BadRequest, t, a.ServerNotificationMessage.DBResetFailed)
            }
          }
          async deleteUser(e, t) {
            try {
              const r = e.body.deleteUserId
              return (await o.UserModel.findById(r))
                ? (await o.UserModel.findByIdAndDelete(r),
                  t.json({ message: a.ServerNotificationMessage.UserDeleteSuccess }))
                : (0, n.throwError)(a.Status.NotFound, t, a.ServerNotificationMessage.UserNotFound)
            } catch {
              ;(0, n.throwError)(a.Status.BadRequest, t, a.ServerNotificationMessage.DeleteUserFailed)
            }
          }
          async updateUserData(e, t) {
            try {
              const { id: r, username: s, email: i, role: d, confirmed: l } = e.body.userData
              let c = await o.UserModel.findById(r)
              return c
                ? ((c.username = s),
                  (c.email = i),
                  (c.role = d),
                  (c.confirmed = l),
                  await c.save(),
                  t.json({ message: a.ServerNotificationMessage.UserUpdateSuccess, updatedUser: c }))
                : (0, n.throwError)(a.Status.NotFound, t, a.ServerNotificationMessage.UserNotFound)
            } catch {}
          }
        })()
      },
      2554: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.controller = void 0)
        const o = r(5828),
          a = r(3827),
          n = r(767),
          s = r(4386),
          i = r(9344),
          d = r(9348),
          l = r(7525),
          c = r(8432)
        t.controller = new (class {
          async updateTokensPair(e, t) {
            const r = e.app.locals.id
            await (0, i.updateTokens)(r, t),
              t.json({ message: d.ServerNotificationMessage.TokensPairUpdated, silent: !0 })
          }
          async registration(e, t) {
            try {
              ;(0, n.authValidator)(e, t)
              const { username: r, email: o, password: u } = e.body
              if (await s.UserModel.findOne({ username: r }))
                return (0, l.throwError)(
                  d.Status.BadRequest,
                  t,
                  d.ServerNotificationMessage.UserWithCurrentNameAlreadyExist
                )
              if (await s.UserModel.findOne({ email: o }))
                return (0, l.throwError)(
                  d.Status.BadRequest,
                  t,
                  d.ServerNotificationMessage.UserWithCurrentEmailAlreadyExist
                )
              const m = await c.hash(u, 6)
              if (!m) return (0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.FailedPassHash)
              const f = (0, i.getInfo)('1'),
                p = new s.UserModel({
                  username: r,
                  email: o,
                  password: m,
                  socketId: '',
                  settings: a.initUserSettings,
                  codes: a.initUserCodes,
                  infoItems: [f],
                  role: 'user'
                })
              await p.save()
              const g = await (0, i.sendEmailConfirmationLink)(e.body.email)
              return g
                ? t.json(g)
                : (0, l.throwError)(d.Status.Unreachable, t, d.ServerNotificationMessage.FailedSendConfirmationLink)
            } catch {
              ;(0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.FailedRegistration)
            }
          }
          async sendConfirmationLink(e, t) {
            const { email: r } = e.body
            try {
              const e = await (0, i.sendEmailConfirmationLink)(r)
              return t.json(e)
            } catch {
              ;(0, l.throwError)(d.Status.Unreachable, t, d.ServerNotificationMessage.FailedSendConfirmEmail)
            }
          }
          async confirmEmail(e, t) {
            try {
              const r = e.body.userId,
                o = await s.UserModel.findOneAndUpdate({ _id: r }, { confirmed: !0 }, { new: !0 })
              if (!o) return
              return t.json({
                userData: { username: o.username, email: o.email, id: o._id, avatar: o.avatar },
                message: d.ServerNotificationMessage.EmailConfirmed
              })
            } catch {
              ;(0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.FailedEmailConfirm)
            }
          }
          async login(e, t) {
            try {
              const { email: r, password: o } = e.body,
                a = await s.UserModel.findOne({ email: r })
              return a
                ? a.confirmed
                  ? c.compareSync(o, a.password)
                    ? (await (0, i.updateTokens)(a._id, t),
                      t.json({
                        userData: {
                          role: a.role,
                          username: a.username,
                          email: r,
                          id: a._id,
                          avatar: a.avatar,
                          infoItems: a.infoItems
                        },
                        settings: a.settings,
                        message: d.ServerNotificationMessage.LoginSuccess,
                        silent: !0
                      }))
                    : (0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.WrongPass)
                  : (0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.EmailNotConfirm)
                : (0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.UserNotFound)
            } catch {
              ;(0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.FailedLogin)
            }
          }
          async signInWithProvider(e, t) {
            try {
              const { username: r, email: n, avatar: l, providerName: u } = e.body
              let m = await s.UserModel.findOne({ email: n })
              if (!m) {
                const e = await c.hash((0, o.v4)(), 6)
                ;(m = new s.UserModel({
                  username: r,
                  role: 'user',
                  email: n,
                  avatar: l,
                  providerName: u,
                  password: e,
                  socketId: '',
                  confirmed: !0,
                  settings: a.initUserSettings,
                  codes: a.initUserCodes
                })),
                  await m.save()
              }
              return (
                await (0, i.updateTokens)(m._id, t),
                t.json({
                  userData: {
                    username: m.username ?? r,
                    email: n,
                    id: m?._id,
                    avatar: m.avatar ?? l,
                    role: m.role
                  },
                  settings: m.settings,
                  message: d.ServerNotificationMessage.LoginWithProvider
                })
              )
            } catch {
              ;(0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.FailedLogin)
            }
          }
        })()
      },
      7698: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.controller = void 0)
        const o = r(5828),
          a = r(4784),
          n = r(4386),
          s = r(9344),
          i = r(9348),
          d = r(7525)
        t.controller = new (class {
          async emailPasswordRecovery(e, t) {
            try {
              const { email: r } = e.body,
                o = (0, d.notAccuratePinRandomGenerator)(),
                l = (0, d.getNextTimeCodeRequest)(a.ENV.NEXT_CODE_REQUEST_INTERVAL_SECONDS)
              return (
                await n.UserModel.findOneAndUpdate(
                  { email: r },
                  { $set: { 'codes.passwordRecovery.email': o, 'codes.nextRequestPossibleAt': l } },
                  { new: !0 }
                ),
                await (0, s.sendEmailCodePasswordRecovery)(r, o),
                t.json({ message: i.ServerNotificationMessage.CheckEmailForCode, nextTimeRequest: l })
              )
            } catch {
              ;(0, d.throwError)(i.Status.BadRequest, t, i.ServerNotificationMessage.FailedCodeSend)
            }
          }
          async validateEmailCodePasswordRecovery(e, t) {
            try {
              const { email: r, code: s } = e.body,
                l = await n.UserModel.findOne({ email: r })
              s === String(l?.codes.passwordRecovery.email) ||
                (0, d.throwError)(i.Status.BadRequest, t, i.ServerNotificationMessage.InvalidConfirmCode)
              const c = (0, o.v4)()
              return (
                await l?.updateOne({
                  $set: {
                    'codes.passwordRecovery.query.value': c,
                    'codes.passwordRecovery.query.expiresIn': (0, d.getNextTimeCodeRequest)(
                      a.ENV.PASSWORD_RECOVERY_LINK_LIFE
                    )
                  }
                }),
                t.json({ message: i.ServerNotificationMessage.Success, query: c, silent: !0 })
              )
            } catch {
              ;(0, d.throwError)(i.Status.BadRequest, t, i.ServerNotificationMessage.CommonServerError)
            }
          }
        })()
      },
      1545: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.controller = void 0)
        const o = r(4386),
          a = r(9348),
          n = r(7525),
          s = r(7147)
        t.controller = new (class {
          async imagesHandler(e, t) {
            try {
              const r = e.query.img,
                o = r.split('.')[1],
                i = (0, n.getPathToImg)(r)
              if (!s.existsSync(i))
                return (0, n.throwError)(a.Status.NotFound, t, a.ServerNotificationMessage.NoFilesExist)
              t.writeHead(200, { 'content-type': `image/${o}` }), s.createReadStream(i).pipe(t)
            } catch {
              return (0, n.throwError)(a.Status.NotFound, t, a.ServerNotificationMessage.NoFilesExist)
            }
          }
          async readInfoHandler(e, t) {
            try {
              const { currentInfoId: r } = e.body,
                n = e.app.locals.id
              return (
                await o.UserModel.findOneAndUpdate(
                  { _id: n, infoItems: { $elemMatch: { id: r } } },
                  { $set: { 'infoItems.$[outer].read': 'read' } },
                  { new: !0, arrayFilters: [{ 'outer.id': r }] }
                ),
                t.json({ message: a.ServerNotificationMessage.Success, silent: !0 })
              )
            } catch {
              ;(0, n.throwError)(a.Status.NotFound, t, a.ServerNotificationMessage.NotImage)
            }
          }
        })()
      },
      8135: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.AdminController = t.CommonController = t.UserController = t.CodesController = t.AuthController = void 0)
        var o = r(2554)
        Object.defineProperty(t, 'AuthController', {
          enumerable: !0,
          get: function () {
            return o.controller
          }
        })
        var a = r(7698)
        Object.defineProperty(t, 'CodesController', {
          enumerable: !0,
          get: function () {
            return a.controller
          }
        })
        var n = r(4780)
        Object.defineProperty(t, 'UserController', {
          enumerable: !0,
          get: function () {
            return n.controller
          }
        })
        var s = r(1545)
        Object.defineProperty(t, 'CommonController', {
          enumerable: !0,
          get: function () {
            return s.controller
          }
        })
        var i = r(6605)
        Object.defineProperty(t, 'AdminController', {
          enumerable: !0,
          get: function () {
            return i.controller
          }
        })
      },
      4780: function (e, t, r) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.controller = void 0)
        const a = o(r(7147)),
          n = r(4386),
          s = r(4506),
          i = r(8679),
          d = r(9348),
          l = r(7525),
          c = r(9344),
          u = r(8432)
        t.controller = new (class {
          async updateUserData(e, t) {
            try {
              const { username: r, oldFilename: o } = e.body,
                c = e.app.locals.id,
                u = (0, l.getPathToImg)(o),
                m = a.default.existsSync(u)
              !u.includes('static') && m && a.default.unlinkSync((0, l.getPathToImg)(o))
              const f = await (0, l.saveImageAndGetPath)(e.file?.buffer, 'avatar', c),
                p = await n.UserModel.findOneAndUpdate({ _id: c }, { username: r, avatar: f }, { new: !0 })
              if (!p) return (0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.UsersFind)
              const g = (await (0, i.getUsersByHasContactId)(c)).map((e) => e.id),
                y = await (0, i.getSocketsByUserIds)(g),
                h = { username: p.username, avatar: p.avatar },
                v = { id: c, ...h }
              return (
                y.forEach((e) => {
                  s.io.to(e).emit('change-contacts-data', v)
                }),
                t.json({ userData: h, message: d.ServerNotificationMessage.UserDataUpdated })
              )
            } catch {
              ;(0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.FailedUserDataUpdate)
            }
          }
          async getUserData(e, t) {
            try {
              const r = e.app.locals.id,
                o = await n.UserModel.findOne({ _id: r })
              return o
                ? (await (0, c.updateTokens)(o._id, t),
                  t.json({
                    userData: {
                      username: o.username,
                      role: o.role,
                      email: o.email,
                      id: o._id,
                      avatar: o.avatar,
                      infoItems: o.infoItems
                    },
                    settings: o.settings
                  }))
                : (0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.UserNotFound)
            } catch {
              ;(0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.FailedGetUserData)
            }
          }
          async resetPassword(e, t) {
            try {
              const { query: r, password: o } = e.body,
                a = await u.hash(o, 6)
              if (!a) return (0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.FailedPassHash)
              const s = await n.UserModel.findOne({ 'codes.passwordRecovery.query.value': r })
              return (
                s || (0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.FailedResetPassword),
                await s?.updateOne({
                  $set: { 'codes.passwordRecovery.query.value': null, 'codes.nextRequestPossibleAt': null, password: a }
                }),
                t.json({ message: d.ServerNotificationMessage.PasswordReset })
              )
            } catch {
              return (0, l.throwError)(d.Status.BadRequest, t, d.ServerNotificationMessage.CommonServerError)
            }
          }
        })()
      },
      2823: function (e, t, r) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, o) {
                  void 0 === o && (o = r)
                  var a = Object.getOwnPropertyDescriptor(t, r)
                  ;(a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
                    (a = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      }
                    }),
                    Object.defineProperty(e, o, a)
                }
              : function (e, t, r, o) {
                  void 0 === o && (o = r), (e[o] = t[r])
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r)
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), a(r(9435), t), a(r(2590), t)
      },
      9435: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.initUserCodes = void 0),
          (t.initUserCodes = {
            passwordRecovery: { query: { value: '', expiresIn: '' }, email: null, sms: null },
            nextRequestPossibleAt: null
          })
      },
      2590: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.initUserSettings = void 0),
          (t.initUserSettings = {
            asideTab: 'contacts',
            selectedAdminPanelModelTab: 'users',
            currentInfoId: '1',
            selectedChatRoomId: '',
            theme: 'dark',
            soundOn: !0,
            showTooltips: !1,
            ableToShowNotification: !0,
            showWallpaper: !0
          })
      },
      3827: function (e, t, r) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, o) {
                  void 0 === o && (o = r)
                  var a = Object.getOwnPropertyDescriptor(t, r)
                  ;(a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
                    (a = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      }
                    }),
                    Object.defineProperty(e, o, a)
                }
              : function (e, t, r, o) {
                  void 0 === o && (o = r), (e[o] = t[r])
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r)
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.loadFixtures = void 0)
        const n = r(175),
          s = r(6190)
        a(r(2823), t)
        const i = r(7525)
        t.loadFixtures = async (e = !0) => {
          await (0, n.loadMessageFixtures)(),
            await (0, s.loadUsersFixtures)(e),
            console.log(i.clc.green.bgWhite('-Fixtures loaded'))
        }
      },
      175: function (e, t, r) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.loadMessageFixtures = void 0)
        const a = o(r(1185)),
          n = r(5607),
          s = r(4386)
        t.loadMessageFixtures = async () =>
          await Promise.all(
            n.serverConstants.messages.system.map(async (e) => {
              const t = new a.default.Types.ObjectId(e.id)
              if (await s.MessageModel.findOne({ _id: t })) return
              const r = new s.MessageModel({
                _id: t,
                authorId: 'system',
                authorName: 'system',
                status: 'none',
                body: e.text,
                createdAt: Date.now(),
                usersMetaData: []
              })
              await r.save()
            })
          )
      },
      6190: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.loadUsersFixtures = void 0)
        const o = r(4784),
          a = r(4386),
          n = r(9344),
          s = r(7525),
          i = r(2823),
          d = r(8432),
          l = [
            { username: 'tolik' },
            { username: 'ivan' },
            { username: 'guest-1' },
            { username: 'guest-2' },
            { username: 'guest-3' }
          ],
          c = [{ username: 'erlan', admin: !0 }],
          u = [{ username: 'guest-1' }],
          m = [{ username: 'erlan', admin: !0, password: o.ENV.K_ROOM_ADMIN_PASS }]
        t.loadUsersFixtures = async (e) => {
          let t = []
          t = o.ENV.IS_DEV ? (e ? [...l, ...c] : l) : e ? [...u, ...m] : u
          const r = t.map(async ({ username: e, admin: t, password: r }) => {
            if (await a.UserModel.findOneAndUpdate({ email: `${e}@gmail.com` }, { online: !1 })) return
            const o = r || 'Asdf1234',
              l = await d.hash(o, 6),
              c = e.includes('guest') ? 'guest' : e,
              u = new a.UserModel({
                username: (0, s.firstCharUpperCase)(e),
                role: t ? 'admin' : 'user',
                avatar: `${(0, s.getRequestStringToImg)(c)}.jpg`,
                email: `${e}@gmail.com`,
                password: l,
                socketId: '',
                refreshToken: e,
                confirmed: !0,
                settings: i.initUserSettings,
                codes: i.initUserCodes,
                online: !1,
                infoItems: [(0, n.getInfo)('1')]
              })
            await u.save()
          })
          return await Promise.all(r)
        }
      },
      9973: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.accessTokenValidator = void 0)
        const o = r(4784),
          a = r(9344),
          n = r(9348),
          s = r(7525),
          i = r(4881)
        t.accessTokenValidator = (e, t, r) => {
          const d = e.cookies.jwt
          if (!d) return (0, s.throwError)(n.Status.NotAuth, t, n.ServerNotificationMessage.NonAuthorized, !0)
          a.jwt.verify(d, o.ENV?.K_ROOM_ACCESS_TOKEN_SECRET, async (o, a) => {
            if (o) return await (0, i.refreshTokenValidator)(e, t, r)
            ;(e.app.locals = a), r()
          })
        }
      },
      2843: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.adminRoleValidator = void 0)
        const o = r(4784),
          a = r(9344),
          n = r(9348),
          s = r(7525),
          i = r(4386)
        t.adminRoleValidator = (e, t, r) => {
          const d = e.cookies.jwt
          a.jwt.verify(d, o.ENV?.K_ROOM_ACCESS_TOKEN_SECRET, async (e, o) => {
            if (e) return (0, s.throwError)(n.Status.NotAuth, t, n.ServerNotificationMessage.FailedToDecodeAdminId)
            const a = o.id,
              d = await i.UserModel.findOne({ _id: a })
            if ('admin' !== d?.role)
              return (0, s.throwError)(n.Status.Forbidden, t, n.ServerNotificationMessage.ForbiddenDoNotHavePermission)
            r()
          })
        }
      },
      8991: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.authValidator = void 0)
        const o = r(3553),
          a = r(9348),
          n = r(7525)
        t.authValidator = (e, t) => {
          const r = (0, o.validationResult)(e)
          r.isEmpty() || (0, n.throwError)(a.Status.BadRequest, t, r)
        }
      },
      5565: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.codesRequestValidator = void 0)
        const o = r(4386),
          a = r(9348),
          n = r(7525)
        t.codesRequestValidator = async (e, t, r) => {
          try {
            const { email: s } = e.body,
              i = await o.UserModel.findOne({ email: s })
            i || (0, n.throwError)(a.Status.BadRequest, t, a.ServerNotificationMessage.CouldNotFindEmail)
            if (Date.now() > Number(i?.codes.nextRequestPossibleAt)) return void r()
            ;(0, n.throwError)(a.Status.BadRequest, t, a.ServerNotificationMessage.NextTimeRequestNotPossible)
          } catch {
            ;(0, n.throwError)(a.Status.BadRequest, t, a.ServerNotificationMessage.CommonServerError)
          }
        }
      },
      9291: function (e, t, r) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.fileUploader = void 0)
        const a = o(r(1738)),
          n = a.default.memoryStorage()
        t.fileUploader = (0, a.default)({ storage: n })
      },
      767: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.fileUploader =
            t.validationRules =
            t.codesRequestValidator =
            t.authValidator =
            t.refreshTokenValidator =
            t.accessTokenValidator =
              void 0)
        var o = r(9973)
        Object.defineProperty(t, 'accessTokenValidator', {
          enumerable: !0,
          get: function () {
            return o.accessTokenValidator
          }
        })
        var a = r(4881)
        Object.defineProperty(t, 'refreshTokenValidator', {
          enumerable: !0,
          get: function () {
            return a.refreshTokenValidator
          }
        })
        var n = r(8991)
        Object.defineProperty(t, 'authValidator', {
          enumerable: !0,
          get: function () {
            return n.authValidator
          }
        })
        var s = r(5565)
        Object.defineProperty(t, 'codesRequestValidator', {
          enumerable: !0,
          get: function () {
            return s.codesRequestValidator
          }
        })
        var i = r(4543)
        Object.defineProperty(t, 'validationRules', {
          enumerable: !0,
          get: function () {
            return i.validationRules
          }
        })
        var d = r(9291)
        Object.defineProperty(t, 'fileUploader', {
          enumerable: !0,
          get: function () {
            return d.fileUploader
          }
        })
      },
      4881: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.refreshTokenValidator = void 0)
        const o = r(4784),
          a = r(4386),
          n = r(9344),
          s = r(9348),
          i = r(7525),
          d = (e) => (0, i.throwError)(s.Status.NotAuth, e, s.ServerNotificationMessage.NonAuthorized, !0)
        t.refreshTokenValidator = async (e, t, r) => {
          const l = e.cookies['refresh-jwt']
          if (!l) return (0, i.throwError)(s.Status.NotAuth, t, s.ServerNotificationMessage.NonAuthorized)
          n.jwt.verify(l, o.ENV?.K_ROOM_REFRESH_TOKEN_SECRET, async (o, s) => {
            if (o) return d(t)
            const i = s.id,
              c = await a.UserModel.findOne({ _id: i }),
              u = c?.refreshToken
            return u ? (u !== l ? d(t) : (await (0, n.updateTokens)(i, t), (e.app.locals = s), void r())) : d(t)
          })
        }
      },
      4543: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.validationRules = void 0)
        const o = r(3553)
        t.validationRules = {
          registration: [
            (0, o.check)('username', 'Name is required').notEmpty(),
            (0, o.check)('password', 'Password cant be less than 6 letters').isLength({ min: 6 })
          ]
        }
      },
      8034: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.CallModel = void 0)
        const o = r(1185),
          a = new o.Schema({
            calledAt: { type: Number, required: !1 },
            startedAt: { type: Number, required: !1 },
            finishedAt: { type: Number, required: !1 },
            authorId: { type: String, required: !0 },
            interlocutors: { type: [], required: !0 },
            answered: { type: Boolean, required: !0 },
            video: { type: Boolean, required: !1 }
          })
        t.CallModel = (0, o.model)('Call', a)
      },
      3339: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.ChatRoomModel = void 0)
        const o = r(1185),
          a = new o.Schema({
            chatName: { type: String, required: !1 },
            avatar: { type: String, required: !1 },
            authorId: { type: String, required: !0 },
            multiple: { type: Boolean, required: !1 },
            users: { type: [String], required: !0, default: [] },
            messages: { type: [String], required: !1, default: [] }
          })
        t.ChatRoomModel = (0, o.model)('ChatRoom', a)
      },
      4386: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.UserModel = t.MessageModel = t.ChatRoomModel = t.CallModel = void 0)
        var o = r(8034)
        Object.defineProperty(t, 'CallModel', {
          enumerable: !0,
          get: function () {
            return o.CallModel
          }
        })
        var a = r(3339)
        Object.defineProperty(t, 'ChatRoomModel', {
          enumerable: !0,
          get: function () {
            return a.ChatRoomModel
          }
        })
        var n = r(3209)
        Object.defineProperty(t, 'MessageModel', {
          enumerable: !0,
          get: function () {
            return n.MessageModel
          }
        })
        var s = r(8493)
        Object.defineProperty(t, 'UserModel', {
          enumerable: !0,
          get: function () {
            return s.UserModel
          }
        })
      },
      3209: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.MessageModel = void 0)
        const o = r(1185),
          a = new o.Schema({
            username: { type: String, required: !0 },
            authorId: { type: String, required: !0 },
            glyphKey: { type: String, required: !0 }
          }),
          n = new o.Schema({ src: { type: String, required: !0 }, name: { type: String, required: !0 } }),
          s = new o.Schema({
            authorId: { type: String, unique: !1, required: !0 },
            authorName: { type: String, unique: !1, required: !0 },
            body: { type: String, unique: !1, required: !1 },
            createdAt: { type: String, unique: !1, required: !0 },
            reactions: { type: [a], unique: !1, required: !1 },
            images: { type: [n], unique: !1, required: !1 },
            imageCompression: { type: Boolean, required: !1, default: !0 },
            usersMetaData: {
              type: [
                {
                  id: { type: String, required: !0 },
                  status: { type: String, enum: ['sending', 'undelivered', 'delivered', 'read', 'none'], required: !0 }
                }
              ],
              required: !1,
              default: []
            },
            repliedMessage: { type: {}, required: !1, default: null }
          })
        t.MessageModel = (0, o.model)('Message', s)
      },
      8493: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.UserModel = void 0)
        const o = r(1185),
          a = new o.Schema({
            role: { type: String, unique: !1, required: !1 },
            socketId: { type: String, unique: !1, required: !1 },
            username: { type: String, required: !0 },
            email: { type: String, unique: !0, required: !0 },
            refreshToken: { type: String, unique: !1, required: !1 },
            confirmed: { type: Boolean, required: !0, default: !1 },
            confirmAttempts: { type: Number, required: !0, default: 3 },
            password: { type: String, required: !0 },
            avatar: { type: String, required: !1 },
            online: { type: Boolean, required: !1, default: !1 },
            lastSeen: { type: String, required: !1 },
            contacts: { type: {}, default: {} },
            chatRooms: { type: [], required: !1 },
            settings: { type: {}, required: !1 },
            codes: { type: {}, required: !1 },
            infoItems: { type: [], required: !1 }
          })
        t.UserModel = (0, o.model)('User', a)
      },
      173: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.router = void 0)
        const o = r(6860),
          a = r(8135),
          n = r(767),
          s = r(9348),
          i = r(2843)
        ;(t.router = (0, o.Router)()),
          t.router.get(s.AuthEndpoints.UpdateTokensPair, n.refreshTokenValidator, a.AuthController.updateTokensPair),
          t.router.post(s.AuthEndpoints.Registration, n.validationRules.registration, a.AuthController.registration),
          t.router.post(s.AuthEndpoints.Login, a.AuthController.login),
          t.router.post(s.AuthEndpoints.ProviderLogin, a.AuthController.signInWithProvider),
          t.router.post(s.AuthEndpoints.SendEmailConfirmationLink, a.AuthController.sendConfirmationLink),
          t.router.post(s.AuthEndpoints.ConfirmEmail, a.AuthController.confirmEmail),
          t.router.get(s.UserEndpoints.GetUserData, n.accessTokenValidator, a.UserController.getUserData),
          t.router.post(
            s.UserEndpoints.UpdateUserData,
            n.accessTokenValidator,
            n.fileUploader.single('file'),
            a.UserController.updateUserData
          ),
          t.router.post(s.UserEndpoints.ResetPassword, a.UserController.resetPassword),
          t.router.post(s.CommonEndpoints.GetInfo, n.accessTokenValidator, a.CommonController.readInfoHandler),
          t.router.get(s.CommonEndpoints.CommonImages, n.accessTokenValidator, a.CommonController.imagesHandler),
          t.router.post(
            s.CodesEndpoints.SendEmailCodePasswordRecovery,
            n.codesRequestValidator,
            a.CodesController.emailPasswordRecovery
          ),
          t.router.post(
            s.CodesEndpoints.ValidateEmailCodePasswordRecovery,
            n.codesRequestValidator,
            a.CodesController.validateEmailCodePasswordRecovery
          ),
          t.router.get(
            s.AdminEndpoints.GetAppData,
            n.accessTokenValidator,
            i.adminRoleValidator,
            a.AdminController.getAppData
          ),
          t.router.post(
            s.AdminEndpoints.DBClear,
            n.accessTokenValidator,
            i.adminRoleValidator,
            a.AdminController.resetDB
          ),
          t.router.patch(
            s.AdminEndpoints.ApplyFixtures,
            n.accessTokenValidator,
            i.adminRoleValidator,
            a.AdminController.applyFixtures
          ),
          t.router.post(
            s.AdminEndpoints.DeleteUser,
            n.accessTokenValidator,
            i.adminRoleValidator,
            a.AdminController.deleteUser
          ),
          t.router.post(
            s.AdminEndpoints.UpdateUserData,
            n.accessTokenValidator,
            i.adminRoleValidator,
            a.AdminController.updateUserData
          )
      },
      5607: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.serverConstants = void 0),
          (t.serverConstants = {
            sharp: {
              avatar: { dimensions: { x: 300, y: 300 }, quality: 100 },
              'common-compressed': { quality: 60, dimensions: { x: null, y: null } },
              'common-uncompressed': { quality: 100, dimensions: { x: null, y: null } }
            },
            maxMbQuantityTransfer: 10,
            messages: {
              system: [
                {
                  id: '56cb91bdc3464f14678934ca',
                  name: 'invite-message',
                  text: 'Hi, this is an automatically created message, reply to start a conversation'
                },
                { id: '56cb91bdc3464f14678934cb', name: 'author-created-chat', text: 'You have created the chat' },
                {
                  id: '56cb91bdc3464f14678934cc',
                  name: 'invite-group-chat',
                  text: 'You have been added to the group chat'
                },
                {
                  id: '56cb91bdc3464f14678934cd',
                  name: 'author-created-group-chat',
                  text: 'You have created the group chat'
                }
              ]
            }
          })
      },
      4506: function (e, t, r) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.io = void 0)
        const a = o(r(6860)),
          n = r(3952),
          s = r(7195),
          i = o(r(3582)),
          d = r(5607),
          l = r(4784),
          c = r(173),
          u = r(7525),
          m = r(7147),
          f = r(1017),
          p = r(5687),
          g = r(9567),
          y = r(3986),
          h = r(9710),
          v = ['https://k-room.space', 'http://k-room.space'],
          b = { origin: v, optionsSuccessStatus: 200, preflightContinue: !0, credentials: !0 },
          _ = (0, a.default)()
        _.use((0, i.default)(b)),
          _.use(h()),
          _.use(y.json()),
          _.use(g('_method')),
          _.use(s.RouteNames.API, c.router),
          _.get(s.RouteNames.API, (e, t) => {
            t.send('Server running')
          })
        const w = l.ENV.IS_DEV
            ? {
                key: m.readFileSync(f.join(__dirname, 'dev-certs', 'k-room-dev-key.pem')),
                cert: m.readFileSync(f.join(__dirname, 'dev-certs', 'k-room-dev.pem'))
              }
            : {},
          S = p.createServer(w, _),
          M = l.ENV.SERVER_PORT
        S.listen(M, () => {
          console.log(u.clc.green.bgWhite(`-Server listening on port ${M}`))
        })
        const P = 'assets/img/'
        m.existsSync(f.join(__dirname, P)) ||
          m.mkdir(f.join(__dirname, P), (e) => {
            console.log(u.clc.red.bgWhite('-Cant create image directory'))
          }),
          (t.io = new n.Server(S, {
            path: s.RouteNames.SOCKET_PATH,
            maxHttpBufferSize: 1e6 * d.serverConstants.maxMbQuantityTransfer,
            cors: { origin: l.ENV.IS_DEV ? '*' : v }
          }))
      },
      708: function (e, t, r) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.db = void 0)
        const a = o(r(1185)),
          n = r(4784),
          s = r(3827),
          i = r(9953)
        ;(t.db = a.default.set('strictQuery', !0)),
          (async function () {
            try {
              await t.db.connect(n.ENV.MONGO_HOST),
                console.log(i.green.bgWhite('-Connected to DB')),
                (0, s.loadFixtures)()
            } catch (e) {
              console.log(i.red.bgWhite(e)), console.log(i.red.bgWhite('-init DB failed'))
            }
          })()
      },
      9344: function (e, t, r) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, o) {
                  void 0 === o && (o = r)
                  var a = Object.getOwnPropertyDescriptor(t, r)
                  ;(a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
                    (a = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      }
                    }),
                    Object.defineProperty(e, o, a)
                }
              : function (e, t, r, o) {
                  void 0 === o && (o = r), (e[o] = t[r])
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r)
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), a(r(708), t), a(r(7446), t), a(r(2769), t), a(r(1018), t)
      },
      1864: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getInfo = void 0)
        const o = {
          1: { id: '1', label: 'Welcome to K-Room', read: 'unread', content: '', contentComponent: r(2721).welcome }
        }
        t.getInfo = (e) => {
          const t = o[e]
          if (!t.contentComponent) return null
          const r = t.contentComponent()
          return { id: t.id, label: t.label, read: t.read, content: r }
        }
      },
      7446: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getInfo = void 0)
        var o = r(1864)
        Object.defineProperty(t, 'getInfo', {
          enumerable: !0,
          get: function () {
            return o.getInfo
          }
        })
      },
      2721: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.welcome = void 0)
        var o = r(700)
        Object.defineProperty(t, 'welcome', {
          enumerable: !0,
          get: function () {
            return o.welcome
          }
        })
      },
      700: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.welcome = void 0),
          (t.welcome = () =>
            '<div class="welcome">\n  <h1>Welcome to K-Room!</h1>\n  <p>We are excited to introduce you to the beta version of our web app, where you can seamlessly communicate with your friends and loved ones. Connect through private chats, exchange text messages, share photos, and engage in both regular and video calls.</p>\n  <p>Create your own group chats to bring together friends, colleagues, or family members, allowing for seamless communication and information exchange within the group.</p>\n  <p>Enjoy the ability to make high-quality video calls with your loved ones, no matter where they are located. Share life\'s brightest moments with friends by sending and receiving photos right within the chat.</p>\n  <p>As we continue to develop the website, expect even more features and improvements to enhance your experience.</p>\n</div>')
      },
      2769: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.updateTokens = t.jwt = void 0)
        const o = r(4784),
          a = r(4386),
          n = r(9348),
          s = r(7525),
          i = r(9953)
        t.jwt = r(6982)
        const d = (e, r, o, a, n) => {
          const s = ((e, r, o) => {
            const a = { id: e }
            return t.jwt.sign(a, r, { expiresIn: o })
          })(o, a, n)
          return e.cookie(r, s, { secure: !0 }), s
        }
        t.updateTokens = async (e, t) => {
          ;(o.ENV?.K_ROOM_ACCESS_TOKEN_SECRET && o.ENV?.K_ROOM_REFRESH_TOKEN_SECRET) ||
            (console.log(i.red.bgWhite('failed to load - K_ROOM_ACCESS_TOKEN_SECRET')),
            (0, s.throwError)(n.Status.Server, t, n.ServerNotificationMessage.CommonServerError)),
            d(t, 'jwt', e, o.ENV?.K_ROOM_ACCESS_TOKEN_SECRET, o.ENV.JWT_ACCESS_EXPIRES_INTERVAL)
          const r = d(t, 'refresh-jwt', e, o.ENV.K_ROOM_REFRESH_TOKEN_SECRET, o.ENV.JWTR_ACCESS_EXPIRES_INTERVAL)
          return (
            console.log(i.green.bgWhite('-Token pair updated')),
            await a.UserModel.updateOne({ _id: e }, { refreshToken: r })
          )
        }
      },
      1018: function (e, t, r) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.sendEmailCodePasswordRecovery = t.sendEmailConfirmationLink = void 0)
        const a = o(r(5184)),
          n = r(9348),
          s = r(4784),
          i = r(4386),
          d = r(7525),
          l = r(8231),
          c = a.default.createTransport({
            service: 'gmail',
            auth: { user: s.ENV.MAIL_APP, pass: s.ENV.K_ROOM_MAIL_PASS }
          }),
          u = async (e) => {
            const { to: t, subject: r, html: o } = e
            return await c.sendMail({ from: s.ENV.MAIL_APP, to: t, subject: r, html: o })
          }
        ;(t.sendEmailConfirmationLink = async (e) => {
          const t = await i.UserModel.findOneAndUpdate({ email: e }, { $inc: { confirmAttempts: -1 } }),
            r = {
              appName: s.ENV.APP_NAME,
              link: `${s.ENV.CLIENT_URL}${n.RouteNames.EMAIL_CONFIRM}?userId=${t?.id}`,
              host: `${s.ENV.CLIENT_URL}/sign-in`
            },
            o = (0, l.getAdditionalMailData)('confirmation', r)
          return (
            await u({ to: e, ...o }),
            t?.confirmAttempts && t.confirmAttempts >= 0
              ? { email: e, timeNextRequest: (0, d.getTimeNextRequest)(), attempts: t?.confirmAttempts }
              : null
          )
        }),
          (t.sendEmailCodePasswordRecovery = async (e, t) => {
            const r = { code: t },
              o = (0, l.getAdditionalMailData)('password-repair-sent-code', r)
            return await u({ to: e, ...o }), { message: 'code sended' }
          })
      },
      6293: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.confirmation = void 0)
        const o = r(8231)
        t.confirmation = (e) =>
          `\n<!DOCTYPE html>\n<html>\n<head>\n\n  <meta charset="utf-8">\n  <meta http-equiv="x-ua-compatible" content="ie=edge">\n  <title>Email Confirmation</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <style type="text/css">\n  /**\n   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.\n   */\n  @media screen {\n    @font-face {\n      font-family: 'Source Sans Pro';\n      font-style: normal;\n      font-weight: 400;\n      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');\n    }\n    @font-face {\n      font-family: 'Source Sans Pro';\n      font-style: normal;\n      font-weight: 700;\n      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');\n    }\n  }\n  /**\n   * Avoid browser level font resizing.\n   * 1. Windows Mobile\n   * 2. iOS / OSX\n   */\n  body,\n  table,\n  td,\n  a {\n    -ms-text-size-adjust: 100%; /* 1 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n  }\n  /**\n   * Remove extra space added to tables and cells in Outlook.\n   */\n  table,\n  td {\n    mso-table-rspace: 0pt;\n    mso-table-lspace: 0pt;\n  }\n  /**\n   * Better fluid images in Internet Explorer.\n   */\n  img {\n    -ms-interpolation-mode: bicubic;\n  }\n  /**\n   * Remove blue links for iOS devices.\n   */\n  a[x-apple-data-detectors] {\n    font-family: inherit !important;\n    font-size: inherit !important;\n    font-weight: inherit !important;\n    line-height: inherit !important;\n    color: inherit !important;\n    text-decoration: none !important;\n  }\n  /**\n   * Fix centering issues in Android 4.4.\n   */\n  div[style*="margin: 16px 0;"] {\n    margin: 0 !important;\n  }\n  body {\n    width: 100% !important;\n    height: 100% !important;\n    padding: 0 !important;\n    margin: 0 !important;\n  }\n  /**\n   * Collapse table borders to avoid space between cells.\n   */\n  table {\n    border-collapse: collapse !important;\n  }\n  a {\n    color: #418FDE;\n  }\n  img {\n    height: auto;\n    line-height: 100%;\n    text-decoration: none;\n    border: 0;\n    outline: none;\n  }\n  </style>\n\n</head>\n<body style="background-color: #e9ecef;">\n\n  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">\n    Email confirmation\n  </div>\n  <table border="0" cellpadding="0" cellspacing="0" width="100%">\n    <tr>\n      <td align="center" bgcolor="#e9ecef">\n        \x3c!--[if (gte mso 9)|(IE)]>\n        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n        <tr>\n        <td align="center" valign="top" width="600">\n        <![endif]--\x3e\n        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n          <tr>\n            <td align="center" align="top">\n              <svg height="210" width="500">\n                <polygon points="200,10 250,190 160,210" style="fill:lime;stroke:purple;stroke-width:1" />\n              </svg>\n            </td>\n          </tr>\n        </table>\n        \x3c!--[if (gte mso 9)|(IE)]>\n        </td>\n        </tr>\n        </table>\n        <![endif]--\x3e\n      </td>\n    </tr>\n\n    <tr>\n      <td align="center" bgcolor="#e9ecef">\n        \x3c!--[if (gte mso 9)|(IE)]>\n        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n        <tr>\n        <td align="center" valign="top" width="600">\n        <![endif]--\x3e\n        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin-top: 24px">\n          <tr>\n            <td align="left" bgcolor="#ffffff" style="padding: 2px 12px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">\n              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>\n            </td>\n          </tr>\n        </table>\n        \x3c!--[if (gte mso 9)|(IE)]>\n        </td>\n        </tr>\n        </table>\n        <![endif]--\x3e\n      </td>\n    </tr>\n    \x3c!-- end hero --\x3e\n\n    \x3c!-- start copy block --\x3e\n    <tr>\n      <td align="center" bgcolor="#e9ecef">\n        \x3c!--[if (gte mso 9)|(IE)]>\n        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n        <tr>\n        <td align="center" valign="top" width="600">\n        <![endif]--\x3e\n        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n\n          \x3c!-- start copy --\x3e\n          <tr>\n            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">\n              <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with ${o.commonPayload.appName}, you can safely delete this email.</p>\n            </td>\n          </tr>\n\n          <tr>\n            <td align="left" bgcolor="#ffffff">\n              <table border="0" cellpadding="0" cellspacing="0" width="100%">\n                <tr>\n                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">\n                    <table border="0" cellpadding="0" cellspacing="0">\n                      <tr>\n                        <td align="center" bgcolor="#418FDE" style="border-radius: 6px;">\n                          <a href=${e.link} target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Confirm email</a>\n                        </td>\n                      </tr>\n                    </table>\n                  </td>\n                </tr>\n              </table>\n            </td>\n          </tr>\n          \x3c!-- end button --\x3e\n\n          \x3c!-- start copy --\x3e\n          <tr>\n            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">\n              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>\n              <p style="margin: 0;"><a href=${e.link} target="_blank">${e.link}</a></p>\n            </td>\n          </tr>\n          \x3c!-- end copy --\x3e\n\n          \x3c!-- start copy --\x3e\n          <tr>\n            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">\n              <p style="margin: 0;">Cheers,<br>${o.commonPayload.appName}</p>\n            </td>\n          </tr>\n          \x3c!-- end copy --\x3e\n\n        </table>\n        \x3c!--[if (gte mso 9)|(IE)]>\n        </td>\n        </tr>\n        </table>\n        <![endif]--\x3e\n      </td>\n    </tr>\n    \x3c!-- end copy block --\x3e\n\n    \x3c!-- start footer --\x3e\n    <tr>\n      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">\n        \x3c!--[if (gte mso 9)|(IE)]>\n        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n        <tr>\n        <td align="center" valign="top" width="600">\n        <![endif]--\x3e\n        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n\n          \x3c!-- start permission --\x3e\n          <tr>\n            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">\n              <p style="margin: 0;">You received this email because we received a request for registration for your account. If you didn't request registration you can safely delete this email.</p>\n            </td>\n          </tr>\n          \x3c!-- end permission --\x3e\n\n        </table>\n        \x3c!--[if (gte mso 9)|(IE)]>\n        </td>\n        </tr>\n        </table>\n        <![endif]--\x3e\n      </td>\n    </tr>\n    \x3c!-- end footer --\x3e\n\n  </table>\n  \x3c!-- end body --\x3e\n\n</body>\n</html>\n`
      },
      8231: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getAdditionalMailData = t.commonPayload = void 0)
        const o = r(4784),
          a = r(6293),
          n = r(5783)
        ;(t.commonPayload = { appName: o.ENV.APP_NAME, host: `${o.ENV.CLIENT_URL}/sign-in` }),
          (t.getAdditionalMailData = (e, t) => {
            let r, o
            switch (e) {
              case 'confirmation':
                ;(r = 'Email confirmation'), (o = (0, a.confirmation)(t))
                break
              case 'password-repair-sent-code':
                ;(r = 'Password recovery'), (o = (0, n.passwordRepairSentCode)(t))
                break
              default:
                ;(r = ''), (o = '')
            }
            return { subject: r, html: o }
          })
      },
      5783: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.passwordRepairSentCode = void 0)
        const o = r(8231)
        t.passwordRepairSentCode = (e) =>
          `\n<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <meta http-equiv="x-ua-compatible" content="ie=edge">\n  <title>Password recovery</title>\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <style type="text/css">\n  /**\n   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.\n   */\n  @media screen {\n    @font-face {\n      font-family: 'Source Sans Pro';\n      font-style: normal;\n      font-weight: 400;\n      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');\n    }\n    @font-face {\n      font-family: 'Source Sans Pro';\n      font-style: normal;\n      font-weight: 700;\n      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');\n    }\n  }\n  /**\n   * Avoid browser level font resizing.\n   * 1. Windows Mobile\n   * 2. iOS / OSX\n   */\n  body,\n  table,\n  td,\n  a {\n    -ms-text-size-adjust: 100%; /* 1 */\n    -webkit-text-size-adjust: 100%; /* 2 */\n  }\n  /**\n   * Remove extra space added to tables and cells in Outlook.\n   */\n  table,\n  td {\n    mso-table-rspace: 0pt;\n    mso-table-lspace: 0pt;\n  }\n  /**\n   * Better fluid images in Internet Explorer.\n   */\n  img {\n    -ms-interpolation-mode: bicubic;\n  }\n  /**\n   * Remove blue links for iOS devices.\n   */\n  a[x-apple-data-detectors] {\n    font-family: inherit !important;\n    font-size: inherit !important;\n    font-weight: inherit !important;\n    line-height: inherit !important;\n    color: inherit !important;\n    text-decoration: none !important;\n  }\n  /**\n   * Fix centering issues in Android 4.4.\n   */\n  div[style*="margin: 16px 0;"] {\n    margin: 0 !important;\n  }\n  body {\n    width: 100% !important;\n    height: 100% !important;\n    padding: 0 !important;\n    margin: 0 !important;\n  }\n  /**\n   * Collapse table borders to avoid space between cells.\n   */\n  table {\n    border-collapse: collapse !important;\n  }\n  a {\n    color: #418FDE;\n  }\n  img {\n    height: auto;\n    line-height: 100%;\n    text-decoration: none;\n    border: 0;\n    outline: none;\n  }\n  </style>\n\n</head>\n<body style="background-color: #e9ecef;">\n\n  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">\n    Password recovery\n  </div>\n  <table border="0" cellpadding="0" cellspacing="0" width="100%">\n    <tr>\n      <td align="center" bgcolor="#e9ecef">\n        \x3c!--[if (gte mso 9)|(IE)]>\n        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n        <tr>\n        <td align="center" valign="top" width="600">\n        <![endif]--\x3e\n        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n          <tr>\n            <td align="center" align="top">\n              <svg height="210" width="500">\n                <polygon points="200,10 250,190 160,210" style="fill:lime;stroke:purple;stroke-width:1" />\n              </svg>\n            </td>\n          </tr>\n        </table>\n        \x3c!--[if (gte mso 9)|(IE)]>\n        </td>\n        </tr>\n        </table>\n        <![endif]--\x3e\n      </td>\n    </tr>\n\n    <tr>\n      <td align="center" bgcolor="#e9ecef">\n        \x3c!--[if (gte mso 9)|(IE)]>\n        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n        <tr>\n        <td align="center" valign="top" width="600">\n        <![endif]--\x3e\n        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin-top: 24px">\n          <tr>\n            <td align="left" bgcolor="#ffffff" style="padding: 2px 12px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">\n              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Password recovery</h1>\n            </td>\n          </tr>\n        </table>\n        \x3c!--[if (gte mso 9)|(IE)]>\n        </td>\n        </tr>\n        </table>\n        <![endif]--\x3e\n      </td>\n    </tr>\n    \x3c!-- end hero --\x3e\n\n    \x3c!-- start copy block --\x3e\n    <tr>\n      <td align="center" bgcolor="#e9ecef">\n        \x3c!--[if (gte mso 9)|(IE)]>\n        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n        <tr>\n        <td align="center" valign="top" width="600">\n        <![endif]--\x3e\n        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n\n          \x3c!-- start copy --\x3e\n          <tr>\n            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">\n              <p>Password recovery code: ${e.code}</p>\n            </td>\n          </tr>\n\n          \x3c!-- start copy --\x3e\n          <tr>\n            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">\n              <p style="margin: 0;">Cheers,<br>${o.commonPayload.appName}</p>\n            </td>\n          </tr>\n          \x3c!-- end copy --\x3e\n\n        </table>\n        \x3c!--[if (gte mso 9)|(IE)]>\n        </td>\n        </tr>\n        </table>\n        <![endif]--\x3e\n      </td>\n    </tr>\n    \x3c!-- end copy block --\x3e\n\n    \x3c!-- start footer --\x3e\n    <tr>\n      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">\n        \x3c!--[if (gte mso 9)|(IE)]>\n        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">\n        <tr>\n        <td align="center" valign="top" width="600">\n        <![endif]--\x3e\n        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\n\n          \x3c!-- start permission --\x3e\n          <tr>\n            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">\n              <p style="margin: 0;">You received this email because we received a request for password recovery. If you didn't request password recovery you can safely delete this email.</p>\n            </td>\n          </tr>\n          \x3c!-- end permission --\x3e\n\n        </table>\n        \x3c!--[if (gte mso 9)|(IE)]>\n        </td>\n        </tr>\n        </table>\n        <![endif]--\x3e\n      </td>\n    </tr>\n    \x3c!-- end footer --\x3e\n\n  </table>\n  \x3c!-- end body --\x3e\n\n</body>\n</html>\n`
      },
      195: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.emitCallsToUser = void 0)
        const o = r(4386),
          a = r(4506),
          n = r(7525)
        t.emitCallsToUser = async (e) => {
          const t = await o.UserModel.findOne({ _id: e })
          if (!t) return
          const r = (await o.CallModel.find({ interlocutors: { $in: [e] } })).map(
              async (t) => await (0, n.transformCallDataForUser)(e, t._id)
            ),
            s = (await Promise.all(r)).filter((e) => null !== e)
          a.io.to(t.socketId).emit('calls-updated', s)
        }
      },
      9681: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.emitContactsToUser = void 0)
        const o = r(4386),
          a = r(4506),
          n = r(7525),
          s = r(2817)
        t.emitContactsToUser = async (e) => {
          const t = await (0, s.getUserById)(e)
          if (!t || !t.contacts) return
          const r = Object.keys(t.contacts),
            i = await o.UserModel.find({ _id: { $in: r } }),
            d = (0, n.transformUsersToContacts)(i, t?.contacts)
          if (!t?.socketId) return
          const l = { contacts: d }
          a.io.to(t.socketId).emit('get-contacts', l)
        }
      },
      8154: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.emitRoomsByUserId = void 0)
        const o = r(4386),
          a = r(4506),
          n = r(7525),
          s = r(2817)
        t.emitRoomsByUserId = async (e) => {
          const t = await (0, s.getUserById)(e)
          if (!t?.socketId) return
          const r = await o.ChatRoomModel.find({ _id: { $in: t.chatRooms } }),
            i = await Promise.all(r.map(async (t) => await (0, n.transformRoomForUser)({ userId: e, room: t })))
          a.io.to(t.socketId).emit('get-rooms', i)
        }
      },
      9029: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.emitSearchedContacts = void 0)
        const o = r(4506)
        t.emitSearchedContacts = (e, t) => {
          o.io.to(e).emit('get-searched-contact', t)
        }
      },
      2482: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.emitUserStatusToAll = void 0)
        const o = r(4386),
          a = r(4506),
          n = r(2817)
        t.emitUserStatusToAll = async (e, t) => {
          const r = (await o.UserModel.find({ [`contacts.${e}`]: { $exists: !0 } })).map((e) => e.id),
            s = await (0, n.getSocketsByUserIds)(r),
            i = { interlocutorId: e, online: t, onlineStatusUpdatedTimestamp: Date.now() }
          s.forEach((e) => {
            a.io.to(e).emit('status-contact', i)
          })
        }
      },
      2056: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.emitSearchedContacts = t.emitUserStatusToAll = t.emitRoomsByUserId = t.emitContactsToUser = void 0)
        var o = r(9681)
        Object.defineProperty(t, 'emitContactsToUser', {
          enumerable: !0,
          get: function () {
            return o.emitContactsToUser
          }
        })
        var a = r(8154)
        Object.defineProperty(t, 'emitRoomsByUserId', {
          enumerable: !0,
          get: function () {
            return a.emitRoomsByUserId
          }
        })
        var n = r(2482)
        Object.defineProperty(t, 'emitUserStatusToAll', {
          enumerable: !0,
          get: function () {
            return n.emitUserStatusToAll
          }
        })
        var s = r(9029)
        Object.defineProperty(t, 'emitSearchedContacts', {
          enumerable: !0,
          get: function () {
            return s.emitSearchedContacts
          }
        })
      },
      5511: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getSocketsByUserIds = void 0)
        const o = r(4386)
        t.getSocketsByUserIds = async (e) => (await o.UserModel.find({ _id: { $in: e } })).map((e) => e.socketId)
      },
      7109: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getUserById = void 0)
        const o = r(4386)
        t.getUserById = async (e) => await o.UserModel.findOne({ _id: e })
      },
      7175: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getUserBySocketId = void 0)
        const o = r(4386)
        t.getUserBySocketId = async (e) => await o.UserModel.findOne({ socketId: e })
      },
      6652: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getUsersByHasContactId = void 0)
        const o = r(4386)
        t.getUsersByHasContactId = async (e) => await o.UserModel.find({ contacts: e })
      },
      2817: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getUsersByHasContactId = t.getUserBySocketId = t.getUserById = t.getSocketsByUserIds = void 0)
        var o = r(5511)
        Object.defineProperty(t, 'getSocketsByUserIds', {
          enumerable: !0,
          get: function () {
            return o.getSocketsByUserIds
          }
        })
        var a = r(7109)
        Object.defineProperty(t, 'getUserById', {
          enumerable: !0,
          get: function () {
            return a.getUserById
          }
        })
        var n = r(7175)
        Object.defineProperty(t, 'getUserBySocketId', {
          enumerable: !0,
          get: function () {
            return n.getUserBySocketId
          }
        })
        var s = r(6652)
        Object.defineProperty(t, 'getUsersByHasContactId', {
          enumerable: !0,
          get: function () {
            return s.getUsersByHasContactId
          }
        })
      },
      5384: function (e, t, r) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, o) {
                  void 0 === o && (o = r)
                  var a = Object.getOwnPropertyDescriptor(t, r)
                  ;(a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
                    (a = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      }
                    }),
                    Object.defineProperty(e, o, a)
                }
              : function (e, t, r, o) {
                  void 0 === o && (o = r), (e[o] = t[r])
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r)
            }
        Object.defineProperty(t, '__esModule', { value: !0 }), a(r(2056), t), a(r(2817), t), a(r(711), t)
      },
      3968: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.deleteContactById = void 0)
        const o = r(4386),
          a = r(4506)
        t.deleteContactById = async (e, r, n, s = !1) => {
          await o.UserModel.updateOne({ _id: e }, { $unset: { [`contacts.${r}`]: '' } })
          const i = { deletedContactId: r, silent: s }
          a.io.to(n).emit('contact-delete-success', i)
          const d = await o.UserModel.findOne({ _id: r }, { _id: 1, socketId: 1, [`contacts.${e}.interactionType`]: 1 })
          if (!d || !d.contacts?.[e]?.interactionType) return
          const l = d.contacts[e].interactionType
          if (
            (('invite-received' !== l && 'invite-hidden' !== l) ||
              (await (0, t.deleteContactById)(r, e, d.socketId, !0)),
            'invite-accepted' === l)
          ) {
            await o.UserModel.updateOne({ _id: r }, { $set: { [`contacts.${e}.interactionType`]: 'default' } })
            const t = { contactId: e, interactionType: 'default' }
            a.io.to(d.socketId).emit('contact-interaction-type-updated', t)
          }
        }
      },
      711: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.deleteContactById =
            t.setMessage =
            t.setRoomToUsers =
            t.setMessageStatus =
            t.setLastSeenData =
            t.setUserStatus =
            t.setSocketId =
              void 0)
        var o = r(9742)
        Object.defineProperty(t, 'setSocketId', {
          enumerable: !0,
          get: function () {
            return o.setSocketId
          }
        })
        var a = r(5859)
        Object.defineProperty(t, 'setUserStatus', {
          enumerable: !0,
          get: function () {
            return a.setUserStatus
          }
        })
        var n = r(264)
        Object.defineProperty(t, 'setLastSeenData', {
          enumerable: !0,
          get: function () {
            return n.setLastSeenData
          }
        })
        var s = r(7056)
        Object.defineProperty(t, 'setMessageStatus', {
          enumerable: !0,
          get: function () {
            return s.setMessageStatus
          }
        })
        var i = r(9718)
        Object.defineProperty(t, 'setRoomToUsers', {
          enumerable: !0,
          get: function () {
            return i.setRoomToUsers
          }
        })
        var d = r(6991)
        Object.defineProperty(t, 'setMessage', {
          enumerable: !0,
          get: function () {
            return d.setMessage
          }
        })
        var l = r(3968)
        Object.defineProperty(t, 'deleteContactById', {
          enumerable: !0,
          get: function () {
            return l.deleteContactById
          }
        })
      },
      264: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.setLastSeenData = void 0)
        const o = r(4386),
          a = r(2056)
        t.setLastSeenData = async (e) => {
          await o.UserModel.updateOne({ _id: e }, { $set: { lastSeen: Date.now() } }), (0, a.emitUserStatusToAll)(e, !1)
        }
      },
      7056: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.setMessageStatus = void 0)
        const o = r(4386),
          a = r(4506),
          n = r(2817)
        t.setMessageStatus = async (e, t, r, s) => {
          if (!(await (0, n.getUserById)(r))) return
          if (
            !(await o.MessageModel.findOneAndUpdate(
              { _id: e, 'usersMetaData.id': r },
              { $set: { 'usersMetaData.$.status': t } }
            ))
          )
            return
          const i = await o.ChatRoomModel.findOne({ _id: s })
          if (!i) return
          const d = await (0, n.getSocketsByUserIds)(i?.users),
            l = { roomId: s, messageId: e, status: t }
          d.forEach((e) => {
            a.io.to(e).emit('update-message-status', l)
          })
        }
      },
      6991: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.setMessage = void 0)
        const o = r(4386),
          a = r(4506),
          n = r(7525),
          s = r(2817)
        t.setMessage = async ({ roomId: e, message: t }) => {
          let r = []
          if (t.images) {
            const e = t.imageCompression ? 'common-compressed' : 'common-uncompressed',
              o = t.images?.map(async (r) => await (0, n.saveImageAndGetPath)(r.fileBuffer, e, t.authorId)),
              a = await Promise.all(o)
            r = a.map((e) => ({ src: e, name: e.split('img=')[1] }))
          }
          const i = await o.ChatRoomModel.findOne({ _id: e }),
            d = { reactions: [], ...t, images: r, usersMetaData: [] },
            l = await new o.MessageModel(d).save()
          await o.ChatRoomModel.updateOne({ _id: e }, { $push: { messages: l.id } }),
            i?.users.forEach(async (n) => {
              await o.MessageModel.updateOne(
                { _id: l.id },
                { $push: { usersMetaData: { id: n, status: 'delivered' } } }
              )
              const i = await (0, s.getUserById)(n)
              if (!i?.socketId) return
              const d = { ...t, images: r, id: String(l._id), isSelf: i?.id === t.authorId, status: 'delivered' },
                c = { roomId: e, message: d }
              a.io.to(i?.socketId).emit('message-delivered', c)
            })
        }
      },
      9718: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.setRoomToUsers = void 0)
        const o = r(4386)
        t.setRoomToUsers = async (e, t) =>
          await Promise.all(
            t.map(async (t) => {
              await o.UserModel.updateOne({ _id: t }, { $push: { chatRooms: e } })
            })
          )
      },
      9742: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.setSocketId = void 0)
        const o = r(4386)
        t.setSocketId = async (e, t) => await o.UserModel.updateOne({ _id: e }, { $set: { socketId: t } })
      },
      5859: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.setUserStatus = void 0)
        const o = r(4386),
          a = r(2056)
        t.setUserStatus = async (e, t) => {
          await o.UserModel.updateOne({ _id: e }, { $set: { online: t } }), (0, a.emitUserStatusToAll)(e, !0)
        }
      },
      8679: function (e, t, r) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, o) {
                  void 0 === o && (o = r)
                  var a = Object.getOwnPropertyDescriptor(t, r)
                  ;(a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
                    (a = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      }
                    }),
                    Object.defineProperty(e, o, a)
                }
              : function (e, t, r, o) {
                  void 0 === o && (o = r), (e[o] = t[r])
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r)
            }
        Object.defineProperty(t, '__esModule', { value: !0 })
        const n = r(4506),
          s = r(1763),
          i = r(2769),
          d = r(4784),
          l = r(7525)
        a(r(5384), t), a(r(1763), t)
        const c = (e) => {
          e.emit('auth-error'), e.disconnect()
        }
        try {
          n.io.on('connection', async (e) => {
            await (async (e) => {
              const { token: t } = e.handshake.auth
              if (!t) return c(e)
              i.jwt.verify(t, d.ENV?.K_ROOM_ACCESS_TOKEN_SECRET, (t, r) => {
                if (t) return c(e)
                e.data = { userId: r.id }
              })
            })(e),
              Object.values(s.slices).forEach((t) => t(e))
          })
        } catch (e) {
          console.log(l.clc.red.bgWhite(`-${e}`))
        }
      },
      3622: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.callSlice = void 0)
        const o = r(4386),
          a = r(4506),
          n = r(7525),
          s = r(5384)
        t.callSlice = (e) => {
          e.on('mark-call-as-video', (e) => {
            o.CallModel.updateOne({ _id: e.callId }, { video: !0 })
          }),
            e.on('call-user', async ({ signal: t, userToCall: r, from: i, avatar: d, callerName: l }) => {
              if (!r) return
              const c = await (0, s.getUserById)(r)
              if (!c) return
              const u = { signal: t, from: i, avatar: d, callerName: l }
              a.io.to(c?.socketId).emit('call-user', u)
              const m = [r, i],
                f = new o.CallModel({ calledAt: new Date(), authorId: i, interlocutors: m, answered: !1 })
              await f.save(),
                (0, n.emitCallDataToInterlocutors)(m, f.id, !0),
                e.on('update-call-signal', (e) => {
                  a.io.to(c?.socketId).emit('interlocutor-update-signal', e)
                })
            }),
            e.on('answer-call', async ({ to: e, signal: t, selfSocketId: r, callId: i }) => {
              const d = await (0, s.getUserById)(e)
              if (!d) return
              const l = { signal: t }
              a.io.to(d?.socketId).emit('call-accepted', l)
              const c = await o.CallModel.findOneAndUpdate(
                { _id: i },
                { startedAt: new Date(), answered: !0 },
                { new: !0 }
              )
              c &&
                ((0, n.emitCallDataToInterlocutors)(c?.interlocutors, c._id),
                [d.socketId, r].forEach((e) => {
                  const t = Date.now()
                  a.io.to(e).emit('call-started-at', t)
                }))
            }),
            e.on('call-ended', async ({ callerId: e, callId: t }) => {
              const r = await (0, s.getUserById)(e)
              if (!r) return
              a.io.to(r?.socketId).emit('call-ended')
              const i = await o.CallModel.findOneAndUpdate({ _id: t }, { finishedAt: new Date() })
              i && (0, n.emitCallDataToInterlocutors)(i?.interlocutors, i._id)
            })
        }
      },
      3545: function (e, t, r) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.chatRoomSlice = void 0)
        const a = o(r(7147)),
          n = r(4386),
          s = r(4506),
          i = r(7525),
          d = r(5384)
        t.chatRoomSlice = (e) => {
          const { userId: t } = e.data
          e.on('create-room', async ({ users: e, multiple: r, avatarFile: o, chatName: a = '' }) => {
            let l = ''
            o && (l = await (0, i.saveImageAndGetPath)(o.buffer, 'avatar', t))
            const c = new n.ChatRoomModel({
                avatar: l,
                multiple: r,
                chatName: a,
                users: e,
                authorId: t,
                messages: []
              }),
              u = await c.save()
            await (0, d.setRoomToUsers)(u.id, e),
              await Promise.all(e.map(async (e) => await (0, d.emitRoomsByUserId)(e)))
            const m = await (0, d.getUserById)(t)
            m?.socketId && s.io.to(m.socketId).emit('room-created', { roomId: u.id })
          }),
            e.on('user-typing', async ({ authorName: e, usersTo: r, status: o }) => {
              const a = r.map((e) => e.id)
              ;(await (0, d.getSocketsByUserIds)(a)).forEach((r) => {
                const a = { authorData: { authorName: e, authorId: t }, status: o }
                s.io.to(r).emit('get-user-typing-status', a)
              })
            }),
            e.on('update-chat-room', async ({ roomId: e, chatName: r, avatar: o, avatarFile: l }) => {
              a.default.existsSync(o ?? '') && a.default.unlinkSync((0, i.getPathToImg)(o))
              const c = await (0, i.saveImageAndGetPath)(l?.buffer, 'avatar', t),
                u = await n.ChatRoomModel.findOneAndUpdate({ _id: e }, { avatar: c, chatName: r })
              if (!u) return
              await Promise.all(u.users.map(async (e) => await (0, d.emitRoomsByUserId)(e)))
              const m = await (0, d.getUserById)(u.authorId)
              m?.socketId && s.io.to(m?.socketId).emit('room-data-updated')
            })
        }
      },
      9176: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.commonSlice = void 0)
        const o = r(4386),
          a = r(4506),
          n = r(5384),
          s = r(195)
        t.commonSlice = (e) => {
          const { userId: t } = e.data
          e.on('initialize', async () => {
            a.io.to(e.id).emit('connection'),
              await (0, n.setSocketId)(t, e.id),
              await (0, n.emitContactsToUser)(t),
              await (0, n.emitRoomsByUserId)(t),
              await (0, s.emitCallsToUser)(t),
              await (0, n.setUserStatus)(t, !0)
          }),
            e.on('disconnect', async () => {
              await (0, n.setUserStatus)(t, !1), (0, n.setLastSeenData)(t)
            }),
            e.on('update-user-settings', async ({ type: e, value: r }) => {
              const a = {}
              ;(a['settings.' + e] = r), await o.UserModel.findOneAndUpdate({ _id: t }, a, { new: !0 })
            })
        }
      },
      5016: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.contactsSlice = void 0)
        const o = r(4386),
          a = r(7525),
          n = r(5384),
          s = r(4506),
          i = r(1185).Types.ObjectId
        t.contactsSlice = (e) => {
          const { userId: t } = e.data
          e.on('search-contact', async ({ value: t }) => {
            let r = 'name',
              s = !0
            t.includes('#') && ((t = t.substring(1)), i.isValid(t) ? (r = 'id') : (s = !1)),
              t.includes('@') && ((r = 'email'), (t = t.split('@')[0])),
              t || (s = !1)
            const d = new RegExp(t, 'i'),
              l = { name: { username: { $regex: d } }, email: { email: { $regex: d } }, id: { _id: t } }[r]
            l || (s = !1)
            let c = []
            if (s) {
              const e = await o.UserModel.find(l)
              c = (0, a.transformUsersData)(e)
            }
            ;(0, n.emitSearchedContacts)(e.id, c)
          }),
            e.on('save-contact', async ({ interlocutorId: r }) => {
              const n = await o.UserModel.findOneAndUpdate(
                  { _id: t },
                  { $set: { [`contacts.${r}`]: { id: r, interactionType: 'default' } } },
                  { new: !0 }
                ),
                i = await o.UserModel.findOne({ _id: r })
              if (n && i) {
                const t = n.contacts[r]
                if (t) {
                  const r = { contactData: (0, a.transformUserToContact)(i, t) }
                  s.io.to(e.id).emit('contact-add-success', r)
                }
              }
            }),
            e.on('delete-contact', async ({ deletingUserId: r }) => {
              await (0, n.deleteContactById)(t, r, e.id)
            }),
            e.on('interlocutor-ping', async () => {
              await (0, n.setUserStatus)(t, !0)
            }),
            e.on('update-contact-interaction-type', async ({ contactId: r, interactionType: a }) => {
              const i = async () =>
                  await o.UserModel.findOneAndUpdate(
                    { _id: t, [`contacts.${r}`]: { $exists: !0 } },
                    { $set: { [`contacts.${r}.interactionType`]: a } }
                  ),
                d = async () => {
                  const e = await o.UserModel.findOneAndUpdate(
                    { _id: r, [`contacts.${t}`]: { $exists: !0 } },
                    { $set: { [`contacts.${t}.interactionType`]: a } }
                  )
                  if (e) {
                    const r = { contactId: t, interactionType: a }
                    s.io.to(e.socketId).emit('contact-interaction-type-updated', r)
                  }
                }
              if (('default' === a && (await (0, n.deleteContactById)(t, r, e.id), await d()), 'invited' === a)) {
                const e = await o.UserModel.findOneAndUpdate(
                    { _id: r },
                    { $set: { [`contacts.${t}`]: { id: t, interactionType: 'invite-received' } } }
                  ),
                  a = await i()
                if (e && a) {
                  const { id: t, username: r, email: o, online: n, avatar: i, lastSeen: d } = a,
                    l = {
                      contactData: {
                        id: t,
                        username: r,
                        email: o,
                        online: n,
                        avatar: i,
                        lastSeen: d,
                        interactionType: 'invite-received'
                      }
                    }
                  s.io.to(e.socketId).emit('invite-received', l)
                }
              }
              'invite-accepted' === a && (await i(), await d())
              const l = { contactId: r, interactionType: a }
              s.io.to(e.id).emit('contact-interaction-type-updated', l)
            })
        }
      },
      1763: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.slices = void 0)
        const o = r(5016),
          a = r(9176),
          n = r(3545),
          s = r(6349),
          i = r(3622)
        t.slices = {
          contactsSlice: o.contactsSlice,
          commonSlice: a.commonSlice,
          chatRoomSlice: n.chatRoomSlice,
          messageSlice: s.messageSlice,
          callSlice: i.callSlice
        }
      },
      6349: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.messageSlice = void 0)
        const o = r(4386),
          a = r(4506),
          n = r(5384)
        t.messageSlice = (e) => {
          const { userId: t } = e.data
          e.on('send-message', async ({ roomId: e, message: t }) => {
            try {
              await (0, n.setMessage)({ roomId: e, message: t })
            } catch (e) {
              console.log(e, 'y')
            }
          }),
            e.on('change-message-status', async ({ messageId: e, status: r, roomId: o }) => {
              await (0, n.setMessageStatus)(e, r, t, o)
            }),
            e.on('delete-message', async ({ messageId: e, roomId: t }) => {
              await o.MessageModel.findByIdAndDelete({ _id: e })
              const r = await o.ChatRoomModel.findOneAndUpdate({ _id: t }, { $pull: { messages: e } })
              if (!r) return
              const s = await (0, n.getSocketsByUserIds)(r.users),
                i = { messageId: e, roomId: t }
              s.forEach((e) => {
                a.io.to(e).emit('message-deleted', i)
              })
            }),
            e.on('add-reaction', async ({ glyphKey: e, messageId: r, roomId: s, username: i }) => {
              const d = { glyphKey: e, authorId: t, username: i }
              try {
                await o.MessageModel.updateOne({ _id: r }, { $push: { reactions: d } })
                const e = await o.ChatRoomModel.findOne({ _id: s })
                if (!e) return
                const t = await (0, n.getSocketsByUserIds)(e.users),
                  i = { roomId: s, messageId: r, reaction: d }
                t.forEach((e) => {
                  a.io.to(e).emit('update-message-reactions', i)
                })
              } catch (e) {
                console.log(e)
              }
            })
        }
      },
      1251: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.clc = void 0), (t.clc = r(9953))
      },
      5749: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.emitCallDataToInterlocutors = void 0)
        const o = r(4386),
          a = r(4506),
          n = r(1376)
        t.emitCallDataToInterlocutors = (e, t, r) => {
          e.forEach(async (e) => {
            const s = await (0, n.transformCallDataForUser)(e, t)
            if (!s) return null
            const i = await o.UserModel.findOne({ _id: e })
            if (!i) return
            const d = { ...s, setId: r }
            a.io.to(i.socketId).emit('call-updated', d)
          })
        }
      },
      3798: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.firstCharUpperCase = void 0),
          (t.firstCharUpperCase = (e) => e.charAt(0).toUpperCase() + e.slice(1))
      },
      1760: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getInterlocutor = void 0),
          (t.getInterlocutor = (e, t) => e.filter((e) => e.id !== t)[0])
      },
      1482: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getNextTimeCodeRequest = void 0),
          (t.getNextTimeCodeRequest = (e) => {
            const t = new Date()
            return t.setSeconds(t.getSeconds() + Number(e))
          })
      },
      3099: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getTimeNextRequest = void 0)
        const o = r(4784)
        t.getTimeNextRequest = () =>
          Number(new Date(Date.now() + 6e4 * Number(o.ENV?.REGISTRATION_RESEND_INTERVAL_MINUTES)))
      },
      3685: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getPathToImg = void 0)
        const o = r(4784),
          a = r(7147)
        t.getPathToImg = (e) => {
          if (!e) return ''
          const t = `${o.ENV.SERVER_ASSETS_PATH}static/${e}`
          return a.existsSync(t) ? t : `${o.ENV.SERVER_ASSETS_PATH}img/${e}`
        }
      },
      9651: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.getRequestStringToImg = void 0)
        const o = r(4784),
          a = r(9348)
        t.getRequestStringToImg = (e) => `${o.ENV.SERVER_URL}${a.CommonEndpoints.CommonImages}?img=${e}`
      },
      7525: function (e, t, r) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, o) {
                  void 0 === o && (o = r)
                  var a = Object.getOwnPropertyDescriptor(t, r)
                  ;(a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
                    (a = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      }
                    }),
                    Object.defineProperty(e, o, a)
                }
              : function (e, t, r, o) {
                  void 0 === o && (o = r), (e[o] = t[r])
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r)
            }
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.clc =
            t.removeKeys =
            t.parseTimeToMs =
            t.getPathToImg =
            t.transformUsersData =
            t.transformUserData =
            t.throwError =
            t.throwErrorViaSocket =
            t.saveImageAndGetPath =
            t.notAccuratePinRandomGenerator =
            t.getRequestStringToImg =
            t.getTimeNextRequest =
            t.getNextTimeCodeRequest =
            t.getInterlocutor =
            t.firstCharUpperCase =
            t.emitCallDataToInterlocutors =
              void 0),
          a(r(1376), t)
        var n = r(5749)
        Object.defineProperty(t, 'emitCallDataToInterlocutors', {
          enumerable: !0,
          get: function () {
            return n.emitCallDataToInterlocutors
          }
        })
        var s = r(3798)
        Object.defineProperty(t, 'firstCharUpperCase', {
          enumerable: !0,
          get: function () {
            return s.firstCharUpperCase
          }
        })
        var i = r(1760)
        Object.defineProperty(t, 'getInterlocutor', {
          enumerable: !0,
          get: function () {
            return i.getInterlocutor
          }
        })
        var d = r(1482)
        Object.defineProperty(t, 'getNextTimeCodeRequest', {
          enumerable: !0,
          get: function () {
            return d.getNextTimeCodeRequest
          }
        })
        var l = r(3099)
        Object.defineProperty(t, 'getTimeNextRequest', {
          enumerable: !0,
          get: function () {
            return l.getTimeNextRequest
          }
        })
        var c = r(9651)
        Object.defineProperty(t, 'getRequestStringToImg', {
          enumerable: !0,
          get: function () {
            return c.getRequestStringToImg
          }
        })
        var u = r(6199)
        Object.defineProperty(t, 'notAccuratePinRandomGenerator', {
          enumerable: !0,
          get: function () {
            return u.notAccuratePinRandomGenerator
          }
        })
        var m = r(6470)
        Object.defineProperty(t, 'saveImageAndGetPath', {
          enumerable: !0,
          get: function () {
            return m.saveImageAndGetPath
          }
        })
        var f = r(9670)
        Object.defineProperty(t, 'throwErrorViaSocket', {
          enumerable: !0,
          get: function () {
            return f.throwErrorViaSocket
          }
        })
        var p = r(1319)
        Object.defineProperty(t, 'throwError', {
          enumerable: !0,
          get: function () {
            return p.throwError
          }
        })
        var g = r(3129)
        Object.defineProperty(t, 'transformUserData', {
          enumerable: !0,
          get: function () {
            return g.transformUserData
          }
        }),
          Object.defineProperty(t, 'transformUsersData', {
            enumerable: !0,
            get: function () {
              return g.transformUsersData
            }
          })
        var y = r(3685)
        Object.defineProperty(t, 'getPathToImg', {
          enumerable: !0,
          get: function () {
            return y.getPathToImg
          }
        })
        var h = r(7271)
        Object.defineProperty(t, 'parseTimeToMs', {
          enumerable: !0,
          get: function () {
            return h.parseTimeToMs
          }
        })
        var v = r(5175)
        Object.defineProperty(t, 'removeKeys', {
          enumerable: !0,
          get: function () {
            return v.removeKeys
          }
        })
        var b = r(1251)
        Object.defineProperty(t, 'clc', {
          enumerable: !0,
          get: function () {
            return b.clc
          }
        })
      },
      6199: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.notAccuratePinRandomGenerator = void 0),
          (t.notAccuratePinRandomGenerator = () => Math.floor(9e3 * Math.random() + 1e3))
      },
      7271: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.parseTimeToMs = void 0),
          (t.parseTimeToMs = (e) => {
            const t = e.match(/^(\d+)([smhd])$/)
            if (!t) throw new Error(`Invalid time format: ${e}`)
            return parseInt(t[1], 10) * { s: 1e3, m: 6e4, h: 36e5, d: 864e5 }[t[2]]
          })
      },
      5175: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.removeKeys = void 0),
          (t.removeKeys = (e, t) => Object.fromEntries(Object.entries(e).filter(([e]) => !t.includes(e))))
      },
      6470: function (e, t, r) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.saveImageAndGetPath = void 0)
        const a = o(r(7441)),
          n = r(5828),
          s = r(3685),
          i = r(9651),
          d = r(9670),
          l = r(5607)
        t.saveImageAndGetPath = async (e, t = 'common-uncompressed', r) => {
          if (!e) return ''
          const o = `${(0, n.v4)()}.jpg`,
            { dimensions: c, quality: u } = l.serverConstants.sharp[`${t}`],
            m = (0, s.getPathToImg)(o)
          try {
            await (0, a.default)(e).resize(c.x, c.y).jpeg({ quality: u }).toFile(`${m}`)
          } catch {
            return await (0, d.throwErrorViaSocket)(r), ''
          }
          return e ? (0, i.getRequestStringToImg)(o) : ''
        }
      },
      9670: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.throwErrorViaSocket = void 0)
        const o = r(4506),
          a = r(8679),
          n = r(9348)
        t.throwErrorViaSocket = async (e) => {
          const t = await (0, a.getUserById)(e),
            r = { message: n.ServerNotificationMessage.ImageConverterError }
          t?.socketId && o.io.to(t?.socketId).emit('error-message', r)
        }
      },
      1319: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.throwError = void 0)
        const o = r(1251)
        t.throwError = (e, t, r, a = !1) => {
          console.log(o.clc.red.bgWhite(`-${r}`))
          const n = { message: r, status: e, data: null, silent: a }
          return t.status(e).json(n)
        }
      },
      1376: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.transformUserToContact =
            t.transformUsersToContacts =
            t.transformRoomForUser =
            t.transformMessageForUsers =
            t.transformCallDataForUser =
              void 0)
        var o = r(8329)
        Object.defineProperty(t, 'transformCallDataForUser', {
          enumerable: !0,
          get: function () {
            return o.transformCallDataForUser
          }
        })
        var a = r(7595)
        Object.defineProperty(t, 'transformMessageForUsers', {
          enumerable: !0,
          get: function () {
            return a.transformMessageForUsers
          }
        })
        var n = r(5196)
        Object.defineProperty(t, 'transformRoomForUser', {
          enumerable: !0,
          get: function () {
            return n.transformRoomForUser
          }
        })
        var s = r(7923)
        Object.defineProperty(t, 'transformUsersToContacts', {
          enumerable: !0,
          get: function () {
            return s.transformUsersToContacts
          }
        })
        var i = r(492)
        Object.defineProperty(t, 'transformUserToContact', {
          enumerable: !0,
          get: function () {
            return i.transformUserToContact
          }
        })
      },
      8329: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.transformCallDataForUser = void 0)
        const o = r(4386),
          a = r(8679)
        t.transformCallDataForUser = async (e, t) => {
          const r = await o.CallModel.findOne({ _id: t })
          if (!r) return null
          const n = await (0, a.getUserById)(r.authorId)
          if (!n) return null
          const s = r.interlocutors.filter((t) => t !== e)[0],
            i = await (0, a.getUserById)(s)
          if (!i) return null
          const d = e !== n?.id,
            l = ((e, t) => {
              let r
              return (r = e ? (t ? 'incoming' : 'outgoing') : t ? 'missed' : 'no-answered'), r
            })(r.answered, d),
            { calledAt: c, startedAt: u, finishedAt: m, authorId: f, video: p } = r
          return {
            id: r._id,
            calledAt: c,
            startedAt: u,
            finishedAt: m,
            authorId: f,
            video: p,
            type: l,
            interlocutorId: s,
            authorName: n.username,
            interlocutorName: i.username,
            interlocutorAvatarPath: i.avatar
          }
        }
      },
      7595: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.transformMessageForUsers = void 0),
          (t.transformMessageForUsers = (e, t) => {
            const {
                _id: r,
                authorId: o,
                authorName: a,
                body: n,
                createdAt: s,
                usersMetaData: i,
                reactions: d,
                images: l,
                repliedMessage: c
              } = e,
              u = o === t,
              m = i.some((e) => 'read' === e.status),
              f = u && m ? 'read' : i.find((e) => e.id === t)?.status
            return {
              id: String(r),
              authorId: o,
              authorName: a,
              body: n,
              createdAt: s,
              reactions: d,
              images: l,
              status: f,
              isSelf: u,
              repliedMessage: c
            }
          })
      },
      5196: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.transformRoomForUser = void 0)
        const o = r(5607),
          a = r(4386),
          n = r(8679),
          s = r(7595)
        t.transformRoomForUser = async ({ userId: e, room: t }) => {
          let { chatName: r, users: i, avatar: d, multiple: l, authorId: c, _id: u, messages: m } = t,
            f = !1
          if (!l) {
            const t = i?.find((t) => t !== e) ?? '',
              o = await (0, n.getUserById)(t)
            ;(r = o?.username ?? o?.id), (d = o?.avatar), (f = Boolean(o?.online))
          }
          i?.splice(i?.indexOf(e), 1)
          const p = (await a.UserModel.find({ _id: { $in: i } })).map((e) => ({
            id: e.id,
            username: e.username,
            avatar: e.avatar
          }))
          if (m.length < 1) {
            const r = {}
            for (const e of o.serverConstants.messages.system) r[e.name] = e.id
            const n = t.authorId === e
            let s = n ? r['author-created-chat'] : r['invite-message']
            l && (s = n ? r['author-created-group-chat'] : r['invite-group-chat'])
            const i = n ? 'none' : 'delivered'
            await a.MessageModel.updateOne({ _id: s }, { $set: { usersMetaData: { id: e, status: i } } }), m?.push(s)
          }
          const g = (await a.MessageModel.find({ _id: { $in: m } })).map((t) => (0, s.transformMessageForUsers)(t, e))
          return {
            id: String(u),
            authorId: c,
            chatName: r,
            avatar: d,
            hasOnline: f,
            users: p,
            messages: g,
            multiple: l
          }
        }
      },
      492: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.transformUserToContact = void 0),
          (t.transformUserToContact = (e, t) => ({
            id: e.id,
            username: e.username,
            email: e.email,
            online: e.online,
            avatar: e.avatar ?? '',
            lastSeen: e.lastSeen ?? '',
            interactionType: t?.interactionType ?? 'default'
          }))
      },
      7923: (e, t, r) => {
        Object.defineProperty(t, '__esModule', { value: !0 }), (t.transformUsersToContacts = void 0)
        const o = r(492)
        t.transformUsersToContacts = (e, t) => e.map((e) => (0, o.transformUserToContact)(e, t[e.id]))
      },
      3129: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.transformUsersData = t.transformUserData = void 0),
          (t.transformUserData = (e) => ({
            id: e._id,
            role: e.role,
            username: e.username,
            avatar: e.avatar,
            email: e.email,
            online: e.online ?? !1,
            chatRooms: e.chatRooms ?? []
          })),
          (t.transformUsersData = (e) => e.map((e) => (0, t.transformUserData)(e)))
      },
      7195: function (e, t, r) {
        var o,
          a,
          n,
          s,
          i,
          d,
          l,
          c =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, o) {
                  void 0 === o && (o = r)
                  var a = Object.getOwnPropertyDescriptor(t, r)
                  ;(a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
                    (a = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      }
                    }),
                    Object.defineProperty(e, o, a)
                }
              : function (e, t, r, o) {
                  void 0 === o && (o = r), (e[o] = t[r])
                }),
          u =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || c(t, e, r)
            }
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.AdminEndpoints =
            t.CodesEndpoints =
            t.CommonEndpoints =
            t.UserEndpoints =
            t.AuthEndpoints =
            t.Status =
            t.RouteNames =
              void 0),
          u(r(5379), t),
          ((l = t.RouteNames || (t.RouteNames = {})).SIGN_IN = '/sign-in'),
          (l.SIGN_UP = '/sign-up'),
          (l.WAIT_EMAIL_CONFIRM = '/wait-email-confirm'),
          (l.EMAIL_CONFIRM = '/confirm-email'),
          (l.MAIN = '/app'),
          (l.NOT_FOUND = '/not-found'),
          (l.PASSWORD_RECOVERY = '/password-recovery'),
          (l.CREATE_NEW_PASSWORD = '/create-new-password'),
          (l.NOTIFICATION = '/notification'),
          (l.PRIVACY_POLICY = '/privacy-policy/'),
          (l.ADMIN_PANEL = '/admin-panel/'),
          (l.SOCKET_PATH = '/app-socket/'),
          (l.API = '/api/'),
          ((d = t.Status || (t.Status = {}))[(d.Success = 200)] = 'Success'),
          (d[(d.BadRequest = 400)] = 'BadRequest'),
          (d[(d.NotAuth = 401)] = 'NotAuth'),
          (d[(d.Forbidden = 403)] = 'Forbidden'),
          (d[(d.NotFound = 404)] = 'NotFound'),
          (d[(d.Server = 500)] = 'Server'),
          (d[(d.Unreachable = 503)] = 'Unreachable'),
          (d[(d.BadGateway = 504)] = 'BadGateway'),
          ((i = t.AuthEndpoints || (t.AuthEndpoints = {})).Registration = '/auth/registration'),
          (i.SendEmailConfirmationLink = '/auth/send-email-confirmation-link'),
          (i.ConfirmEmail = '/auth/send-email-confirmation'),
          (i.Login = '/auth/login'),
          (i.GoogleLogin = '/auth/google-login'),
          (i.ProviderLogin = '/auth/provider-login'),
          (i.Logout = '/auth/logout'),
          (i.UpdateTokensPair = '/auth/update-tokens-pair'),
          ((s = t.UserEndpoints || (t.UserEndpoints = {})).GetUserData = '/auth/get-user-data'),
          (s.UpdateUserData = '/auth/user-data/update'),
          (s.ResetPassword = '/user/reset-password'),
          ((n = t.CommonEndpoints || (t.CommonEndpoints = {})).CommonImages = '/common-images'),
          (n.GetInfo = '/notification'),
          ((a = t.CodesEndpoints || (t.CodesEndpoints = {})).SendEmailCodePasswordRecovery =
            '/codes/email/password-recovery'),
          (a.ValidateEmailCodePasswordRecovery = '/codes/email/validate-email-code-password-recovery'),
          ((o = t.AdminEndpoints || (t.AdminEndpoints = {})).GetAppData = '/admin/get-app-data'),
          (o.DBClear = '/admin/db-reset'),
          (o.ApplyFixtures = '/admin/apply-fixtures'),
          (o.DeleteUser = '/admin/delete-user'),
          (o.UpdateUserData = '/admin/update-user-data')
      },
      4984: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      2489: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      5712: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      4152: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      2075: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      9940: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      5379: function (e, t, r) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, o) {
                  void 0 === o && (o = r)
                  var a = Object.getOwnPropertyDescriptor(t, r)
                  ;(a && !('get' in a ? !t.__esModule : a.writable || a.configurable)) ||
                    (a = {
                      enumerable: !0,
                      get: function () {
                        return t[r]
                      }
                    }),
                    Object.defineProperty(e, o, a)
                }
              : function (e, t, r, o) {
                  void 0 === o && (o = r), (e[o] = t[r])
                }),
          a =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var r in e) 'default' === r || Object.prototype.hasOwnProperty.call(t, r) || o(t, e, r)
            }
        Object.defineProperty(t, '__esModule', { value: !0 }),
          a(r(4984), t),
          a(r(2489), t),
          a(r(9940), t),
          a(r(5477), t),
          a(r(2030), t),
          a(r(2951), t),
          a(r(9799), t),
          a(r(2075), t),
          a(r(5712), t),
          a(r(2778), t),
          a(r(4152), t)
      },
      2778: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      5477: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      2030: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      2951: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      9799: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 })
      },
      8432: (e) => {
        e.exports = require('bcryptjs')
      },
      3986: (e) => {
        e.exports = require('body-parser')
      },
      9953: (e) => {
        e.exports = require('cli-color')
      },
      9710: (e) => {
        e.exports = require('cookie-parser')
      },
      3582: (e) => {
        e.exports = require('cors')
      },
      5142: (e) => {
        e.exports = require('dotenv')
      },
      6860: (e) => {
        e.exports = require('express')
      },
      3553: (e) => {
        e.exports = require('express-validator')
      },
      6982: (e) => {
        e.exports = require('jsonwebtoken')
      },
      9567: (e) => {
        e.exports = require('method-override')
      },
      1185: (e) => {
        e.exports = require('mongoose')
      },
      1738: (e) => {
        e.exports = require('multer')
      },
      5184: (e) => {
        e.exports = require('nodemailer')
      },
      7441: (e) => {
        e.exports = require('sharp')
      },
      3952: (e) => {
        e.exports = require('socket.io')
      },
      5828: (e) => {
        e.exports = require('uuid')
      },
      7147: (e) => {
        e.exports = require('fs')
      },
      5687: (e) => {
        e.exports = require('https')
      },
      1017: (e) => {
        e.exports = require('path')
      }
    },
    t = {}
  function r(o) {
    var a = t[o]
    if (void 0 !== a) return a.exports
    var n = (t[o] = { exports: {} })
    return e[o].call(n.exports, n, n.exports, r), n.exports
  }
  r(708), r(8679), r(4506)
})()
