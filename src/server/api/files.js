import { spawn } from 'child_process'
import fs from 'fs'
import { mkdtemp, access } from 'fs/promises'
import os from 'os'
import path from 'path'

import { getFifo, returnFifo } from '../lib/fifo'
import { emitter } from '../servers'

export let dirname = false
export const fileHandles = {}

export async function outputDir(dir=false) {
  if (dir) {
    try{
      await access(dir, fs.constants.R_OK | fs.constants.W_OK)
    } catch (e) {
      fs.mkdirSync(dir, {mode: 0o755})
    }
    return dir
  } else {
    return await mkdtemp(path.join(os.tmpdir(), 'audio-transformer-'))
  }
}

emitter
  .on('write file', ({id, data, seq}) => {
    if(fileHandles[id] === undefined) {
      fileHandles[id] = fs.createWriteStream(path.join(dirname, id))
      console.debug(`writing to file ${path.join(dirname, id)}...`)
      console.debug(Object.keys(fileHandles))
    } else {
      console.debug(`appending to existing file ${path.join(dirname, id)}...`)
    }
    fileHandles[id].write(data)

    // fs.writeFile(path.join(dirname, `${id}.${seq.toString().padStart(8, '0')}.wav`), data, err=>{if(err) throw err})

    // emitter.emit('start fifo', {id, data, seq})
  })
  .on('close file', id => {
    try {
      fileHandles[id].end()
    } catch(e) {
      console.error('error ending a fileHandle: ', {id, e})
    }
    fileHandles[id] = undefined
  })
  .on('start fifo', ({id, data, seq, mimeType}) => {
    let fifo = getFifo()
    fs.writeFile(fifo.wav, data, err => console.error({source: 'start fifo (write)', id, seq, err}))
    console.debug('start fifo: write file called')
    spawn('sox', [fifo.wav, fifo.raw])
    console.debug('start fifo: sox spawned')
    fs.readFile(fifo.raw, (err, data) => {
      console.debug('start fifo read file callback entered. id: ' + id)
      if(err) {
        console.error({source: 'start fifo (read)', id, seq, err})
      } else {
        console.debug('start fifo: will emit audio ' + id)
        emitter
          .emit(`audio ${id}`, {data, id, seq, mimeType})
        console.debug(`start fifo: emitted audio ${id}`)
      }
      setTimeout(() => {
        returnFifo(fifo)
        console.debug('start fifo: returnFifo called')
      }, 4000)
    })
    console.debug('start fifo: read file called')
  });

(async () => {
  dirname = await outputDir(dirname)
})()
