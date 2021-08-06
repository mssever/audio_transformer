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
          let seq = data.seq
          console.debug({event: `audio ${id}`, data})
          if(!mimeType) {
            mimeType = data.mimeType
            res.writeHead(200, {'Content-Type': mimeType})
          }
          if(alreadySentFirst) {
            res.write(data.data.raw)
            emitter.emit('write file', {id, data: data.data.raw, seq})
          } else {
            alreadySentFirst = true
            res.write(data.data.wav)
            emitter.emit('write file', {id, data: data.data.wav, seq})
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
