title: 5 years of DevFest CountDown - Part 3
tags:
  - DevFest
  - Canvas
category:
  - Conference
toc: false
date: 2018-11-30 17:10:00
---

This article is the third of series ( [5 years of DevFest CountDown - Part 1](https://jef.binomed.fr/2018/11/30/2018-11-30-5-years-of-DevFest-CountDown-part1) and [5 years of DevFest CountDown - Part 2](https://jef.binomed.fr/2018/11/30/2018-11-30-5-years-of-DevFest-CountDown-part2))

# 2018


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown2018.png" width="1000px">
</div>

### The idea

2018 was the year of the "space" theme. The idea was to throw planets around the sun to create a constellation of avatars! Each attendee could log through the app and use its avatar as a planet by throwing it with a very simple interface.

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown2018_player.png" width="600px">
</div>

You simply drag your finger from your avatar to the center of the screen and when you release it, your planet will be thrown to the main screen!

### A New year = a new challenge

As I use the countdown as a personal challenge to try lots of things, this year my biggest challenge was to learn a new framework. I wanted to learn [Vue.js](https://vuejs.org/). I used the package `@vue/cli:3.0.0` to serve, build my project and I used the version 2.5.x which was the latest version at the moment of this project.

Since the last 6 months, I started to be exhausted by what we can call the _**"CLI fatigue"**_. Indeed, as the frameworks evolve every month, their CLI often evolve too and when you work with several projects with different versions, having a CLI in a specific version could be a problem... I simply install the cli as a `devDependencies` and reference the CLI in the script part of my package. Here is, for example, the package.json of my project

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

As you can see, I referenced the cli I needed and I was sure that the version of vue/cli wouldn't interfere with any other of my cli.

### The new Architecture


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/Galaxy_Archi.png" width="800px">
</div>

As you can see, I removed lots of elements to focus on my code. And I wanted to go back to something compatible with the [KISS principle](https://en.wikipedia.org/wiki/KISS_principle)

As firebase evolves each year, in 2016, when I started to use it, Firestore wasn't available and we couldn't listen to change on the tree. Back in 2016, I decided to use the realtime database. But in 2018, firestore offered me all I need :
* A database with a higher quota for the storage: 1 GB
* A number of simultaneous connection very high 1,000,000
* The possibility to be notified when a change is done to the tree (even if in realtime, we could do that)

It was more than I really needed, so I used it in replacement of realtime database.

One of the pain point I had to face this year was to be attentive to the performances!! Indeed, I wanted to show a high number of planets on screen. Every planet is following an ellipse and I have to calculate for each planet if it enter in collision with another planet. All those calculations could cost times so I decided to use a Web Worker to do all the calculations and to notify the app with a new model as soon as the calculations were done.


<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/Galaxy_Validation.png" width="800px">
</div>

To summarize:

1. A player launchs a planet
2. The planet is added/updated in the firestore tree
3. The Countdown screen is notified and asks to the webworker to add the new planet

In parallel

1. The webworker calculates the position of the planets, the collisions, updates the model
2. The Countdown screen receives the data.
3. When the `requestAnimationFrame`is called, the Countdown screen reads the current model and displays it

All the animations, stars, shine effect, are just maths and effects with the Canvas, I won't explain how I do this. If you are interested in that, check the source code (end of this section).

### Data Structure and security

To secure my paths and data, I used firebase authentication and path configuration in Vue:

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
    // The page to show when the user is waiting for his connection
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

The idea was to check for specific route (`/countdown`, `/game`) if the user is authenticated. If not, I redirect the user to the authentication route. The period while the application is waiting for checking if the user is authenticated, I redirect him/her/them to a waiting screen. I'm not sure if it's the best practice or not but it works pretty well 😇.

The `/countdown` route should be shown only to "Admins" so I secured this page with this redirection

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

Indeed, I can consider that an error here is thrown when the current user has not the permission to see the collection "admins". This leads me to the protection of the data. Here is the structure of my data

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

To secure those data, I used these firebase rules:

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    // Generic method that checks if the email of the currently authenticated user is contained in the admin collection
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

    // To update a planet, you have to be the user that create it or to be an admin. Everyone logged can read the data of a planet (because there is nothing critical in it)
    match /planets/{planetId} {
      allow update, delete: if request.auth.uid == planetId
        || isAdmin();
      allow read, create: if request.auth.uid != null;
    }
  }
}
```

With these few lines, I secured my application and my data 💪.

### Few enhancements

Although every year I reuse the codebase for the timer, the audio player, ... This year I wanted to fix and enhance a little bit the class. I focused my enhancement to the Audio Player and the timer.

#### The Timer

Before this year, I never had to create a class for it, this has to be fixed.

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

This timer is updated very often and gives the delta to the main screen.

#### The Audio player

One of our problem each year is the timing. We play music and we want a specific music to be played at the end. Let me explain it more easily. If we start the countdown 45min before the beginning of the Keynote and we want the last song to be played to be, for example, ACDC - Thunderstock and we want the countdown to show **00:00** when Thunderstock is finishing...  It was not very easy because we have to calculate the right time to start our playlist, be sure to not stop it, ...

So I got an idea. What if I can specify what is the last song, its duration and what if the countdown automatically switched to this song when it's the right moment? That's why I did an evolution in my AudioPlayer class

```javascript
'use strict'
import {
    PLAYLIST,
    LASTS_SONGS_PLAYLIST
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

I had some controls to deal with the sound volume and to switch to the playlist of last songs. The code that execute those controls is in a separate class because it's not the rule of the AudioPlayer to know when to change!  The code that dealt with the timing was in my CountDown component:

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

My first challenge was to try Vue.js and my conclusion is VueJS is good framework / library to prototype application but not the best solution when you have an application with a high frame rate like 30fps. The main problem comes from the fact that my data were refreshed very often... More often than the inner mechanism of rendering of Vue. So Vue destroys and recreates too many times the HTML Nodes.

For example, to be performant, I had to change this code:

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

And I also had to give data to a children component through a method exposed in the child component instead of using the properties. This problem comes to serialization/deserialization of the object and causes a re-rendering of the child component where my basic rendering was made by the canvas.

For the next year, I think that I will continue to work with vanillaJS because the use case of the countdown is each time to match with the mindset of a framework. I'm not saying that Vue is a bad framework, but I really think that it wasn't the best choice for my project.


### Code & Demo

You can find the code here: [CountDown DevFest 2018](https://github.com/GDG-Nantes/CountDownDevFest2018).

If you want to see it in action, have a look here [CountDown 2018](http://gdg-nantes.github.io/CountDownDevFest2018/)


# 2019?

I don't know yet what I will write for 2019 but it will be maybe a new game based on vanilla. Stay tuned 🤘

PS : A huge thanks to [Elaine Dias Batista](https://twitter.com/elainedbatista) for having taking time to read and correct this article.

<!-- Imports to use for interactivité -->
<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="module" src="/assets/2018-11-countdown/countdown.js"></script>