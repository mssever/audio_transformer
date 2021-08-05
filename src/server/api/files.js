import fs from 'fs'
import { mkdtemp, access } from 'fs/promises'
import os from 'os'
import path from 'path'

import { emitter } from '../servers'

export let dirname = undefined
export const fileHandles = {}

async function outputDir(dir=false) {
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
  .on('write file', ({id, data}) => {
    if(fileHandles.id === undefined) {
      fileHandles[id] = fs.createWriteStream(path.join(dirname, id))
      console.debug(`writing to file ${path.join(dirname, id)}...`)
      // console.debug(fileHandles)
    }
    fileHandles[id].write(data)
  })
  .on('close file', id => {
    fileHandles[id].end()
    fileHandles[id] = undefined
  });

(async () => {
  dirname = await outputDir()
})()
