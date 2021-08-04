import dotenv from 'dotenv'

if(!dotenv.config()) {
  throw new Error('env variables not loaded')
}

let port = parseInt(process.env.PORT)

export default {
  port,
  corsOrigin: `http://192.168.1.100:${port}`
}
