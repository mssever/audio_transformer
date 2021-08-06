import { spawn } from 'child_process'
import express from 'express'

import { emitter } from '../servers.js'
import { getFifo, returnFifo } from '../lib/fifo.js'
import { recordings } from '../shared_data.js'

const router = express.Router()

router
  .get('/play/test', (req, res, next) => {
    try {
      let id = req.query.id
      res.json({ id, available: !!recordings[id] })
    } catch (e) {
      next(e)
    }
  })
  .get('/play', (req, res, next) => {
    try {
      let id = req.query.id
      let mimeType
      let sentFirst = false
      console.debug({id, recordings})
      if(!recordings[id]) {
        res
          .status(409)
          .json({
            message:
              "This data source isn't currently sending data. Please check the ID or try again later.",
          })
        return
      }
      emitter
        .on(`audio ${id}`, data => {
          console.debug({event: `audio ${id}`, data})
          if(!mimeType) {
            mimeType = data.mimeType
            res.writeHead(200, {'Content-Type': mimeType})
          }
          if(sentFirst) {
            res.write(data.data)
            emitter.emit('write file', {id, data: data.data, seq})
          } else {
            sentFirst = true
            let fifo = getFifo()
            console.debug({where: 'audio id sent first', fifo, wav: fifo.wav, raw: fifo.raw})
            fs.writeFile(fifo.raw, data.data, err => console.error({source: 'audio id first (write)', id, seq: data.seq, err}))
            console.debug('audio id: write file called')
            spawn('sox', ['-r', '44100', '-c', '1', '-t', 'raw', '-b', '16', '-e', 'signed', fifo.raw, fifo.wav])
            console.debug('audio id: sox spawned')
            fs.readFile(fifo.wav, (err, wavData) => {
              if(err) {
                console.error({source: 'audio id first (read)', id, seq: data.seq, err})
              } else {
                res.write(wavData)
                emitter.emit('write file', {id, data: wavData, seq})
              }
              setTimeout(() => {
                returnFifo(fifo)
                console.debug('audio id: returnFifo called')
              }, 4000)
            })
            console.debug('audio id: read file called')
          }
          console.debug({event: `audio ${id}`, seq: data.seq, mimeType, length: data.data.length})
        })
        .on(`close ${id}`, () => {
          console.debug({type:'audio close', id})
          res.end()
        })
    } catch (e) {
      next(e)
    }
  })

export default router
