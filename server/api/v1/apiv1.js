import express from 'express'
import morgan from 'morgan'

const router = express.Router();

router.use(express.urlencoded({extended: true}))
router.use(express.json())
router.use(morgan('common'))

router.get('play', (req, res, next)=>{
  let id = req.query.id
  let stream
  try {
    stream = fs.createReadStream(id, {emitClose: true})
  } catch(err) {
    next(err)
  }
  res.writeHead(200, 'audio/mp3')
  stream.pipe(res)
  stream.on('close', ()=>res.end())
})

export default router
