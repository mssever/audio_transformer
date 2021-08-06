#!/usr/bin/liquidsoap -v

log.file.path.set("/tmp/<script>.log")
log.stdout.set(true)

recipe = # <fill this>
output(recipe)
# play -r 44100 -c 1 -t raw -b 16 -e signed tmp.00000000.wav.raw
