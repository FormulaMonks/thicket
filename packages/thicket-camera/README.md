# thicket-camera

A camera component, built for React, used by the Thicket web app.

# Usage

Install with `npm` or `yarn`, and import it with the syntax of your choice:

``` js
import Camera from 'thicket-camera'
// or
var Camera = require('thicket-camera')
```

**Props**: The only required prop is `onSave`:

``` jsx
<Camera
  onSave={dataUrl => {
    const myImage = new Image()
    myImage.src = dataUrl
    document.body.appendChild(myImage)
  }
/>
```

# Styling

The style of thicket-camera is deliberately bare-bones so that you can style it to match your own app. You can do this by overriding the following class names:

``` jsx
  <Camera
    classNames={{
      cameraWrap: '',
      videoWrap: '',
      controlsWrap: '',
      controlsTitle: '',
      controlsButton: '',
      progressLabel: '',
      progressBarWrap: '',
      progressBarBar: '',
      loadingSpinner: '',
      loadingTitle: '',
      loadingMessage: '',
      reviewWrap: '',
      reviewTitle: '',
      reviewMsg: '',
      reviewPreview: '',
      reviewControlsWrap: '',
      reviewButton: '',
      reviewRedo: '',
      reviewApprove: '',
    }}
  />
```

# Contributing

To run this code locally:

1. Clone the repo
2. Run `yarn` in the project directory to install all dev dependencies
3. Run `yarn start` to run the demo locally
4. Visit `localhost:3000` in your browser to see it as you make changes

Please submit pull requests from a non-`master` branch.

# About Citrusbyte

![Citrusbyte](http://i.imgur.com/W6eISI3.png)

This software is lovingly maintained and funded by Citrusbyte. At Citrusbyte, we specialize in solving difficult computer science problems for startups and the enterprise.

At Citrusbyte we believe in and support open source software.

* Check out more of our open source software at Citrusbyte Labs.
* Learn more about [our work](https://citrusbyte.com/portfolio).
* [Hire us](https://citrusbyte.com/contact) to work on your project.
* [Want to join the team?](http://careers.citrusbyte.com)

*Citrusbyte and the Citrusbyte logo are trademarks or registered trademarks of Citrusbyte, LLC.*
