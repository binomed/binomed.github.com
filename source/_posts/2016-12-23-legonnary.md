title: >-
  J'ai fait un jeux multijoueur en temps réel server-less et offline (Partie 1 -
  PWA)
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
date: 2016-12-23 17:04:43
---


![](/assets/2016-12-legonnary/devfest_photo.jpg)


## [TL;DR;] 

Il s'agit d'une série de 3 articles sur un jeu mis en place pour le DevFest 2016. Les grandes parties sont : 
* [Origin Story](#Origin_story) : Pourquoi / comment / les enjeux ?
* [Architecture](#Architecture) : Quelle architecture j'ai choisi.
* [Workflow de dev choisi](#Workflow_de_dev_choisi) : Comment j'ai structuré mon code et mon workflow de dev.
* [Progressive Web App](#Progressive_Web_App) : Comment j'ai transformé l'application en Progressive Web App.
* [Sécurisation de l’app](/2016/12/23/2016-12-23-legonnary-2/) : Utilisation détaillée de firebase pour le cas du jeu.
* [Challenges graphiques](/2016/12/23/2016-12-23-legonnary-3/) : Problèmes et solutions graphiques rencontrées.

## Tout ça pour un compte à rebours !

Dans le cadre du [DevFest Nantes 2016](https://devfestnantes.gdgnantes.com) j'ai voulu comme chaque année travailler un compte à rebours personnalisé.

### Origin Story

Ayant eu la chance d'aller au [Google I/O](https://events.google.com/io), j'ai beaucoup apprécié les animations qu'il y a eu qui permettaient aux participants de jouer avec une application codée spécialement pour l'occasion : [Paper Planes](https://paperplanes.world/).

N'ayant pas les compétences graphiques WebGL pour faire un jeu aussi beau. J'ai donc cherché un autre concept ! 

### Thème : les Lego ©

![](/assets/2016-12-legonnary/theme_lego.jpg)

En 2016, le thème graphique était l'univers Lego ©, je me suis donc lancé dans un gros brainstorming avec ma femme pour trouver une idée qui me permettrait de faire un jeu multijoueur basé sur les Lego ©. 

Ma première idée fut de laisser les participants construire en 3D des Lego © et d'afficher sur l'écran de restitution les étapes suivies par les participants ! L'idée était intéressante mais j'ai dû me rendre à l'évidence : je n'ai ni le temps, ni les compétences pour mettre en place un tel système... Il a donc fallu que je continue à chercher. Finalement c'est ma femme qui a trouvé l'idée qui était à la fois cool et réalisable : 

J'allais faire une application Pixel art Lego © dont le résultat final se verrait à l'écran de compte à rebours ! Legonnary était né !

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/gdg_logo_legonnary.png">
</div>


### Le concept

Le concept est simple : 
1. Un participant va se loguer pour soumettre des dessins. 
2. Un modérateur reçoit le dessin du participant (car oui, il vaut mieux modérer ;) ). Il va décider de valider ou de refuser le dessin.
3. Si le dessin est accepté, il apparaîtra sur l'écran de compte à rebours !
4. Si non, seul l'utilisateur à l'origine du dessin pourra le revoiravec son état : accepté / refusé. 
5. Tous les dessins validés doivent être accessible sur un écran de restitution indépendant pour accéder simplement aux dessins créés ET validés.

## Enjeux 

Avant de rentrer dans le détail de l'implémentation, je me suis fixé quelques contraintes : 

- Je veux faire une Progressive Web App ([PWA](https://developers.google.com/web/progressive-web-apps/)) afin d'être : mobile first / offline / installable.
- Je veux un jeu temps réel mais où je n'ai pas à m'occuper de la partie serveur.
- Je veux une application sécurisée, que ce soit pour les données mais aussi par son accès. Globalement, je veux que mes utilisateurs soient logués.
- Afin d'éviter aux participants de saisir une URL, je veux que l'application soit détectable en physical web (https).
- Nous sommes en 2016, l'application doit être codée en ES6.
- Il faut prévoir plusieurs applications pour coller avec chacun des rôles : Joueur / Modérateur / Écran de compte à rebours /  Écran de restitution.

## Architecture

Pour faire marcher tout ça ensemble, j'ai choisi l'architecture suivante : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/Legonnary_Archi.png">
</div>

### Firebase

Firebase me permet en effet de répondre à beaucoup de besoins : 
* En sécurisant mon arbre de données firebase, je vais sécuriser mes données. De plus grâce à [Firebase Authentication](https://firebase.google.com/docs/auth/) je peux faire de l'authentification sécurisée sans me soucier de l'installation / configuration des mécanismes OAuth !
* Je vais pouvoir "hoster" mon application en https.
* Mes données vont être synchronisées en temps réel et chacune des applications va pouvoir communiquer de façon instantanée sans que j'aie quoi que ce soit à coder au niveau serveur.
* Enfin pour finir, le jeu fonctionnera aussi offline grace à Firebase car je sais qu'il est du ressort de la librairie de gérer les push d’évènements.

### Progresse Web App

La partie Progressive Web App a été codé de façon manuelle car je voulais comprendre les concepts et les enjeux d'une PWA. 

### Fabric JS

Ayant déjà eu l'occasion de travailler plusieurs fois avec des canvas, je sais que la complexité de code peut vite augmenter. J'ai aussi identifié un certain nombre de points qui vont surement me poser problème. Par exemple, le fait que mes pièces Lego © doivent avoir un effet aimanté vis-à-vis d'une grille. 

Face à tous possibles problèmes, j'ai préféré me reposer sur une libraire plutôt que de tout coder moi-même. J'ai donc choisi [FabricJS](http://fabricjs.com/) comme librairie car elle propose une abstraction suffisante et des fonctionnalités qui collent avec mon besoin.

### Déploiement automatique avec CodeShip

Enfin pour pousser mon code en production, je me suis reposé sur [Codeship](https://codeship.com/). 

### Workflow de validation des dessins

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/Legonnary_Validation.png">
</div>

Afin de faire communiquer correctement chacun des écrans / applications, j'ai défini une notion d'états pour les dessins. Un dessin va pouvoir se retrouver avec plusieurs états en même temps pour permettre un affichage conditionnel. 

* **Submited** : Un dessin est dans cet état juste après la validation d'un utilisateur.
* **Accepted** : Un dessin est dans cet état si le modérateur a validé le dessin.
* **Rejected** : Un dessin est dans cet état si le modérateur a rejeté le dessin.

États additionnels :
* **Validated** : Un dessin est dans cet état s'il a été validé par le modérateur et qu'il attend d'être traité par l'écran de compte à rebours
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

Comme je le disais plus haut, j'ai voulu coder mon application en ES6. Alors, la première question que l'on m'a posé, c'est pourquoi du vanillaJS plutôt qu'un Angular ou autre chose ? La réponse est simple : KISS ! Le jeu mis en place ne nécessitait pas de grande complexité de code et donc, j'ai jugé un peu "overkill" de charger une librairie type Angular. 

ES6 m'a permis de structurer tout aussi efficacement mon code, en créant des classes, séparant fortement mes concepts, et déléguant aussi bien les responsabilités dans chaque partie de mon code !

### Task runner

Côté build, je n'avais pas forcément envie de partir sur webpack car soyons franc, je n'avais pas l'envie d'apprendre un nouvel outil de build. J'avais déjà bien assez à apprendre avec ce jeu. Je ne voulais pas me rajouter un nouveau chalenge. Bref ! J'ai choisi Gulp & Browserify. Gulp, par ce que je l'aime bien et Browserify par ce je voulais coder mon application en utilisant les imports de modules Javascript.

La seule complexité que j'ai eue avec ce build a été de trouver la bonne configuration pour faire marcher ES6, Babel & Browserify. Pour résoudre ce problème, je me suis appuyé sur le plugin [babelify](https://github.com/babel/babelify). Voici les tasks spécifiques à mon build qui gère cette partie.

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

**/!\\** Il est très important aussi d'ajouter à la racine de son projet un ficher `.babelrc` qui permet de spécifier quelle est la cible de compilation.

```javascript .babelrc https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/.babelrc
{
  "presets": ["es2015"]
}
```

Pour le reste, j'ai utilisé sass /  browsersync afin de me garantir un workflow de dev complet. Voici le lien vers mon [Gulp File](https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/gulpfile.js)

### Spécifiques du build

J'ai dû prévoir un certain nombre de choses assez spécifiques car : 

* J'ai plusieurs applications. J'ai donc plusieurs taches qui font des builds spécifiques pour chacune de mes applications.
* Toutes les applications n'ont pas de service worker.
* Je veux une invalidation brute de mon service worker à chaque nouvelle publication (j'en parlerais dans la partie PWA).


## Progressive Web App

Les Progressives Web App (PWA) est un terme pour regrouper un ensemble de bonnes pratiques pour les applications web. Voici en vrac les choses que l'on peut retrouver sur une PWA : 

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

Une des choses les plus simples à mettre en œuvre, c'est le manifest. Il s'agit d'un fichier JSON qui va donner un ensemble de meta-données sur votre application permettant par la suite d'installer votre application sur la "home" de votre téléphone (compatible Android & un peu IOS).

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
* `name`: Il s'agit du nom de l'application à son lancement.
* `short_name` : Il s'agit du nom qui sera présent sous l'icône dans la "home" de votre téléphone.
* `icons` : Ensemble de combinaisons possibles de résolutions de votre icône. Cela va dépendre du téléphone.
* `start_url` : URL de démarrage du site une fois qu'on a cliqué sur l'icône. On peut donc spécifier une URL spécifique dans le cas d'une PWA ! 
* `display` : Il s'agit d'un flag permettant de définir le mode de lancement de l'application. Voici les valeurs possibles : 
    - `standalone` : N'affiche pas la barre de navigation du navigateur.
    - `browser` : Affiche la barre de navigation.
* `orientation` : Définit l'orientation de l'application.
* `background_color` : Définit la couleur de fond que vous allez avoir pour le spash screen.
* `theme_color` : Définit une couleur de thème qui pourra être utilisée par le navigateur pour colorer la barre d’URL.

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

Concernant mon application, j'avais envie d'éviter de surcharger mon serveur en bande passante et donc je me suis appuyé sur des CDN pour délivrer mes librairies Javascript. Une des premières choses que j'ai donc mises en place, c'est la séparation entre mon cache de CDN et le cache de mes ressources que je considérais comme dynamiques (css / js / ...) 

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

La particularité de mon service worker réside au niveau de la mise en cache du CDN. J'attends en effet de voir si la ressource demandée fait partie de ma liste de ressources à mettre à cache et si c'est le cas, je délivre soit le fichier "caché", soit je le récupère sur le réseau et ensuite je le mets en cache.

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

Enfin, n'oublions pas d'inclure l'installation du service worker dans l'application.

```javascript app_phone.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/app_phone.js#L186
 if ('serviceWorker' in navigator) {        
    navigator.serviceWorker.register('./service-worker-phone.js', {scope : location.pathname}).then(function(reg) {
        console.log('Service Worker Register for scope : %s',reg.scope);
    });
}
```

#### Gestion du build 

Comme je n'ai pas utilisé d'outils de build pour gérer le service worker, j'ai dû mettre en place quelques *"astuces"* pour garder un workflow de dev facile. En effet, en développement mon service worker n'est pas actif et la mise à jour du numéro de cache est gérée automatiquement par mon build. 

**1. Service worker désactivé pendant le dev**

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
