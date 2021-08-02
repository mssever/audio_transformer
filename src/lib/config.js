const socket = {
  protocol: 'ws://',
  host: 'localhost:3605',
  cors: {
    origin: "https://example.com",
    methods: ["GET", "POST"]
  }
}

const exports = {
  socket
}

export default exports
