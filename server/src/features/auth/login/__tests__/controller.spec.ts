import { StatusEnum } from 'common-types'
import type { Request, Response } from 'express'

import { login } from '../controller'
import { Message } from '../lib'

const findOneMock = jest.fn()
jest.mock('entities/user', () => ({
  UserModel: { findOne: (...args: unknown[]) => findOneMock(...args) }
}))

const compareSyncMock = jest.fn()
jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: { compareSync: (...args: unknown[]) => compareSyncMock(...args) }
}))

const updateTokensMock = jest.fn()
jest.mock('./../../~shared', () => ({
  updateTokens: (...args: unknown[]) => updateTokensMock(...args)
}))

const mapUserToDtoMock = jest.fn()
jest.mock('../lib', () => {
  const actual = jest.requireActual('../lib')
  return {
    ...actual,
    mapUserToDto: (...args: unknown[]) => mapUserToDtoMock(...args),
    Message: actual.Message
  }
})

const throwHTTPErrorMock = jest.fn()
jest.mock('shared-lib', () => ({
  throwHTTPError: (...args: unknown[]) => throwHTTPErrorMock(...args)
}))

const makeReq = (body: unknown = {}): Request => ({ body, cookies: {} } as unknown as Request)

const makeRes = () => {
  const res: Partial<Response> = {}
  ;(res.json as unknown) = jest.fn().mockReturnValue(res)
  ;(res.status as unknown) = jest.fn().mockReturnValue(res)
  return res as Response & { json: jest.Mock; status: jest.Mock }
}

describe('login controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns error if user not found', async () => {
    findOneMock.mockResolvedValueOnce(null)

    const req = makeReq({ email: 'a@b.c', password: 'pass' })
    const res = makeRes()

    await login(req, res)

    expect(throwHTTPErrorMock).toHaveBeenCalledWith(StatusEnum.BadRequest, res, Message.InvalidEmailOrPassword)
    expect(compareSyncMock).not.toHaveBeenCalled()
    expect(updateTokensMock).not.toHaveBeenCalled()
  })

  test('returns error if password invalid', async () => {
    findOneMock.mockResolvedValueOnce({
      system: { password: 'hashed', confirmed: true },
      id: 'u1'
    })
    compareSyncMock.mockReturnValueOnce(false)

    const req = makeReq({ email: 'a@b.c', password: 'wrong' })
    const res = makeRes()

    await login(req, res)

    expect(compareSyncMock).toHaveBeenCalledWith('wrong', 'hashed')
    expect(throwHTTPErrorMock).toHaveBeenCalledWith(StatusEnum.BadRequest, res, Message.InvalidEmailOrPassword)
    expect(updateTokensMock).not.toHaveBeenCalled()
  })

  test('returns error if email not confirmed', async () => {
    findOneMock.mockResolvedValueOnce({
      system: { password: 'hashed', confirmed: false },
      id: 'u1'
    })
    compareSyncMock.mockReturnValueOnce(true)

    const req = makeReq({ email: 'a@b.c', password: 'pass' })
    const res = makeRes()

    await login(req, res)

    expect(throwHTTPErrorMock).toHaveBeenCalledWith(StatusEnum.BadRequest, res, Message.EmailNotConfirmed)
    expect(updateTokensMock).not.toHaveBeenCalled()
  })

  test('success: updates tokens and returns dto', async () => {
    const user = {
      system: { password: 'hashed', confirmed: true },
      id: 'u1'
    }
    findOneMock.mockResolvedValueOnce(user)
    compareSyncMock.mockReturnValueOnce(true)
    updateTokensMock.mockResolvedValueOnce(undefined)
    mapUserToDtoMock.mockReturnValueOnce({ id: 'u1', name: 'John' })

    const req = makeReq({ email: 'a@b.c', password: 'pass' })
    const res = makeRes()

    await login(req, res)

    expect(updateTokensMock).toHaveBeenCalledWith('u1', req, res)
    expect(mapUserToDtoMock).toHaveBeenCalledWith(user)
    expect(res.json).toHaveBeenCalledWith({
      id: 'u1',
      name: 'John',
      message: Message.Success,
      silent: true
    })
    expect(throwHTTPErrorMock).not.toHaveBeenCalled()
  })

  test('unknown crash → Server error', async () => {
    findOneMock.mockRejectedValueOnce(new Error('db down'))

    const req = makeReq({ email: 'a@b.c', password: 'pass' })
    const res = makeRes()

    await login(req, res)

    expect(throwHTTPErrorMock).toHaveBeenCalledWith(StatusEnum.Server, res, Message.Failed)
  })
})
