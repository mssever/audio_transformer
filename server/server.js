// import events from 'events'
import express from 'express'
import fs from 'fs'
import http from 'http'
import log from 'loglevel'
import morgan from 'morgan'
import path from 'path'
// import cors from 'cors'
import { Server as SocketServer } from 'socket.io'

import util from './util.js'
import apiv1 from './api/v1/apiv1.js'

const config = JSON.parse(fs.readFileSync(path.join('server', 'config.json')).toString())
log.setLevel(config.loglevel, false)
log.debug('config: ', config)

export const recordings = {}

const app = express()
// app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(morgan('common'))

app.use('/', (req, res, next) => {
  try{
    res.header({'Feature-Policy': 'microphone'})
    next()
  } catch (e) {
    next(e)
  }
})

app.use('/api', apiv1)
app.use('/test', (req, res, next) => {
  res.json({message: 'success'})
})
app.use('/', express.static(path.join(process.cwd(), 'build')));
app.use((req, res, next) => {
  res.sendFile(path.join(process.cwd(), 'build', 'index.html'))
})
// 404 handler
app.use((req, res, next) => {
  try{
    res.status(404)
    res.json({status: 'error', message:'404 Not Found'})
  } catch(e) {
    next(e)
  }
})

app.use((err, req, res, next) => {
      res
        .status(err.status || 500)
        .json({err, status: 'error', req:{path:req.path, method: req.method}})
})

//error handler: app.use((err, req,res, next) => {// is an error handler because it takes four parameters})
// res.json({...err})
//then call next(error)
//
// Custom 404: place on a general route, then override with a specific route

const server = http.createServer(app)

export const io = new SocketServer(server, {
  cors: {
    origin: `http://192.168.1.100:${config.port}`,
    methods: ['GET', 'POST']
  }
});
io
  .on('connection', (socket) => {
    console.log('a user connected')
    socket.emit('test', {test:true, message:'message'})
    log.debug(socket)
  })
  .on('start recording', ({id})=>recordings[id] = true)
  .on('stop recording', ({id})=>recordings[id] = false)
  .on('ping', ()=>console.log('ping'))

server
  .on('connect', socket=>log.debug(`Client ${socket.remoteAddress}:${socket.remotePort} connected to the server at ${socket.localAddress}:${socket.localPort}.`))
  .on('connection', socket=>log.debug(`Connection established from ${socket.remoteAddress} port ${socket.remotePort} to ${socket.localAddress} port ${socket.localPort}`))
  .on('request', (req, res) => log.debug(`Request received. URL: ${req.url}. Method: ${req.method}`))
  .on('upgrade', (req, socket, head) => log.debug(`Upgrade requested. Header: ${head}\nSocket:${socket}`))
server.listen(config.port, () => log.info(`Server listening on port ${config.port}`))

process.on('SIGTERM', ()=>util.kill_server(server))
process.on('SIGINT', ()=>util.kill_server(server))
process.on('SIGHUP', ()=>util.kill_server(server))
