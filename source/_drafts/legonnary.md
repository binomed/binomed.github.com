title: "J'ai fait un jeux multijoueur en temps réel server-less et offline"
tags:
  - Progressive Web App
  - HTML5
  - Firebase
  - DevFest
category:
  - Tech
toc: false
---

![](/assets/2016-12-legonnary/devfest_photo.jpg)


## Tout ça pour un compte à rebours !

Dans le cadre du [DevFest Nantes 2017](https://devfestnantes.gdgnantes.com) j'ai voulu comme chaque année travailler un compte à rebours personnalisé.

### Origin story

Ayant eu la chance d'aller au [Google I/O](https://events.google.com/io), j'ai beaucoup apprécié les animations qu'il y a eu et qui permettait aux participants de joueur avec une application codée spécialement pour l'occasion : [Paper Planes](https://paperplanes.world/).

N'ayant pas les compétences graphiques WebGL pour faire un jeu aussi beau. J'ai donc cherché un autre concept ! 

### Thème : les Lego ©

![](/assets/2016-12-legonnary/theme_lego.jpg)

En 2016, le thème graphique était l'univers Lego, je me suis donc lancé dans gros brainstorming avec ma femme pour trouver une idée qui permettrait de faire un jeux multijoueur basé sur les legos. 

Ma première idée fue de laisser les participants contruire en 3D des Lego © et d'afficher sur l'écran de restitution les étapes suivies par les participants et le résultat final ! L'idée était intéressante mais j'ai du me rendre à l'évidence, je n'ai ni le temps, ni les compétences pour mettre en place un tel système... il a donc fallu que je continue à chercher. Finalement c'est ma femme qui a trouvé l'idée qui était à la fois cool et à la fois réalisable pour mes compétences graphiques : J'allais faire un Pixel art Lego © dont le résultat final se verrait à l'écran ! Legonnary était né !

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/gdg_logo_legonnary.png">
</div>


### Le concept

Le concept est du coup relativement simple : 
1. Un participant va se logguer pour soumettre des dessins type Pixel art fait à partir de briques Lego ©. 
2. Un modérateur reçoit le dessin du participant (car oui il vaut mieux modérer dans ces cas ;) ). Il va donc décider de valider ou refuser un dessin
3. Si le dessin est accepté, alors il apparaitra sur l'écran de comptes à rebours et sera affiché une seule fois !
4. Si non, seul l'utilisateur à l'origine du dessin pourra revoir son dessin ainsi que l'état du dessin : accepté / refusé. 
5. Tous les dessins validés doivent être accessible sur un écran de restitution indépendant pour accéder simplement aux dessins créés ET validés.

## Enjeux 

Avant de rentrer dans le détail de l'implémentation choisie, j'ai voulu me fixer quelques contraintes : 

- Je voulais faire une Progressive Web App [PWA](https://developers.google.com/web/progressive-web-apps/) afin d'être : mobile first / offline / installable.
- Je voulais un jeu temps réel mais en même temps sans serveur.
- Je voulais une application sécurisée, à la fois au niveau des données mais aussi au niveau de son accès. Globalement, je voudrais que mes utilisateurs soient loggués.
- Afin d'éviter aux participants de saisir une url, je voulais que l'application soit détectable en physical web
- Nous sommes en 2016, je ne me voyais pas partir sur une application qui n'était pas codée en ES6.
- Il a fallu prévoir plusieurs applications pour coller avec chacun des rôles : Joueur / Modérateur / Ecran de comptes à rebours /  Ecran de restitution

## Architecture

Pour faire marcher tout ça ensemble, j'ai choisi l'architecture suivante : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/Legonnary_Archi.png">
</div>

### Firebase

Firebase me permet en effet de répondre à beaucoup de besoins : 
* En sécurisant mon arbre de données firebase, je vais sécuriser mes données. De plus grâce à [Firebase Authentication](https://firebase.google.com/docs/auth/) je peux faire de l'authentification sécurisée sans me soucier de mettre en place des mécanismes d'OAuth !
* Je vais pouvoir "hoster" mon application
* Mes données vont être synchronisées en temps réel et chacune des applications va pouvoir communiquer de façon instanée sans que j'ai quoi que ce soit à coder au niveau serveur.
* Enfin pour finir, le jeux fonctionnera aussi offline grace à Firebase car je sais qu'il est du ressort de la librairie de gérer les push d'événements.

### PWA 

La partie Progressive Web App a été codé de façon manuelle car je voulais comprendre, mettre les mains dans le cambouie 

### Fabric JS

Ayant déjà eu l'occasion de travailler plusieurs fois avec des canvas, je sais que la complexité de code peut vite augmenter notamment lié aux histoires de zoom d'écran sur mobile. J'avais aussi identifé un certains nombre de points qui allaient surement me poser des problèmes, notamment le fait que mes pièces Lego devaient avoir un effet aimenté vis à vis d'une grille. 

Face à tous possibles problèmes, j'ai préféré me reposer sur une libraire plutôt que de tout coder moi même. J'ai donc choisi [FabricJS - todo]() comme librairie car elle proposait une abstraction suffisante et des fonctionnalités qui collaient bien avec mon besoin.

### Déployement automatique avec CodeShip

Enfin pour pousser mon code en production, je me suis reposé sur [Codeship](https://codeship.com/) qui propose de se brancher sur les commits faits sur github et donc permettre un redéployement automatique de mon code. 

### Workflow de validation des dessins

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/Legonnary_Validation.png">
</div>

Afin de faire communiquer correctement chacun des écrans / applications, j'ai défini une notion d'états pour les dessins fait via l'application. Un dessin va pouvoir se retrouer avec plusieurs états en même pour permettre un affichage conditionnel. 

* **Submited** : Un dessin est dans cet état, juste après la validation d'un utilisateur
* **Accepted** : Un dessin est dans cet état si le modérateur a validé le dessin
* **Rejected** : Un dessin est dans cet état si le modérateur a rejeté le dessin

Etats additionnels :
* **Validated** : Un dessin est dans cet état s'il a été validé par le modérateur et qu'il attend d'être traité par l'écran de comptes à rebours
* **Archived** : Un dessin est dans cet état dès que le dessin est validé. Un dessin dans cet état est considéré comme public et peut donc être consulté par n'importe qui.


<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/Legonnary_Workflow.png">
</div>


## Workflow de dev choisi


### Structure du code

```bash
Legonnary
/public # Build du projet
/src # Sources du projet
  /assets # Assets audio / vidéos / font / images
  /css # build du sass
  /sass # Sources du sass
  /scripts # ensemble des fichiers js à transpiler
  /index.html # index basique pour les joeurs
  /moderator.html # index spécifique aux modérateurs
  /screen.html # index spécifique à l'écran de compte à rebours
  /summary.html # index spécifique à la restitution
  /manifest_phone.json # Manifest pour la PWA jeu
  /manifest_moderator.json # Manifest pour la PWA moderator
  /service-worker-phone.js # Service Worker pour la PWA jeu
  /service-worker-moderator.js # Service Worker pour la PWA moderator
```

### Pourquoi pas Angular ?

Comme je le disais plus haut, j'ai voulu coder mon application en ES6. Alors la première question que l'on m'a posé à chaque fois, c'est pourquoi du vanillaJS plutôt qu'un angular ou autre chose ? La réponse est simple : KISS ! Le jeux mis en place ne nécessitait pas de grand complexité et donc, j'ai jugé un peu overkill de charger une librairie type angular. 

ES6 m'a permis de structurer tout aussi éfficacement mon code, en créant des classes séparant ainsi fortement mes concepts, et en déléguant aussi bien les responsabilités dans chaque partie de mon code !

### Task runner

Côté build, je n'avais pas forcément envie de partir sur webpack car soyons franc, je n'avais pas les compétences ni l'envie d'apprendre un nouvel outils de build. J'avais déjà bien assez à apprendre avec ce jeux. Je ne voulais pas me rajouter un nouveau challenge. A terme, je ne pas par contre que mes prochains projets n'utiliseront pas webpack ou le task runner tendance du moment. Bref ! J'ai choisi Gulp & Browserify. Gulp, par ce que je l'aime bien et Browserify par ce je voulais coder mon application en utilisant les imports de modules javascript.

La seule complexité que j'ai eu avec ce build a été de trouver la bonne configuration pour faire marcher ES6, Babel & Browserify. Pour résoudre ce problème, je me suis appuyé sur le plugin [babelify](https://github.com/babel/babelify). Voici les tasks spécifiques à mon build qui gère cette partie

```javascript
"use strict";
// Include gulp
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps")
var babelify = require('babelify');
var gutil = require('gulp-util');
var browserify = require("browserify");
var source = require('vinyl-source-stream');


var extensions = ['.js','.json','.es6'];

gulp.task('browserify_phone',function(){
  return browserify({entries: './src/scripts/app_phone.js', debug:true, extensions: extensions})
    .transform(babelify)
    .on('error', gutil.log)    
    .bundle()    
    .on('error', gutil.log)    
    .pipe(source('bundle_phone.js'))
    .pipe(gulp.dest('./src'));
});
```

La déclaration des extensions es6 est obligatoire pour indiquer au plugin ce qu'il doit convertir / transpiller.

**/!\\** Il est très important aussi d'ajouter à la racine de son projet un ficher `.babelrc` qui permet de spécifier quelle est la cible de compilation

```javascript
{
  "presets": ["es2015"]
}
```

Pour le reste, j'ai utilisé sass /  browsersync afin de me garentir un workflow de dev complet. Voici le lien vers mon [gulp file - TODO]()

### Spécifiques du build

J'ai du prévoir un certains de choses assez spécifiques car  : 

* J'ai plusieurs applications. J'ai donc plusieurs taches qui font des builds spécifiques pour chacune de mes applications.
* Toutes les applications n'ont pas de service worker.
* Je veux une invalidation brute de mon service worker à chaque nouvelle publication (j'en parlerais dans la partie PWA)


## Progressive Web App

Les Progressives Web App (PWA) sont un des grands concepts regroupant un ensemble de bonnes pratiques sur les applications web. Voici en vrac les choses que l'ont peut retrouver sur un PWA : 

* OffLine
* Responsive
* Installable
* Push Notification
* Background Sync
* ... 

### Concepts abordés

Pour l'application legonnary, j'ai choisi d'aborder les choses suivantes : 

* Application installable
* Disponibilité de l'application offline
* Responsive

Je n'ai donc pas touché à la partie push, ni background sync.

### Application Installable

Une des choses les plus simple à mettre en oeuvre c'est le manifest. Il s'agit d'un fichier json qui va donner un ensemnble de meta-données sur votre application permettant par la suite d'installer votre application sur la home de votre téléphone (compatible android & un peu IOS).

Prenons en exemple le manifest de l'application joueur.

```json
{
    "name": "Legonnary",
    "short_name": "Legonnary",
    "icons": [{
            "src": "./assets/img/launcher_144.png",
            "type": "image/png",
            "sizes": "144x144"
        }, {
            "src": "./assets/img/launcher_192.png",
            "type": "image/png",
            "sizes": "192x192"
        }, {
            "src": "./assets/img/launcher_512.png",
            "type": "image/png",
            "sizes": "512x512"
        }
    ],
    "start_url": "./index.html",
    "display": "standalone",
    "orientation": "portrait",
    "background_color": "#ffeb3b",
    "theme_color": "#ffeb3b"
}
```

Revenons sur les différents champs : 
* `name`: Il s'agit du nom de l'application à son lancement
* `short_name` : Il s'agit du nom qui sera présent sous l'icône dans la home de votre téléphone
* `icons` : ensemble de combinaisons possibles de résolutions de votre icône. Cela va dépendre du téléphone
* `start_url` : url de démarage du site une fois qu'on a cliqué sur l'icône. On peut donc spécifier une url spécifique dans le cas d'une PWA ! 
* `display` : il s'agit d'un flag permettant de définir le mode de lancement de l'application. Voici les valeurs possibles : 
    - `standalone` : n'affiche pas la barre de navigation du navigateur
    - `browser` : affiche la barre de navigation 
* `orientation` : définit l'orientation de l'application
* `background_color` : définit la couleur de fond que vous aller avoir pour le spash screen
* `theme_color` : définit une couleur de thème qui pourra être utilisée par le navigateur pour colorer la barre d'url

Pour ajouter ce manifest à votre page il suffit simplement d'ajouter la balise suivante dans la partie header : 

```html
<link rel="manifest" href="manifest_phone.json">
```

Concernant IOS & Windows, il faut ajouter quelques balises supplémentaires (toujours dans le header) pour avoir l'ajout à l'écran d'accueil.

```html
<!-- Add to home screen for Safari on iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Legonnary">
<link rel="apple-touch-icon" href="./assets/img/launcher_144.png">
<!-- Windows management -->
<meta name="msapplication-TileImage" content="./assets/img/launcher_144.png">
<meta name="msapplication-TileColor" content="#ffeb3b">
```

**/!\ Le fait de préciser le manifest dans l'index.html ne suffit pas à transformer votre application en application "installable" ! En effet, une application installée sur votre home doit être capable de démarer même sans internet !  Donc une PWA avec un manifest ne sera réellement installable que si vous avez un service worker installé. **

Pour plus d'infos, vous pouvez consulter cette doc : [Web App Manifest](https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/)

### Offline

### Responsive

## Sécurisation de l'app 

### Structure de l'arbre firebase

### Gestion de l'admin

## Challenges graphiques

### Grille légo

### Animations CSS

## Tout ce dont je n'ai pas parlé

* le comptes à rebours
* Code github

Le résultat final : 
 * App de base
 * App Modérateur
 * App Comptes à rebours
 * App Restit