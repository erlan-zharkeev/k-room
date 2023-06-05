import multer from 'multer'

const storage = multer.memoryStorage()

const fileUploader = multer({ storage })

export default fileUploader
