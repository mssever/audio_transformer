# Audio Transformer

## About

This project was born out of a desire to modernize real-time voice interpretation between languages at live events. The use case I had in mind when planning this project was to enable Spanish-speaking attendees at my church to be able to listen to a translation of the service into their language using only their phones and headphones.

Key desires include being 100% browser-based so that users don't need to install any software. In addition, the server should be able to be hosted locally so that data can be kept on the internal wireless network, thus conserving upstream bandwidth.

## Current Status

This is a pre-alpha project. The most essential features work, but there is enough work yet to do that it isn't yet in use in the wild.

## Installation

I've tested this on Ubuntu. In theory, it should run on any system that has the required dependencies, though I suspect that making it run well on Windows would be a chore.

1. Make sure you have a recent version of Node.js installed. I've tested it on
   version 14.17.4. Then `cd` into the project directory and run `npm install`.
2. You also need the Unix utility `sox`.

<!-- 2. Install Liquidsoap. On Ubuntu systems, you can do this:
   `sudo apt install liquidsoap`. On other systems,
   [see the Liquidsoap documentation][liq-install]. -->

[liq-install]: https://www.liquidsoap.info/doc-dev/install.html
