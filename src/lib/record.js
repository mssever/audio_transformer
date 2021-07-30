import RecordRTC, { StereoAudioRecorder } from 'recordrtc'
import adapter from 'webrtc-adapter'

export class Recorder {
  constructor(id) {
    (async () => {
      this.id = id
      this.seq = 0
      this.stream = await navigator.mediaDevices.getUserMedia({video: false, audio: true})
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
      timeSlice: 10,
      ondataavailable: async blob => {
        let seq = this.seq++
        let data = await blob.arrayBuffer()
        data = Buffer.from(data)
        console.log({seq, data})
      },
      sampleRate: 22050,
      desiredSampleRate: 22050,
      numberOfAudioChannels: 1
    })
  }

  startRecording() {
    this.recorder.startRecording()
    console.log('recording started')
  }

  stopRecording() {
    this.recorder.stopRecording()
    console.log('recording stopped')
    this.setRecorder()
  }
}
