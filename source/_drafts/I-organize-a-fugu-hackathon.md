title: I Organize a hackathon on Project Fugu
tags:
  - web
  - fugu
category:
  - Event
toc: false
---

A month ago, I organize (with a colleague of mine, [Gérôme Grignon](https://twitter.com/geromegrignon)) a Hackathon based on Project Fugu "Shape Detection API".

![morty](/assets/2020-10-push-the-limit/push-the-limit.png)

As you can imagine, We want to create a fun Hackathon, a hackthon where the fun and the creativity where more important than the social impact of the result 😅.

The main idea of this hackathon was to play with the [Shape Detection API](https://web.dev/shape-detection/). 

>TLDR; This API lets you find your shapes in images. The shape is restricted by the web platform, you could recognize a face, a BarCode or a text (not implemented yet)

# Under the hood

This API is interesting because with very few lines of codes you have something that gives you the position of shape detected in an ImageBitmapSource. An image is nice, but a canvas is better 😉. Indeed, a canvas can generate data that the detector could interpret.

Here is for example how you can detect a face: 

```javascript
const faceDetector = new FaceDetector({
  // (Optional) Hint to try and limit the amount of detected faces
  // on the scene to this maximum number.
  maxDetectedFaces: 5,
  // (Optional) Hint to try and prioritize speed over accuracy
  // by, e.g., operating on a reduced scale or looking for large features.
  fastMode: false
});
try {
  const faces = await faceDetector.detect(image);
  faces.forEach(face => console.log(face));
} catch (e) {
  console.error('Face detection failed:', e);
}
```

The object face returned is an array with all positions of the detected faces in the image or canvas.

Here is the result of face detection: 

```javascript
[
    {
        boudingBox: // DOMRectReadOnly / The position and size of the face
        {
            bottom: xxx.xxx // absolute bottom position in the image
            height: xxx.xxx // absolute height in the image
            left: xxx.xxx // absolute left position in the image
            right: xxx.xxx // absolute right position in the image
            top: xxx.xxx // absolute top position in the image
            width: xxx.xxx // absolute width in the image
            x: xxx.xxx // absolute left position in the image
            y: xxx.xxx // absolute top position in the image
        },
        landmarks: // Some points to position eyes, mouth and nose
        [
            {
                type: 'eye', // could be also 'mouth' or 'nose'
                locations: // Array of point that you use to draw the part of face
                [
                    {
                        x: xxx.xxx // left position of element in the image
                        y: xxx.xxx // right position of element in the image
                    }
                    , ...
                ]
            }
            ,...
        ]
    }
    ,...
]
```
Here is the result of barcode detection: 

```javascript
[
    {
        boudingBox: // DOMRectReadOnly / The position and size of the face
        {
            bottom: xxx.xxx // absolute bottom position in the image
            height: xxx.xxx // absolute height in the image
            left: xxx.xxx // absolute left position in the image
            right: xxx.xxx // absolute right position in the image
            top: xxx.xxx // absolute top position in the image
            width: xxx.xxx // absolute width in the image
            x: xxx.xxx // absolute left position in the image
            y: xxx.xxx // absolute top position in the image
        },
        format: 'qr_code', // Could be 'aztec', 'code_128', 'code_39', 'code_93', 'codabar',
        // 'data_matrix', 'ean_13', 'ean_8', 'itf', 'pdf417', 'qr_code', 'upc_a', 'upc_e'
        rawValue: 'text in the code', // the value of the barcode
        cornerPoints: // Position of corner points of barcode
        [
            {
                x: xxx.xxx // left position of element in the image
                y: xxx.xxx // right position of element in the image
            }
            , ...
        ]
    }
    ,...
]
```

For the moment the TextDectector is not yet Implemented 😅.

# Some Helpers for particpants

Even if the API is really easy to use, combine it to video, canvas, a performant mechanism is a synonym of lots boilerplate. Indeed, when you want to play with the camera, you need to follow those steps to be sure to not block your thread.

1. Start the camera with the correct parameters
1. Inject the stream to an HTML `video` element (and keep a copy somewhere)
1. Start to play with `requestAnimationFrame` to be sure to optimize the rendering.
1. On each frame, draw the video on your canvas
1. Start a detection in asynchronous mode (the result will arrive in another frame)
1. If a result of detection is present, then you can draw something

Each of those steps has specific code and it could be lots of code for just detection and drawing something 😅. That's why we create some helpers that you could use too if you want for your projects.

## Detector.js

This file will wrap and expose methods to use to detect things on the image

```javascript
class Detector {

  /**
  * Will create the write dectector object according to the type.
  * @param type: the type of detector to use -> see constant TYPES to use the correct types
  * @param options: each detector should work with specifics options that could override. Check the desire constant. Note that text detector don't need options
  **/
  constructor(type, options) {}

  /**
  * Where the magic happens ;)
  * @param image: the source image or canvas where we want to detect something
  * @returns a Promise with the result of the detection
  **/
  detect(image) {}
}

/**
* Helper function to check if the browser supports the feature
* @return true or false according to your browser support
**/
function isAvailable(type) {}

/**
* The managed types
*/
const TYPES = {
  face: "face",
  text: "text",
  barcode: "barcode"
};

/**
* The options of face
* You can override the number of detected faces
* FastMode is to use when you want to have a quick result. The result will be less precise if fastMode is set to true
*/
const OPTIONS_FACE = {
  maxDetectedFaces: 1,
  fastMode: false
};

/**
* The list if BARCODE format to check. You can reduce this list if you want to speed detection process
**/
const OPTIONS_BARCODE = {
  formats: [
    "aztec",
    "code_128",
    "code_39",
    "code_93",
    "codabar",
    "data_matrix",
    "ean_13",
    "ean_8",
    "itf",
    "pdf417",
    "qr_code",
    "upc_a",
    "upc_e"
  ]
};
```

The source code is available here [Gist Detector](https://gist.github.com/jefBinomed/031d77184db58768468e81738108ee7b#file-detector-js)

## UserMedia.js

UserMedia is the API used to request camera input. We create this class :

```javascript
class UserMediaHelper {

  /**
  * @param canvas: the dom element corresponding to canvas
  * @param video: the dom element corresponding to video
  * @param videoArea: the dom element around the canvas (to fix the size of the output video)
  **/
  constructor(canvas, video, videoArea) {}

  /**
  * Method to call to receive the results of the detection
  * @param type: the type of detector to use -> See the Helper Detector to have more information
  * @param options: the options passed to the previous detector. If you want to use TextDetector, please give "null" as value
  * @param callback: the callback function that will receive the results of the detection. The function should be like (detectedObject)=>{}
  **/
  addDetectorCallbak(type, options, callback) {}

  /**
  * Method to call if you want to draw something on the canvas based on the detection
  * @param callBackFunction: the method call at every frame to draw on the canvas. The function should be like (context, video, canvas) => {}
  **/
  addCallbackDraw(callBackFunction) {}

  /**
  * This method should be called to stop the process of captation and detection
  **/
  stop() {}

  /**
  * Call this method to start the captation and detection process
  **/
  async getUserMedia() {}
}
```

The source code is available here [Gist usermedia](https://gist.github.com/jefBinomed/031d77184db58768468e81738108ee7b#file-usermedia-js)

As you can see, the UserMedia helper uses a detector.

The Helper provides also a method to stop in the right way your camera 😎.

## CodeSandBox

To continue to help the attendees, we create a codesandbox sample to clone to be sure that attendees could start directly. Here is the result of the codesandbox.

To be sure that it will works with your configuration, check if you have activated the flags.

* Demo: [Pickle Rick Me](https://bg3o4.csb.app/)
* CodeSandBox to clone: [CodeSandBox Push The Limit](https://codesandbox.io/s/young-tree-bg3o4?)

### Demos writen

Here is the list of demos people write :)
* Face Face Revolution (a dance dance revolution but with your face): https://codesandbox.io/s/z3opl
* Draw a pickle rick if find a BarCode (android only): https://codesandbox.io/s/891md
* Like Pickel Rick but with a random character of smash ultimate game: https://codesandbox.io/s/festive-wiles-f9hbs?file=/src/index.js
* Draw a "joker" smile and if you open your mouth show a grumpycat (only specifics version, see bugs and restrictions after): https://codesandbox.io/s/elegant-mayer-up20v
* A Game where a Pickle Rick have to eat pickle coming from the top of the screen: https://codesandbox.io/s/young-flower-s0162

### Special Trick for image

During the preparation of this hackathon, we face a problem with the pickle image and the drawing of the pickle on the canvas. Indeed, I didn't know it before but Canvas is also sensible to CORS origin security when you draw an image! 

To understand that, you have to understand that codesandbox doesn't host the image in the same origin of your page. The resource is redirected under the hood to a bucket S3. To bypass this problem, we simply write a script that downloads the image from the amazon server, extracts the data, converts them to base64 and injects this base64 data as the source to the original `img`. In that way, you can continue to draw images on canvas without facing any CORS problem 🥳

```javascript
export function prepareImage(img) {
  return new Promise((resolve) => {
    fetch(img.src)
      .then((response) => response.blob())
      .then((blob) => {
        var reader = new FileReader();
        reader.onload = function () {
          img.src = this.result;
          resolve();
        }; // <--- `this.result` contains a base64 data URI
        reader.readAsDataURL(blob);
      });
  });
}
```

# What we learn

During this session, we have a different kinds of developers and environment so here is the conclusion in **'Oct 2020'**.

Please have in mind that Shape Detection API is still an experimental API, so the conclusion what I will write now could be not the same as what you see when you will read this post.

## FaceDetector 

The face detection is working well but not everywhere. Indeed, we couldn't make it work on those platform: 
* Chrome Android (it's a bug [bc1107675](https://bugs.chromium.org/p/chromium/issues/detail?id=1107675)) When this article is written, a fix has been deployed and should be shipped with chrome 88
* Chrome Linux (it has never worked [Overview api](https://github.com/WICG/shape-detection-api#overview))
* Chrome Mac -> The landmarks aren't well positioned (it's a bug too [bc914348](https://bugs.chromium.org/p/chromium/issues/detail?id=914348))

Fun fact, the face recognition is based on eyes position, it is a COVID proof API 😷😅.

If you wear glasses but big glasses, the recognition could be very lacky.

![Gérôme](/assets/2020-10-push-the-limit/gerome.jpeg)

Indeed Gérôme as you can see wear big glasses. When he wears them, the face recognition wasn't very smooth, my Pickle Rick move with visible steps. But when he removes its glasses, the Pickle Rick follow its face.

<video src="/assets/2020-10-push-the-limit/big-glasses.mp4"  type="video/mp4" controls></video>

The bug of Landmarks could be for the moment bypass by using `fast` mode. This bug is dependant on your platform. Here are the results according to the platform I could test: 

![Chrome Canary 88.0.4306.0 - MacOS 10.14.6](/assets/2020-10-push-the-limit/canary_88.0.4306.0.png)

![Chrome Stable 86.0.4240.111 - MacOS 10.14.6](/assets/2020-10-push-the-limit/stable_86.0.4240.111.png)

![Chrome Canary 88.0.4306.0 - MacOS 10.15.7](/assets/2020-10-push-the-limit/canary_88.0.4306.0-MacOS_10.15.7.png)

![Chrome Stable 86.0.4240.111 - MacOS 10.14.6 - fast mode](/assets/2020-10-push-the-limit/stable_86.0.4240.111-fast.png)

You could test this at this url : https://mona-lisa.glitch.me/ or https://mona-lisa.glitch.me/?fast

## BarCodeDetector

The BarCodeDetector which was working previously on Android and Desktop is just working on Android for devices with the PlayServices. It's a limitation for the moment but we could hope that tomorrow, something based on non "native" solution will arrive: 

>This API is part of the new capabilities project. Barcode detection has launched in Chrome 83 on certified devices with Google Play Services installed. Face and text detection are available behind a flag. This post will be updated as the Shape Detection API evolves

But it works in those conditions 🤗


## TextDetector

This feature isn't yet implemented in the tested devices so no-one could test it. And Google is also alerting that it's not universally available.


<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="text/javascript" src="/assets/2020-10-push-the-limit/push-the-limit.js"></script>