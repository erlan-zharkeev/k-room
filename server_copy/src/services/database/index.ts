import mongoose from 'mongoose'
import { ENV } from '../../app/config/constants'
import { loadFixtures } from '../../fixtures'

const clc = require('cli-color')

export const db = mongoose.set('strictQuery', true)

async function initDataBase() {
  try {
    await db.connect(ENV.MONGO_HOST)
    console.log(clc.green.bgWhite('-Connected to DB'))
    loadFixtures()
  } catch (e) {
    console.log(clc.red.bgWhite(e))
    console.log(clc.red.bgWhite('-init DB failed'))
  }
}

initDataBase()
