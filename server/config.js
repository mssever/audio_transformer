import dotenv from 'dotenv'

if(!dotenv.config()) {
  console.error('env variables not loaded')
}

let port = process.env.PORT
