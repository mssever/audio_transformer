import React, { Component } from "react";
import { Link } from 'react-router-dom'
import Navbar from "./Navbar";
import Player from "./Player"

const filename = "/home/scott/misc/music/Choir/He Loved Me/soprano.mp3"
const title = 'He Loved Me'
const server = 'http://192.168.1.100:3605'

export default class Home extends Component {
  render() {
    return (
      <main>
        <Navbar />
        <h1>Audio Transformer</h1>
        <Player src={filename} title={title} server={server} />
        <Link to="/record/test_id">Record</Link>
      </main>
    )
  }
}
