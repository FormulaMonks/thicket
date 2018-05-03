(() => {
  const pattern = /safari/i
  if (pattern.test(navigator.userAgent)) {
    require('webrtc-adapter')
  }
})()
