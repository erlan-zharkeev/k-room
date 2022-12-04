import mongoose from 'mongoose'
import ENV from './ENV'
const clc = require('cli-color')
const db = mongoose

async function initDataBase() {
  try {
    await db.connect(ENV.MONGO_HOST)
    console.log(clc.green.bgWhite('-Connected to DB'))
  } catch (e) {
    console.log(clc.red.bgWhite(e))
    console.log(clc.red.bgWhite('-Db connection failed'))
  }
}

initDataBase()

export default db
