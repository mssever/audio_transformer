import React from 'react'

export default function SocketScript() {
  return (
    <React.Fragment>
      {/* <script src="https://www.WebRTC-Experiment.com/RecordRTC.js"></script> */}
      <script src="/socket.io/socket.io.js"></script>
      <script>
        socket = io();
      </script>
    </React.Fragment>
  )
}
