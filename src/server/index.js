import express from 'express'
import log from 'loglevel'
import morgan from 'morgan'
import path from 'path'

import api from './api/routes'
import config from './config'
import { app, httpServer, io } from './servers'
import { recordings } from './shared_data'
import util from './util'


/*****************************************************************************
 * 
 * Setup
 * 
 ****************************************************************************/
log.debug(config.port)


/*****************************************************************************
 * 
 * Express
 * 
 ****************************************************************************/
app
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use(morgan('dev'))

app.use('/api', api)

app
  .use('/', (_req, res, next) => {
    try {
      res.header({ 'Feature-Policy': 'microphone' })
      next()
    } catch (e) {
      next(e)
    }
  })
  .use('/', express.static(path.join(process.cwd(), 'public')))
  .use((_req, res, _next) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
  })

// Error handlers
app
  .use((_req, res, next) => {
    try {
      res.status(404)
      res.json({ status: 'error', message: '404 Not Found' })
    } catch (e) {
      next(e)
    }
  })
  .use((err, req, res, _next) => {
    res
      .status(err.status || 500)
      .json({
        err,
        status: 'error',
        code: err.status || 500,
        req: { path: req.path, method: req.method },
      })
  })


/*****************************************************************************
 * 
 * Socket.io (WebSockets)
 * 
 ****************************************************************************/
io.on('connection', (socket) => {
  console.log('a user connected')
  socket.emit('test', { test: true, from: 'socket', message: 'message' })
  io.emit('test', {test:true, from: 'io', message: 'message'})
  log.debug(socket)
})
  .on('start recording', ({ id }) => (recordings[id] = true))
  .on('stop recording', ({ id }) => (recordings[id] = false))
  .on('ping', () => console.log('ping'))


/*****************************************************************************
 * 
 * Start the servers
 * 
 ****************************************************************************/
httpServer
  .on('connect', socket=>log.debug(`Client ${socket.remoteAddress}:${socket.remotePort} connected to the httpServer at ${socket.localAddress}:${socket.localPort}.`))
  .on('connection', socket=>log.debug(`Connection established from ${socket.remoteAddress} port ${socket.remotePort} to ${socket.localAddress} port ${socket.localPort}`))
  .on('request', (req, res) => log.debug(`Request received. URL: ${req.url}. Method: ${req.method}`))
  .on('upgrade', (req, socket, head) => log.debug(`Upgrade requested. Header: ${head}\nSocket:${socket}`))
httpServer.listen(config.port, () => log.info(`Server listening on port ${config.port}`))

process.on('SIGTERM', () => util.kill_server(httpServer))
process.on('SIGINT', () => util.kill_server(httpServer))
process.on('SIGHUP', () => util.kill_server(httpServer))
