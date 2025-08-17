import { createHash } from 'crypto'

export const createSha256FromBuffer = (buffer: Buffer) => createHash('sha256').update(buffer).digest('hex')
