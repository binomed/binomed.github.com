title: "GDG Nantes : Intel XDK"
tags:
- GDG Nantes
- XDK
category:
- Event
---

# Soirée GDG Nantes : présentation du intel XDK

Le [GDG Nantes](http://www.gdgnantes.com) a reçu Olivier Gonthier le 22 Janvier afin qu'il nous présente le framework mobile dévelopé par intel : XDK



#XDK ?

Avant de parler xdk faut parler du html5 sur le mobile et c'est quelque chose de très répendu maintenant pour le développement et profitant d'une forte communauté.

Vous l'aurez compris XDK se positionne sur le marché des frameworks générant des applications hybrides reposant entre autre sur cordova.

Concrètement c'est un ensemble d'outils : 
    * editeur de code
    * gestionnaire d'assets
    * ensemble d'apis
    * ...

L'éditeur de code propose aussi d'avoir de base du jQuery Mobile / du bootstrap mais cela n'empêche pas d'apporter ses propres dépendances.

ça gère aussi des frameworks de jeux

ça supporte aussi pleins de services tels Dropbox, Youtube, ... => ça veut dire que l'intégration de ces services est simplifiée et facilité par l'éditeur.

# C'est basé sur l'existant

Afin d'eviter de réinventer la roue, ils ont choisis de se baser sur Brackets (pour l'éditeur) et compatible avec les plugins brackets / Ripple (pour l'émulateur) / Cordova (pour l'aspect hybride) /  DevTools ( pour le débugging)


# Les services intégrés

L'éditeur propose de simplement remplir les champs en lien avec l'API

Binding de services basé sur AngularJS ou Backbone

Y a designer d'interface en mode DnD et peut aller loin dans la configuration (notion de pages / widget) mais aussi gestion de thèmes de media-queries

# Tools

On retrouve globalement les mêmes devtools que chrome (size / network / maps / ...)

appPreview => debugging dans le cloud mais sur nos mobiles

# Build

vers toutes les plateformes existentes

Enfin le build se fait depuis le xdk=> les sources sont envoyées sur les serveurs d'intel pour générer pour la bonne plateforme. Par contre on peut quand même gérer son build perso, c'est juste un peu plus chiant (installation des sdk etc)


# comment ça marche : 

import js ```intelxdk.js``` 
object parent : intel.xdk = point d'entrée

l'API est asynchrone pour les événements natifs

ILs fournissent le AppFramwework = framework opensource à la sauce jQuery et très très proche de jQuery

Crosswalk, webview dispo pour android 4+ donnant accès à plus d'API de webview. Le moteur est embarqué. CrossWalk est un projet conjoitement fait avec Google, c'est donc une webview dispo qui est alternative

C'est gratuit, marche sur tous les OS.

Le XDK est aussi compatible avec les board IoT d'Intel

