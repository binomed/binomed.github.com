title: "Connectez votre rameur d'appartement avec Chrome"
tags:
  - Chrome
  - Arduino
  - Canvas
  - HTML5
  - Jeux
category:
  - Tech
toc: false
date: 2015-10-30 16:36:24
---


## Connectez votre rameur d'appartement avec Chrome

WiiFit, AppleHealt, Google Fit, tout ça c’est du passé ! Place à SkiffSimulator !!

<div class="center">
    <img src="/assets/2015-10-Skiff/rameur_Accueil.png" class="center">
</div>

Nous allons voir à travers cet article comment réaliser un rameur connecté et ainsi vous permettre de vous amuser en faisant du sport ! 

La version présentée dans cet article est une V1 dépendant d’un ordinateur. Il pourrait être très facile de faire évoluer l’application pour qu’elle soit autonome sur un équipement de type Raspberry par la suite.

## Principe

Grâce à l’[API serial](https://developer.chrome.com/apps/serial) de Google Chrome, nous allons relier directement notre rameur à notre navigateur pour créer un jeu qui nous permettra de jouer à un jeu 8bit. Voici globalement un schéma symbolisant le montage à effectuer : 

![](/assets/2015-10-Skiff/schema_skiff.png)

Nous allons faire communiquer 2 programmes entre eux : 
1. un sketch Arduino qui va mesurer la distance du joueur sur le rameur
2. une Application Chrome avec d’un côté : 
  a. la partie Chrome App qui va lire le port série
  b. la partie Jeu qui va lire les informations provenant de la Chrome App

Comme tout ceci n’est pas bien compliqué, j’ai décidé de tout coder from scratch afin de me faire la main sur les possibilités offertes par cet écosystème. Côté application web, nous avons un simple canvas afin de tirer parti de l’accélération matérielle. Côté matériel, j’ai opté un simple arduino avec un capteur ultrason.

## Shopping List

Voici les pré requis en terme d’achat pour réaliser cette démonstration : 
1. un rameur (~20€ sur le bon coin)
2. un Arduinio nano (~trouvé à 6€ sur tinyDeal)
3. une breadboard (~2€ sur tinyDeal)
4. un capteur ultrason HC-SR04(~1,5€ sur tinyDeal)
5. un fil MiniUSB -> USB (fourni avec l’arduino)
6. des fils pour notre montage
7. un ordinateur avec Chrome

## Un jeu en HTML ? 

Avant de commencer, il m’a fallu me renseigner sur le fonctionnement d’un jeu et voir comment j’allais procéder pour respecter au mieux les bonnes pratiques en vigueur. 

Globalement, un jeu possède plusieurs briques qui fonctionnent en parallèle afin de minimiser le blocage de l’UI. Pour rappel, un jeu est considéré comme fluide s’il est à 60fps ce qui veut dire que chaque affichage ne doit pas dépasser les 13ms. Afin de respecter au mieux cette contrainte, j’ai découpé mon programme : 
* la brique qui s’occupe de l’affichage va lire dans un modèle partagé
* la brique qui s’occupe de lire les données de l’arduino va alimenter ce modèle partagé et faire les calculs nécessaires

De cette façon, j’ai une séparation propre de mes interactions et des actions provenant de l’extérieur pouvant parfois bloquer mon interface. Il est à noter qu’avec ce fonctionnement, je tolère une désyncrhonisation entre l’état de mon modèle et mon affichage. Je pars du principe que celle-ci sera de maximum 13ms, ce qui est acceptable.

## Sketch Arduino

![](/assets/2015-10-Skiff/schema_bb.png)

``` c
//Pour le cpateur à ultrasons
int TriggerPin = 8; 
//Trig pin
int EchoPin = 5; 
//Echo pin
long distance; 
void setup() {
   Serial.begin(9600); 
   //Mise en entrées de Pins
   //On initialise le capteur à ultrasons
   pinMode(TriggerPin, OUTPUT); 
   digitalWrite(TriggerPin, LOW); 
   pinMode(EchoPin, INPUT); 
   delay(100); 
   Serial.println("Fin SETUP capteurs"); 
   }
void loop() {
   distance = lire_distance(); 
   Serial.print("D"); 
   Serial.println(distance); 
   //Envoi des données en BT : 
   delay(50); 
   }
long lire_distance() {
   long lecture_echo; 
   digitalWrite(TriggerPin, HIGH); 
   delayMicroseconds(10); 
   digitalWrite(TriggerPin, LOW); 
   lecture_echo = pulseIn(EchoPin, HIGH); 
   long cm = lecture_echo / 58; 
   return(cm); 
   }
```

Le fonctionnement est très simple : il suffit de lire la mesure de distance dès que l’on en obtient une, puis on la retranscrit directement sur le port série.

## ChromeApp ?

Comme il s’agit d’une application chrome, nous devons créer un fichier [manifest.json](https://developer.chrome.com/extensions/manifest) :  [Manifest de SkiffSumulator](https://github.com/sqli-nantes/skiff-simulator/blob/master/chromeApp%2Fmanifest.json) qui correspond au fichier de configuration de l’application chrome. 

### Structure de l’application

L’application possède donc plusieurs scripts qui vont tourner en parallèle afin de faire fonctionner le jeu. Voici la structure de mon projet côté application web : 
* assets : répertoire possèdant tous les fichiers de ressources du jeu (Fonts, images, sons)
* javascript : ensemble des srcipts javascript constituant l’application
* scss : fichier sass qui vont servir à générer le css

Nous allons nous attarder uniquement sur les scripts car c’est dans cette partie que se situe toute l'intelligence du jeu. En effet, le fichier html est très sommaire car il ne contient qu’un canvas : 

``` html
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="UTF-8">
      <title>Skiff Almost Simulator</title>
      <link rel="icon" type="image/png" href="./assets/images/icon48.png" />
      <link rel="stylesheet"href="./css/app.css"/>
   </head>
   <body>
      <canvas id="skiff"></canvas>
      <input id="user" type="text" placeholder='Enter your name'/>  
      <script type="text/javascript" src="./javascript/resources.js"></script>
      <script type="text/javascript" src="./javascript/audio.js"></script>
      <script type="text/javascript" src="./javascript/const.js"></script>
      <script type="text/javascript" src="./javascript/chrome_storage.js"></script>
      <script type="text/javascript" src="./javascript/chrome_serial.js"></script>
      <script type="text/javascript" src="./javascript/screen_accueil.js"></script>
      <script type="text/javascript" src="./javascript/screen_action.js"></script>
      <script type="text/javascript" src="./javascript/screen_end.js"></script>
      <script type="text/javascript" src="./javascript/app.js"></script>
   </body>
</html>
```


### Scripts et rôles

Voici les différents fichiers et leur rôles : 
* app.js : coeur de l’application, il s’agit du point d’entrée de l’application et il agit comme un chef d’orchestre. C’est dans un sens le contrôleur de notre application
* audio.js : fichier servant à gérer la lecture des fichiers audio
* chrome_serial.js : fichier contenant le code spécifique à Chrome qui va nous permettre de lire directement depuis le port série de l’ordinateur
* chrome_storage.js : fichier utilitaire qui expose de façon uniforme une API de localstorage au cas où l’application devrait tourner en dehors de Chrome (plus de détails plus loin dans l’article)
* const.js : fichier regroupant toutes les constantes du jeu. Il peut s’agir de simples constantes ou de variables d’ajustement servant lors de la calibration du jeu
* ressources.js : fichier permettant d’exposer un mécanisme de chargement de ressources graphiques en vue de les exploiter par la suite dans le programme
* screen_acceuil.js : fichier contenant tout le code spécifique à l’affichage de l’écran d’accueil
* screen_action.js : fichier contenant tout le code spécifique à l’affichage pendant le jeu
* screen_end.js : fichier contenant tout le code spécifique à l’affiche de l’écran de fin

Le [Reveal Module Pattern](https://carldanley.com/js-revealing-module-pattern/) a été choisi comme pattern car il permet de fonctionner en module javascript et d’offrir un découpage propre du code tout en maîtrisant les méthodes exposées.

## Déroulement du programme :


Prenons les différents points méritant de l’attention : 

### Démarage (App.js)

``` javascript
//API
function init() {
   window.addEventListener('load', 
   pageLoad); 
   }
return {
   init : init, ... }
}
(); 
AppSAS.init(); 
```

On démarre l’application dès que la page est prête.

``` javascript
'use strict'; 
var AppSAS = AppSAS || function() {
   … function pageLoad() {
      // On se connecte à l'arduino
      try {
         skiffSimulatorChrome.initArduino(); 
         }
      catch(err) {
         console.error("Error : %s \n %s", 
         err.message, err.stack); 
         }
```

On doit faire appel au module qui va lire les données de l’arduino.

``` javascript
// On initialise le canvas
ui.input = document.getElementById('user'); 
ui.canvas = document.getElementById('skiff'); 
ui.canvas.width = window.innerWidth; 
ui.canvas.height = window.innerHeight; 
ui.context = ui.canvas.getContext('2d'); 
ui.canvas.addEventListener('click', checkClick, false); 
// On précharge toutes les ressources nécessaires
ui.resources.loadSprites([ {
   title : 'logo', url : 'assets/images/logo.png'}
, {
   title : 'game_over', url : 'assets/images/gameover.png'}
, {
   title : 'rive_gauche_portrait', url : 'assets/images/riviere_gauche_portrait.png'}
, ... ]) .then(function(value) {
   paintSkiff(); 
   }
).catch(function(err) {
   console.error("Error : %s \n %s", err.message, err.stack); }
); 
}
```

On initialise notre canvas ainsi que les ressources graphiques du projet. On n’affiche le jeu qu’une fois ces dernières chargées.
    
### En fonctionnement (app.js)

Une fois l’application réellement démarrée avec la méthode paintSkiff. Nous allons simplement déléguer l’affichage aux méthodes appropriées : 

``` javascript
// Gère l'affichage de l'écran
function paintSkiff() {
   try {
      ... // Affichage des décors
      paintBackground(); 
      if (gameModel.stateGame === constState.STATE_ACCUEIL) {
         ScreenSasAccueil.paintSkiffAccueil(); 
         StorageSAS.manageGhost(); 
         }
      else if (gameModel.stateGame === constState.STATE_RUNNING) {
         // On doit peindre le fantome du jeu en deuxième car son alpha nous indique où il est
         ScreenSasAction.paintSkiffAction(); 
         ScreenSasAction.paintSkiffGhost(); 
         // On ajoute l'état à l'historique
         gameModel.currentHistory.push( {
            direction : gameModel.direction, 
            distanceSkiff : + gameModel.distanceSkiff, 
            distanceArduino : + gameModel.distanceArduino }
         ); 
         gameModel.step++; 
         }
      if (gameModel.stateGame === constState.STATE_END) {
         ScreenSasEnd.paintSkiffEnd(); 
         }
      window.requestAnimationFrame(paintSkiff); 
      }
   catch (err) {
      console.error("Error : %s \n %s", 
      err.message, err.stack); 
      }
   }
```




Il est à noter que l’on utilise la méthode window.requestAnimtionFrame. Cette dernière est très importante car elle permet d’optimiser l’affichage de nos écrans en fonction de la puissance de la machine. En effet, la méthode de callback ne sera appelée une fois le navigateur prêt à effectuer une nouvelle mise à jour graphique. Il faut donc utiliser cette méthode à la place d’un setInterval

### Affichage des écrans

L’affichage des écrans se fait toujours de la même façon : 
1. on nettoie le canvas
2. on dessine une ou des images sur le canvas

L’affichage d’un écran se fait toujours de la façon suivante : 

``` javascript
ui.context.drawImage(imgSource //L’image source
, sx //sx clipping de l'image originale
, sy //sy clipping de l'image originale
, sw // swidth clipping de l'image originale
, sh // sheight clipping de l'image originale
, dx // x Coordonnées dans le dessin du canvas
, dy // y Coordonnées dans le dessing du canvas
, dw // width taille du dessin
, dh // height taille du dessin 
); 
```

<div class="center">
    <img src="/assets/2015-10-Skiff/drawImage.png" class="center">
</div>

Les animations / constructions des écrans ne sont en fait qu’une succession de drawImage ou fillText.

### Gestion des interactions

Afin de pouvoir démarrer l’application, nous devons gérer les clicks sur le canvas. Le problème est que lorsque nous dessinons des images, nous ne pouvons pas avoir accès à un équivalent de onClick sur une zone graphique précise. Nous devons donc écouter les clicks sur le canvas et calculer si la zone de click correspond à une zone d’interaction de notre ihm.

``` javascript
    // Gère les clicks en fonction de l'état du jeu
function checkClick(event) {
   if (gameModel.stateGame != constState.STATE_RUNNING) {
      var btnStart = ui.resources.images['btn_start']; 
      var finalHeight = btnStart.height * ui.ratio, 
      finalWidth = btnStart.width * ui.ratio; 
      var x = (ui.canvas.width / 2) - ((btnStart.width * ui.ratio) / 2), y = ui.canvas.height - finalHeight - (isPortrait() ? 100 : 50);
      var xClick = event.pageX, 
      yClick = event.pageY; 
      if (yClick > y && yClick < (y + finalHeight) && xClick > x && xClick < (x + finalWidth)) {
         // On change l'état du jeu
         gameModel.stateGame = gameModel.stateGame === constState.STATE_ACCUEIL ? constState.STATE_RUNNING : constState.STATE_ACCUEIL; 
        ... 
         }
      }
   }
```

### Gestion du moteur

Un des éléments clés du programme est l’alimentation du modèle depuis l’application chrome. L’application chrome va alimenter le modèle et déterminer un certain nombre d’éléments en lien avec le rendu souhaité, puis appeler le moteur de calcul pour terminer les traitements. On vérifie par exemple dans quel sens va le joueur, s’il y a eu un déplacement, etc.

``` javascript
// Calcul 
function setDistance(distance) {
   if (gameModel.distanceArduino === distance) {
      gameModel.direction = 0; 
      }
   else if (gameModel.distanceArduino > distance) {
      gameModel.direction = 1; 
      }
   else {
      gameModel.direction = - 1; 
      }
   // Vitesse en cm / ms
   var deltaCM = Math.abs(gameModel.distanceArduino - distance); 
   if (deltaCM > ConstSAS.MIN_DELTA_CM) {
      gameModel.speed = deltaCM / ConstSAS.DELAY; 
      }
   else {
      gameModel.speed = Math.max(gameModel.speed - ConstSAS.FACTOR_SPEED, 
      0); 
      }
   gameModel.distanceArduino = distance; 
   engineSkiff(); 
   }
```

Le coeur du moteur quant à lui, s’occupe uniquement de lire les données issues de l’arduino et de calculer la distance globale parcourue, ainsi que le pourcentage de déplacements dans l’écran.

``` javascript
function engineSkiff() {
   if (gameModel.speed > 0 && gameModel.stateGame === constState.STATE_RUNNING) {
      var distanceSpeed = gameModel.speed * ConstSAS.DELAY; 
      // On incrémente la distance
      gameModel.distanceSkiff += (distanceSpeed * ConstSAS.FACTOR_DISTANCE); 
      // On gère l'effet de déplacement des bords via un pourcentage
      gameModel.percent = (gameModel.distanceSkiff % 100) / 100;
      }
   }
```
 
## Spécifique Chrome

Depuis le début nous parlons d’application chrome et de l’API Serial, il est désormais temps de voir comment nous implémentons cette partie.

### Interaction avec l’Arduino

Toute l’interaction avec L’arduino se fait directement via le port série. Mais il faut pour cela passer par des étapes clés : 
1. récupérer les appareils connectés sur les ports série “chrome.serial.getDevices”
2. une fois un appareil trouvé, on s’y connecte “chrome.serial.connect”. Dans notre exemple, on veille à ce qu’il n’y ai qu’un appareil de connecté au moment du lancement de l’application
3. lire le port série “chrome.serial.onReceive”

``` javascript
   function initArduino() {
      chrome.serial.getDevices(function(ports) {
         if (ports && ports.length == 1) {
            chrome.serial.connect(ports[0].path, 
            onOpenArduino); 
            }
         }
      ); 
      }
   function onOpenArduino(openInfo) {
      connectionId = openInfo.connectionId; 
      console.log("connectionId: " + connectionId); 
      if (connectionId == - 1) {
         console.log('Could not open'); 
         return; 
         }
      console.log('Connected'); 
      chrome.serial.onReceive.addListener(onReadArduino); 
      }
   function convertArrayBufferToString(buf) {
      return String.fromCharCode.apply(null, 
      new Uint8Array(buf)); 
      }
   function onReadArduino(readInfo) {
      if (readInfo.connectionId == connectionId && readInfo.data) {
         var str = convertArrayBufferToString(readInfo.data); 
         if (str.charAt(str.length - 1) === '\n') {
            value += str.substring(0, 
            str.length - 1); 
            if (regExp.test(value)) // Light on and off
            {
               var distanceTmp = + regExp.exec(value)[1]; 
               if (distanceTmp < ConstSAS.DISTANCE_MAX && Math.abs(distance - distanceTmp) < (ConstSAS.DISTANCE_MAX * 1.5) ) {
                  AppSAS.setDistance(distanceTmp); 
                  }
               distance = distanceTmp; 
               }
            value = ""; 
            }
         else {
            value += str; 
            }
         }
      }
```

Il faut noter une petite particularité lors de la lecture : nous lisons le port série et nous attendons une chaîne de caractères. Aussi, il est important de penser à convertir les données issues du port série en données exploitables sous forme de chaîne de caractères.

## Gestion des écrans et cas particuliers

Maintenant que nous avons vu la mécanique sous le capot, regardons de plus près quelques cas particuliers qui méritent un peu d’attention.

### Déplacement du décor 

Afin de donner une sensation de déplacement, il nous faut bouger nos rives. Pour se faire, on va simplement fonctionner avec un indicateur en pourcentage en rapport avec le déplacement global du rameur. Ainsi pour afficher correctement nos 2 rives qui bougent, il nous suffit juste de dessiner 2 fois chaque rive de chaque côté afin de gérer les dépassement d’écran et de les positionner en fonction d’un pourcentage résultant d’un modulo de la distance du rameur : 

``` javascript
// Affiche le rivage en fonction de la rive souhaitée et de la progression du rameur
function paintRive(riveDroite) {
   var rive = ui.resources.images[(riveDroite ? 'rive_droite' : 'rive_gauche') + getSuffix()]; 
   var finalHeight = rive.height * ui.ratio, 
   finalWidth = rive.width * ui.ratio; 
   ui.context.drawImage(rive , 0 //sx clipping de l'image originale
   , 0 //sy clipping de l'image originale
   , rive.width // swidth clipping de l'image originale
   , rive.height // sheight clipping de l'image originale
   , riveDroite ? ui.canvas.width - finalWidth : 0 // x Coordonnées dans le dessing du canvas
   , 0 - (finalHeight * gameModel.percent) // y Coordonnées dans le dessing du canvas
   , finalWidth // width taille du dessin
   , finalHeight // height taille du dessin 
   ); 
   ui.context.drawImage(rive , 0 //sx clipping de l'image originale
   , 0 //sy clipping de l'image originale
   , rive.width // swidth clipping de l'image originale
   , rive.height // sheight clipping de l'image originale
   , riveDroite ? ui.canvas.width - finalWidth : 0 // x Coordonnées dans le dessing du ui.canvas
   , finalHeight - (finalHeight * gameModel.percent) // y Coordonnées dans le dessing du canvas
   , finalWidth // width taille du dessin
   , finalHeight // height taille du dessin 
   ); 
   }
```

### L’affichage du rameur

L’affichage du rameur comporte 2 parties à prendre en compte : 
1. l’affichage du rameur en fonction de la position du joueur
2. l’avancée du rameur quand le mode ghost est activé

#### Position du rameur en fonction du joueur

Afin de restituer au mieux les gestes effectués par le joueur, il a fallu réfléchir à une façon d’afficher la bonne image de rameur, en fonction de sa position sur le rameur.

<div>
<img src="/assets/2015-10-Skiff/A1_portrait.png" class="imgskiff"><img src="/assets/2015-10-Skiff/A2_portrait.png" class="imgskiff"><img src="/assets/2015-10-Skiff/A3_portrait.png" class="imgskiff"><img src="/assets/2015-10-Skiff/A4_portrait.png" class="imgskiff"><img src="/assets/2015-10-Skiff/A5_portrait.png" class="imgskiff"><img src="/assets/2015-10-Skiff/R1_portrait.png" class="imgskiff"><img src="/assets/2015-10-Skiff/R2_portrait.png" class="imgskiff"><img src="/assets/2015-10-Skiff/R3_portrait.png" class="imgskiff"><img src="/assets/2015-10-Skiff/R4_portrait.png" class="imgskiff"><img src="/assets/2015-10-Skiff/R5_portrait.png" class="imgskiff">
</div>

<div style="clear:both"></div>

 La réponse était relativement simple :  il suffit de connaître à chaque instant la position du joueur sur le rameur et sa direction, puis d’appliquer la bonne image.

``` javascript
function indexToUse(direction, distance) {
   var arrayToUse = direction >= 0 ? mappingPositonRameurFront : mappingPositonRameurBack; 
   for (var i = 0; i < arrayToUse.length; i++) {
      var minMax = arrayToUse[i]; 
      if (distance > minMax.min && distance <= minMax.max) {
         return minMax.indexSprite + AppSAS.getSuffix(); 
         }
      }
   return mappingPositonRameurBack[0].indexSprite + AppSAS.getSuffix(); 
   }
// Affiche le bon sprire du bateau
function paintBoat() {
   //var ratio = 0.05;
   var image = AppSAS.ui.resources.images[AppSAS.gameModel.indexSprite]; 
   AppSAS.ui.context.shadowOffsetX = 0; 
   AppSAS.ui.context.shadowOffsetY = 0; 
   AppSAS.ui.context.shadowBlur = 0; 
   AppSAS.ui.context.drawImage(image , 0 //sx clipping de l'image originale
   , 0 //sy clipping de l'image originale
   , image.width // swidth clipping de l'image originale
   , image.height // sheight clipping de l'image originale
   , (AppSAS.ui.canvas.width / 2) - ((image.width * AppSAS.ui.ratio) / 2) // x Coordonnées dans le dessin du AppSAS.ui.canvas 
   , (AppSAS.ui.canvas.height / 2) - ((image.height * AppSAS.ui.ratio) / 2) + 100// y Coordonnées dans le dessin du AppSAS.ui.canvas 
   , image.width * AppSAS.ui.ratio // width taille du dessin 
   , image.height * AppSAS.ui.ratio // height taille du dessin  
) }
```

De cette manière nous affichons toujours la bonne image. Puis, afin de faciliter le déplacement du bateau, il a été considéré qu’il était en position fixe sur l’écran et que l’illusion du déplacement se fait uniquement à travers le déplacement du décor.

#### Gestion du ghost

L’affichage du ghost doit faire face à un problème. Contrairement au bateau, ce dernier se déplace sur l’écran. Le problème est que ce déplacement vient surtout du fait qu’il a fallu gérer le cas d’un ghost allant plus vite que le joueur courant. En effet, si le ghost est meilleur que le joueur, alors, il sera vers le haut de l’écran ce qui veut dire que sa position va s’approcher de l’axe, voire aller dans les négatifs. Or dans un canvas, si un élément est dessiné avec des coordonnées de destination dans le négatif, l’élément n’est tout simplement pas peint !  Il a donc fallu tronquer l’image source pour donner l’illusion que le dessin du ghost parte vers le haut de l’écran.

``` javascript
// Affiche le bon sprire du bateau du mode Ghost
function paintGhost() {
   //var ratio = 0.05;
   var image = AppSAS.ui.resources.images[AppSAS.gameModel.indexSpriteGhost]; 
   ...
   // Le fantome doit etre dessiné là où il est au niveau de sa distance globale par rapport au bateau actuel 
   // => On l'affiche là où est son delta en distance par rapport à bateau actuel
   var stateGhost = AppSAS.gameModel.ghost[AppSAS.gameModel.step]; 
   var deltaGhost = AppSAS.gameModel.distanceSkiff - stateGhost.distanceSkiff; 
   // On doit tronquer le ghost s'il dépasse de l'écran 
   var yGhost = (AppSAS.ui.canvas.height / 2) - ((image.height * AppSAS.ui.ratio) / 2) + 100 + (deltaGhost * ConstSAS.FACTOR_GHOST);
   var heightSpriteGhost = image.height; 
   if (yGhost < 0) {
      heightSpriteGhost = image.height + yGhost; 
      yGhost = 0; 
      }
   AppSAS.ui.context.drawImage(image , 0 //sx clipping de l'image originale
   , image.height - heightSpriteGhost //sy clipping de l'image originale
   , image.width // swidth clipping de l'image originale
   , heightSpriteGhost // sheight clipping de l'image originale
   , (AppSAS.ui.canvas.width / 2) - ((image.width * AppSAS.ui.ratio) / 2) // x Coordonnées dans le dessin du AppSAS.ui.canvas 
   , yGhost // y Coordonnées dans le dessin du AppSAS.ui.canvas , image.width * AppSAS.ui.ratio // width taille du dessin 
   , heightSpriteGhost * AppSAS.ui.ratio // height taille du dessin 
   );
   ...
 }
```

### Affichage des écrans de login & de scores

Ces 2 écrans sont différents car on y affiche non pas une animation, mais tu texte.

#### Ecran de Login

<div class="center">
    <img src="/assets/2015-10-Skiff/rameur_Accueil.png" class="center">
</div>

Concernant l’écran de login, il n’existe pas d’équivalent du champ input dans un canvas. Aussi, il a fallu intégrer à notre html une balise input que l’on affiche ou cache en fonction du besoin.

#### Ecran de scores

<div class="center">
    <img src="/assets/2015-10-Skiff/rameur_GameOver.png" class="center">
</div>

L’affichage du score est simple car il ne s’agit que d’afficher du texte : 

``` javascript
AppSAS.ui.context.fillText(MyText, x, y); 
```

La taille et la couleur du texte sont définis par des propriétés appliquées directement sur le context du canvas.

### Persistance des données

Pour sauvegarder les données d’une partie à l’autre, ou même d’un démarrage d’application à l’autre. J’ai fait le choix le plus simple : le LocalStorage. Le seul hic avec le LocalStorage et les ChromeApps, c’est que l’API telle qu’elle est disponible en html5 n’existe pas sur une ChromeApp. En effet, l’api localStorage étant syncrhone, Google a préféré mettre en place une solution asyncrhone : [https://developer.chrome.com/apps/storage](https://developer.chrome.com/apps/storage). J’ai donc mis en place la solution de Google et j’en ai profité pour prévoir une api uniforme entre localstorage & chrome.storage au cas où vous partiriez sur une solution native html5.

### Placer l’aduino

Afin de mesurer au mieux les données de distance, j’ai placé l’arduino au dos de l’utilisateur et j’ai fabriqué une petite boîte pour packager un peu tout ça :

![](/assets/2015-10-Skiff/lego.jpg)

## Annexes 

Le code complet est disponible [https://github.com/sqli-nantes/skiff-simulator](https://github.com/sqli-nantes/skiff-simulator)


<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="text/javascript" src="/assets/2015-10-Skiff/skiff-custo.js"></script>
