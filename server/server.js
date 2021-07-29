import events from 'events'
import express from 'express'
import fs from 'fs'
import http from 'http'
import log from 'loglevel'
import morgan from 'morgan'
import path from 'path'

import util from './util.js'
import apiv1 from './api/v1/apiv1.js'

const config = JSON.parse(fs.readFileSync(path.join('server', 'config.json')).toString())
log.setLevel(config.loglevel, false)
log.debug('config: ', config)

const app = express()
app.use(express.urlencoded())
app.use(express.json())
app.use(morgan('common'))

app.use('/api/v1', apiv1)

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
        .json({...err, status: 'error', req:{path:req.path, method: req.method}})
})

//error handler: app.use((err, req,res, next) => {// is an error handler because it takes four parameters})
// res.json({...err})
//then call next(error)
//
// Custom 404: place on a general route, then override with a specific route

const server = http.createServer(app)
server
  .on('connect', socket=>log.debug(`Client ${socket.remoteAddress}:${socket.remotePort} connected to the server at ${socket.localAddress}:${socket.localPort}.`))
  .on('connection', socket=>log.debug(`Connection established from ${socket.remoteAddress} port ${socket.remotePort} to ${socket.localAddress} port ${socket.localPort}`))
  .on('request', (req, res) => log.debug(`Request received. URL: ${req.url}. Method: ${req.method}`))
  .on('upgrade', (req, socket, head) => log.debug(`Upgrade requested. Header: ${head.toString()}`))
server.listen(config.port, () => log.info(`Server listening on port ${config.port}`))

// const emitter = new events.EventEmitter()

process.on('SIGTERM', ()=>util.kill_server(server))
process.on('SIGINT', ()=>util.kill_server(server))
process.on('SIGHUP', ()=>util.kill_server(server))

function server_callback(req, res) {
  let {url, method} = req
  url = new URL(url, `http://${req.headers.host}`)
  const chunks = []
  req.on("error", err=>{
    log.error(err)
    req.writeHead(400, {'Content-Type': 'text/plain'})
    req.end('400 Bad Request')
  })
  res
    .on("error", err=>{
      log.error(err)
      req.writeHead(500, {'Content-Type': 'text/plain'})
      req.end('500 Internal Server Error')
    })
    .on('finish', ()=>log.debug(`Finished request for ${url}`))
    .on('404', message=>{
      log.warn(`404 error: ${url}`)
      res.writeHead(404, {'Content-Type': 'text/html'})
      let msg_str = '<!DOCTYPE html><html><head><title>Not Found</title></head><body><h1>404 Not Found</h1>'
      if(message) {
        msg_str += `<h2>Message from the server</h2><pre>${message}</pre>`
      }
      res.end(msg_str + '</body></html>')
    })

  req
    .on('data', chunk=>chunks.push(chunk))
    .on('end', ()=>{
      const body=Buffer.concat(chunks).toString()
      let input = config.test.input
      if(url.searchParams.get('name')) {
        input = url.searchParams.get('name')
      }
      switch(url.pathname) {
        case '/data/play':
          log.debug('search parameters: ', url.search)
          let stream
          try {
            stream = fs.createReadStream(input, {emitClose: true})
          } catch(err) {
            return res.emit('404', err)
          }
          res.writeHead(200, 'audio/mp3')
          stream.pipe(res)
          stream.on('close', ()=>res.end())
          break
        case '/':
          let play_url = new URL('/data/play', `${url.protocol}${url.host}`)
          play_url.searchParams.append('name', input)
          res.writeHead(200, 'text/html')
          res.end(`<!DOCTYPE html><html><head><title>Server Test</title></head><body><audio autostart controls="controls"><source src="${play_url}"></audio></body></html>`)
          break
        default:
          res.emit('404')
      }
    })
}
