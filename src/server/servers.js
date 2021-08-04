import { EventEmitter } from 'events'
import express from 'express'
import http from 'http'
import { Server as SocketServer } from 'socket.io'

import config from './config'

export const app = express()

export const httpServer = http.createServer(app)

export const io = new SocketServer(httpServer, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
})

export const emitter = new EventEmitter()
