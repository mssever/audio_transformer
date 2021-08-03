// import events from 'events'
import express from 'express'
import morgan from 'morgan'

import { io, recordings } from '../server.js'

const router = express.Router()
// const emitter = new events.EventEmitter()

router.use(express.urlencoded({ extended: true }))
router.use(express.json())
router.use(morgan('common'))

// router.post('play', (req, res, next) =>{
//   let id = req.query.id
// //webrtc, socket.io
//   let data
//   while(data = __readBytesFromReq__()) {
//     emitter.emit('data'+id, Buffer.from(data))
//   }
//   emitter.emit('close'+id)
//   res.json({status: 'success', message:'Stream finished'})
// })
router.get('/play/test', (req, res, next) => {
  try {
    let id = req.query.id
    res.json({ id, available: !!recordings[id] })
  } catch (e) {
    next(e)
  }
})

router.get('/play', (req, res, next) => {
  console.log('hi from play')
  try {
    let id = req.query.id
    if(!recordings[id]) {
      res.status(409)
      res.json({
        message:
          "This data source isn't currently sending data. Please check the ID or try again later.",
      })
      next()
    }
    // let stream
    // try {
    //   stream = fs.createReadStream(id, {emitClose: true})
    // } catch(err) {
    //   next(err)
    // }
    res.writeHead(200, 'audio/mp3')
    // io.on('audio'+id, data=>res.write(data))
    // io.on('close'+id, ()=>res.end())
    io.on('audio'+id, data=>console.log({id, event:'audio', seq: data.seq}))
    io.on('close'+id, data=>console.log({id, event:'close'}))
    // TODO: Do I need to remove the listener to avoid memory leaks?

    // stream.pipe(res)
    // stream.on('close', ()=>res.end())
  } catch (e) {
    next(e)
  }
})

export default router
