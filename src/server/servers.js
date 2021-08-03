import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'

import config from './config'

export const app = express()

export const server = http.createServer(app)

export const io = new SocketServer(server, {
  cors: {
    origin: `http://192.168.1.100:${config.port}`,
    methods: ['GET', 'POST'],
  },
})
