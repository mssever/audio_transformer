import fs from 'fs'
import { mkfifo } from 'mkfifo'
import { nanoid } from 'nanoid'
import path from 'path'

import { dirname } from '../api/files'

const fifo_queue = []

export function getFifo() {
  let fifo = fifo_queue.shift()
  if(fifo) {
    fifo.inUse = true
    console.debug(`getting fifo ${fifo.id}`)
    return fifo
  } else {
    fifo = new Fifo()
    fifo.inUse = true
    fifo_queue.push(fifo)
    console.debug(`getting a new fifo: ${fifo.id}`)
    return fifo
  }
}

export function returnFifo(fifo) {
  console.debug('returning a fifo' + ` (id: ${fifo.id})`)
  fifo.inUse = false
  fifo.lastUsed = new Date()
  fifo_queue.push(fifo)
}

class Fifo {
  constructor() {
    this.dirname = path.join(dirname, 'fifo')
    this.id = nanoid()
    this._wav = undefined
    this._raw = undefined
    this.inUse = false
    this.lastUsed = new Date()
    console.debug('new fifo created with id ' + this.id)
  }

  get wav() {
    if(this._wav) {
      return this._wav
    } else {
      this._createFifo('wav')
      while(true) {
        if (this._wav) {
          return this._wav
        }
      }
    }
  }

  set wav(val) {
    if(val === undefined) {
      this._wav = undefined
    } else {
      throw new Error("Can't set pipe names directly, except to undefined")
    }
  }

  get raw() {
    if(this._raw) {
      return this._raw
    } else {
      this._createFifo('raw')
      while(true) {
        if (this._raw) {
          return this._raw
        }
      }
    }
  }

  set raw(val) {
    if(val === undefined) {
      this._raw = undefined
    } else {
      throw new Error("Can't set fifo names directly, except to undefined")
    }
  }

  _createFifo(extension) { // not to be called directly
    // console.debug('Fifo._createFifo called')
    try {
      fs.mkdirSync(this.dirname)
    } catch (err) {
      if(err.code != 'EEXIST') {
        console.error({where: 'Fifo._createFifo in fs.access', err})
        throw err
      }
    }
    let filename = path.join(this.dirname, `${this.id}.${extension}`)
    // console.debug('Fifo._createFifo: filename = ' + filename)
    mkfifo(filename, 0o600, err => {if (err) throw err})
    // console.debug('Fifo._createFifo: mkfifo returned')
    this[`_${extension}`] = filename
    // console.debug('created fifo ' + filename)
  }

  destroy() {
    [this.wav, this.raw].forEach(filename => {
      fs.rm(filename, {force: true}, err => {if(err) console.error({source: 'fs.rm(), from Fifo.destroy()', err})})
      console.debug('deleted fifo ' + `(${this.id}) ${filename}`)
    })
    this.wav = undefined
    this.raw = undefined
  }
}

const gc = setInterval(() => {
  console.debug('fifo gc starting. Queue length: ' + fifo_queue.length)
  while(fifo_queue.length >= 1 && Math.abs(fifo_queue[0].lastUsed - new Date()) > 30000) {
    var fifo = fifo_queue.shift()
    try {
      fifo.destroy()
    } catch(e) {
      console.debug(`fifo gc: possible race condition? fifo: ${fifo}`)
    }
  }
  console.debug('fifo gc finished. Queue length: ' + fifo_queue.length)
}, 30000)
