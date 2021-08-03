import RecordRTC, { StereoAudioRecorder } from 'recordrtc'
import { io } from "socket.io-client";
import adapter from 'webrtc-adapter' // unused because merely importing this library is sufficient to enable the polyfill

import config from '../lib/config.js'

export class Recorder {
  constructor(id) {
    this.id = id
    this.seq = 0;
    (async () => {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({video: false, audio: true})
      } catch(err) {
        console.error(err)
      }
      console.log('stream', this.stream)
      this.setRecorder()
      console.log('recorder', this.recorder)
    })()

    this.setRecorder = this.setRecorder.bind(this)
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
  }
  
  /*
  This is a separate method because the recorder won't fire the ondataavailable
  event after it's been stopped and restarted. As a workaround, it is re-created
  every time it's stopped.
  */
  setRecorder() {
    this.recorder = new RecordRTC(this.stream, {
      type: 'audio',
      mimeType: 'audio/webm',
      recorderType: StereoAudioRecorder,
      timeSlice: 3000,
      ondataavailable: async blob => {
        let seq = this.seq++
        let data = await blob.arrayBuffer()
        // data = Buffer.from(data)
        console.log({seq, data})
        if(this.socket.connected) {
          // this.socket.emit('audio'+this.id, {seq, data})
          this.socket.emit('audio'+this.id, {seq})
        }
      },
      sampleRate: 22050,
      desiredSampleRate: 22050,
      numberOfAudioChannels: 1
    })
    // debugger
    
  }

  startRecording() {
    this.socket = io(config.socket.protocol + config.socket.host)
    // debugger
    this.socket.on('connection', (socket) => {
      console.log('socket connected - client', socket)
      socket.on('ping', ()=>console.log('ping'))
      socket.on('test', (msg)=>console.log(msg))
      this.heartbeat = setInterval(()=>socket.emit('ping'), 100)
    })
    console.log({socket: this.socket})
    this.recorder.startRecording()
    this.socket.emit('start recording', {id: this.id})
    console.log('recording started')
  }

  stopRecording() {
    clearInterval(this.heartbeat)
    this.socket.emit('stop recording', {id: this.id})
    this.recorder.stopRecording()
    this.socket.emit('close'+this.id)
    this.socket.close()
    this.socket = undefined
    console.log('recording stopped')
    this.setRecorder()
  }
}
