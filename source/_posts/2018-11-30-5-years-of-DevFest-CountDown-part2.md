title: 5 years of DevFest CountDown - Part 2
tags:
  - DevFest
  - Canvas
category:
  - Conference
toc: false
date: 2018-11-30 17:05:00
---

This article is the second of series ( [5 years of DevFest CountDown - Part 1](https://jef.binomed.fr/2018/11/30/2018-11-30-5-years-of-DevFest-CountDown-part1))

# 2016

### The year of fail 😅


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/gdg_logo_legonnary.png" width="400px">
</div>

This year had the theme of 'Lego' so I had in mind an interactive game where people draw some "pixel art" with Lego bricks and submit them for the main screen. It was a good idea but my code this year wasn't robust enough and the real-time database contained some corrupted data and everything crashed 30min before the official launch!

We had to hide the game and we just displayed the basic countdown with music. If you are interested in the architecture, I wrote a series of article about it: [Legonnary](https://jef.binomed.fr/2016/12/23/2016-12-23-legonnary) ⚠️ those articles are in French 🇫🇷 for the moment. I will try to translate them when I have time.

Just notice that it was a PWA application that uses Firebase (real-time database, hosting, auth).

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/Legonnary_Archi.png" width="800px">
</div>

I created 4 web pages:
* The game that the user used
* The interface that the moderator used
* The interface that corresponds to the main screen with the countdown
* The interface that shows a summary of all the generated drawings


### The year of ES6

As ES6 was starting to be everywhere, I started to rethink a little bit my code to make it more reusable.

I created a class for the audio player :

```javascript
'use strict'
import {
    PLAYLIST
} from './playlist.js';

/**
 * Class for playing music
 *
 * We create an invisible audio element and we play music on it
 */
export class AudioPlayer {
    constructor() {
        this.indexPlayList = 0;
        this.currentIndex = 0;
        this.audioElt = document.createElement('audio');
        this.audioElt.style.display = 'none';
        document.body.appendChild(this.audioElt);
        window.addEventListener('beforeunload', this._unload.bind(this));
        this._startPlayer();
    }


    _startPlayer() {
        if (localStorage['devfestCountdown-LastSong']) {
            this.indexPlayList = +localStorage['devfestCountdown-LastSong'];
            if (this.indexPlayList >= PLAYLIST.length) {
                this._nextSong();
            } else {
                this._playSound(`./assets/audio/${PLAYLIST[this.indexPlayList]}`);
                this.audioElt.currentTime = +localStorage['devfestCountdown-currentTime'];
            }
        } else {
            this._nextSong();
        }
    }

    _unload() {
        localStorage['devfestCountdown-LastSong'] = `${this.currentIndex}`;
        localStorage['devfestCountdown-currentTime'] = `${this.audioElt.currentTime}`;
    }

    /**
     * Play a song according to the url of song
     */
    _playSound(url) {
        this.audioElt.pause();
        this.audioElt.src = url;
        this.audioElt.play();
        this.audioElt.onended = this._nextSong.bind(this);
    }

    /**
     * Skip to the next song
     */
    _nextSong() {
        try {
            this.currentIndex = this.indexPlayList;
            this._playSound(`./assets/audio/${PLAYLIST[this.indexPlayList]}`);
            this.indexPlayList = (this.indexPlayList + 1) % PLAYLIST.length;
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Update the sound volume of audio element
     */
    manageSoundVolume(delta) {
        if (delta < 10 * 1000) {
            this.audioElt.volume = Math.min(Math.max(0, delta / (10 * 1000)), 0.5);
        }
    }
}
```

And the same thing for the video player:

```javascript
'use strict'

/**
 * Class for playing video
 *
 */
export class VideoPlayer {
    constructor(parentElt, callBackEnd) {
        this.videoElt = document.createElement('video');
        parentElt.appendChild(this.videoElt);
        this.videoName = 'MotionDevfest2017_HQ.mp4';
        this.callBackEnd = callBackEnd;
    }

    /**
     * Play the video
     */
    playVideo() {
        this.videoElt.pause();
        this.videoElt.src = `./assets/video/${this.videoName}`;
        this.videoElt.play();
        this.videoElt.onended = this.callBackEnd.bind(this);
    }

}
```

### Code

You can find the code here: [CountDown DevFest 2016](https://github.com/GDG-Nantes/CountDownDevFest2016).


# 2017


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/DevFestDraw_screen.png" width="800px">
</div>

### The revenge!!

As in 2016, I created a whole application with moderation, a display on the screen... I didn't want to put everything I did into the trash. So I reused the code, did some evolutions and wanted to complexify the project. Indeed, I introduced some machine learning in order to try to recognize what the attendees drew. Here is the workflow of the application


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/DevFestDraw_Validation.png" width="800px">
</div>

1. A user submits a drawing
2. The drawing is uploaded to firebase, caught by a cloud function
3. The cloud function asks a machine learning model to analyze the image and try to classify it.
4. The moderator sees the drawing to validate (I wanted to be sure that the content will not break the code of conduct 😅)
5. The drawing is moved somewhere in the tree of real-time database
6. All valid drawing are shown on the main screen with their classifications.


### Recap of architecture


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/DevFestDraw_Archi.png" width="800px">
</div>

I tried to use the power of serverless as much as I could. So what I add this year was the additionnal services:
* A cloud function to listen to new drawing in the firebase tree based on Firebase Admin SDK
* A Machine learning model utilized to recognize the drawing based on Cloud ML
* Google Cloud Storage to save the drawings

### Machine learning addon

The biggest addition of 2017 was the machine learning detection. So to use it, I created a cloud function that used the Firebase Admin SDK to listen to new additions of drawings :

1. The user creates a drawing.
2. He submits it and the application uploads the drawing to cloud storage
3. The cloud function starts
4. The drawing is compressed and converted to a greyscale image of 28x28 pixels (it's because the model was trained to recognize a grayscale image of this size and to be as efficient as we can)
5. The model is interrogated
6. The drawing is classified
7. The cloud function updates the firebase model in order to change the state of the drawing to continue the workflow.

As I'm not a specialist on Machine Learning, I Asked some help from a Googler from New York [Yufeng Guo](https://twitter.com/YufengG). He did all the stuff of training the model. He trained a machine learning model based on 'black and white' image of 28x28 pixels. I had to do a conversion between what I received and what I sent to the ML engine. The image:

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/DevFestDraw_before.png" >
</div>

Will be sent to the engine like this:

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/DevFestDraw_after.png" >
</div>

As you can imagine there will be a lot of misunderstanding of the model, It was the game 😃

Here is the package.json used:

```javascript
{
  "name": "functions",
  "description": "Cloud Functions for Firebase",
  "dependencies": {
    // Use for the cloud storage
    "@google-cloud/storage": "^1.4.0",
    // A wrapper to use child_process in promise
    "child-process-promise": "^2.2.1",
    // Use for manipulating the realtime database
    "firebase-admin": "~5.2.1",
    // Mandatory for firebase cloud functions
    "firebase-functions": "^0.6.2",
    // A helper library for environement variables
    "dotenv": "^4.0.0",
    // A library to manipulate the images (compression, grayscale, ...)
    "get-pixels": "^3.3.0",
    // Libraries to talk with google authentication
    "google-auth-library": "^0.11.0",
    "googleapis": "^22.2.0"
  },
  "private": true
}
```

Let's have a look at the code of my cloud function

```javascript
/**
 * Method trigger when an image is upload
 */
exports.detectImage = functions.storage.object().onChange(event => {
    const object = event.data; // The Storage object.

    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
    const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

    ...
    try {
        const userId = path.dirname(filePath).split(path.sep).pop();
        const drawId = path.basename(filePath, '.jpg');

        return prediction.predictPromise(event)
            .then((result) => {
                console.log('Got result for drawId : ' + drawId);
                return updateTree(userId, drawId, result);
            })
            .catch((err) => {
                console.log('Error trapped !');
                console.error(err);
                return updateTree(userId, drawId);
            });;
    } catch (e) {
        console.log('Error trapped by catch !');
        console.error(e);
    }
    return;
});
```

The method `prediction` calls some Cloud ML APIs, you can find the detail of the implementation here [prediction.js](https://github.com/GDG-Nantes/CountDownDevFest2017/blob/master/functions/prediction.js). After getting the result of the classification, I had to update the drawing (changing its parent in the Tree).

```javascript
function updateTree(userId, drawId, result) {
    return new Promise((resolve, reject) => {
        admin.database().ref(`/drawUpload/${drawId}`).once('value', (snapshot) => {
            try {
                // prepare to update the tree
                if (snapshot && snapshot.val()) {
                    let snapshotFb = snapshot.val();
                    // Update the drawing with the classifications
                    snapshotFb.tags = extractTags(result);
                    // Add the drawing in a new part of tree
                    admin.database().ref(`/draw/${drawId}`).set(snapshotFb)
                        // When it's done, I remove the drawing from it's old path
                        .then(() => admin.database().ref(`/drawUpload/${drawId}`).remove())
                        .then(() => {
                            resolve();
                        })
                        .catch((reason) => {
                            reject(reason);
                        });
                }
            } catch (e) {
                reject(e);
            }
        }, (error) => {
            reject(error);
        });
    });
}
```

### My Conclusion

The conclusion of this year was that creating an interactive game is something finally easy if you have the rights tools! Using Firebase was a good idea because I don't have to manage the following aspects:  deployment, installations, load, simple authentication, secure access...

During a short time (less than 30 min), I got 140 players that created around 250 drawings. It was a huge success for me.


### Code & Demo

You can find the code here: [CountDown DevFest 2017](https://github.com/GDG-Nantes/CountDownDevFest2017).

If you want to see what people drew, have a look here [Summary of CountDown 2017](https://devfest-draw.firebaseapp.com/summary.html)



# What's Next

See [5 years of DevFest CountDown - Part 3](https://jef.binomed.fr/2018/11/30/2018-11-30-5-years-of-DevFest-CountDown-part3)

<!-- Imports to use for interactivité -->
<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="module" src="/assets/2018-11-countdown/countdown.js"></script>