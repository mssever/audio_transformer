import fs from 'fs'
import { dirname, fileHandles } from './api/files'
import { emitter } from './servers'
import { recordings } from './shared_data'

function kill_server(server) {
  try {
    server.close(()=> console.info('\nServer shut down\n'))

    Object.keys(fileHandles).forEach(handle => {
      console.debug(`killing file handle ${handle}`)
      try {
        fileHandles[handle].end()
      } catch(e) {
        console.error('caught an error while deleting fileHandles: ', e)
      }
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
  } catch(err) {
    console.error('Caught an error while killing server: ', error)
  }
}

export default {kill_server}
