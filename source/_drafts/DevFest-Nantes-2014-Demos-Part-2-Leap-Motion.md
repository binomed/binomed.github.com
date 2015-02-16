title: DevFest Nantes 2014 - Demos Part 2 - Leap Motion
tags:
  - leap motion
  - devfest
category:
  - Event
---

Suite des articles sur les démos que j'ai eu l'occasion de coder pour le [DevFest Nantes](http://devfest.gdgnantes.com).

- [Part 0 - Teasing](/2014/12/10/2014-12-10--DevFest-Nantes-2014-Demos-Part-0-Teasing)
- [Part 1 - Myo](/2014/12/16/2014-12-16--DevFest-Nantes-2014-Demos-Part-1-Myo)

# Leap Motion

La [Leap Motion](https://www.leapmotion.com/) (j'ai personnellement toujours dit la, après beaucoup de monde dit "le") est un capteur infra rouge qui détecte vos mains de façon très précise et qui permet de récupérer les coordonnées de nos mains dans un espace en 3D.  Pour beaucoup de monde la Leap Motion, c'était la promesse de ça : 

![](/assets/2014-12-DevFestDemos/images/MinorityReport.jpg)

Mais en réalité ce n'est pas tout à fait ça....

## Théorie

Regardons d'un peu plus prêt la leap et comment cela fonctionne.

### Petit boitier

La leap c'est donc ce petit boitier : 

![](/assets/2014-12-DevFestDemos/images/leap_motion.png)

Il fonctionne avec l'infra rouge et renvoie les informations interprétées à l'ordinateur via une websocket. On peut récupérer ce genre d'informations : 

* Position d'une (plusieurs mains) dans un espace en 3D
* Position d'un doigt / fallenge / paume de main dans un espace en 3D
* Position d'un stylo dans un espace en 3D (pour la partie écriture)
* Reconnaissance de geste : 
    - Swype
    - Cercles
    - Pinch
    - Point fermé 
    - ...

Pour avoir la liste complète, je vous invite à aller consulter la doc du SDK : [https://developer.leapmotion.com/](https://developer.leapmotion.com/) 


### Reconnaissance dans l'espace

Ne vous attendez pas à placer votre leapmotion proche de télé à contrôler cette dernière depuis votre canapé, la distance de déctection de la leap est relativement courte (<1m). Elle reconnait ce qui est placé dans son cône de détection.

![](/assets/2014-12-DevFestDemos/images/Leap_InteractionBox.png)

Ce qui est représenté ici, ce sont 2 choses : 

* Le cône de détection qui représente la zone globale de détection de la leap
* L'interaction Box qui représente une boite servant de référence pour le placement des mains / objets.


### SDK

Le SDK est assez facile d'accès et permet de développer des programmes en JavaScript / Unity, C# / C++ / Java / Python / Objective-C. Ils ont aussi rajouté récement une API pour interragir plus facilement avec des casques de Virtual Reality ! 

Concrètement, quand l'on veut simplement utiliser les résultats de notre leap. Il nous suffit de créer un objet LeapMotion issue du SDK, puis d'écouter les événements correspondants à notre demande. Par exemple, si l'on veut récupérer les mains, il suffit d'écrire ça : 

```html
<script src="//js.leapmotion.com/leap-0.6.4.js"></script>
```

```javascript
Leap.loop(function(frame) {

  frame.hands.forEach(function(hand, index) {
     // faire quelque chose avec la main
  });

}).use('screenPosition', {scale: 0.25});
```

L'utilisation du "screenPosition" nous permet d'avoir des positions en référence avec la résolution de notre écran  

# Démo réalisée

N'étant pas un as du graphisme ni de la 3D, j'ai voulu creuser comment l'on peut utiliser la leap motion sur une interface en 2D et quels pourraient être les interacations possible



