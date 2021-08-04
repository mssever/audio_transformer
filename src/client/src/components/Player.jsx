import React from 'react'
import Navbar from './Navbar'

export default function Player({match}) {
  let id = match.params.id
  const url = new URL(location.origin + '/api/play')
  url.searchParams.set('id', id)
  return (
    <main>
      <Navbar/>
      <figure>
        <figcaption></figcaption>
        <audio controls src={url}>
          Your browser does not support the <code>audio</code> element.
        </audio>
      </figure>
    </main>
  )
}
