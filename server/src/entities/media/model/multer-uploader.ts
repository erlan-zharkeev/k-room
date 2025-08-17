import multer from 'multer'

export const multerUploader = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 1024 // Cutting off for huge files early on
  }
})
