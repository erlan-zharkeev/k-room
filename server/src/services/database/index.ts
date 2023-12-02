import mongoose from 'mongoose'
import ENV from './../../ENV'
import { loadUsersFixtures } from './../../fixtures/users'
import { loadMessageFixtures } from '../../fixtures/messages'
const clc = require('cli-color')

const db = mongoose.set('strictQuery', true)

async function initDataBase() {
  try {
    await db.connect(ENV.MONGO_HOST)
    console.log(clc.green.bgWhite('-Connected to DB'))
    await loadMessageFixtures()
    await loadUsersFixtures()
    console.log(clc.green.bgWhite('-Fixtures loaded'))
  } catch (e) {
    console.log(clc.red.bgWhite(e))
    console.log(clc.red.bgWhite('-init DB failed'))
  }
}

initDataBase()

export default db
