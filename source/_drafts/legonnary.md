title: "J'ai fait un jeux multijoueur en temps réel server-less et offline"
tags:
  - Progressive Web App
  - HTML5
  - Firebase
  - DevFest
  - Service Worker
  - Web App Manifest
category:
  - Tech
toc: false
---

![](/assets/2016-12-legonnary/devfest_photo.jpg)


## [TL;DR;] 

Il s'agit d'un article sur un jeu mis en place pour le DevFest 2017. Les grandes parties sont : 
* [Origin Story](#Origin_story) : pourquoi / comment / les enjeux ?
* [Architecture](#Architecture) : Quelle architecture j'ai choisi.
* [Workflow de dev choisi](#Workflow_de_dev_choisi) : Comment j'ai structuré mon code et mon workflow de dev
* [Progressive Web App](#Progressive_Web_App) : Comment j'ai transformé l'application en Progressive Web App
* [Sécurisation de l’app](#Sécurisation_de_l’app) : Utilisation détaillée de firebase pour le cas du jeu
* [Challenges graphiques](#Challenges graphiques) : Problèmes et solutions graphiques rencontrées

## Tout ça pour un compte à rebours !

Dans le cadre du [DevFest Nantes 2017](https://devfestnantes.gdgnantes.com) j'ai voulu comme chaque année travailler un compte à rebours personnalisé.

### Origin Story

Ayant eu la chance d'aller au [Google I/O](https://events.google.com/io), j'ai beaucoup apprécié les animations qu'il y a eu et qui permettait aux participants de joueur avec une application codée spécialement pour l'occasion : [Paper Planes](https://paperplanes.world/).

N'ayant pas les compétences graphiques WebGL pour faire un jeu aussi beau. J'ai donc cherché un autre concept ! 

### Thème : les Lego ©

![](/assets/2016-12-legonnary/theme_lego.jpg)

En 2016, le thème graphique était l'univers Lego ©, je me suis donc lancé dans gros brainstorming avec ma femme pour trouver une idée qui permettrait de faire un jeu multijoueur basé sur les Lego ©. 

Ma première idée fut de laisser les participants construire en 3D des Lego © et d'afficher sur l'écran de restitution les étapes suivies par les participants et le résultat final ! L'idée était intéressante mais j'ai dû me rendre à l'évidence, je n'ai ni le temps, ni les compétences pour mettre en place un tel système... il a donc fallu que je continue à chercher. Finalement c'est ma femme qui a trouvé l'idée qui était à la fois cool et à la fois réalisable pour mes compétences graphiques : J'allais faire un Pixel art Lego © dont le résultat final se verrait à l'écran ! Legonnary était né !

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/gdg_logo_legonnary.png">
</div>


### Le concept

Le concept est du coup relativement simple : 
1. Un participant va se loguer pour soumettre des dessins type Pixel art fait à partir de briques Lego ©. 
2. Un modérateur reçoit le dessin du participant (car oui il vaut mieux modérer dans ces cas ;) ). Il va donc décider de valider ou refuser un dessin
3. Si le dessin est accepté, alors il apparaîtra sur l'écran de comptes à rebours et sera affiché une seule fois !
4. Si non, seul l'utilisateur à l'origine du dessin pourra revoir son dessin ainsi que l'état du dessin : accepté / refusé. 
5. Tous les dessins validés doivent être accessible sur un écran de restitution indépendant pour accéder simplement aux dessins créés ET validés.

## Enjeux 

Avant de rentrer dans le détail de l'implémentation choisie, j'ai voulu me fixer quelques contraintes : 

- Je voulais faire une Progressive Web App [PWA](https://developers.google.com/web/progressive-web-apps/) afin d'être : mobile first / offline / installable.
- Je voulais un jeu temps réel mais en même temps sans serveur.
- Je voulais une application sécurisée, à la fois au niveau des données mais aussi au niveau de son accès. Globalement, je voudrais que mes utilisateurs soient logués.
- Afin d'éviter aux participants de saisir une URL, je voulais que l'application soit détectable en physical web
- Nous sommes en 2016, je ne me voyais pas partir sur une application qui n'était pas codée en ES6.
- Il a fallu prévoir plusieurs applications pour coller avec chacun des rôles : Joueur / Modérateur / Écran de comptes à rebours /  Écran de restitution

## Architecture

Pour faire marcher tout ça ensemble, j'ai choisi l'architecture suivante : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/Legonnary_Archi.png">
</div>

### Firebase

Firebase me permet en effet de répondre à beaucoup de besoins : 
* En sécurisant mon arbre de données firebase, je vais sécuriser mes données. De plus grâce à [Firebase Authentication](https://firebase.google.com/docs/auth/) je peux faire de l'authentification sécurisée sans me soucier de mettre en place des mécanismes d'OAuth !
* Je vais pouvoir "hoster" mon application
* Mes données vont être synchronisées en temps réel et chacune des applications va pouvoir communiquer de façon instantanée sans que j'aie quoi que ce soit à coder au niveau serveur.
* Enfin pour finir, le jeu fonctionnera aussi offline grace à Firebase car je sais qu'il est du ressort de la librairie de gérer les push d’évènements.

### PWA 

La partie Progressive Web App a été codé de façon manuelle car je voulais comprendre, mettre les mains dans le cambouis 

### Fabric JS

Ayant déjà eu l'occasion de travailler plusieurs fois avec des canvas, je sais que la complexité de code peut vite augmenter notamment lié aux histoires de zoom d'écran sur mobile. J'avais aussi identifié un certain nombre de points qui allaient surement me poser des problèmes, notamment le fait que mes pièces Lego © devaient avoir un effet aimanté vis-à-vis d'une grille. 

Face à tous possibles problèmes, j'ai préféré me reposer sur une libraire plutôt que de tout coder moi-même. J'ai donc choisi [FabricJS](http://fabricjs.com/) comme librairie car elle proposait une abstraction suffisante et des fonctionnalités qui collaient bien avec mon besoin.

### Déploiement automatique avec CodeShip

Enfin pour pousser mon code en production, je me suis reposé sur [Codeship](https://codeship.com/) qui propose de se brancher sur les commits faits sur github et donc permettre un redéploiement automatique de mon code. 

### Workflow de validation des dessins

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/Legonnary_Validation.png">
</div>

Afin de faire communiquer correctement chacun des écrans / applications, j'ai défini une notion d'états pour les dessins faits via l'application. Un dessin va pouvoir se retrouver avec plusieurs états en même pour permettre un affichage conditionnel. 

* **Submited** : Un dessin est dans cet état, juste après la validation d'un utilisateur
* **Accepted** : Un dessin est dans cet état si le modérateur a validé le dessin
* **Rejected** : Un dessin est dans cet état si le modérateur a rejeté le dessin

États additionnels :
* **Validated** : Un dessin est dans cet état s'il a été validé par le modérateur et qu'il attend d'être traité par l'écran de comptes à rebours
* **Archived** : Un dessin est dans cet état dès que le dessin est validé. Un dessin dans cet état est considéré comme public et peut donc être consulté par n'importe qui.


<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/Legonnary_Workflow.png">
</div>


## Workflow de dev choisi


### Structure du code

```bash Legonnary/
/public # Build du projet
/src # Sources du projet
  /assets # Assets audio / vidéos / font / images
  /css # build du sass
  /sass # Sources du sass
  /scripts # ensemble des fichiers js à transpiler
  /index.html # index basique pour les joueurs
  /moderator.html # index spécifique aux modérateurs
  /screen.html # index spécifique à l'écran de compte à rebours
  /summary.html # index spécifique à la restitution
  /manifest_phone.json # Manifest pour la PWA jeu
  /manifest_moderator.json # Manifest pour la PWA moderator
  /service-worker-phone.js # Service Worker pour la PWA jeu
  /service-worker-moderator.js # Service Worker pour la PWA moderator
```

### Pourquoi pas Angular ?

Comme je le disais plus haut, j'ai voulu coder mon application en ES6. Alors la première question que l'on m'a posé à chaque fois, c'est pourquoi du vanillaJS plutôt qu'un Angular ou autre chose ? La réponse est simple : KISS ! Le jeu mis en place ne nécessitait pas de grande complexité et donc, j'ai jugé un peu overkill de charger une librairie type Angular. 

ES6 m'a permis de structurer tout aussi efficacement mon code, en créant des classes séparant ainsi fortement mes concepts, et en déléguant aussi bien les responsabilités dans chaque partie de mon code !

### Task runner

Côté build, je n'avais pas forcément envie de partir sur webpack car soyons franc, je n'avais pas les compétences ni l'envie d'apprendre un nouvel outil de build. J'avais déjà bien assez à apprendre avec ce jeu. Je ne voulais pas me rajouter un nouveau chalenge. À terme, je ne pas par contre que mes prochains projets n'utiliseront pas webpack ou le task runner tendance du moment. Bref ! J'ai choisi Gulp & Browserify. Gulp, par ce que je l'aime bien et Browserify par ce je voulais coder mon application en utilisant les imports de modules Javascript.

La seule complexité que j'ai eue avec ce build a été de trouver la bonne configuration pour faire marcher ES6, Babel & Browserify. Pour résoudre ce problème, je me suis appuyé sur le plugin [babelify](https://github.com/babel/babelify). Voici les tasks spécifiques à mon build qui gère cette partie

```javascript gulpfile.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/gulpfile.js
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

```javascript .babelrc https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/.babelrc
{
  "presets": ["es2015"]
}
```

Pour le reste, j'ai utilisé sass /  browsersync afin de me garantir un workflow de dev complet. Voici le lien vers mon [Gulp File](https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/gulpfile.js)

### Spécifiques du build

J'ai dû prévoir un certain nombre de choses assez spécifiques car  : 

* J'ai plusieurs applications. J'ai donc plusieurs taches qui font des builds spécifiques pour chacune de mes applications.
* Toutes les applications n'ont pas de service worker.
* Je veux une invalidation brute de mon service worker à chaque nouvelle publication (j'en parlerais dans la partie PWA)


## Progressive Web App

Les Progressives Web App (PWA) sont un des grands concepts regroupant un ensemble de bonnes pratiques sur les applications web. Voici en vrac les choses que l'on peut retrouver sur un PWA : 

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

### Application installable

Une des choses les plus simples à mettre en œuvre c'est le manifest. Il s'agit d'un fichier JSON qui va donner un ensemble de meta-données sur votre application permettant par la suite d'installer votre application sur la "home" de votre téléphone (compatible Android & un peu IOS).

Prenons en exemple le manifest de l'application joueur.

```json manifest_phone.json https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/manifest_phone.json
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
* `short_name` : Il s'agit du nom qui sera présent sous l'icône dans la "home" de votre téléphone
* `icons` : ensemble de combinaisons possibles de résolutions de votre icône. Cela va dépendre du téléphone
* `start_url` : URL de démarrage du site une fois qu'on a cliqué sur l'icône. On peut donc spécifier une URL spécifique dans le cas d'une PWA ! 
* `display` : il s'agit d'un flag permettant de définir le mode de lancement de l'application. Voici les valeurs possibles : 
    - `standalone` : n'affiche pas la barre de navigation du navigateur
    - `browser` : affiche la barre de navigation 
* `orientation` : définit l'orientation de l'application
* `background_color` : définit la couleur de fond que vous aller avoir pour le spash screen
* `theme_color` : définit une couleur de thème qui pourra être utilisée par le navigateur pour colorer la barre d’URL

Pour ajouter ce manifest à votre page il suffit simplement d'ajouter la balise suivante dans la partie header : 

```html index.html(header) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/index.html#L9
<link rel="manifest" href="manifest_phone.json">
```

Concernant IOS & Windows, il faut ajouter quelques balises supplémentaires (toujours dans le header) pour avoir l'ajout à l'écran d'accueil.

```html index.html(header) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/index.html#L10
<!-- Add to home screen for Safari on iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Legonnary">
<link rel="apple-touch-icon" href="./assets/img/launcher_144.png">
<!-- Windows management -->
<meta name="msapplication-TileImage" content="./assets/img/launcher_144.png">
<meta name="msapplication-TileColor" content="#ffeb3b">
```

**/!\ Le fait de préciser le manifest dans l'index.html ne suffit pas à transformer votre application en application "installable" ! En effet, une application installée sur votre home doit être capable de démarrer même sans internet !  Donc une PWA avec un manifest ne sera réellement installable que si vous avez un service worker installé. **

Pour plus d'infos, vous pouvez consulter cette doc : [Web App Manifest](https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/)

### Offline

Passons maintenant à la mise en place du service worker.

Pour ceux qui ne savent pas ce qu'est un service worker, je vous invite à consulter ce site : [Is ServiceWorker Ready ?](https://jakearchibald.github.io/isserviceworkerready/). En plus de vous donner l'état d'avancement de l'implémentation de la spec sur les différents navigateurs, il vous donnera accès à plein de ressources, documentation nécessaire à la compréhension du service worker.

Comme je le disais au début, j'ai préféré coder moi-même mon service worker car je souhaitais monter en compétences et comprendre précisément ce que je codais. Je n'ai donc pas utilisé d'outils pour m'aider à réaliser ce dernier et si vous êtes intéressés par de la génération de services workers, je vous invite à regarder ceci : [sw-precache](https://github.com/GoogleChrome/sw-precache).

Concernant mon application, j'avais envie d'éviter de surcharger mon serveur en bande passante et donc je me suis appuyé sur des CDN pour délivrer mes librairies Javascript. Une des premières choses que j'ai donc mises en place c'est la séparation entre mon cache de CDN et le cache de mes ressources que je considérais comme dynamiques (css / js / ...) 

```javascript service-worker-phone.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/service-worker-phone.js
'use strict';

let cacheFileName = "legonnaryCache-v{timestamp}";
let cacheCdnName = "legonnaryCdnCache-v1";

let filesToCache = [
    './',
    './index.html',
    './bundle_phone.js',
    './css/phone.css',
    './assets/img/favicon.ico',
    './assets/img/launcher_144.png',
    './assets/img/launcher_192.png',
    './assets/img/launcher_512.png',
    './assets/img/lego_painter.png',
    './assets/img/lego_painter_128.png',
    './assets/fonts/LEGO_BRIX.ttf',
    './manifest_phone.json'
];

let cdnToCache = [
  "https://fonts.googleapis.com/",
  "https://cdnjs.cloudflare.com/",
  "https://www.gstatic.com/",
  "https://ajax.googleapis.com/",
  "https://rawgit.com/",
  "https://www.google-analytics.com/",
  "https://code.getmdl.io/",
  "https://fonts.gstatic.com/"  
];
```

Ce fichier est issu des tutoriels de Google, donc on va y retrouver les éléments classiques : 

**1. Installation avec mise en cache**

```javascript service-worker-phone.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/service-worker-phone.js#L32
self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheFileName)
            .then(function(cache) {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache);
            })
    );
});
```

**2. Activation du cache avec invalidation du précédent cache** 

```javascript service-worker-phone.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/service-worker-phone.js#L43
self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheFileName && key != cacheCdnName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});
```

La particularité de mon service worker réside au niveau de la mise en cache du CDN. J'attends en effet de voir si la ressource demandée fait partie de ma liste de ressources à mettre à cache et si c'est le cas, je délivre soit le fichier 'caché', soit je le récupère sur le réseau et ensuite je le mets en cache.

Si la ressource ne fait pas partie des fichiers à mettre en cache, alors, je vais chercher la ressource sur le web.

```javascript service-worker-phone.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/service-worker-phone.js#L57
self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    if (cdnToCache.find((element)=>{return e.request.url.indexOf(element) === 0;})) {
        e.respondWith(
            caches.match(e.request.url).then(function(response) {
                if (response){
                    return response
                }else{
                    return fetch(e.request)
                            .then(function(response) {
                                return caches.open(cacheCdnName).then(function(cache) {
                                    cache.put(e.request.url, response.clone());
                                    console.log('[ServiceWorker] Fetched&Cached Data');
                                    return response;
                                });
                            })
                }
            })            
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request);
            })
        );
    }
});
```

Fichier complet : [ServiceWorker Legonnary](https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/service-worker-phone.js)

enfin, n'oublions pas d'inclure l'installation du service worker dans l'application.

```javascript app_phone.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/app_phone.js#L186
 if ('serviceWorker' in navigator) {        
    navigator.serviceWorker.register('./service-worker-phone.js', {scope : location.pathname}).then(function(reg) {
        console.log('Service Worker Register for scope : %s',reg.scope);
    });
}
```

#### Gestion du build 

Comme je n'ai pas utilisé d'outils de build pour gérer pour moi le service worker, j'ai dû mettre en place quelques *"astuces"* pour garder un workflow de dev facile. En effet, en développement mon service worker n'est pas actif et la mise à jour du numéro de cache est gérée automatiquement par mon build 

**1. Service désactivé pendant le dev**

J'aurais très bien pu utiliser l'option des devtools qui me permet de mettre à jour mon cache à chaque refresh mais cela nécessite que les devtools soient toujours ouverts, ce qui n'était pas toujours mon cas. Pour pallier à ça, j'ai simplement commenté l'activation de mon service dans mon code et mon build va simplement supprimer ces commentaires.

```javascript app_phone.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/app_phone.js#L185
/* SERVICE_WORKER_REPLACE
if ('serviceWorker' in navigator) {        
    navigator.serviceWorker.register('./service-worker-phone.js', {scope : location.pathname}).then(function(reg) {
        console.log('Service Worker Register for scope : %s',reg.scope);
    });
}
SERVICE_WORKER_REPLACE */
```

Mon build s'occupe ensuite de dé-commenter le code : 

```javascript gulpfile.js (task replace) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/gulpfile.js#L98
gulp.task("replace", function(){
  gulp.src(['./public/bundle_phone.js', './public/bundle_moderator.js'])
  .pipe(replace('/* SERVICE_WORKER_REPLACE', ''))
  .pipe(replace('SERVICE_WORKER_REPLACE */', ''))
  .pipe(gulp.dest('./public/'));
});
```

De cette manière le code final ressemble à ça : 

```javascript bundle_phone.js

    
    if ('serviceWorker' in navigator) {        
        navigator.serviceWorker.register('./service-worker-phone.js', {scope : location.pathname}).then(function(reg) {
            console.log('Service Worker Register for scope : %s',reg.scope);
        });
    }
    
```


**2. Incrémentation automatique**

Étant donné que les ressources qui vont évoluées sont à mon cache `let cacheFileName = "legonnaryCache-v{timestamp}";` 

le timestamp est remplacé à la génération de la façon suivante :

```javascript gulpfile.js (task replace_timestamp) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/gulpfile.js#L105
gulp.task("replace_timestamp", function(){
  gulp.src(['./public/service-worker-phone.js', './public/service-worker-moderator.js'])
  .pipe(replace('{timestamp}', Date.now()))
  .pipe(gulp.dest('./public/'));
})
```

De cette manière, le numéro de mon cache sera toujours en lien avec la dernière version de mon code.

**3. Pour aller plus loin**

Si je devais revoir mon service worker, je tacherais d'utiliser des outils tels que sw-precache et je séparerais encore plus mes caches pour dissocier la partie js / css / HTML de mes ressources graphiques / font. 

### Responsive

La partie responsive a été géré très simplement grâce à la librairie [GetMdl.io](https://getmdl.io/) (Get Material Design Lite) qui me permet sans trop de complexité d'avoir une application avec un look Material Design.

Un des avantages que propose cette librairie est d'utiliser une variante graphique jouant sur les couleurs primaires du material design : [Customize Getmdl](https://getmdl.io/customize/index.html). De cette manière, j'ai pu proposer sans surcouche un style graphique différent pour chacune des applications créés. De cette manière, j'avais un style graphique reconnaissable pour l'application "joueur" ou pour l'application "modérateur".

N'oublions quand même pas l'inclusion dans le header de la balise meta permettant de gérer le zoom navigateur pour les mobiles 

```html index.html (header) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/index.html#L22
 <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
```

## Sécurisation de l'app 

Aux jours d'aujourd'hui, nous ne pouvons passer à côté d'applications sécurisées. Je voulais donc mettre en place les choses suivantes : 

* Les joueurs doivent être identifiés pour jouer et je voulais proposer un social login afin d'éviter d'avoir à saisir un nouveau login / mdp
* Le site est servi en https
* L'accès aux données et dessins produits ne sont pas accessibles par tout le monde

Grâce aux dernières APIs sorties côté firebase, j'ai pu résoudre tous ces problèmes le plus simplement du monde ! 

### Authentification

Dans mes précédents projets j'utilisais [Hello.js](https://adodson.com/hello.js/) cette librairie est très facile à installer et très pratique. Je vous conseille d'y jeter un coup d’œil !  Mais pour ce projet, j'ai voulu essayer quelque chose de différent pour comparer et voir les avantages inconvénients de chaque solution. Je suis donc parti sur [Firebase Authentication](https://firebase.google.com/docs/auth/). 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/firebase-authentication-logo1.png">
</div>

Cette solution permet d'utiliser un mécanisme d'authentification des utilisateurs qui sera reconnu dans l'arbre Firebase. De plus, en se basant sur cette solution, on peut facilement paramétrer des solutions de social login ce qui est d'autant plus appréciable !

Afin de faciliter la vie du développeur. Firebase a mis à disposition une librairie web qui permet d'intégrer ce mécanisme : [FirebaseUI-Web](https://github.com/firebase/FirebaseUI-Web). Il reste quand même à configurer les différentes plateformes pour récupérer les différentes clés d'API OAuth. 

```javascript firebaseAuth.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/firebase/firebaseAuth.js#L11
let uiConfig = {
    'callbacks': {
        // Called when the user has been successfully signed in.
        'signInSuccess': function(user, credential, redirectUrl) {
            // Do not redirect.
            return false;
        }
    },
    // Opens IDP Providers sign-in flow in a popup.
    'signInFlow': 'popup',
    'signInOptions': [
        {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        scopes: ['https://www.googleapis.com/auth/plus.login']
        },
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service URL.
    'tosUrl': 'https://gdgnantes.com'
};
this.ui = new firebaseui.auth.AuthUI(firebase.auth());
this.ui.start('#firebaseui-auth-container', uiConfig);
```

A travers ce code, je suis capable gérer une popup de login, je suis capable d'avoir un login social avec Google / Facebook / Github / Twitter et ça donne ça : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/legonnary_auth.png">
</div>

Un des avantages de la solution Firebase est que l'auto login est géré et qu'une API est proposée pour récupérer les informations sur le user

**Comparatif**

|Fonctionnalité|Hello.JS|FireBase|
|:------------:|:----------:|:--------:|
| Auto login      | ✗ | ✓ |
| Facile à intégrer dans firebase      | ✗ | ✓ |
| Peut être utilisé indépendant de firebase      | ✓ | ✗ |
| Interface graphique      | ✗ | ✓ |
| Single Email Login      | ✗ | ✓ |
| Google Login      | ✓ | ✓ |
| Facebook Login      | ✓ | ✓ |
| Twitter Login      | ✓ | ✓ |
| Github Login      | ✓ | ✓ |
| LinkedIn Login      | ✓ | ✗ |
| Live Login      | ✓ | ✗ |
| DropBox Login      | ✓ | ✗ |
| Instagram Login      | ✓ | ✗ |
| Yahoo Login      | ✓ | ✗ |
| Joinme Login      | ✓ | ✗ |
| Soundcloud Login      | ✓ | ✗ |
| Foursquare Login      | ✓ | ✗ |
| Flickr Login      | ✓ | ✗ |
| Vk Login      | ✗ | ✓ |

### Https


<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/firebase_hosting.png">
</div>

Firebase propose depuis quelque temps déjà la possibilité de hoster son application sur leurs serveurs. [Firebase Hosting](https://firebase.google.com/docs/hosting/)

Par défaut, le site est hébergé sur une URL type `https://[MON_APPLICATION].firebaseapp.com`. Cependant si on le souhaite, on peut utiliser son propre nom de domaine. Dans mon cas l'application est disponible à l'adresse suivante : https://legonnary.firebaseapp.com 

Pour déployer son site, rien de plus simple : 

1. Installez les [firebase-tools](https://firebase.google.com/docs/cli/) : `npm install -g firebase-tools`
2. Logguez vous : `firebase login`
3. Initialisez votre projet pour préparer le déploiement firebase : `firebase init`
4. Lancer la procédure de déploiement avec `firebase deploy`

Si vous voulez utiliser `firebase deploy` derrière une plateforme de CI, rien de plus simple : 

1. tapez dans une console : `firebase login:ci`. Vous allez ainsi récupérer un token
2. Utilisez ce token sur votre plateforme d'intégration pour déployer avec la commande suivante : `firebase deploy --token <token>`

### Structure de l'arbre firebase

J'ai fait reposer mon application sur la partie [Realtime Database](https://firebase.google.com/docs/database/) de Firebase car ça me permettait une réactivité et une interaction instantanée entre les différents acteurs. Pour ceux qui ne savent pas ce qu'est le Realtime Database, il s'agit d'un arbre JSON disponible sur firebase sur lequel on peut s'abonner. On peut écouter un ajout / modification / suppression de nœud ou d'attributs de l'arbre json.

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/firebase-database-logo.png">
</div>

Voici comment mon arbre est structuré : 

```json Realtime Database
{
    "admins":{
        "mon*email@me*com":true
    },
    "draw": {
        "XXXXX_FIREBASE_AUTO_UID_XXXX": {
            "instructions":{
                "0": {
                    "angle" : 0
                    "cellSize" : 23
                    "color":"#FFFFFF"
                    "left":"115"
                    "top":"138"
                    "size":{
                        "col":2
                        "row":2
                    }
                },
                "1": {}
            }
            "user": "pseudo user",
            "userId": "XXXX_UUID_OAUTH_USER_XXXX"
        },
        "YYYY_FIREBASE_AUTO_UID_YYYY":{}
    },
    "drawValidated": {
        "ZZZZ_FIREBASE_AUTO_UID_ZZZZ":{
            "instructions":{
                "0": {
                    "angle" : 0
                    "cellSize" : 23
                    "color":"#FFFFFF"
                    "left":"115"
                    "top":"138"
                    "size":{
                        "col":2
                        "row":2
                    }
                },
                "1": {}
            },
            "user": "pseudo user",
            "userdId": "XXXX_UUID_OAUTH_USER_XXXX"
        }
    },
    "drawSaved":{
        "XXXX_UUID_OAUTH_USER_XXXX":{
            "YYYY_FIREBASE_AUTO_UID_YYYY":{
                "accepted":false,
                "dataUrl":"data:image/png;base64,XXXXXXXXXX",
                "user": "pseudo user",
                "userdId": "XXXX_UUID_OAUTH_USER_XXXX"
            }
        }
    },
    "drawShow":{
        "ZZZZ_FIREBASE_AUTO_UID_ZZZZ":{
            "accepted" : true,
            "dataUrl":"data:image/png;base64,XXXXXXXXXX",
            "user": "pseudo user"
        }
    }

}
```

Si l'on regarde de plus près cet arbre, on peut voir 5 nœuds principaux : 

* **admins** :  Liste des emails des administrateurs
* **draw** : Liste des dessins soumis qui doivent être validés ou non par le modérateur
* **drawValidated** : Liste des dessins validés par le modérateur qui sont en attente d'affichage sur l'écran du compte à rebours
* **drawSaved** : Liste des dessins qui ont été soit validés, soit refusés par utilisateur
* **drawShow** : Liste des dessins qui ont été validés et qui sont disponibles pour l'affichage de restitution

```json admins
{
    "admins":{
        "mon*email@me*com":true
    }
}
```

Pour chaque admin, on indique son email. On est obligé par contre de remplacer les "." par des "*" car sinon firebase n'accepte pas le JSON et le considère comme invalide


```json draw
{
    "draw": {
        "XXXXX_FIREBASE_AUTO_UID_XXXX": {
            "instructions":{
                "0": {
                    "angle" : 0
                    "cellSize" : 23
                    "color":"#FFFFFF"
                    "left":"115"
                    "top":"138"
                    "size":{
                        "col":2
                        "row":2
                    }
                },
                "1": {}
            }
            "user": "pseudo user",
            "userId": "XXXX_UUID_OAUTH_USER_XXXX"
        },
        "YYYY_FIREBASE_AUTO_UID_YYYY":{}
    }
}
```

Pour chaque dessin, un uuid généré automatiquement par firebase est ajouté. S'ensuit ensuite un descriptif du dessin avec l'utilisateur à l'origine du dessin et les instructions à appliquer pour reproduire le dessin. 

À une instruction correspond 1 brique. Sa position dans le dessin est disponible ainsi que sa couleur et son angle. Pour un dessin, nous aurons autant d'instructions qu'il y a de briques.

```json drawValidated
{
    "drawValidated": {
        "ZZZZ_FIREBASE_AUTO_UID_ZZZZ":{
            "instructions":{
                "0": {
                    "angle" : 0
                    "cellSize" : 23
                    "color":"#FFFFFF"
                    "left":"115"
                    "top":"138"
                    "size":{
                        "col":2
                        "row":2
                    }
                },
                "1": {}
            },
            "user": "pseudo user",
            "userdId": "XXXX_UUID_OAUTH_USER_XXXX"
        }
    }
}
```

Dans cet arbre, on va retrouver toutes les informations nécessaires à l'affichage d'un dessin à savoir : qui a fait le dessin et quelles sont les instructions pour dessiner. De cette manière, l'écran de compte à rebours est capable d'afficher les bonnes informations et de reproduire le dessin.

```json drawSaved
{
    "drawSaved":{
        "XXXX_UUID_OAUTH_USER_XXXX":{
            "YYYY_FIREBASE_AUTO_UID_YYYY":{
                "accepted":false,
                "dataUrl":"data:image/png;base64,XXXXXXXXXX",
                "user": "pseudo user",
                "userdId": "XXXX_UUID_OAUTH_USER_XXXX"
            }
        }
    }
}
```

À partir du moment où l'on se trouve dans "drawSaved", on se situe au niveau user et on a la liste des dessins de l'utilisateur avec leur état. Contrairement aux nœuds précédents, nous n'avons pas la liste des instructions mais directement l'image finale en base64. De cette manière, on évite la phase de construction du dessin.

```json drawShow
{
    "drawShow":{
        "ZZZZ_FIREBASE_AUTO_UID_ZZZZ":{
            "accepted" : true,
            "dataUrl":"data:image/png;base64,XXXXXXXXXX",
            "user": "pseudo user"
        }
    }
}
```

Même chose dans cette partie de l'arbre, on ne stocke que le nom du user et son dessin, on s'évite ainsi la reconstruction du dessin. De plus sous cette partie de l'arbre, on a supprimé l'id du user car cette information n'est plus pertinente.


### Gestion de l'admin

Une fois cet arbre définit, j'ai voulu appliquer un système de restrictions sur la publication / lecture dans l'arbre. En effet, je ne voulais que n'importe qui puisse écrire ou lire n'importe quelles données. 

Heureusement Firebase propose justement un mécanisme de protection de son arbre en fonction de l'utilisateur connecté. On peut soit protégé de façon fine un nœud ou alors poser des restrictions de façon plus large. Voici le guide complet pour apprendre à protéger ses données dans une base de données firebase : [Security & Rules](https://firebase.google.com/docs/database/security/) 

Voici les restrictions mises en place : 

```json database.rules.json https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/database.rules.json
{
  "rules":{
    "admins": {
      ".read": false,
      ".write": false
    },
    "draw": {
      ".read": "auth != null && root.child('admins').child(auth.token.email.replace('.', '*')).exists() && auth.token.email_verified == true",
      ".write": "auth != null"
    },
    "drawValidated":{
      ".read": "auth != null && root.child('admins').child(auth.token.email.replace('.', '*')).exists() && auth.token.email_verified == true",
      ".write": "auth != null && root.child('admins').child(auth.token.email.replace('.', '*')).exists() && auth.token.email_verified == true"
    },
    "drawShow":{
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.token.email.replace('.', '*')).exists() && auth.token.email_verified == true"
    },
    "drawSaved":{
      "$userId":{
        ".read": "auth != null && $userId === auth.uid",
        ".write": "auth != null && root.child('admins').child(auth.token.email.replace('.', '*')).exists() && auth.token.email_verified == true"  
      }
    }
  }
}
```

Revenons sur chacune de ces règles pour les détailler : 

**Partie Admin :**

```json database.rules.json (admin) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/database.rules.json#L3
{
  "rules":{
    "admins": {
      ".read": false,
      ".write": false
    }
  }
}
```

Cette partie de l'arbre n'est ni disponible en lecture, ni disponible en écriture car je ne veux pas que quiconque puisse avoir accès aux emails concernés.


**Partie dessins soumis :**

```json database.rules.json (admin) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/database.rules.json#L7
{
  "rules":{
    "draw": {
      ".read": "auth != null && root.child('admins').child(auth.token.email.replace('.', '*')).exists() && auth.token.email_verified == true",
      ".write": "auth != null"
    }
  }
}
```

L'écriture sur ce nœud ne peut se faire que pour un utilisateur authentifié `auth != null`.

La lecture n'est disponible que par un admin : 
* `auth != null` : L'admin est authentifié
* `root.child('admins').child(auth.token.email.replace('.', '*')).exists()` : l'utilisateur courant a son mail qui fait partie des nœuds disponibles dans la partie "admins". Au passage, on pense bien à remplacer les "*" par des "." lors de la vérification
* `auth.token.email_verified == true` : l'email est vérifié par le tiers de confiance OAuth

**Partie Dessin validé (écran de comptes à rebours) : **

```json database.rules.json (admin) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/database.rules.json#L11
{
  "rules":{
    "drawValidated":{
      ".read": "auth != null && root.child('admins').child(auth.token.email.replace('.', '*')).exists() && auth.token.email_verified == true",
      ".write": "auth != null && root.child('admins').child(auth.token.email.replace('.', '*')).exists() && auth.token.email_verified == true"
    }
  }
}
```

Dans cette partie, seul l'admin peut lire ou écrire.

**Partie dessins validés :**

```json database.rules.json (admin) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/database.rules.json#L15
{
  "rules":{
    "drawShow":{
      ".read": true,
      ".write": "auth != null && root.child('admins').child(auth.token.email.replace('.', '*')).exists() && auth.token.email_verified == true"
    }
  }
}
```

Seul l'admin peut écrire dans cette partie et par contre la lecture est disponible à n'importe qui. De cette manière seul le modérateur peut déplacer un dessin dans cette partie de l'arbre et une fois qu'un dessin est validé (et donc considéré comme "safe") il n'y a aucune restriction qui mérite de ne pas laisser l'accès à ces dessins au monde entier.

**Partie dessins archivés (validés ou refusés) :**

```json database.rules.json (admin) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/database.rules.json#L19
{
  "rules":{
    "drawSaved":{
      "$userId":{
        ".read": "auth != null && $userId === auth.uid",
        ".write": "auth != null && root.child('admins').child(auth.token.email.replace('.', '*')).exists() && auth.token.email_verified == true"  
      }
    }
  }
}
```

L'écriture ne peut être faite que par un admin. Par contre la lecture n'est disponible que pour le user qui a créé le dessin. 

Le `$userId` permet de cibler les sous-parties de l'arbre `drawSaved` pour un utilisateur donné. Et donc la condition `$userId === auth.uid` me permet de m'assurer que seul l’utilisateur courant puisse avoir accès à ses dessins ! 

N'importe qui ne pourra pas consulter les dessins refusés des autres et pour autant l'utilisateur pourra avoir un retour sur ses soumissions de dessins. 

## Chalenges graphiques

Pour ce projet, j'ai dû faire face à 2 chalenges techniques : 

1. Reproduire une grille Lego ©
2. Afficher les dessins à l'écran principal avec une animation simulant un flash suivit d'une image type polaroid.

### Grille Lego ©

Finalement, faire la grille Lego © a été quelque chose de plutôt simple, Grâce à la libraire [FrabricJS](http://fabricjs.com/) j'ai pu reproduire un pion vu de haut. Une brique est donc l’addition d'un carré avec une ombre sur lequel, j'ai posé 2 cercles avec un jeu de couleurs et d'ombres. Enfin, je rajoute le mot "GDG" à la Place de Lego et le tour est joué.

**Étape 1 : le carré avec l'ombre**

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/brique_1.png">
</div> 

```javascript
this.rectBasic = new fabric.Rect({
    width: cellSize * size.col,
    height: cellSize * size.row,
    fill: color,
    originX: 'center',
    originY: 'center',
    centeredRotation: true,
    hasControls: false,
    shadow : "5px 5px 10px rgba(0,0,0,0.2)"                        
});
```

**Étape 2 : le premier cercle (cercle extérieur)**


<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/brique_2.png">
</div> 

```javascript
new fabric.Circle({
    radius: (cellSize / 2) - 4,
    fill: ColorLuminance(color, 0.1),
    originX: 'center',
    originY: 'center'
});
```

**Étape 3 : le second cercle avec une ombre**


<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/brique_3.png">
</div> 

```javascript
new fabric.Circle({
    radius: (cellSize / 2) - 5,
    fill: ColorLuminance(color, -0.1),
    originX: 'center',
    originY: 'center',
    shadow : "0px 2px 10px rgba(0,0,0,0.2)"
});
```

**Étape 4 : L'ajout du texte GDG**


<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/brique_4.png">
</div> 

```javascript
new fabric.Text('GDG', {
    fontSize: cellSize / 5,
    fill: ColorLuminance(color, -0.15),
    originX: 'center',
    originY: 'center',
    stroke: ColorLuminance(color, -0.20),
    strokeWidth: 1
});
```

Même si cela n'est pas parfait, à une plus petite échelle, ça permet d'avoir un effet plutôt bon ! 

Le code correspondant est au niveau des fichiers [peg.js](https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/lego_shape/peg.js) et [circle.js](https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/lego_shape/circle.js)

### Animations CSS

L'animation css est décomposée en plusieurs animations : 

1. Un flash
2. L'affichage de mon image sous forme de négatif
3. Le déplacement de mon image dans un coin de mon écran

**Le Flash**

<div id="parent-flash">  
  <div id="flash-effect" class="flash"></div>
</div>

Pour réussir cette partie, c'est très simple, il suffit de jouer avec une div blanche avec un dégradé vers de la transparence et il suffit d'afficher cette div pour la faire disparaitre très rapidement.

```css
#flash-effect{
    position:absolute;    
    width:500px;
    height:500px;
    background:radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(0,0,0,0) 80%);
    opacity:0;
}

#flash-effect.flash{
    animation: flash;
    animation-duration: 1s;    
}

@keyframes flash {
    from {opacity:1;}
    to {opacity: 0}
}
```

Ainsi le fait d'appliquer la classe `flash` créera automatiquement cet effet de flash photo.

**L'effet Polaroid**

<div id="parent-negatif">
  <div class="img-ori-parent big" data-author="jefBinomed">
    <img class="img-ori" src="/assets/2016-12-legonnary/gdg_logo_legonnary.png" >
  </div>
</div>

Pour faire cet effet avec un nombre minimum d'éléments, j'ai simplement joué avec les before / after et sur les attributs HTML exploitables en css.

Ainsi voici le code HTML : 

```html 
<div class="img-ori-parent" data-author="jefBinomed">
    <img class="img-ori" src="/assets/2016-12-legonnary/gdg_logo_legonnary.png" >
</div>
```

et voici le code css correspondant : 

```css
.img-ori-parent{
    position:absolute;
    width:calc(200px + 40px);
    height: calc(200px + 100px);
    background:white;
    z-index: 10;
    box-shadow       : 0px 0px 5px 0px rgba(50, 50, 50, 0.75);
}

.img-ori{
    
    position:absolute;
    top:20px;
    left:20px;
    width:200px;
    height:200px;
    background-size: contain;
    background-repeat: no-repeat;
    box-shadow       : 0px 0px 5px 0px rgba(0, 0, 0, 1.5) inset;
}

.img-ori-parent::after{
    content:attr(data-author);
    position: absolute;
    width:100%;
    text-align:center;
    bottom: 15pt;
    left: 0;
    font-size:20pt;
    line-height:20pt;
    font-family:"Roboto","Helvetica","Arial",sans-serif;
}
```

De cette manière, on peut voir qu'avec simplement un jeu d'ombres, de after, before, on peut donner un effet Polaroid à une image ! 

**L'animation de rétrécissement**

<div id="parent-negatif">
  <div class="img-ori-parent big anim" data-author="jefBinomed">
    <img class="img-ori" src="/assets/2016-12-legonnary/gdg_logo_legonnary.png" >
  </div>
</div>

Cette animation est assurée par la propriété transition. On écoute ainsi toutes les évolutions de tailles, positions, ... et on déclenche une transition de façon à rendre ça plus fluide.

La raison pour laquelle je ne passe pas par la propriété animation de css est que la position d'arrivée sera complètement aléatoire !  En effet, une fois l'image apparue, on va la positionner dans l'écran de façon aléatoire. Une fois à gauche et une fois à droite. Sa position horizontale et verticale sera certes bornée, mais le résultat sera issu d'un `Math.random()`. Donc en utilisant la propriété `transition` plutôt que `animation`, je peux m'assurer une animation fluide et prenant en compte tous les cas. 

Dans mon animation, j'ai géré 2 états : 

1. Le parent a la classe `.big` : Dans cet état, l'image est grande et positionnée au centre de l'écran
2. Le parent n'a plus la classe `.big` : Dans cet état, l'image va prendre une taille plus réduite. Les top & left seront fixés directement par le Javascript

Voici le code css à faire pour gérer simplement l'animation

```scss screen.scss https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/sass/screen.scss#L53
$size-photo: 200px;
$size-photo-big: 500px;

.img-ori-parent.big{
    width:$size-photo-big+90px;
    height: $size-photo-big+200px;
    background:white;
    box-shadow       : 0px 0px 5px 0px rgba(50, 50, 50, 0.75);    

    .img-ori{    
        top:45px;
        left:45px;
        width:$size-photo-big;
        height:$size-photo-big;    
    }
}
.img-ori-parent.big::after{
    bottom: 15pt;
    left: 0;
    font-size:50pt;
    line-height:50pt;
    transition-property: all;
    transition-duration: 2s;
    transition-timing-fonction: ease;
}


.img-ori-parent{
    position:absolute;
    width:$size-photo+40px;
    height: $size-photo+100px;
    background:white;
    z-index: 10;
    box-shadow       : 0px 0px 5px 0px rgba(50, 50, 50, 0.75);
    transition-property: all;
    transition-duration: 2s;
    transition-timing-fonction: ease;
}

.img-ori{
    
    position:absolute;
    top:20px;
    left:20px;

    width:$size-photo;
    height:$size-photo;
    background-size: contain;
    background-repeat: no-repeat;
    box-shadow       : 0px 0px 5px 0px rgba(0, 0, 0, 1.5) inset;
    transition-property: all;
    transition-duration: 2s;
    transition-timing-fonction: ease;
}

.img-ori-parent::after{
    content:attr(data-author);
    position: absolute;
    width:100%;
    text-align:center;
    bottom: 15pt;
    left: 0;
    font-size:20pt;
    line-height:20pt;
    font-family:"Roboto","Helvetica","Arial",sans-serif;
    transition-property: all;
    transition-duration: 2s;
    transition-timing-fonction: linear;
}
```


Voici ensuite comment avec le Javascript j'anime le tout : 

1. Je déclenche le "flash"
2. Après un léger timeout (le temps du flash), je créé une nouvelle DIV avec la classe `.big`
3. Après un deuxième timeout (le temps de laisser le dessin à l'écran pour les participants), je supprime la classe `.big` et je donne des valeurs aléatoires au `top` & `left` de la div parente

```javascript app_screen.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/app_screen.js#L35
function generateSnapshot(user, dataUrl) {
    // We start our flash effect
    let rectCanvas = document.querySelector('.canvas-container').getBoundingClientRect();
    let flashDiv = document.getElementById('flash-effect')
    flashDiv.style.top = (rectCanvas.top - 250) + "px";
    flashDiv.style.left = (rectCanvas.left - 250) + "px";
    flashDiv.classList.add('flash');
    //When the animation is done (1s of opacity .7 -> 0 => ~500ms to wait)
    setTimeout(() => {
        // We create the final image
        // We create a div that we will be animate
        flashDiv.classList.remove('flash');
        let imgParent = document.createElement('div');
        let img = document.createElement('img');
        img.src = dataUrl;
        img.classList.add('img-ori');
        imgParent.classList.add('img-ori-parent');
        imgParent.setAttribute('data-author', user);
        imgParent.appendChild(img);
        imgParent.classList.add('big');
        // Initial Position
        imgParent.style.top = (rectCanvas.top - 45) + "px";
        imgParent.style.left = (rectCanvas.left - 45) + "px";

        document.body.appendChild(imgParent);

        // we wait a litle to set new position to the new div. The css animation will do the rest of the job
        setTimeout(function () {

            let horizontalDist = Math.floor(Math.random() * 300) + 1;
            let heightScreen = document.body.getBoundingClientRect().height;
            let verticalDist = Math.floor(Math.random() * (heightScreen - 100 - 300)) + 1;
            let angleChoice = Math.floor(Math.random() * 3) + 1;

            imgParent.classList.remove('big');
            imgParent.style.top = `calc(100px + ${verticalDist}px)`;
            imgParent.style.left = `${horizontalDist}px`;
            if (!lastLeft) { // True if the last photo was placed at the left of the countDown
                imgParent.style.left = `calc(100vw - ${horizontalDist}px - 300px)`;           // The timeout date          
            }
            lastLeft = !lastLeft; // True if the last photo was placed at the left of the countDown
            let angle = angleChoice === 1 ? -9 : angleChoice === 2 ? 14 : 0; // The timeout date
            imgParent.style.transform = `rotate(${angle}deg)`;
            getNextDraw();
        }, 100);

        // When the element is create, we clean the board
        legoCanvas.resetBoard();
        document.getElementById('proposition-text').innerHTML = "En attente de proposition";

    }, 500);
}

```

**Le résultat final**

<div id="parent-final">
  <img class="img-ori empty" src="/assets/2016-12-legonnary/empty_legonnary.png">
  <img class="img-ori temp" src="/assets/2016-12-legonnary/gdg_logo_legonnary.png" >
  <div class="img-ori-parent big final-anim" data-author="jefBinomed">
    <img class="img-ori" src="/assets/2016-12-legonnary/gdg_logo_legonnary.png" >
  </div>
  <div class="flash-final flash"></div>
</div>

## Tout ce dont je n'ai pas parlé

Il reste encore beaucoup de points non abordés : 

* La gestion du compte à rebours
* La gestion de l'audio & vidéo

En conclusion, j'ai encore appris pas mal de choses avec ce projet et si je devais revoir certaines parties, je pense que je ferais les choix suivants : 

*  J'essayerais d'utiliser une autre librairie JS de canvas, D3 ? Car même si FabricJS est facile d'accès et fait bien le job. J'ai constaté quelques soucis avec le touch et quelques problèmes de performances liés à la librairie sur certains téléphones.
*  Je tâcherais d'alléger un peu plus mon arbre firebase, notamment sur le stockage des images. Aujourd'hui mes images sont stockées directement dans l'arbre sous forme de base 64 ce qui ralentit énormément l'affichage de l'écran de restitution. J'essayerais de stocker ça avec le storage de firebase plutôt qu'en tant que nœud firebase...

Si vous êtes curieux, je vous invite à consulter le code source :  [Legonnary-Github](https://github.com/GDG-Nantes/CountDownDevFest2016)

Le résultat final : 
 * [App de base](https://legonnary.firebaseapp.com/)
 * [App Modérateur](https://legonnary.firebaseapp.com/moderator.html) : Nécessite d'être admin
 * [App Comptes à rebours](https://legonnary.firebaseapp.com/screen.html) : Nécessite d'être admin
 * [App Restit](https://legonnary.firebaseapp.com/summary.html)



<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="text/javascript" src="/assets/2016-12-legonnary/legonnary.js"></script>
