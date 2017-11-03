export default class ImageDataConverter {
  constructor(dataURI) {
    this.dataURI = dataURI
  }

  getByteString() {
    if (this.dataURI.split(',')[0].indexOf('base64') >= 0) {
      return atob(this.dataURI.split(',')[1])
    }
    return decodeURI(this.dataURI.split(',')[1])
  }

  convertToTypedArray() {
    let byteString = this.getByteString()
    let ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return ia
  }
}
