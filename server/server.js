import events from 'events'
import fs from 'fs'
import http from 'http'
import log from 'loglevel'
import path from 'path'

import util from './util.js'

const config = JSON.parse(fs.readFileSync(path.join('server', 'config.json')).toString())
log.setLevel(config.loglevel, false)
log.debug('config: ', config)

const server = http.createServer(server_callback)
server.listen(config.port, () => log.info(`Server listening on port ${config.port}`))

const emitter = new events.EventEmitter()

process.on('SIGTERM', ()=>util.kill_server(server))
process.on('SIGINT', ()=>util.kill_server(server))
process.on('SIGHUP', ()=>util.kill_server(server))

function server_callback(req, res) {
  const {url, method} = req
  const chunks = []
  req.on("error", err=>{
    log.error(err)
    req.writeHead(400, {'Content-Type': 'text/plain'})
    req.end('400 Bad Request')
  })
  res.on("error", err=>{
    log.error(err)
    req.writeHead(500, {'Content-Type': 'text/plain'})
    req.end('500 Internal Server Error')
  })

  req
    .on('data', chunk=>chunks.push(chunk))
    .on('end', ()=>{
      const body=Buffer.concat(chunks).toString()
      switch(url) {
        case '/play':
          const stream = fs.createReadStream(config.test.input, {emitClose: true})
          res.writeHead(200, 'audio/mp3')
          stream.pipe(res)
          break
        default:
          res.writeHead(200, 'text/html')
          res.end('<!DOCTYPE html><html><head><title>Server Test</title></head><body><audio controls="controls"><source src="/play"></audio></body></html>')
      }
    })
}
