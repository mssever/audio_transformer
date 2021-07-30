import events from 'events'
import express from 'express'
import morgan from 'morgan'

const router = express.Router();
const emitter = new events.EventEmitter()

router.use(express.urlencoded({extended: true}))
router.use(express.json())
router.use(morgan('common'))

//TODO: In the incoming handler, Read stream a few bytes at a time and emit an event containing those bytes. In the play handler, listen for the event and send the data. When the close event is emitted, end the response.

router.post('play', (req, res, next) =>{
  let id = req.query.id
//webrtc, socket.io
  let data
  while(data = __readBytesFromReq__()) {
    emitter.emit('data'+id, Buffer.from(data))
  }
  emitter.emit('close'+id)
  res.json({status: 'success', message:'Stream finished'})
})

router.get('play', (req, res, next)=>{
  let id = req.query.id
  // let stream
  // try {
  //   stream = fs.createReadStream(id, {emitClose: true})
  // } catch(err) {
  //   next(err)
  // }
  res.writeHead(200, 'audio/mp3')
  emitter.on('data'+id, data=>res.write(data))
  emitter.on('close'+id, ()=>res.end())
  // TODO: Do I need to remove the listener to avoid memory leaks?

  // stream.pipe(res)
  // stream.on('close', ()=>res.end())
})

export default router
