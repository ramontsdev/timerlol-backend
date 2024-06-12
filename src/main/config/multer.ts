import multer from 'multer'
import crypto from 'node:crypto'
import path from 'node:path'

// const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp')
const tmpFolder = path.resolve('tmp')

export const multerConfig = {
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex')
      const filename = `${fileHash}-${file.originalname.replace(/ /g, '_')}`
      return callback(null, filename)
    }
  })
}
