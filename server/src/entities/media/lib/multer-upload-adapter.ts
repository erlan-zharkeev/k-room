import { StatusEnum } from 'common-types'
import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { throwHTTPError } from 'shared-lib'

import { MULTER_MESSAGE, MulterErrorCode, MulterHandler } from '../config'

const mapMulterError = (code: MulterErrorCode): string => {
  switch (code) {
    case 'LIMIT_FILE_SIZE':
      return MULTER_MESSAGE.fileIsTooLarge
    case 'LIMIT_FILE_COUNT':
      return MULTER_MESSAGE.tooManyFiles
    case 'LIMIT_UNEXPECTED_FILE':
      return MULTER_MESSAGE.extNotSupported
    default:
      return `${MULTER_MESSAGE.uploadFailed} - ${code}`
  }
}

const handle = (_: Request, res: Response, next: NextFunction) => (err?: unknown) => {
  if (!err) return next()
  if (err instanceof multer.MulterError) {
    return throwHTTPError(StatusEnum.BadRequest, res, mapMulterError(err.code as MulterErrorCode))
  }
  return throwHTTPError(StatusEnum.Server, res, MULTER_MESSAGE.uploadFailed)
}

/** single('field') */
export const wrapMulterSingle =
  (mw: ReturnType<typeof multer>['single']) =>
  (field: string): MulterHandler =>
  (req, res, next) => {
    mw(field)(req, res, handle(req, res, next))
  }

/** array('field', maxCount?) */
export const wrapMulterArray =
  (mw: ReturnType<typeof multer>['array']) =>
  (field: string, maxCount?: number): MulterHandler =>
  (req, res, next) => {
    mw(field, maxCount)(req, res, handle(req, res, next))
  }

/** fields([{ name, maxCount? }, ...]) */
export const wrapMulterFields =
  (mw: ReturnType<typeof multer>['fields']) =>
  (fields: multer.Field[]): MulterHandler =>
  (req, res, next) => {
    mw(fields)(req, res, handle(req, res, next))
  }

/** none() */
export const wrapMulterNone = (mw: ReturnType<typeof multer>['none']) => (): MulterHandler => (req, res, next) => {
  mw()(req, res, handle(req, res, next))
}
