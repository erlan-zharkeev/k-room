import mongoose from 'mongoose'
import ENV from './../../ENV'
import loadUsersFixtures from './../../fixtures/users'
const Grid = require('gridfs-stream')
const clc = require('cli-color')

const db = mongoose
const connection = db.connection
let gfs = null as any
let gridfsBucket = null as any

async function initDataBase() {
  try {
    await db.connect(ENV.MONGO_HOST)
    console.log(clc.green.bgWhite('-Connected to DB'))
    await loadUsersFixtures()
    console.log(clc.green.bgWhite('-Fixtures loaded'))
    gridfsBucket = new mongoose.mongo.GridFSBucket(connection.db, {
      bucketName: 'uploads'
    })
    gfs = Grid(connection.db, mongoose.mongo)
    gfs.collection('uploads')
    console.log(clc.green.bgWhite('-GFS loaded'))
  } catch (e) {
    console.log(clc.red.bgWhite(e))
    console.log(clc.red.bgWhite('-Db connection failed'))
  }
}

initDataBase()

export { db, gfs, gridfsBucket }
