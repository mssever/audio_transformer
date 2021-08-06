import fs from 'fs'
import { mkfifo } from 'mkfifo'
import { nanoid as nanoID } from 'nanoid'
import path from 'path'

import { dirname } from '../api/files'

const fifo_stack = []

export function getFifo() {
  let fifo = fifo_stack.pop()
  if(fifo) {
    fifo.inUse = true
    console.debug(`getting fifo ${fifo.id}`)
    return fifo
  } else {
    fifo = new Fifo()
    fifo.inUse = true
    fifo_stack.push(fifo)
    console.debug(`getting a new fifo: ${fifo.id}`)
    return fifo
  }
}

export function returnFifo(fifo) {
  console.debug('returning a fifo' + ` (id: ${fifo.id})`)
  fifo.inUse = false
  fifo.lastUsed = new Date()
  fifo_stack.push(fifo)
}

class Fifo {
  constructor() {
    this.dirname = path.join(dirname, 'fifo')
    this.id = nanoID()
    this.wav = undefined
    this.raw = undefined
    this.inUse = false
    this.lastUsed = new Date()
    this._createFifo('wav')
    this._createFifo('raw')
    console.debug('new fifo created with id ' + this.id)
  }

  _createFifo(extension) { // not to be called directly
    try {
      fs.mkdirSync(this.dirname)
    } catch (err) {
      if(err.code != 'EEXIST') {
        console.error({where: 'Fifo._createFifo in fs.access', err})
        throw err
      }
    }
    let filename = path.join(this.dirname, `${this.id}.${extension}`)
    mkfifo(filename, 0o600, err => {if (err) throw err})
    this[`${extension}`] = filename
  }

  destroy() {
    [this.wav, this.raw].forEach(filename => {
      fs.rm(filename, {force: true}, err => {
        if(err) {
          console.error({source: 'fs.rm(), from Fifo.destroy()', err})
        } else {
          console.debug('deleted fifo ' + `(${this.id}) ${filename}`)
        }
      })
    })
    this.wav = undefined
    this.raw = undefined
  }
}

const gc = setInterval(() => {
  if (fifo_stack.length > 0) {
    console.debug('fifo gc starting. Queue length: ' + fifo_stack.length)
    while(fifo_stack.length >= 1 && Math.abs(fifo_stack[0].lastUsed - new Date()) > 30000) {
      let fifo = fifo_stack.shift()
      try {
        fifo.destroy()
      } catch(e) {
        console.debug(`fifo gc: possible race condition? fifo: ${fifo}`)
      }
    }
    console.debug('fifo gc finished. Queue length: ' + fifo_stack.length)
  }
}, 30000)
