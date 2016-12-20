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

```bash Legonnary/
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

Pour le reste, j'ai utilisé sass /  browsersync afin de me garentir un workflow de dev complet. Voici le lien vers mon [Gulp File](https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/gulpfile.js)

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

**/!\ Le fait de préciser le manifest dans l'index.html ne suffit pas à transformer votre application en application "installable" ! En effet, une application installée sur votre home doit être capable de démarer même sans internet !  Donc une PWA avec un manifest ne sera réellement installable que si vous avez un service worker installé. **

Pour plus d'infos, vous pouvez consulter cette doc : [Web App Manifest](https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/)

### Offline

Passons maintenant à la mise en place du service worker.

Pour ceux qui ne savent pas ce qu'est un service worker, je vous invite à consulter ce site : [Is ServiceWorker Ready ?](https://jakearchibald.github.io/isserviceworkerready/). En plus de vous donner l'état d'avancement de l'implémentation de la spec sur les différents navigateurs, il vous donnera accès à plein de ressources, documentation nécessaire à la compréhension du service worker.

Comme je le disais au début, j'ai préféré coder moi même mon service worker car je souhaitais monter en compétences et comprendre précisement ce que je codais. Je n'ai donc pas utilisé d'outils pour m'aider à réaliser ce dernier et si vous êtes intéressés par de la génération de services workers, je vous invite à regarder ceci : [sw-precache](https://github.com/GoogleChrome/sw-precache).

Concernant mon application, j'avais envie d'éviter de surcharger mon serveur en bande passante et donc je me suis appuyé sur des CDN pour délivrer mes librairies javascript. Une des premières choses que j'ai donc mis en place c'est la spération entre mon cache de CDN et le cache des mes ressources que je considérais comme dynamiques (css / js / ...) 

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

Ce fichier est issue des tutoriels de Google, donc on va y retrouver les éléments classiques : 

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

La particularité de mon service worker réside au niveau de la mise en cache du CDN. J'attends en effet de voir si la ressource demandée fait partie de ma liste de ressources à mettre à cache et si c'est le cas, je délivre soit le fichier 'caché', soit je le récupère sur le réseau et ensuite je le met en cache.

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

Comme je n'ai pas utilisé d'outils de build pour gérer pour moi le service worker, j'ai du mettre en place quelques *"astuces"* pour garder un workflow de dev facile. En effet, en développement mon service worker n'est pas actif et la mise à jour du numéro de cache est gérée automatiquement par mon build 

**1. Service désactivé pendant le dev**

J'aurais très bien pu utiliser l'option des devtools qui me permet de mettre à jour mon cache à chaque refresh mais cela nécessite que les devtools soient toujours ouverts, ce qui n'était pas toujours mon cas. Pour palier à ça, j'ai simplement commenté l'activation de mon service dans mon code et mon build va simplement supprimer ces commentaires.

```javascript app_phone.js https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/scripts/app_phone.js#L185
/* SERVICE_WORKER_REPLACE
if ('serviceWorker' in navigator) {        
    navigator.serviceWorker.register('./service-worker-phone.js', {scope : location.pathname}).then(function(reg) {
        console.log('Service Worker Register for scope : %s',reg.scope);
    });
}
SERVICE_WORKER_REPLACE */
```

Mon build s'occupe ensuite de décommenter le code : 

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

Etant donné que les ressources qui vont évoluées sont à mon cache `let cacheFileName = "legonnaryCache-v{timestamp}";` 

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

Si je devais revoir mon service worker, je tacherais d'utiliser des outils tels que sw-precache et je séparerais encore plus mes caches pour dissocier la partie js / css / html de mes ressources graphiques / font. 

### Responsive

La partie responsive a été géré très simplement grâce à la librairie [GetMdl.io](https://getmdl.io/) (Get Material Design Lite) qui me permet sans trop de complexité d'avoir une application avec un look Material Design.

Un des avantages que propose cette librairie est d'utiliser une variante graphique jouant sur les couleurs primaire du material design : [Customize Getmdl](https://getmdl.io/customize/index.html). De cette manière, j'ai pu proposé sans sourcouhe un style graphique différent pour chacune des applications créé. De cette manière, j'avais un style graphique reconnaissable pour l'application joueur ou pour l'application modérateur.

N'oublions quand même pas l'inclusion dans le header de la balise meta permettant de gérer le zoom navigateur pour les mobiles 

```html index.html (header) https://github.com/GDG-Nantes/CountDownDevFest2016/blob/master/src/index.html#L22
 <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
```

## Sécurisation de l'app 

Aux jours d'aujourd'hui, nous ne pouvons passer à côté d'applications sécurisées. Je voulais donc mettre en place les choses suivantes : 

* Les joueurs doivent être indentifiés pour jouer et je voulais proposer un social login afin d'éviter d'avoir à saisir un nouveau login / mdp
* Le site est servi en https
* L'accès aux données et dessins produits n'est pas accessible par tout le monde

Grâce aux dernières apis sorties côté firebase, j'ai pu résoudre tous ces problèmes le plus simplement du monde ! 

### Authentification

Dans mes précédents projets j'utilisais [Hello.js](https://adodson.com/hello.js/) cette librairie est très facile à installer et très pratique. Je vous conseil d'y jetter un coup d'oeil !  Mais pour ce projet, j'ai voulu essayer quelque chose de différent pour comparer et voir les avantages inconvénients de chaque solution. Je suis donc parti sur [Firebase Authentication](https://firebase.google.com/docs/auth/). 

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
    // Terms of service url.
    'tosUrl': 'https://gdgnantes.com'
};
this.ui = new firebaseui.auth.AuthUI(firebase.auth());
this.ui.start('#firebaseui-auth-container', uiConfig);
```

A travers ce code, je suis capable gérer une popup de login, je suis capable d'avoir un login social avec Google / Facebook / Github / Twitter et ça donne ça : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-12-legonnary/legonnary_auth.png">
</div>

Un des avantages de la solution Firebase est que l'auto login est géré et qu'une api est proposée pour récupérer les informations sur le user

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
    <img src="/assets/2016-12-legonnary/firebase-hosting.png">
</div>

Firebase propose depuis quelques temps déjà la possibilité de hoster son application sur leurs serveurs. [Firebase Hosting](https://firebase.google.com/docs/hosting/)

Par défaut, le site est hébergé sur une url type `https://[MON_APPLICATION].firebaseapp.com`. Cependant si on le souhaite, on peut utiliser son propre nom de domaine. Dans mon cas l'application est disponible à l'adresse suivante : https://legonnary.firebaseapp.com 

Pour déployer son site, rien de plus simple : 

1. Installez les [firebase-tools](https://firebase.google.com/docs/cli/) : `npm install -g firebase-tools`
2. Logguez vous : `firebase login`
3. Initialisez votre projet pour préparer le déployement firebase : `firebase init`
4. Lancer la procédure de déployement avec `firebase deploy`

Si vous voulez utiliser `firebase deploy` derrière une plateforme de CI, rien de plus simple : 

1. tapez dans une console : `firebase login:ci`. Vous allez ainsi récupérer un token
2. Utilisez ce token sur votre plateforme d'intégration pour déployer avec la commande suivante : `firebase deploy --token <token>`

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