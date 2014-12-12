title: DevFest Nantes 20114 - Demos Part 1 - Myo
tags:
  - myo
  - ev3
  - devfest
  - nodeJS
category:
  - Event
---
# Myo et EV3

Regardons en premier le résultat et attardons nous ensuite à en comprendre le fonctionnement.

## Déplacement

<video width="80%" controls>
	<source src="/assets/2014-12-DevFestDemos/videos/video_deplacement.mp4" type="video/mp4">
</video>

## Tir d'élastiques

<video width="80%" controls>
	<source src="/assets/2014-12-DevFestDemos/videos/video_tir.mp4" type="video/mp4">
</video>

## Commandes

Pour résumer, j'utilse mon bras pour diriger le robot et si je serre le point, alors ce dernier tir des élastiques. 

Certains m'on dit avec humour que ceci était la prochaine étape : 

<iframe width="560" height="315" src="//www.youtube-nocookie.com/embed/Z3aVhpKaHIU" frameborder="0" allowfullscreen></iframe>

mais ...

# Je ne suis pas un jedi mais juste un développeur

Voici le schéma de communication de nos différents composants : 

![](/assets/2014-12-DevFestDemos/images/schema_myo_ev3.png)

Le fonctionnement est donc très simple. Un programme C++ tourne sur mon ordinateur récupérant tous les messages du Bracelet Myo via le SDK de Myo. Ce dernier envoie toutes les commandes à un serveur NodeJS qui s'occupe de communiquer en Bluetooth avec le légo Mindstorm.