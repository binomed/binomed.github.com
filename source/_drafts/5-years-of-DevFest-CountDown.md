title: 5 years of DevFest CountDown
tags:
  - DevFest
  - Canvas
category:
  - Conference
toc: false
---

I organise the [DevFest Nantes](https://devfest.gdgnantes.com) as a volonteer of [GDG Nantes](https://gdgnantes.com) for already 7 years.

If you don't know what "DevFest" is, it's a worldwide event lead by the GDG community. You could have a look here [DevFest With Google](https://devfest.withgoogle.com).

Each year we work very hard to provide the best experience for our atendees. We try to make DevFest Nantes the most accessible (only 90€ for 2 days with food, goodies, party, conference, ...). And one of the thing I'm responsible of is the Countdown! Indeed, if you already go to Google I/O, you know that when you are waiting for the launch of the keynote, Google prepare you a nice Coutndown animation to let you play with the other attendees! We love so much this experience that we try to create ours to keep that spirit. With this article I will try to share thoses countdown and try to explain you what I've learn with each of them.


# Before 2014


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/original_io_countdown.jpg">
</div>

Before I start to write my own Countdown, i first reuse a public countdown create for Google IO 2011 : [HTML5 Countdown Finale](https://experiments.withgoogle.com/google-io-conference-html5-countdown-finale). It works pretty well but it was not link to our graphical Theme. That's why I start in 2015 to create my own countdown

# 2014


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown2014.png" width="600px">
</div>

### The idea

Before starting to tink about "Interactivity" I had to take some times to check that everything works well! That's also one our mantra in DevFest Nantes, always build better over something strong ! So for the first Countdown, I start following the KISS approach : No Framework, No modules, just a simple html with a litle bit of css.

The basic idea of this Countdown was to animate the DevFest Nantes Tshirt.

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/tshirt_2014.png" width="400px">
</div>

This project let me think about the mandatory steps of Countdown :
1. Play music until the countdown is over
2. Launching a video when the countdown is over

Behind this 2 steps is hide a basic complexity. How to check without blocking the ui the current time ? How to play music and video ?

### Time management

For the first solution, I don't use the best solution : `setInterval` but it's a solution that won't block the ui! Now and you will see it in the other CountDown, I prefer to use `requestAnimationFrame`. Indeed, one of the most important point is avoid to block the eventloop.

```javascript
var cibleDate = Date.parse('2014-11-07T08:35:00Z')
var cancelInterval = setInterval(function() {
    currentTime+=100;            
    var deltaTime = cibleDate - currentTime;        
    var tmpDate = new Date(deltaTime);
    min.innerHTML = tmpDate.getMinutes() < 10 ? "0"+tmpDate.getMinutes() : tmpDate.getMinutes();
    sec.innerHTML = tmpDate.getSeconds() < 10 ? "0"+tmpDate.getSeconds() : tmpDate.getSeconds();
    manageSoundVolume(deltaTime);
    if (deltaTime <= 0 ){
        endCountDown();
    }
}, 100);
```

### Playing Song

For the second solution, even if there is a [Web Audio API](https://developer.mozilla.org/fr/docs/Web/API/Web_Audio_API) a simple `<audio>` tag hidden in the page do the job very well! In 2014, there wasn't the restriction of [autoplay policy](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes) so I can easily play a sound with this code : 

```javascript
// Index of curent song in the playlist
var indexPlaylist = 0;
// The playlist of songs to play
var playListSongs = [
    'The_Spin_Wires_-_Blackout_Romeo.mp3'
];

// Load the song in parameter and play it
function playSound(url){            
    audioElt.pause();
    audioElt.src = url;
    audioElt.play();
}

// Skip to the next song (and start from 0 if we overflow the index of array)
function nextSong(){
    try{
        playSound("assets/songs/"+playListSongs[indexPlaylist]);
        indexPlaylist = (indexPlaylist + 1) % playListSongs.length;
        
    }catch(err){
        console.error(err);
    }
}
```

### Graphical challenge

The only challenge I face was with the css to play with the good text transformation. So for this html:

```html
<div class="conteneur">
    <!-- Minutes Number (Left Column)-->
    <div class="jaune_clair min chiffre" id="min">00</div>
    <!-- Minutes Unit (Right Column)-->
    <div class="jaune_fonce min unit">m</div>

    <!-- Seconds Number (Left Column)-->
    <div class="jaune_clair sec chiffre" id="sec">00</div>
    <!-- Seconds Unit (Right Column)-->
    <div class="jaune_fonce sec unit">s</div>
</div>
```

You will have this css:

```scss
// Parent container
.conteneur{
  ...
  perspective : 500px;
}

// Numbers (left column)
.min.chiffre{
  top: 280px;
  left: 132px;
  transform : rotateY(73deg);
}

// Units (right column)
.min.unit{
  top: 286px;
  left: 241px;
  transform: rotateY(-47deg) rotateZ(-11deg) rotateX(11deg);
}
```

This give you this result

<div id="countdown-2014">
    <div class="conteneur">
        <img src="/assets/2018-11-countdown/tshirt_2014_final_xl_sans_texte.png" id="main">
        <div class="jaune_clair min chiffre" id="min">10</div>
        <div class="jaune_fonce min unit">m</div>
        <div class="jaune_clair sec chiffre" id="sec">55</div>
        <div class="jaune_fonce sec unit">s</div>
    </div>
</div>

And the last thing to do was to animate the text at the bottom of tower. I use the `marquee` tag because it's target to animate text in a box! Here the problem comes to the fact that I have 2 faces in my tower and I want to give the impression that the text "slide" arround the tower. To create this effet, I have to use 2 `marquee` and play a timeout that correspond to the time of the move of the text.

```html
<marquee behavior="scroll" direction="right" class="marquee_1">DevFest Nantes</marquee>
<marquee behavior="scroll" direction="right" class="marquee_2">DevFest Nantes</marquee>
```


```javascript
marquee_1.style.display = 'none';
marquee_2.style.display = 'none';
// The text "DevFest Nantes" takes 2500ms to go throught the marquee
setTimeout(function() {
    marquee_1.style.display = '';
    setTimeout(function() {
        marquee_2.style.display = '';
    }, 2500);
}, 100);
```

Here is the result : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown-2014-markee.gif" width="600px">
</div>

As you can see, there is lots of things to enhance. But it do the job, a uniq countdown linked to DevFest Nantes identity!

### Code & demo

You can find the code here : [CountDown DevFest 2014](https://github.com/GDG-Nantes/DevFestCountDown-2014).

If you want to see it in action, have a look here [CountDown 2014](http://gdg-nantes.github.io/DevFestCountDown-2014/)

# 2015

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown2015.png" width="800px">
</div>

### The idea

In 2015, the DevFest Theme was the retroGaming. So again, the countdown was inspired again by the t-shirt :

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/t-shirt_final_2015.png" width="500px">
</div>

The idea was to simulate a real "Space Invaders". As the tshirt show a space invader destroying Google technologies logos. I try to animate the spaceship in order to destroy the last logo at the last second.

### New Challenges

For this version, I try to keep it as simple as I can, I just introduce a minor toolchain for compiling my Sass files. The main challenge here was to calculate when to destroy or not a logo and how. For a smooth animation, I use a **Canvas**. As I start to play with canvas, I have to rethink some aspects : Animation, Ressources loading. I re-use the work of the previous year for the time management except that I start to use the `requestAnimationFrame` instead of `setTimeout`. Indeed, using `requestAnimationFrame`is something mandatory when you want to create something smooth. To understand why it is important, I encourage you to read more articles about the [Javascript EventLoop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop).

Or have a look at this conference from Jake Archibald about event loop:

<div style="text-align:center; width:100%;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/cCOL7MC4Pl0" frameborder="0" allowfullscreen></iframe>
</div>

### Ressources management

When you want to deal with ressources in video games, it's recommand to use 'sprite' image. 'Sprites' let you download all ressources in one time. As HTTP2 is not present everywhere. It's better to download 1 file than severals. The browser cannot open more than 6 (for chrome) separates thread for download, so prefer the one big cookie download.

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/logos_2015.svg" width="400px">
</div>

When you deal with 'sprites' images you have to position your cursor when you draw. With this technique, you will minimize the number of assets load in memory and gain some times for your first load.

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/drawImage.png" width="400px">
</div>

The main idea is to position your cursor and draw it your context:

```javascript
context = canvas.getContext('2d');
context.drawImage(imgSource //Source image
, sx //sx clipping of source image
, sy //sy clipping of source image
, sw // swidth clipping of source image
, sh // sheight clipping of source image
, dx // x coordinate of drawing in canvas
, dy // y coordinate of drawing in canvas
, dw // width size of drawing
, dh // height size of drawing 
);
```

In my case, I create a map to have a reference of each logo in the sprite. This map let me animate each logos and keep a reference of it's original position in the sprite : 

```javascript
positionLogos = {
    'photos' : {x : 400, y :430},
    'gplus' : {x : 720, y :440},
    'music' : {x : 1010, y :440},
    'maps' : {x : 1320, y :440},
    'calendar' : {x : 400, y :730},
    'keep' : {x : 720, y :730},
    'glass' : {x : 1010, y :730},
    'android' : {x : 1320, y :720},
    'compute' : {x : 400, y :1000},
    'play' : {x : 720, y :1000},
    'docs' : {x : 1010, y :1000},
    'sheets' : {x : 1320, y :1020},
    'draw' : {x : 400, y :1280},
    'youtube' : {x : 700, y :1280},
    'contacts' : {x : 1010, y :1280},
    'chrome' : {x : 1320, y :1280},
    'gmail' : {x : 400, y :1570},
    'playstore' : {x : 720, y :1570},
    'movies' : {x : 1010, y :1570},
    'hangout' : {x : 1320, y :1570},
    'drive' : {x : 400, y :1840},
    'news' : {x : 720, y :1840},
    'wallet' : {x : 1010, y :1840},
    'devs' : {x : 1320, y :1840}
},
```

Using a key will let me have a reference of each sprite.

### Animate the matrix

What I will display on screen a grid of 3 rows of 8 logos. Each logo will have a position in the grid and will move between at maximum from 4 steps in X and 1 step in Y.


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown2015_grid.png" width="900px">
</div>

So to play with the grid, I keep a reference of all the logos in a matrix.

```javascript
mapLogos = [
    [
        {id:'photos',pos:{x:2,y:0},index:{row:0,col:0}, visible:true},
        {id:'gplus',pos:{x:3,y:0}, index: {row:0,col:1}, visible:true},
        {id:'music',pos:{x:4,y:0}, index: {row:0,col:2}, visible:true},
        {id:'maps',pos:{x:5,y:0}, index: {row:0,col:3}, visible:true},
        {id:'calendar',pos:{x:6,y:0}, index: {row:0,col:4}, visible:true},
        {id:'keep',pos:{x:7,y:0}, index: {row:0,col:5}, visible:true},
        {id:'glass',pos:{x:8,y:0}, index: {row:0,col:6}, visible:true},
        {id:'android',pos:{x:9,y:0}, index: {row:0,col:7}, visible:true},
    ],
    [
        {id:'compute',pos:{x:2,y:1}, index: {row:1,col:0}, visible:true},
        {id:'play',pos:{x:3,y:1}, index: {row:1,col:1}, visible:true},
        {id:'docs',pos:{x:4,y:1}, index: {row:1,col:2}, visible:true},
        {id:'sheets',pos:{x:5,y:1}, index: {row:1,col:3}, visible:true},
        {id:'draw',pos:{x:6,y:1}, index: {row:1,col:4}, visible:true},
        {id:'youtube',pos:{x:7,y:1}, index: {row:1,col:5}, visible:true},
        {id:'contacts',pos:{x:8,y:1}, index: {row:1,col:6}, visible:true},
        {id:'chrome',pos:{x:9,y:1}, index: {row:1,col:7}, visible:true},
    ],
    [
        {id:'gmail',pos:{x:2,y:2}, index: {row:2,col:0}, visible:true},
        {id:'playstore',pos:{x:3,y:2}, index: {row:2,col:1}, visible:true},
        {id:'movies',pos:{x:4,y:2}, index: {row:2,col:2}, visible:true},
        {id:'hangout',pos:{x:5,y:2}, index: {row:2,col:3}, visible:true},
        {id:'drive',pos:{x:6,y:2}, index: {row:2,col:4}, visible:true},
        {id:'news',pos:{x:7,y:2}, index: {row:2,col:5}, visible:true},
        {id:'wallet',pos:{x:8,y:2}, index: {row:2,col:6}, visible:true},
        {id:'devs',pos:{x:9,y:2}, index: {row:2,col:7}, visible:true},
    ]
], 
```

A good practice is to separate the data processing and the data rendering!
In my case, I just want to render a snapshot of the grid. So when I start to initialize the countdown, I start severals `setInterval`. Each one as it's purpose and will separate the concerns.

```javascript
// First I load the 'sprites'
loadSprites([
    {title:'logos', url: 'imgs/logos.svg'},
    {title:'spaceship', url: 'imgs/spaceship.png'}
]).then(function(){
    // When the sprites are load, i start multiples 'intervals'

    // One for the music
    nextSong();
    // One that display the grid, the space ship, ... (based on requestAnimationFrameRate)
    runAnimation();
    // One that move the logos (every 5 000 ms)
    processMoveLogos();
    // One that move the spaceship (every 500ms)
    processMoveSpaceShip();
});
```

As you can see, `runAnimation` is the only method that render something on the screen and that's very important because, I don't have to do complex calculation, or complex code! In this method, I'm just focus on the rendering.

### The destruction of a logo

One of the challenge was to be shure that all logos will be destroy at the end of the countdown. I try to make this as automatic as I can so the first thing that is done when the countdown start is to calculate few elements : 

* What is the interval between each destruction : `(Now - Final time) / Number of logos`
* How many time will take the spaceship to be under the current logo at maximum
* Calculate a random order of destruction that will construct a dynamic stack of destructions orders (one row at the time).

All those calculations let me to have a dynamic countdown that will destroy everything at the right time!


### Code & Demo

You can find the code here : [CountDown DevFest 2015](https://github.com/GDG-Nantes/CountDownDevFest2015).

If you want to see it in action, have a look here [CountDown 2015](http://gdg-nantes.github.io/CountDownDevFest2015/)

# 2016

### The year of fail 😅


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/gdg_logo_legonnary.png" width="400px">
</div>

This year was the theme of 'Lego' so I have in mind an interactiv game where people draw some "pixel art" with lego bricks and submit them for the main screen. It was a good idea but my code this year wasn't enough robust and the realtime database contained some corrupts datas and everything crashed 30min before the official launch!

We have to hide the game and we just display the basic countdown with music. If you are intrested by the architecture, I write a series of article about it [Legonnary](https://jef.binomed.fr/2016/12/23/2016-12-23-legonnary) ⚠️ thoses articles are in French 🇫🇷 for the moment. I will try to translate them when I have time.

Just notice that it was a PWA application that use Firebase (realtime database, hosting, auth).

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/Legonnary_Archi.png" width="800px">
</div>

I create 4 webpages : 
* The game that the user use
* The interface that the moderator use
* The interface that correspond to the main screen with the countdown
* The interface that show a summary of all the draw created


### The year of ES6

As ES6 is everywhere, I start to rethink a little bit my code to make it more reusable.

I create a class for the audio player : 

```javascript
'use strict'
import {
    PLAYLIST
} from './playlist.js';

/**
 * Class for playing music
 *
 * We create an insible audio element and we play music on it
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

You can find the code here : [CountDown DevFest 2016](https://github.com/GDG-Nantes/CountDownDevFest2016).


# 2017


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/DevFestDraw_screen.png" width="800px">
</div>

### The revenge!!

As in 2016, I create a whole application with moderation system display on screen. I don't wanted to waste everything to the trash. So I reuse the code and I do some evolutions and wanted to complexify it a litle bit the project. Indeed, I introduce some machine learning in order to try to recognize what the attendees draw. Here is the workflow of the application


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/DevFestDraw_Validation.png" width="800px">
</div>

1. A user submit a draw
2. The draw is upload to firebase, catch in a cloud function
3. The cloud function ask to a machine learning model to analyze the image and try to classify it.
4. The moderator see the draw to validate (I wanted to be shure that the content will not break the code of conduct 😅)
5. The draw is move somewhere in the tree of realtime database
6. All validate draw are show on the main screen with their classifications.


### Recap of architecture


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/DevFestDraw_Archi.png" width="800px">
</div>

I try to use the power of serverless as much as I can. So what I add this year was the additionnals services : 
* A cloud functions to listen new drawing in the firebase tree based on Firebase Admin SDK
* A Machine learning model to use to recognize the drawing based on Cloud ML
* Google Cloud Storage to save the drawings

### Machine learning addon

The biggest addition of 2017 was the machine learning detection. So to use it, I create a cloud function that use the Firebase Admin SDK to listen new additions of drawings : 

1. The user create draw.
2. He submit it and the application upload the drawing to cloud storage
3. The cloud function start
4. The draw is compress and convert to a greyscale image of 28x28 pixels (it's because the model was trainned to recognize grayscale image of this size and to be as efficient as we can)
5. The model is interrogated
6. The drawing is classified
7. The cloud functions update the firebase tree in order to change the state of the draw to continue the workflow.

As I'm not a specialist of Machine Learning I Ask some help to a Google from New York [Yufeng Guo](https://twitter.com/YufengG). He do all the stuff of training the model. So, he trained a machine learning model based on 'black and white' image of 28x28 pixels. I had to do a conversion between what I receive and what I wend to the ML engine. In that way, this image: 

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/DevFestDraw_before.png" >
</div>

Will be send to the engine as this:

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/DevFestDraw_after.png" >
</div>

As you can imagine there will be lot of misunderstanding of the model, It was the game 😃

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

Let's have a look to the code of my cloud function 

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

The method `prediction` call some apis of Cloud ML, you can find the detail of the implementation here [prediction.js](https://github.com/GDG-Nantes/CountDownDevFest2017/blob/master/functions/prediction.js). After getting the result of the classification, I have to update the draw (changing it's parent in the Tree).

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

The conclusion of this year were that creating an interactiv game is something finally easy if you have the rights tools! Using Firebase was a good idea because, I don't manage anything about deployement, installations, charge, simple authentication, secure access... 

During a short time (less than 30 min), I got 140 players that create arround 250 drawings. It was for me a hudge success for me.


### Code & Demo

You can find the code here : [CountDown DevFest 2017](https://github.com/GDG-Nantes/CountDownDevFest2017).

If you want to see what people draw, have a look here [Summary of CountDown 2017](https://devfest-draw.firebaseapp.com/summary.html)


# 2018


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown2018.png" width="1000px">
</div>

### The idea

2018 was the year of the "space" theme. The idea was to throw planets arround the sun to create a constellation of avatars! Each attendee can log through the app and use it's avatar as a planet by throwing it with a very simple interface.

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown2018_player.png" width="600px">
</div>

You simply drag your finger from your avatar to the center of the screen and when you release it, your planet will be throw to the main screen!

### A New year = a new challenge

As I use the countdown as a personal challenge to try lots of things, this year my biggest challenge was to learn a new framework. I wanted to learn [Vue.js](https://vuejs.org/). I use the package `@vue/cli:3.0.0` to serve, build my project and I use the version 2.5.x which was the last version at the moment of this project.

Since the last 6 months, I start to be exausted by what we can call the _**"cli fatigue"**_. Indeed, as the frameworks are evolving every month, their cli often evolve to and when you work with severals projects in different version, having a cli in a specific version could be a problem... I simply install the cli as a `devDependancies` and reference the cli in the script part of my package. Here is for example the package.json of my project

```javascript
{
  "name": "countdowndevfest2018",
  "version": "1.0.0",
  "description": "CountDown game for DevFest Nantes 2018",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "vue": "vue",
    "serve": "vue-cli-service serve",
    "clean": "del-cli dist/*",
    "build": "npm run clean && vue-cli-service build && npm run cp-assets",
    "lint": "vue-cli-service lint",
    "cp-assets": "cpx \"public/assets/audio/*\" \"dist/assets/audio\" && cpx \"public/assets/video/*\" \"dist/assets/video/*\"",
    "deploy": "npm run build && firebase deploy --only hosting",
    "deploy-ci": "npm run build && firebase deploy --only hosting --token \"$FIREBASE_TOKEN\" --project \"$PROJECT_NAME\"",
    "firebase": "firebase"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/GDG-Nantes/CountDownDevFest2018.git"
  },
  "keywords": [
    "vuejs",
    "pwa",
    "game"
  ],
  "author": "jefBinomed",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/GDG-Nantes/CountDownDevFest2018/issues"
  },
  "homepage": "https://github.com/GDG-Nantes/CountDownDevFest2018#readme",
  "dependencies": {
    "cpx": "^1.5.0",
    "del-cli": "^1.1.0",
    "firebase": "^5.3.0",
    "firebaseui": "^3.4.1",
    "vue": "^2.5.16",
    "vue-router": "^3.0.1"
  },
  "devDependencies": {
    "@vue/cli": "^3.0.0-rc.3",
    "@vue/cli-plugin-babel": "^3.0.0-beta.15",
    "@vue/cli-plugin-eslint": "^3.0.0-beta.15",
    "@vue/cli-service": "^3.0.0-beta.15",
    "firebase-tools": "^3.19.3",
    "vue-template-compiler": "^2.5.16"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended"
    ],
    "rules": {},
    "parserOptions": {
      "parser": "babel-eslint"
    }
  },
  "postcss": {
    "plugins": {
      "autoprefixer": {}
    }
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}
```

As you can see, I reference the cli I need and I'm shure that the version of vue/cli won't interfere with any other of my cli.  

### The new Architecture


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/Galaxy_Archi.png" width="800px">
</div>

As you can see, I remove lots of elements to be focused on my code. And I wanted to go back to something in the [KISS principle](https://en.wikipedia.org/wiki/KISS_principle)

As firebase is evoluating each year, in 2016, when I start to use it, the firestore wasn't effective and we cannot listen to change on the tree. I decided to use the realtime database. But in 2018, firestore offer me all I need : 
* A database with higher quota for the storage: 1 GiB
* A number of simultaneous connection very high 1,000,000
* The possibility to be notify when a change is done to the tree

It's more than I really need, so I use it in replacement of realtime database.

One of the pain point I got to face this year was to be attentive to the performances!! Indeed, I wanted to show on screen a high number of planets. Every planet is following an ellipse and I have to calculate for each planet if it's enter in collision with an other. All this calculations could cost some times so I decided to use a Web Worker to do all the stuff of calculation and to notify the app with a new model as soon as the calculations are done.


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/Galaxy_Validation.png" width="800px">
</div>

To summarize:

1. A player launch a planet
2. The planet is add / update in the firestore tree
3. The Countdown screen is notify and ask to the webworker to add the new planet

In parallel

1. The webworker calculate the position of the planets, the collisions, update the model
2. The Countdown screen receive the datas.
3. When the `requestAnimationFrame`is call, the Countdown screen read the current model and display it

All the animations, stars, shine effect, are just maths and effect with the Canvas, I won't explain how I do this. If you are intersted by that, check the source code (end of this section).

### Data Structure and security

To secure my paths and datas, I use firebase authentication and path configuration in vue: 

```javascript
const secureRoute = (to, from, next) => {
  const currentRoute = to.path;
  if (from.path === '/wait') {
    next();
  }else {
    next('/wait');
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        next(currentRoute);
      } else {
        next('/auth');
      }
    });
  }
}
const routes = [
  {
    // The main page for users
    path: '/',
    component: Game,
    beforeEnter: secureRoute
  },
  {
    // The page to display when the countdown is over
    path: '/final',
    component: Final
  },
  {
    // The page to show when the user is waiting for he's connection
    path: '/wait',
    component: Wait
  },
  {
    // The page of authentication
    path: '/auth',
    component: Auth
  },
  {
    // The main screen with the countdown
    path: '/countdown',
    component: Countdown,
    beforeEnter: secureRoute
  }
]
```

So the idea was to check for specifics route (`/countdown`, `/game`) if the user is authenticate. If not, I redirect the user to the route of Authentication. The period while the application is waiting for checking if the user is authenticate, I redirect to a waiting screen. I'm shure if it's the best practice or not but it works pretty well 😇. 

The `/countdown` route should be shown only by "Admins" so I secured this page this redirection

```javascript
// Mount method of my CountDown component
mounted() {
    firestore.collection("admins").get('adminList')
    .then(()=>{
        // console.debug('Admin Loggued :)');
    })
    .catch((error) =>{
        // eslint-disable-next-line no-console
        console.error(error);
        this.$router.push('/')
    });
},
```

Indeed, I can consider that an error here is throw when the current user has not the permission to see the collection "admins". This leads me to the protection of the datas. Here is the structure of my datas

```javascript
// Collection 'admins'
{
    adminList: {
        admin.email.1@email.com: true,
        admin.email.2@email.com: true
    }
}

// Collection 'planets'
{
    UID_OfUserLoggued1: {
        angle: 0,
        collision: false, 
        ...
    },
    UID_OfUserLoggued2: {
        angle: 0,
        collision: false, 
        ...
    }
}
```

To secure thos datas, I use this firebase rules: 

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    // Generic method that check if the email of the current authenticate user is contain in the admin collection
  	function isAdmin() {
      return request.auth != null
      	&& get(/databases/$(database)/documents/admins/adminList).data[request.auth.token.email] == true
      	&& request.auth.token.email_verified == true;
    }
  
    // The admin collection is in read only for the admins
    match /admins/{document=**} {
      allow read: if isAdmin();
      allow write, delete, update: if false;
    }

    // To update a planet, you have to be the user that create it or to be an admin. Everyone loggued can read the datas of a planet (because there is nothing critical in it)
    match /planets/{planetId} {
      allow update, delete: if request.auth.uid == planetId
        || isAdmin();
      allow read, create: if request.auth.uid != null;
    }
  }
}
```

With this few lines, I secure my application and my datas 💪.

### Few enhancements

Although I reuse each year the codebase for the timer, the audio player, ... This year I want to fix and enhanced a litle bit the class. I focus my enhancement to elements: the Audio Player and the timer.

#### The Timer

Since all this year, I never create a class for it, it has to be fix. 

```javascript
'use strict';

export default class Timer {
    constructor(callback){
        // Target Time : '2018-10-18T09:00:00'
        this.targetDate = new Date(Date.now() + 30 * 1000 + 120 * 1000);
        this.callback = callback;
        this.checkTime();
    }

	checkTime() {
		const now = Date.now();
		if (now > this.targetDate.getTime()) {
			this.callback({
				type: 'endCountDown',
				value: true,
			});
			return;
		}

		let diff = this.targetDate.getTime() - now;
		const minutes = new Intl.NumberFormat('fr', {
			minimumIntegerDigits: 2,
			useGrouping: false,
		}).format(Math.floor(diff / (60 * 1000)));
		const seconds = new Intl.NumberFormat('fr', {
			minimumIntegerDigits: 2,
			useGrouping: false,
		}).format(Math.floor((diff % (60 * 1000)) / 1000));
		const lastMinute = diff < 60 * 1000;
		this.callback({
			type: 'time',
			value: {
				minutes,
				seconds,
				lastMinute,
				diff,
			},
		});

		window.requestAnimationFrame(this.checkTime.bind(this));
	}
}
```

This timer is update very often and give the delta to the main screen.

#### The Audio player

One of our problem each year is the timing. We play music and we want that a specific music is played at the end. Let me explain it more easily. If we start the count down 45min before the begining of the Keynote we want that the last song played is for example ACDC - Thunderstock and we want the countdown show **00:00** when Thunderstock is finish...  It was not very easy because we have to calculate the right time to start our playlist, be shure to not stop it, ...

So I got an idea. What if I can specify what is the last song, it's duration and if the countdown automaticaly switch to this song when it's the right moment ? That's why I do an evolution in my AudioPlayer class

```javascript
'use strict'
import {
    PLAYLIST,
    LASTS_SONGS_PLAYLIST
} from './playlist.js';

/**
 * Class for playing music
 *
 * We create an insible audio element and we play music on it
 */
export class AudioPlayer {
    constructor() {
        this.indexPlayList = 0;
        this.currentIndex = 0;
        this.audioElt = document.createElement('audio');
        this.audioElt.style.display = 'none';
        this.currentPlaylist = PLAYLIST;
        document.body.appendChild(this.audioElt);
        window.addEventListener('beforeunload', this._unload.bind(this));
        this._startPlayer();
    }


    _startPlayer() {
        if (localStorage['devfestCountdown-LastSong']) {
            this.indexPlayList = +localStorage['devfestCountdown-LastSong'];
            if (this.indexPlayList >= this.currentPlaylist.length) {
                this._nextSong();
            } else {
                this._playSound(`./assets/audio/${this.currentPlaylist[this.indexPlayList]}`);
                this.audioElt.currentTime = +localStorage['devfestCountdown-currentTime'];
            }
        } else {
            this.indexPlayList = -1;
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
            this.currentIndex = Math.max(this.indexPlayList, 0);
            this.indexPlayList = (this.indexPlayList + 1) % this.currentPlaylist.length;
            this._playSound(`./assets/audio/${this.currentPlaylist[this.indexPlayList]}`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
        }
    }

    /**
     * Update the sound volume of audio element
     */
    manageSoundVolume(delta) {
        if (delta < 10 * 1000) {
            this.audioElt.volume = Math.min(Math.max(0, delta / (10 * 1000)), 0.7);
        }
    }

    manageVolumeFromPercent(percent) {

        if (percent > 0){
            this.audioElt.volume = Math.min(percent, 1);
        }
    }

    switchToLastsSongPlaylist(){
        this.audioElt.volume = 1;
        this.indexPlayList = 0;
        this.currentPlaylist = LASTS_SONGS_PLAYLIST;
        this._nextSong();
    }
}
```

I had some controls to deal with the sound volume and to switch to the playlist of last songs. The code that execute thoses controls is in a separate class because it's not the rule of the AudioPlayer to know when to change!  The code that deal with the timing is in my CountDown component:

```javascript
const timeBeforeLastSongs = 60 * 1000; // 1 Minute
const dropTimeForLastSong = 5 * 1000; // 5 sec

export default {
	name: 'countdown',
	components: { Galaxy, ScoreList, Timer },
	// ... 
	methods: {
		/// ...
		timeUpdate(event) {
			// If we're in the last song delay, we first drop the sound of current sound before
			if (
				event.diff < timeBeforeLastSongs &&
				event.diff > timeBeforeLastSongs - dropTimeForLastSong
			) {
                // We simulate a kind of fader to switch to last song
				const adjustDiff =
					event.diff - (timeBeforeLastSongs - dropTimeForLastSong);
				this.audioPlayer.manageVolumeFromPercent(
					adjustDiff / dropTimeForLastSong,
				);
			} else if (event.diff < timeBeforeLastSongs && !this.switchToLastsSongs) {
                // When it's time, we switch to last song
				this.audioPlayer.switchToLastsSongPlaylist();
				this.switchToLastsSongs = true;
			} else if (this.audioPlayer) {
                // We wait for the last 10 seconds to drop down the volume
				this.audioPlayer.manageSoundVolume(event.diff);
			}
		},
		// ...
	},
    // ...
};
```


### My Conclusion

My first challenge was to try Vue.js and my conclusion is VueJS is good framework / library to prototype application but not the best solution when you have an application with frame rate high 30fps. The main problem comes from the fact that my Datas were refresh very often... More often than the inner mecanism of rendering of Vue. So Vue destroy and recreate to many times the HTML Nodes.

For exemple, to be performant, I had to change this code: 

```javascript
 <Score 
    v-for="planet in planets.slice(0,10)"
    :key="planet.id"
    v-bind:planet="planet"
></Score>
```

To this: 

```javascript
<Score
    v-if="planets.length > 0"
    v-bind:planet="planets[0]"
></Score>
<Score
    v-if="planets.length > 1"
    v-bind:planet="planets[1]"
></Score>
<Score
    v-if="planets.length > 2"
    v-bind:planet="planets[2]"
></Score>
<Score
    v-if="planets.length > 3"
    v-bind:planet="planets[3]"
></Score>
<Score
    v-if="planets.length > 4"
    v-bind:planet="planets[4]"
></Score>
```

And I also have to give datas to a children component through a method exposed in the child component instead of using the properties. This problem comes to serialisation / deserialisation of object and cause a rerendering of the child component where my basic rendering was made by the canvas.

For the next year I think that I will continue to work with vanillaJS because the use cas of countdown is each time to specific to match with the mindset of a framework. I don't say that Vue is a bad framework, but I really think that it wasn't the best choice for my project.


### Code & Demo

You can find the code here : [CountDown DevFest 2018](https://github.com/GDG-Nantes/CountDownDevFest2018).

If you want to see it in action, have a look here [CountDown 2018](http://gdg-nantes.github.io/CountDownDevFest2018/)


# 2019 ?

I don't yet what I will write for 2019 but it will be maybe a new game based on vanilla. Stay tuned 🤘

<!-- Imports to use for interactivité -->
<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="module" src="/assets/2018-11-countdown/countdown.js"></script>