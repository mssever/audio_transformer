import express from 'express'

import { emitter } from '../servers.js'
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
      res
        .writeHead(200, {'Content-Type': 'application/json; charset=utf-8'})
      emitter
        .on(`audio ${id}`, data=>{
          res.write(JSON.stringify({id, event:'audio', data}))
          console.log({type:'audio event', data})
        })
        .on(`close ${id}`, () => {
          console.log({type:'audio close', id})
          res
            // .json({id, event:'close'})
            .end()
        })
    } catch (e) {
      next(e)
    }
  })

export default router
