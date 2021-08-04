import React, { Component } from "react";
import { Link } from 'react-router-dom'
import Navbar from "./Navbar";
// import Player from "./Player"
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { IconContext } from "react-icons"
import { TiMediaPlay as PlayIcon, TiMediaRecord as RecordIcon } from 'react-icons/ti'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      audioID: "tmp"
    }

    this.handleAudioIDChange = this.handleAudioIDChange.bind(this)
  }

  handleAudioIDChange() {
    let val = document.querySelector('#audio_id').value
    if(val == '') val = tmp
    this.setState({
      audioID: val
    })
  }

  render() {
    return (
      <main>
        <Navbar />
        <h1>Audio Transformer</h1>
        {/* <Player src={filename} title={title} server={server} /> */}
        <Form inline className="mb-3">
          <FormGroup>
            <Label for="audio_id">Enter the audio ID to use.</Label>
            <Input type="text" name="audio_id" id="audio_id" placeholder="e.g., test_id" onChange={this.handleAudioIDChange} />
          </FormGroup>
        </Form>
        <IconContext.Provider value={{
          color: 'white',
          size: '3em',
          style: {verticalAlign: 'middle'}
        }}>
          <Link
            className="me-3"
            to={`/play/${this.state.audioID}`}
            title={`Play (${this.state.audioID})`}
            aria-label={`Play (${this.state.audioID})`}
          >
            <Button color="primary" aria-hidden><PlayIcon/></Button>
          </Link>
          <Link
          className="me-3"
            to={`/record/${this.state.audioID}`}
            title={`Record (${this.state.audioID})`}
            aria-label={`Record (${this.state.audioID})`}
          >
            <Button color="primary" aria-hidden><RecordIcon/></Button>
          </Link>
        </IconContext.Provider>
      </main>
    )
  }
}
