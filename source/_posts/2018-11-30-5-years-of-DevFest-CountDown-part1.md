title: 5 years of DevFest CountDown - Part 1
tags:
  - DevFest
  - Canvas
category:
  - Conference
toc: false
date: 2018-11-30 17:00:00
---

I organize the [DevFest Nantes](https://devfest.gdgnantes.com) as a volunteer of [GDG Nantes](https://gdgnantes.com) for 7 years already.

If you don't know what "DevFest" is, it's a worldwide event lead by the GDG community. You can have a look here [DevFest With Google](https://devfest.withgoogle.com).

Each year we work very hard to provide the best experience for our attendees. We try to make DevFest Nantes the most accessible (only 90€ for 2 days with food, goodies, party, conference, ...). And one of the things I'm responsible for is the Countdown! Indeed, if you already go to Google I/O, you know that when you are waiting for the launch of the keynote, Google prepares a nice Countdown animation to let you play with the other attendees! We love so much this experience that we tried to create ours to keep that spirit. In this article, I will try to share those countdown and try to explain to you what I've learned with each of them.


# Before 2014


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/original_io_countdown.jpg">
</div>

Before I started to write my own Countdown, I first reused a public countdown created for Google IO 2011: [HTML5 Countdown Finale](https://experiments.withgoogle.com/google-io-conference-html5-countdown-finale). It works pretty well but it was not linked to our graphical Theme. That's why I started in 2014 to create my own countdown

# 2014


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown2014.png" width="600px">
</div>

### The idea

Before starting to think about "Interactivity" I had to take time to check that everything works well! That's also our mantra in DevFest Nantes, always build better over something strong! So for the first Countdown, I started following the KISS approach: No Framework, No modules, just a simple HTML with a little bit of CSS.

The basic idea of this Countdown was to animate the DevFest Nantes t-shirt.

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/tshirt_2014.png" width="400px">
</div>

This project allowed me to think about the mandatory steps of Countdown :
1. Play music until the countdown is over
2. Launching a video when the countdown is over

Behind this 2 steps is hidden a basic complexity. How to check the current time without blocking the UI? How to play both music and video?

### Time management

For the first year, I didn't use the best solution: `setInterval` but it's something that won't block the UI! Today, I prefer to use `requestAnimationFrame`. Indeed, one of the most important points is to avoid to blocking the event loop.

```javascript
var cibleDate = Date.parse('2014-11-07T08:35:00Z')
var cancelInterval = setInterval(function() {
    currentTime += 100;
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

### Playing a song

For the second problem, even if there is a [Web Audio API](https://developer.mozilla.org/fr/docs/Web/API/Web_Audio_API) a simple `<audio>` tag hidden in the page does the job very well! In 2014, there wasn't the restriction of [autoplay policy](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes) so I could easily play a sound with this code :

```javascript
// Index of the current song in the playlist
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

The only challenge I faced was with the CSS. To play with the good text transformation. So for this HTML:

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

You will have this CSS:

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

This gives you this result

<div id="countdown-2014">
    <div class="conteneur">
        <img src="/assets/2018-11-countdown/tshirt_2014_final_xl_sans_texte.png" id="main">
        <div class="jaune_clair min chiffre" id="min">10</div>
        <div class="jaune_fonce min unit">m</div>
        <div class="jaune_clair sec chiffre" id="sec">55</div>
        <div class="jaune_fonce sec unit">s</div>
    </div>
</div>

And the last thing to do was to animate the text at the bottom of the tower. I used the `marquee` tag because it's targeted to animate text in a box! Here, the problem comes to the fact that I have 2 faces in my tower and I want to give the impression that the text "slides" around the tower. To create this effect, I had to use 2 `marquee` and play a timeout that corresponded to the duration of the move of the text.

```html
<marquee behavior="scroll" direction="right" class="marquee_1">DevFest Nantes</marquee>
<marquee behavior="scroll" direction="right" class="marquee_2">DevFest Nantes</marquee>
```


```javascript
marquee_1.style.display = 'none';
marquee_2.style.display = 'none';
// The text "DevFest Nantes" takes 2500ms to go through the marquee
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

As you can see, there are lots of things to enhance. But it does the job, a unique countdown linked to DevFest Nantes identity!

### Code & demo

You can find the code here: [CountDown DevFest 2014](https://github.com/GDG-Nantes/DevFestCountDown-2014).

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

The idea was to simulate a real "Space Invaders". As the t-shirt shows a space invader destroying Google technologies logos. I tried to animate the spaceship in order to destroy the last logo at the last second.

### New Challenges

For this version, I tried to keep it as simple as I could, I just introduced a minor toolchain for compiling my Sass files. The main challenge here was to calculate when to destroy or not a logo and how. For a smooth animation, I used a **Canvas**. As I started to play with canvas, I had to rethink some aspects: Animation, Ressources loading. I reused the work of the previous year for the time management except that I started to use the `requestAnimationFrame` instead of `setTimeout`. Indeed, using `requestAnimationFrame` is something mandatory when you want to create something smooth. To understand why it is important, I encourage you to read more articles about the [Javascript EventLoop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop).

Or have a look at this conference from Jake Archibald about event loop:

<div style="text-align:center; width:100%;">
<iframe width="560" height="315" src="https://www.youtube.com/embed/cCOL7MC4Pl0" frameborder="0" allowfullscreen></iframe>
</div>

### Resources management

When you want to deal with resources in video games, it's recommended to use 'sprite' image. 'Sprites' let you download all resources in one time. As HTTP2 is not present everywhere. It's better to download 1 file than several. The browser cannot open more than 6 (for chrome) separated threads for download, so favor the one big cookie download.

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/logos_2015.svg" width="400px">
</div>

When you deal with 'sprites' images, you have to position your cursor when you draw. With this technique, you will minimize the number of assets loaded in memory and gain some time on your first load.

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
, dx // x coordinate of drawing on canvas
, dy // y coordinate of drawing on canvas
, dw // width size of the drawing
, dh // height size of the drawing
);
```

In my case, I created a map to have a reference for each logo in the sprite. This map allowed me animate each logo and keep a reference of its original position in the sprite :

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

What I will display on the screen is a grid of 3 rows of 8 logos. Each logo will have a position in the grid and will move between at maximum from 4 steps in the x axis and 1 step in the y axis.


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown2015_grid.png" width="900px">
</div>

So to play with the grid, I kept a reference of all the logos in a matrix.

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
In my case, I just want to render a snapshot of the grid. So when I start the initialization of the countdown, I start several `setInterval`. Each one has its purpose and will separate the different logics.

```javascript
// First I load the 'sprites'
loadSprites([
    {title:'logos', url: 'imgs/logos.svg'},
    {title:'spaceship', url: 'imgs/spaceship.png'}
]).then(function(){
    // When the sprites are load, I start multiples 'intervals'

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

As you can see, `runAnimation` is the only method that renders something on the screen and that's very important because, I don't have to do complex calculation, or complex code! In this method, I'm just focused on the rendering.

### The destruction of a logo

One of the challenges was to be sure that all logos would be destroyed at the end of the countdown. I tried to make this as automatic as I can. The first thing that is done when the countdown starts is to calculate a few elements :

* The interval between each destruction : `(Now - Final time) / Number of logos`
* The maximum duration in which a spaceship will be under the current logo
* A random order of destruction that will construct a dynamic stack of destructions orders (one row at a time).

All those calculations let me have a dynamic countdown that will destroy everything at the right time!


### Code & Demo

You can find the code here: [CountDown DevFest 2015](https://github.com/GDG-Nantes/CountDownDevFest2015).

If you want to see it in action, have a look here [CountDown 2015](http://gdg-nantes.github.io/CountDownDevFest2015/)


# What's Next

See [5 years of DevFest CountDown - Part 2](https://jef.binomed.fr/2018/11/30/2018-11-30-5-years-of-DevFest-CountDown-part2) and [5 years of DevFest CountDown - Part 3](https://jef.binomed.fr/2018/11/30/2018-11-30-5-years-of-DevFest-CountDown-part3)


<!-- Imports to use for interactivité -->
<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="module" src="/assets/2018-11-countdown/countdown.js"></script>