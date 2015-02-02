title: "GDG Nantes : Intel XDK"
tags:
  - GDG Nantes
  - XDK
category:
  - Event
date: 2015-02-02 14:30:30
---

# Soirée GDG Nantes : présentation du intel XDK

![](/assets/2015-01-XDK/ecran_principal.jpg)

Le [GDG Nantes](http://www.gdgnantes.com) a reçu [Olivier Gonthier](https://twitter.com/rolios) le 22 Janvier afin qu'il nous présente le framework mobile développé par Intel : "Intel XDK"

#XDK ?

Avant de parler du XDK, il faut parler du HTML5 sur le mobile. En effet, le HTML5 est aujourd'hui très répandu et la communauté des développeurs Web est très grande ! Plutôt que de réinventer un n-ième langage, Intel a fait le choix du HTML.

Vous l'aurez compris; le XDK se positionne sur le marché des frameworks générant des applications hybrides reposant entre autre sur cordova.

![](/assets/2015-01-XDK/Native_html5_hybrid.png)

Concrètement, le XDK est un ensemble d'outils : 
* Editeur de code
* Gestionnaire d'assets
* Designer d'application
* Emulateur
* Debugger
* Ensemble d'apis
* ...

# Basé sur l'existant

Afin d'éviter de réinventer la roue, ils ont choisi de se baser sur des outils / services existants !

* L'éditeur est basé sur brackets et il est donc compatible avec les plugins brackets 
* L'émulateur est basé sur Ripple
* Le framework choisit pour la partie hybride est basé sur Cordova
* Le debugging se fait avec des devTools


L'éditeur de code propose aussi d'utiliser des environnements graphiques pour son application basé sur des solutions répandues : jQuery Mobile ou Bootstrap. 

Cela n'empêche pas le développeur de choisir sa propre librairie ou d'utiliser des framework css différents. L'avantage d'utiliser jQuery Mobile ou Bootstrap dans un projet XDK, est que l'IDE propose un éditeur WYSIWYG utilisant directement les composants de ces frameworks.

![](/assets/2015-01-XDK/designer.jpg)

Cependant, Intel fourni le "AppFramwework" : framework opensource à la sauce jQuery qui offre l'avantage d'avoir un style final proche du natif de la plateforme pour laquelle l'application est générée.


# Les services intégrés

Intel a pensé aux développeurs et aux services tiers. En effet, ils ont créé un certain nombre de ponts vers les services principaux comme DropBox, Youtube, ... L'intégration de ces services est donc simplifiée et facilitée par l'éditeur.

![](/assets/2015-01-XDK/services.png)

L'éditeur propose de simplement remplir les champs en lien avec l'API et le reste se fait tout seul. Comme nous sommes dans le web, il est possible de binder directement son service sur son IHM, pour cela, Intel propose d'utiliser Backbone ou AngularJS.


# Build

Comme le build est basé sur Cordova, une application codée avec le SDK peut être buildé sur les mêmes plateformes que Cordova.

Seul hic : le build se fait depuis les serveurs d'Intel. Les sources sont envoyées sur les serveurs d'Intel pour générer pour la bonne plateforme. Cependant, il reste quand même possible de gérer son build perso. C'est juste un peu plus compliqué, car il faut gérer soit même les dépendances, les installations de SDK etc...

Concernant les builds Android, Intel propose de générer l'application avec la webview [Crosswalk](https://crosswalk-project.org/). Cette webview dispo pour android 4+ donne accès à plus d'API que la webview de base. La webview étant embarqué, l'apk sera plus gros qu'un projet compilé sans crosswalk.

# Ce que j'ai retenu des outils à disposition

On retrouve globalement les mêmes devtools que chrome (size / network / maps / ...), ce qui peut faciliter le debuggage d'application et si l'on veut aller plus loin, et que l'on souhaite quand même debugguer sur son téléphone, Intel fournit une application qui vous permettra de tester votre application "non finalisée" sur votre appareil à condition d'installer l'application [Intel App Preview](https://play.google.com/store/apps/details?id=com.intel.html5tools.apppreview&hl=fr_FR)



# Petit bonus

Le XDK est aussi compatible avec les board IoT d'Intel. On peut donc programmer sur les cartes d'Intel orienté IoT avec le XDK

![](/assets/2015-01-XDK/2boards.png)

# En conclusion

Intel XDK est à mon avis intéressant pour ceux qui veulent produire rapidement des applications cross plateformes (i.e. des gens qui débutent). Cependant, de mon point de vue de développeur, je ne suis pas sûr qu'une personne ayant déjà de bonnes compétences avec Cordova trouvent un intérêt avec le XDK. 

# Pour aller plus loin

Le site officiel d'intel : [https://software.intel.com/fr-fr/html5/tools](https://software.intel.com/fr-fr/html5/tools)

Les slides de la présentation donnée au GDG : 
<iframe src="//slides.com/r0ly/intel-xdk/embed" width="576" height="420" scrolling="no" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

La vidéo de la session du GDG Nantes : 
<iframe width="560" height="315" src="//www.youtube.com/embed/pjcs-7Af5Y4" frameborder="0" allowfullscreen></iframe>
