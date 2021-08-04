import express from 'express'
import log from 'loglevel'
import morgan from 'morgan'
import path from 'path'

import api from './api/routes'
import config from './config'
import { app, httpServer, io, emitter } from './servers'
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
io
  .on('connection', socket => {
    console.log(`Socket.io connection from ${socket.client.conn.remoteAddress}`)
    socket
      .on('start recording', ({ id }) => {
        recordings[id] = true
        console.log({type: 'start', id})
      })
      .on('stop recording', ({ id }) => {
        recordings[id] = false
        console.log({type: 'stop', id})
      })
      .on('audio', data => {
        console.log({type: 'first audio event', audio: `audio ${data.id}`, data})
        emitter.emit(`audio ${data.id}`, data)
      })
      .on('close', ({id}) => emitter.emit(`close ${id}`))
  })

// emitter.on('audio test_id', data => console.log({type: 'second audio event', audio: `audio ${data.id}`, data}))

/*****************************************************************************
 * 
 * Start the servers
 * 
 ****************************************************************************/
httpServer
  .on('connect', socket=>log.debug(`Client ${socket.remoteAddress}:${socket.remotePort} connected to the httpServer at ${socket.localAddress}:${socket.localPort}.`))
  .on('connection', socket=>log.debug(`Connection established from ${socket.remoteAddress} port ${socket.remotePort} to ${socket.localAddress} port ${socket.localPort}`))
  .on('request', req => log.debug(`Request received. URL: ${req.url}. Method: ${req.method}`))
  .on('upgrade', (_req, socket, head) => log.debug(`Upgrade requested. Header: ${head}\nSocket:${socket}`))
  .listen(config.port, () => log.info(`Server listening on port ${config.port}`))

process
  .on('SIGTERM', () => util.kill_server(httpServer))
  .on('SIGINT', () => util.kill_server(httpServer))
  .on('SIGHUP', () => util.kill_server(httpServer))
