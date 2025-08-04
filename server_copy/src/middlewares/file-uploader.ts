import multer from 'multer'

const storage = multer.memoryStorage()

export const fileUploader = multer({ storage })
