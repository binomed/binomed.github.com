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

Pour résumer, j’utilise mon bras pour diriger le robot et si je serre le point, alors ce dernier tir des élastiques. 

Certains m'ont dit avec humour que ceci était la prochaine étape : 

<iframe width="560" height="315" src="//www.youtube-nocookie.com/embed/Z3aVhpKaHIU" frameborder="0" allowfullscreen></iframe>

mais ...

# Je ne suis pas un jedi mais juste un développeur

Voici le schéma de communication de nos différents composants : 

![](/assets/2014-12-DevFestDemos/images/schema_myo_ev3.png)

Le fonctionnement est donc très simple. Un programme C++ tourne sur mon ordinateur récupérant tous les messages du Bracelet Myo via le SDK de Myo. Ce dernier envoie toutes les commandes à un serveur NodeJS qui s'occupe de communiquer en Bluetooth avec le Lego Mindstorm. Nous allons donc regarder chacune des composantes des acteurs en jeux.

## Myo

### C'est quoi ?

Avant de parler de Myo, revenons un peu sur ce qu'est Myo et comment cela fonctionne. Le Myo c'est ça : 

![](/assets/2014-12-DevFestDemos/images/myo-overview.png)

C'est donc un bracelet connecté qui possède un certains nombre de sensors : 

* Sensors Électriques
* Accéléromètre
* Gyroscope

Ce qui différencie le Myo des autres bracelets connectés c'est les sensors électriques qui lui permettre de reconnaître des **"gestes"**. De cette façon en plus d'envoyer des informations de types : orientation / vitesse, nous sommes capable de détecter si le porteur du bracelet a fait un geste précis. Les gestes aujourd'hui reconnus sont : 

![](/assets/2014-12-DevFestDemos/images/myo_gestures.png)

En fonction de la version du SDK que vous avez, une 5ème gesture est disponible mais les gestes représentés ci-dessus sont ceux qui fonctionnent le mieux et qui sont les plus simple à déclencher.

### Que dois-je analyser ?

Avant d'attaquer le code, j'ai du me poser une question cruciale : **Comment vais-je contrôler mon robot ?** 

Je viens de vous présenter  les sensors qui sont à notre disposition : accéléromètre, Gyroscope, sensors électriques. Je dois donc choisir le moyen le plus simple pour contrôler ce dernier. Il convient donc de réfléchir en terme de mouvement dits "naturels". Quel va être le mouvement le plus naturel pour contrôler un robot ? A défaut d'avoir trouvé le plus naturel, j'en ai trouvé un qui était simple à exploiter et simple à faire comprendre car c'est aussi un des enjeux majeurs de ce genre de devices : Si l'on doit passer un considérable à expliquer le fonctionnement, c'est que l'on a raté quelque chose ! 

Voici un schéma qui traduit le vocabulaire utilisé par Thalmic pour retranscrire les informations du bracelet

![](/assets/2014-12-DevFestDemos/images/Mark-blog-Diagrams-01.jpg)

Pour ma part, j'ai donc choisi d'exploiter le **"Pitch"** et le **"yaw"**. Cela reste relativement intuitif et facile à expliquer : 

* Baissez votre bras et ça fera avancer le robot. Remontez le et ça le fera reculer
* Bougez votre bras vers la gauche ou vers la droite pour le faire tourner.

J'aurais pu utiliser le **"Roll"** mais après quelques essais, je me suis rendu comptes que le roll était facile à faire pour l'utilisateur vers la partie extérieur de son corps mais pas vers l'intérieur... Ceci implique que si l'on pouvait facilement tourner dans un sens mais difficilement dans l'autre.... D'où mon choix de tourner avec le **"Yaw"**. Faites l'essai, si vous êtes droitiers par exemple, vous vous rendrez vite compte que tourner sa main vers la droite est simple, mais la tourner la gauche nécessite une certaine contortion du bras qui rend le mouvement pas du tout naturel.


### On code comment avec ?

Aujourd'hui [Thalmic](https://www.thalmic.com) (la société derrière le bracelet) a développé 3 SDK permettant d'interagir avec des objets que l'on peut manipuler :

* Un SDK en C++ pour les pc
* Un SDK en Java pour Android
* Un SDK en ObjectiveC pour Iphone

à partir de là, on peut commencer à jouer. Je ne rentrerais pas trop dans le détail car je comptes rédiger plus tard un billet sur le développement avec Myo. Je vais donc m'attarder sur la solution retenue pour la démo.




### Partie C++

Pour la démo, j'ai donc choisi d'exploiter le SDK C++ car utiliser mon téléphone aurait posé un problème rapidement en terme de batterie notamment au niveau de la communication bluetooth classique avec le Lego.

Je suis parti du code fournit avec le SDK pour exploiter les données que je voulais.

