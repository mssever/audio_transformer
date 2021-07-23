import fs from 'fs'
import http from 'http'
import log from 'loglevel'
import path from 'path'

const config = JSON.parse(fs.readFileSync(path.join('server', 'config.json')).toString())
log.setLevel(config.loglevel, false)
log.debug('config: ', config)

const server = http.createServer(server_callback)
server.listen(config.port, () => console.log(`Server listening on port ${config.port}`))

function server_callback(req, res) {

}
