import { spawn } from 'child_process'
import express from 'express'
import fs from 'fs'

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
      let alreadySentFirst = false
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
          if(!recordings[id]) recordings[id] = true // restore recordings if broadcaster connection is reset
          let seq = data.seq
          console.debug({event: `audio ${id}`, data})

          if(!mimeType) {
            mimeType = data.mimeType
            res.writeHead(200, {
              'Content-Type': mimeType,
              'Cache-Control': 'no-store, max-age=0'
            })
          }


          if(alreadySentFirst) {
            res.write(data.data.raw)
            emitter.emit('write file', {id, data: data.data.raw, seq})
          } else {
            alreadySentFirst = true
            
            // For some reason, we have to convert *back* into WAV instead of using the WAV file received.

            let fifo = getFifo()

            fs.writeFile(fifo.raw, data.data.raw, err => console.error({source: 'audio id first (write)', id, seq, err}))
            
            spawn('sox', ['-r', '44100', '-c', '1', '-t', 'raw', '-b', '16', '-e', 'signed', fifo.raw, fifo.wav])
            
            fs.readFile(fifo.wav, (err, wavData) => {
              if(err) {
                console.error({source: 'audio id first (read)', id, seq: data.seq, err})
              } else {
                res.write(wavData)
                emitter.emit('write file', {id, data: wavData, seq})
              }
              setTimeout(() => {
                returnFifo(fifo)
              }, 4000)
            })
          }
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
