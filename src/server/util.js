import log from "loglevel";

function kill_server(server) {
  server.close(()=> log.info('\nServer shut down\n'))
}

export default {kill_server}
