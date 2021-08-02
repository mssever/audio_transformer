import dotenv from 'dotenv'

if(!dotenv.config()) {
  throw new Error('env variables not loaded')
}

export default {
  port: parseInt(process.env.PORT),
}
