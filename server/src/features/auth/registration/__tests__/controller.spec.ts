import { hash } from 'bcryptjs'
import { StatusEnum } from 'common-types'
import { UserModel } from 'entities/user'
import type { Request, Response } from 'express'
import { createUser } from 'features/user'
import { throwHTTPError } from 'shared-lib'

import { registration } from '..'
import { Message } from '../lib/message'

jest.mock('entities/user', () => ({
  UserModel: { findOne: jest.fn() }
}))

jest.mock('bcryptjs', () => ({
  hash: jest.fn()
}))

jest.mock('features/user', () => ({
  createUser: jest.fn()
}))

jest.mock('shared-lib', () => ({
  throwHTTPError: jest.fn()
}))

const makeReq = (body: unknown = {}): Request => ({ body } as unknown as Request)
const makeRes = () => {
  const res: Partial<Response> = {}
  ;(res.json as unknown) = jest.fn().mockReturnValue(res)
  ;(res.status as unknown) = jest.fn().mockReturnValue(res)
  return res as Response & { json: jest.Mock; status: jest.Mock }
}

describe('registration controller', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns error if username is already taken', async () => {
    ;(UserModel.findOne as jest.Mock).mockResolvedValueOnce({ _id: 'u1' })

    const req = makeReq({ username: 'john', email: 'j@d.com', password: '123456' })
    const res = makeRes()

    await registration(req, res)

    expect(throwHTTPError).toHaveBeenCalledWith(StatusEnum.BadRequest, res, Message.UserWithCurrentNameAlreadyExist)
    expect(hash).not.toHaveBeenCalled()
    expect(createUser).not.toHaveBeenCalled()
  })

  it('returns error if email is already taken', async () => {
    ;(UserModel.findOne as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce({ _id: 'u2' })

    const req = makeReq({ username: 'john', email: 'j@d.com', password: '123456' })
    const res = makeRes()

    await registration(req, res)

    expect(throwHTTPError).toHaveBeenCalledWith(StatusEnum.BadRequest, res, Message.UserWithCurrentEmailAlreadyExist)
    expect(hash).not.toHaveBeenCalled()
    expect(createUser).not.toHaveBeenCalled()
  })

  it('successful registration', async () => {
    ;(UserModel.findOne as jest.Mock).mockResolvedValueOnce(null).mockResolvedValueOnce(null) // email
    ;(hash as jest.Mock).mockResolvedValue('hashed_pwd')
    ;(createUser as jest.Mock).mockReturnValue({ save: jest.fn().mockResolvedValue(undefined) })

    const req = makeReq({ username: 'john', email: 'j@d.com', password: '123456' })
    const res = makeRes()

    await registration(req, res)

    expect(hash).toHaveBeenCalledWith('123456', 6)
    expect(createUser).toHaveBeenCalledWith({
      email: 'j@d.com',
      username: 'john',
      hashedPassword: 'hashed_pwd'
    })
    expect(res.json).toHaveBeenCalledWith({ message: Message.RegistrationSuccess })
    expect(throwHTTPError).not.toHaveBeenCalled()
  })

  it('unknown unexpected crash → Server error', async () => {
    ;(UserModel.findOne as jest.Mock).mockRejectedValue(new Error('db down'))

    const req = makeReq({ username: 'john', email: 'j@d.com', password: '123456' })
    const res = makeRes()

    await registration(req, res)

    expect(throwHTTPError).toHaveBeenCalledWith(StatusEnum.Server, res, Message.FailedRegistration)
  })
})
