export const GIF_DURATION = 3000

export const GIF_OPTIONS = {
  // Desired width of the image
  'gifWidth': 400,
  // Desired height of the image
  'gifHeight': 300,
  // Whether or not the animated GIF text will be resized to fit within the GIF container
  'resizeFont': true,
  // Note: Each frame is captured every 100 milleseconds of a video and every ms for existing images
  'numFrames': GIF_DURATION / 100,
}
