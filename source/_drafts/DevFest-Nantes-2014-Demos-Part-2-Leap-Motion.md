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

N'étant pas un as du graphisme ni de la 3D, j'ai voulu réfléchir à l'utilisation de la leap motion sur une interface 2D. Quels pourraient être les interactions possible ? etc. Le projet choisi permettait de naviguer dans le programme du devfest. On pouvait ainsi consulter les sessions et aussi regarder les fiches speakers.

![](/assets/2014-12-DevFestDemos/images/leap_navigation.png)

L’architecture de cette démo était plus simple : 

![](/assets/2014-12-DevFestDemos/images/schema_leap.png)


Pour ce faire, j'ai donc cherché à répondre à 3 questions : 

1. Comment avoir une interaction claire ? en d'autres termes, qu'est ce qui fait que l'utilisateur saura utiliser mon application ?
2. Comment interagir avec l'écran ?
3. Qu'est ce qui est naturel ?

Le dernier point est pour moi un des plus important à traiter lors de l'utilisation de nouveaux devices non tactiles !  Le tactile joui d'une forte adoption et les standard d'utilisation sont fortement rependus et connus. Tout le monde sait qu'un pinch to zoom permettra de zoomer etc. Mais quand il est question d'interctions non tactiles ? Que ce soit avec la Leap, la kinect ou le bracelet Myo par exemple, les possibilités offertes par les technologies ne sont pas les mêmes et pourtant il faut trouver un moyen d'interagir avec. La seule réponse à trouver est : Qu'est ce qui est naturel ? Qu'est sont les gestes que je ferais si je devais manipuler cette interface dans le monde réel ?

## Interaction claire

Quand bien même, on aura trouvé des gestes naturels, il faut expliquer à l'utilisateur comment utiliser l'application.

![](/assets/2014-12-DevFestDemos/images/details_leap.png)

1. Une popup est affichée si personne n'utilise l'application afin d'indiquer quelle est la première action La police de caractère et la taille de l'image est importante car cela doit être la première information que l'utilisateur voit.
2. Une zone de légende permet à l'utilisateur d'avoir une information complémentaire. La taille de la police et de l'icône est plus petite pour ne pas interférer avec la première information. L'icône utilisé montre la main dans une certaine configuration et invite l'utilisateur à pointer son doigt dans une direction.
3. La barre bleu permet de cacher le menu s'il n'y a aucune interaction. De cette façon l'utilisateur n'est pas polué d'informations inutiles.

J'ai beau préciser comment interagir avec l'écran, il faut une chose importante pour l'utilisateur : le FEEDBACK ! 

![](/assets/2014-12-DevFestDemos/images/leap_feedback.png)

Le SDK de leap motion fournit un modèle 3D unity de la main détectée. J'ai donc intégré cette dernière à mon interface en guise de feedback. J'ai aussi rajouté un point blanc correspondant à  équivalent de curseur de souris. Etant donné que mon application est en 2D et orienté "consultation de contenu", il me fallait un élément de sélection

## Interaction avec l'écran

Pour interagir, j'ai choisi d'avoir le même fonctionnement qu'un menu dans les sites web. De cette façon l'utilisateur reste dans un mécanisme connu.

![](/assets/2014-12-DevFestDemos/images/leap_navigation.png)

La zone sur laquelle est l'utilisateur porte une couleur différente afin de lui signaler sa sélection. 

Reste à voir maintenant comment valider un choix ?

J'ai dans un premier temps expérimenté la sélection en mode push : Utiliser la profondeur pour donner à l'utilisateur l'impression qu'il clique sur le bouton. Mais en pratique, il s'est avéré que cette interaction était assez peu intuitive et plus difficile à calibrer en premier lieu. Je penses cependant que si j'avais eu plus de temps elle aurait pu être assez intéressante et pertinente. Mais passons, la sélection dans l'application c'est fait de 2 façon.

La première, par un mécanisme de glisse qui permet à l'utilisateur de remplir une jauge. Une fois la jauge remplit l'action est validée

![](/assets/2014-12-DevFestDemos/images/leap_selection.png)

La seconde, tout droit issue du monde Kinect avec la validation d'une sélection après un certains temps. De la même façon une jauge se remplit afin d'indiquer à l'utilisateur qu'il va valider l'action.

![](/assets/2014-12-DevFestDemos/images/leap_selection_2.png)

J'ai volontairement garder les 2 sélections pour voir la réaction des utilisateurs. Globalement les 2 validations ont étés bien comprises et utilisées.

### Hack sur le mouse move

J'ai quand même du faire un petit hack pour cette démo. En effet, un des écrans affiche des graphiques dynamiques et la légende des graphique n’apparaît que sur un calcul du mousemove. J'ai donc récupéré les événements de positions de ma main et je les ai transformé en mousemove. Le code suivant est une directive AngularJS mais la théorie reste la même.

```javascript
components.directive('leapMouseMove', ['$rootScope'
  ,function ($rootScope) {
   var directiveDefinitionObject = {
    restrict: 'A',
    scope: false, 
    link: function postLink($scope, iElement, iAttrs) { 

      var element = iElement[0];
      var boundingRect = element.getBoundingClientRect();
      console.log('Id : '+element.id);
      console.log(boundingRect);

      var unregister = $scope.$watch('leapState', function(leapState, oldleapState){
    
        if (leapState.handActive){
          var screenPosition = leapState.fingerPos;
          dispatchEvent(element, 
            mouseEvent('mousemove', 
              screenPosition[0], // Screen X
              screenPosition[1], // Screen Y
              screenPosition[0], // Client X
              screenPosition[1]  // Client Y
              ))
          ;
          
        }

      },true);


      function mouseEvent(type, sx, sy, cx, cy) {
        var evt;
        var e = {
          bubbles: true,
          cancelable: (type != "mousemove"),
          view: window,
          detail: 0,
          screenX: sx, 
          screenY: sy,
          clientX: cx, 
          clientY: cy,
          ctrlKey: false,
          altKey: false,
          shiftKey: false,
          metaKey: false,
          button: 0,
          relatedTarget: undefined
        };
        if (typeof( document.createEvent ) == "function") {
          evt = document.createEvent("MouseEvents");
          evt.initMouseEvent(type, 
            e.bubbles, e.cancelable, e.view, e.detail,
            e.screenX, e.screenY, e.clientX, e.clientY,
            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
            e.button, document.body.parentNode);
        } else if (document.createEventObject) {
          evt = document.createEventObject();
          for (prop in e) {
          evt[prop] = e[prop];
        }
          evt.button = { 0:1, 1:4, 2:2 }[evt.button] || evt.button;
        }
        return evt;
      }
      function dispatchEvent (el, evt) {
        if (el.dispatchEvent) {
          el.dispatchEvent(evt);
        } else if (el.fireEvent) {
          el.fireEvent('on' + type, evt);
        }
        return evt;
      }

      $rootScope.$on('changeRouteEvent', function(){
        unregister();
      });

    }
  };
  return directiveDefinitionObject;
}]);
```


# Sources

Les sources de ce projet sont disponible ici [Github - LeapDevFest](https://github.com/GDG-Nantes/leap-devfest2014)