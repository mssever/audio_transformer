# Installation

I've tested this on Ubuntu. In theory, it should run on any system that has the required dependencies, though I suspect that making it run well on Windows would be a chore.

Potential Windows issues:

- I don't know if sox is available for Windows. I haven't checked. At any rate, this dependency will hopefully be going away soon.
- Some NPM modules include C++ code. Getting a working C++ compiler on Windows is a pain.
- The current implementation depends on a collection of FIFOs. I don't know whether Windows supports FIFOs.

All of these issues can likely be resolved by using WSL (Windows Subsystem for Linux).

## Installation Steps

1. Make sure you have a recent version of Node.js installed. I've tested it on
   version 14.17.4. Then `cd` into the project directory and run `npm install`.
2. Make sure `sox` is installed. In Ubuntu or Debian, do `sudo apt install sox`
3. Configure at least the required environment variables. Any method of doing so will suffice, but the preferred method is to create a file in the project root directory called `.env`. In that file, create the environment variables as you would in a Bash shell. For example: `PORT=3605`

    These are the variables that you can configure:

    - `PORT`: The port the server listens on. Required.
    - `SERVER_IP`: The IP address or hostname (FQDN) of the server. Required.
    - `DB_HOST`: The hostname or IP address of the database server. Optional: Defaults to `localhost`.
    - `DB_PORT`: The port the DB server listens on. Optional: Defaults to `3306`
    - `DB_USER`: The database username. Optional until the database is implemented.
    - `DB_PASSWORD`: The database password. Optional until the database is implemented.
    - `DB_NAME`: The database name. Optional: Defaults to `audio_transformer`
