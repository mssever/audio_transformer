export default class AudioChunk {
  constructor(id, seq, mimeType) {
    this.id = id
    this.seq = seq
    this.mimeType = mimeType
    this.data = {}
  }

  setData({format, data}) {
    if (data.data) data = data.data
    this.data[format] = data
    return this
  }
}
