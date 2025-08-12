import { NextFunction, Request, Response } from 'express'

export type MulterHandler = (req: Request, res: Response, next: NextFunction) => void

export type RequestMulterFile = Express.Multer.File & {
  id?: string
  filename?: string
  contentType?: string
  bucketName?: string
}

export type MediaBucketName = 'avatar' | 'doc' | 'image' | 'audio' | 'video'

export type MulterErrorCode = 'LIMIT_FILE_SIZE' | 'LIMIT_FILE_COUNT' | 'LIMIT_UNEXPECTED_FILE'
