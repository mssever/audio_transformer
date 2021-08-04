import express from 'express'
// import log from 'loglevel'
import morgan from 'morgan'

import { emitter } from '../servers.js'
import { recordings } from '../shared_data.js'

const router = express.Router()
// const emitter = new events.EventEmitter()

router.use(express.urlencoded({ extended: true }))
router.use(express.json())
router.use(morgan('common'))

router.get('/play/test', (req, res, next) => {
  try {
    let id = req.query.id
    res.json({ id, available: !!recordings[id] })
  } catch (e) {
    next(e)
  }
})

router.get('/play', (req, res, next) => {
  try {
    let id = req.query.id
    console.debug({id, recordings})
    if(!recordings[id]) {
      res.status(409)
      res.json({
        message:
          "This data source isn't currently sending data. Please check the ID or try again later.",
      })
      return
    }
    res.status(200)
    emitter
      .on(`audio ${id}`, data=>{
        res.json({id, event:'audio', data})
        console.log({type:'audio event', data})
      })
      .on(`close ${id}`, () => {
        res.json({id, event:'close'})
        console.log({type:'audio close', id})
        res.end()
      })
  } catch (e) {
    next(e)
  }
})

export default router
