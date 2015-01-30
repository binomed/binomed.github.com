title: DevFest Paris 2015
tags:
- Angular2
- CSS
- PolymerJS
category:
- Event
---
#Devfest Paris : 30 / 01 / 2015

J'ai eu la chance d'^etre retenu en speaker au DevFest Paris et voici mon retour sur cette journée de conférences.

Le DevFest Paris c'est donc tenu à l'école ECE à Paris ce vendredi 30 janvier 2015. 

[Photo devfest]

La journée s'est déroulée de façon assez classique et voici le programme que j'ai suivit sur cette journée : 

* 9h00 : Keynote avec le [GDG Paris](http://gdgparis.com) et [Alexis Moussine Pouchkine (TODO)](http://twitter.com/alexismp)
* 10h00 : PolymerJS avec [Martin Gorner](http://twitter.com/mgorner) et [Cyril Balit](http://twitter.com/balit)    
* 11h00 : j'ai préféré faire une pause networking
* 12h00 : repas
* 13h30 : j'ai donné ma session sur WebRTC
* 14h30 : Angular2 avec [Thierry Chatel](http://twitter.com/tchatel)
* 16h15 : Flexbox par [Raphael Goetter](http://twitter.com/goetter)

# Keynote

[Photo Keynote]

Pendant la keynote, le GDG Paris a commencé par nous présenter la journée puis Alexis a pris le relais pour parler des composantes à prendre en compte pour faire des applications de qualités.

Globalement, Alexis nous a expliqué en quoi Google mettait à disposition tout un ensemble d'outils aussi bien sur a partie front que backend pour aider les développeurs. Il a donc été question de Material Design / Plateforme Cloud / Retours utilisateurs.

* Matérial design est le nouveau thème par défaut dans lolipop mais il s'adresse aussi au applications desktop via Polymer par exemple
* L'offre cloud c'est beaucoup diversifiée ces derniers temps surtout avec l'intégration d'outils comme docker par exemple.

Je ne mettrais qu'une citation d'Alexis qui m'a bien fait sourire : <quote>On ne désire pas les choses par ce qu'elles sont belles mais c'est par ce qu'elles sont belles qu'on les désire</quote>


# Les WebComponents & Polymer : une révolution ?

Cyril Balit & Martin Gorner ont fait une introductions aux composants disponible via PolymerJS avec le stye Paper. Ils nous ont ainsi expliqué certains des principes qui se cachent derrière Material Design.

## L'enjeux 

Un des principaux objectifs de Polymer et de permettre de concevoir des ihm  réutilisables et basées sur les nouveaux standards des webComponents

Polymer, c'est donc l'association de 4 standards : 
* HTML Import : 
    - Importer un fragment html depuis une page web
* Shadow Dom
    - C'est la garantie de l'isolation du composant
* Templates
    - Permet de définir une zone réutilisable dans votre code html qui sera disponible après coup via le javascript
* Custom Elements
    - La création des tags persos ! (je tacherais de créer une balise à titre d'exemple) <jef-binomed></jef-binomed>

## Compatibilité navigateurs

[sortir un tableau ]

## Polymer ! 

C'est donc un polyfill pour les WebComponents qui propose un certain nombre d'éléments en places réutilisables

### Architecture 

[mettre l'image ]

## Paper & Material design

Viens ensuite Paper & Material Design. Paper est donc une implémentation de Matérial Design pour le web. Le nom n'est pas anodin car un des principes de Material Design est de dire que l'information est proposée sur du papier (le matériel !) et donc c'est le support de base de présentation du contenu.

On peut retenir qu'un des enjeux est de donner de l'information rapidement et efficacement ! Pour cela, les informations sont très colorés, dans lolipop, on peut donner une image et il nous ressort en fonction de l'image la couleur correspondante. Les animations et transitions permettent de compléter l'expérience utilisateur en lui offrant une continuité graphique qui ne perd pas notre utilisateur avec un écran noir de transition !


### Composants : 

PolymerJS vient donc avec un certains nombre de composants que l'on peut réutiliser afin d'agrémenter notre ihm. Je n'en ai noté que quelque uns mais la liste est grande et facilite donc grandement le travail des développeurs

* FAB : Floating Action Button : bouton d'action principal
* Ripple ou Ink Effect : Retour visuel sur une interaction
* Hero element : élément qui fait la transition entre 2 vues
* core-toolbar : l'actionbar 
* core-header-panel : conteneur au dessus qui gère la toolbar et le contenu
* core-drawer-panel : composant responsive 
* paper-input : composant de saisie avec toutes les informations nécessaire à la validation
* ...

### Nos propres composants

Pour déclarer un composant personnel, il suffit simplement de déclarer un fichier html qui contient la déclaration de la balise (le nom doit forcément contenir un "-" pour ne pas ^etre confondu avec un autre élément du DOM, le html, le css, le js associé.

[TODO mettre un exemple basique]
```html
```

# WebRTC : Révolutionnons le partage d'informations dans le browser

Plut^ot que de parler de ma session, je vous invite à aller voir les slides ou les vidéos que l'on a déjà pu filmer de cette présentation

[LIEN PRESENTATION]

# AngularJS 2.0... et avant ?

Thierry Chatel nous a fait une présentation pour nous rassurer sur l'avenir d'Angular 2 et il a ainsi revu les principales annoncent qui ont pu ^etre faites pendant NG-Conf.

Globalement, ce qu'il faut retenir, c'est ne vous inquiétez pas ! Certes Angular2 va changer beaucoup de choses mais en me^me temps c'est une bonne chose. Alors que le web très vite et que nous sommes à l'aube de voir débarquer EMACScript 6, les webcomponents, ... dans nos navigateurs, il n'était pas envisageable pour la team Angular de ne pas en tenir compte et donc Angular2 est clairement tourné vers l'avenir !

Prenons quelques uns des arguments de Thierry.

## Application perdurant dans le temps

Thierry a rencontré beaucoup de personnes lui expliquant vouloir déveloper des applications durant 10 ans basées sur AngularJS. Thierry s'est posé la question suivante : "c'était quoi le web y a 10 ans ?". Et en effet, si l'on regarde en arrière, on se rend compte qu'en février 2005 sortait "prototype" et que ce n'est qu'en juillet 2006 que le terme AJAX apparu vraiment et que l'on commença à réaliser des applications aynschrones ! Autant dire qu'il s'en est passé des choses depuis 10 ans, il va surement s'en passer encore beaucoup sur les 10 prochaines années. 

Dire que l'on veut une application qui va durer 10, pourquoi pas mais cela à surtout du sens c^oté serveur ! Le front évoluer trop vite pour que l'on puisse chercher à faire durer des applications c^oté front 10 ans. Pour information, la version de IE disponible il y a 10 ans était IE 6...

## Maintenance de la version 1.x

Pour le moment L'équipe de Google n'a communiquer aucune date sur l'arr^et de la maintenance d'Angular en version 1.x mais Thierry faisait remarquer que l'adésion à ce framework a été tellement forte par la communauté qu'il ne fait aucun doute que des gens reprendront le projet pour des maintenances mineures lors de l'arr^et officiel de la part de Google.

## Suppression du scope et du controleur, je fais comment maintenant ?

Thierry s'est penché sur les raisons qui ont amené à la suppression de ces 2 composants qui sont aujourd'hui au coeur du framework Angular. Il nous a expliqué que si l'on suit les bonnes pratiques du dévelopement Angular, notre contr^oleur ne sert qu'à intialisé le scope et qu'il sert de "passe plat" entre nos services et nos directives. En effet, pour Thierry, le code métier doit figurer dans les services afin de séparer au mieux les couches et d'avoir un code propre et maintenable. Tout ça pour en venir au fait que m^eme la déclaration d'un contr^oleur dans notre application se fait via une directive ng-controller... Ne serait-il pas logique de faire en sorte que ça soit nos directives qui portent nos informations directement et que la simple hiérarchie du DOM ou alors nos services nous servent faire communiquer le tout ? C'est exactement ce qui est proposé avec Angular2.

Il nous a donc expliqué que au lieu de publier dans le scope d'un contr^oleur, nous alions simplement publier dans une directive. 

Afin de faciliter la migration vers Angular2, Thierry propose d'utiliser par exemple la déclaration "Controller as" et de bien séparer au maximum les couches pour rendre notre contr^oleur le moins existant possible.

# FlexBox Révolution

Raphael Goether nous a présenté la propriété css "flex-box". Cette proriété ou plut^ot ensemble de propriétés a 4 objectifs : 

* Distribuer : Comment mes élements vont se position dans le parent (verticalement / horizontalement )
* Ordonancer : Dans quel ordre vont-^etre affichés mes éléments 
* Alignement : Comment les éléments vont-ils ^etre alignés ?
* Flexibilité : Quelle places vont prendre mes éléments ?

## Spect & compatibilité

Aujourd'hui c'est disponible à partir de IE10+, dans tous les autres navigateurs et c'est m^eme disponible dans android 2.1. Rapha¨el nous disait que cela représente 95% du marché ! Mais en tout cas ce qui est sur, c'est que concernant le mobile, vous pouvez foncer les yeux fermés et utiliser flexbox dans la partie mediaquieries de vos sites mobiles !

Concernant la spec, elle a été rétrogradée il y a peu à l'état de brouillon. Ceci est du à un manque de cohérence dans l'écriture de certaines propriétés. Mais Raphael mise quand m^eme sur une disponibilité officielle de la part du W3C prochainement. 

## Fonctionnalités

Voici en vrac ce que l'on peut faire avec flexbox :

* Alignement vertical : oui j'ai bien dit alignement vertical ! 
* Regroupement par catégorie gr^ace à la notion d'ordre
* Réorganisation graphique et très simple de nos ihm


### La Distribution

Par défault, la distribution est horizontal. Cest à dire que nos éléments au lieu d'^etre les un en dessous des autres, seront les uns à c^oté des autres

``` css
 display:flex
```

Si l'on veut changer la direction passé sur vertical par exemple, il faudra setter la propriété flex-direction. De m^eme si notre contenu dépasse, on peut demander à la propriété de faire un retour à la ligne automatique via

``` css
 flex-wrap: true
```

### L'ordonancement

Concrètement, on peut changer l'ordre d'affichage de nos éléments du dom gr^ace à la propriété

``` css
{order : 0} 
```

Cela fonctionne de façon comparable aux z-index. Plus l'ordre est grand, plus il sera loin dans le flux, plus le chiffre est bas (chiffres négatifs autorisés), plus l'élément sera au début du flux.

L'ordonacement peut ^etre utilisé par exemple pour faire des regroupement graphiques d'éléments ayant une propriété en commun. Raphael, nous a montré comment au sein d'une div contenant des liens vers des fichiers (ppt, pdf, doc, ...)

``` css

[href$=".pdf"]{
    order:0;
}

[href$=".doc"]{
    order:1;
}
...
```

De cette manière, tous les pdfs se retrouveront à c^oté, m^eme chose pour les docs.

### L'alignement

L'alignement permet donc de définir comment nos éléments vont ^etre alignés dans leur contenuer ! 

``` css
{justify-content:flex-end}
```
Fera par exemple alignement vers le bas si flex-orientation est en column

``` css
justify-content:center 
```

Quand à lui centrera le contenu en fonction le l'orientation primaire de la flexbox.

``` css 
align-items : 
```

Permettra d'aligner selon l'autre axe

### La flexibilité

Concernant la place prise par l'élément, 3 propriétés sont en jeux : 

La propriété flex est un raccourci de trois propriétés, flex-grow, flex-shrink et flex-basis, qui s’appliquent au flex-container. et dont les fonctionnalités sont:

flex-grow : capacité pour un élément à s’étirer dans l’espace restant,
flex-shrink : capacité pour un élément à se contracter si nécessaire,
flex-basis : taille initiale de l’élément avant que l’espace restant ne soit distribué.
Par défaut, les valeurs de ces propriétés sont : flex-grow: 0, flex-shrink: 1 et flex-basis: auto.
En clair, les flex-items n’occupent initialement que la taille minimale de leur contenu.

## resssources

Je vous invite à aller consulter le site d'Alsa créations : http://www.alsacreations.com/tuto/lire/1493-css3-flexbox-layout-module.html

# Conclusion

La journée fue riche en rencontre et en conférences de qualités, je suis donc content d'avoir pu faire parti de cette édition ! Suiviez le GDG Paris pour ^etre tenus au courant de la publication des vidéos et slides.