import fs from 'fs'
import { dirname, fileHandles } from './api/files'
import { emitter } from './servers'
import { recordings } from './shared_data'

function kill_server(server) {
  server.close(()=> console.info('\nServer shut down\n'))

  Object.keys(fileHandles).forEach(handle => {
    console.debug(`killing file handle ${handle}`)
    fileHandles[handle].end()
  })

  Object.keys(recordings).forEach(id => {
    console.debug(`killing recording ${id}`)
    emitter.emit(`stop ${id}`)
  })
  
  fs.rm(dirname, {recursive: true, force: true}, err => {
    if(err) {
      throw err
    } else {
      console.debug(`deleted directory ${dirname}`)
    }
  })
}

export default {kill_server}
