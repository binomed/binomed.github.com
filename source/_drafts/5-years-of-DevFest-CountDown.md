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
    <img src="/assets/2018-11-countdown/countdown2014.png">
</div>

Before starting to tink about "Interactivity" I had to take some times to check that everything works well! That's also one our mantra in DevFest Nantes, always build better over something strong ! So for the first Countdown, I start following the KISS approach : No Framework, No modules, just a simple html with a litle bit of css.

The basic idea of this Countdown was to animate the DevFest Nantes Tshirt.

You can find the code here : [CountDown DevFest 2014](https://github.com/GDG-Nantes/DevFestCountDown-2014).

This project let me think about the mandatory steps of Countdown :
1. Play music until the countdown is over
2. Launching a video when the countdown is over

Behind this 2 steps is hide a basic complexity. How to check without blocking the ui the current time ? How to play music and video ?

For the first solution, I don't use the best solution : `setInterval` but it's a solution that won't block the ui! Now and you will see it in the other CountDown, I prefer to use `requestAnimationFrame`. Indeed, one of the most important point is avoid to block the eventloop.

For the second solution, even if there is a [Web Audio API](https://developer.mozilla.org/fr/docs/Web/API/Web_Audio_API) a simple `<audio>` tag hidden in the page do the job very well!

The only challenge I face was with the css to play with the good text transformation.

As you can see, there is lots of things to enhance. But it do the job, a uniq countdown linked to DevFest Nantes identity!

# 2015

<div style="text-align:center; width:100%;">
    <img src="/assets/2018-11-countdown/countdown2015.png">
</div>


This year, the DevFest Theme was the retroGaming. So again, the countdown was inspired by the t-shirt. The idea was to simulate a real "Space Invador". As the tshirt show a space invader destroying Google technologies logos. I try to animate the spaceship in order to destroy the last logo at the last second.

For this version, I try to keep it as simple as I can, I just introduce a minor toolchain for compiling my Sass files. The main challenge here was to calculate when to destroy or not a logo and how

I re-use the work of the previous year for the time management except that I start to use the requestAnimationFrame