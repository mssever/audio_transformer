import SocketScript from "./SocketScript";
import { Recorder } from '../lib/record'
import React from "react";
import Navbar from "./Navbar";

export default class Record extends React.Component {
  constructor(props) {
    super(props)
    this.id = props.match.params.id
    this.recorder = new Recorder(this.id)
    this.recordingInProgress = false

    this.handleRecordSwitch = this.handleRecordSwitch.bind(this)
  }

  handleRecordSwitch(e) {
    // debugger
    let box = document.querySelector('#recording-switch')
    if(this.recordingInProgress) {
      this.recorder.stopRecording()
    } else {
      this.recorder.startRecording()
    }
    this.recordingInProgress = !this.recordingInProgress
    box.checked = this.recordingInProgress
  }

  componentDidMount() {
    document.querySelector('#recording-switch').addEventListener('change', this.handleRecordSwitch)
    document.querySelector('#recording-switch-label').addEventListener('change', this.handleRecordSwitch)
  }

  render() {
    return (
      <React.Fragment>
        <Navbar/>
        <h2>Record</h2>
        <p>Turn on the switch to start recording. Turn it off to stop.</p>
        <div className="form-check form-switch">
          <SocketScript/>
          {/* <button id="btn-record" className="btn btn-primary me-3" onClick={() => {
            this.recorder.startRecording()
            document.querySelector('#btn-stop').disabled = false
            this.disabled = true
          }}>Record</button>
          <button disabled="disabled" id="btn-stop" className="btn btn-primary me-3" onClick={() => {
            this.recorder.stopRecording()
            document.querySelector('#btn-start').disabled = false
            this.disabled = true
          }}>Stop</button> */}
          <input type="checkbox" name="recording-switch" id="recording-switch" className="form-check-input" />
          <label htmlFor="recording-switch" id="recording-switch-label" className="form-check-label">Record</label>
        </div>
      </React.Fragment>
    )
    }
}
