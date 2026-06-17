import path from 'node:path'

export const resolveFixtureImagePath = (imagePath: string) => path.resolve(__dirname, '..', 'images', imagePath)
