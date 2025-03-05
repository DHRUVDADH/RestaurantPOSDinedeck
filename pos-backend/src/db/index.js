import {DB_NAME} from "../constants.js"
import mongoose from "mongoose"

const connectDB = async ()=>{
  try {
    const connectionInstance = mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\nMongoDB Connection Successful !! DB Host: ${(await connectionInstance).connection.host}`)    
  } catch (error) {
    console.error(`MongoDB Connection Failed.`)
    throw error
  }
}

export {connectDB}