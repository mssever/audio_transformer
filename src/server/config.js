import dotenv from 'dotenv'

if(!dotenv.config()) {
  throw new Error('env variables not loaded')
}

if(!(process.env.PORT && process.env.SERVER_IP)) {
  throw new Error('Environment variables PORT and SERVER_IP not specified')
}

let port = parseInt(process.env.PORT)

export default {
  port,
  corsOrigin: `${process.env.SERVER_IP}:${port}`,
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: parseInt(process.env.DB_PORT) || 3306,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME || 'audio_transformer'
}
