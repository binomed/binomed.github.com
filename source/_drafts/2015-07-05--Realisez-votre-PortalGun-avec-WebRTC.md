title: Réalisez votre PortalGun avec WebRTC
tags:
    - WebRTC
    - Canvas
category:
    - Tech
toc: false
---


## Réalisez votre PortalGun avec WebRTC

<img src="/assets/2015-07-PortalWebRTC/homer.png" class="left homer">

Vous avez toujours rêvé d’avoir votre “Portal Gun”* afin de pouvoir imiter Homer Simpson et ainsi pouvoir attraper les bières de votre frigo depuis votre canapé.

Et bien c’est dors et déjà possible ! Enfin presque… vous pourrez surveiller votre frigo mais vous ne pourrez pas attraper ces précieuses bières.

Ce que je vous propose c’est de réaliser des Portails similaires au jeux Portal basés uniquement sur les technologies du Web ! 

<div style="clear:both"></div>

## Le projet Portal WebRTC

Voici le rendu de ce qu’on allons réaliser : Le portail bleu voit ce qui se passe dans le portail orange et inversement :

<img src="/assets/2015-07-PortalWebRTC/jf_0.png" class="jf first">

<img src="/assets/2015-07-PortalWebRTC/jf_1.png" class="jf">


Avant d’attaquer le code, regardons un peu de quoi nous avons besoin : 
1. Nous devons être capables de voir ce qu’il se passe de l’autre côté du portail
2. Un “mur de flammes” entoure notre image
3. Nous voulons nous télé-porter de l’autre côté du portail

Voyons maintenant comment nous pouvons répondre à ces différents  besoins à travers des technologies du Web : 
1. WebRTC :il s’agit d’une technologie de visio (mais pas que) et donc c’est idéal pour voir ce qu’il se passe à l’autre côté du portail
2. Les canvas nous permettront de jouer efficacement pour simuler de façon performante notre “mur de flammes”.
3. La teleportationAPI…. euh non rien ne permet de répondre à ce besoin… 

/!\ Ce projet ne marchera que sous Chrome ou Firefox

## Architecture du projet

![](/assets/2015-07-PortalWebRTC/archi.png)

* Chaque ordinateur se trouve sur le réseau et se connecte à un serveur Web uniquement pour afficher le contenu de la page. Le serveur est un serveur NodeJS. 
* Ce Serveur expose aussi une WebSocket dont le rôle sera expliqué plus tard dans l’article
* L’échange des données vidéos se fait en “direct” entre les 2 ordinateurs via la technologie WebRTC <img src="/assets/2015-07-PortalWebRTC/logo_webrtc.png" class="logo">

## WebRTC What ?


<img src="/assets/2015-07-PortalWebRTC/meme_webrtc.png" class="left meme">

WebRTC pour Real Time Communication est une des technologies les plus importantes du projet. Grâce à cette API, on peut  faire plusieurs choses :

<div style="clear:both"></div>

* Obtenir l’audio et la vidéo.
* Etablir une connexion entre 2 hôtes.
* Communiquer de la vidéo et de l’audio.
* Communiquer d’autres types de données.

Une des forces du webRTC est que les données s’échangent directement entre les 2 ordinateurs et que ces dernières ne passent pas par un serveur ! Pour réussir cet exploit, la technologie WebRTC repose sur 3 APIS web : 

1. **getUserMedia** : cette API permet de récupérer les flux vidéos et audios d’un ordinateur
2. **RTCPeerConnection** : cette API permet de faire communiquer des données entre 2 hôtes en tenant compte de tout un ensemble de contraintes telles que l’adresse IP d’une machine, ses codecs, sa connectivité, …
3. **RTCDataChannel** : cette API permet de faire transiter sur une RTCPeerConnection des données textuelles ou binaires.

Pour notre projet, nous n’allons utiliser que les API getUserMedia et RTCPeerConnection.

### GetUserMedia

Il s’agit d’une API qui permet de récupérer un ensemble de stream de médias syncrhonisés. Chaque stream peut être vidéo / audio.

``` javascript
var constraints = {video: true};

function successCallback(stream) {
  var video = document.querySelector("video");
  video.src = window.URL.createObjectURL(stream);
}
function errorCallback(error) {
  console.log("navigator.getUserMedia error: ", 
  error);
}
navigator.getUserMedia(constraints, 
      successCallback, 
      errorCallback);
      
```


Dans l’exemple ci dessus, nous ne récupérons que la vidéo et nous injectons le résultat de l’appel de getUserMedia dans une balise vidéo.

### RTCPeerConnection

La RTCPeerConnection permet de gérer le transport des données. Pour initialiser une RTCPeerConnection, on répond au principe de l’offre et de la demande. Il y a d’une part, une notion d’offre et de demande pour communiquer mais aussi une notion de chemin à emprunter ! Ces 2 notions s'appellent le “Signaling”. Le Signaling a pour objectif de répondre à ces questions : 
* Quel type de média et format je supporte ?
* Que puis-je envoyer ?
* Quel est mon type d’infrastructure réseau ?

Pour faire cette étape, il suffit juste de trouver un moyen de passer ces informations à l’hôte distant. Une des technologies préconisées pour faire le signaling est “les WebSockets”. C’est donc ici qu’interviendra notre serveur de websockets

Voici comment se déroule le signaling : 

#### Gestion de l’offre

1. Alice appelle la méthode **createOffer()**
2. Dans le callback, Alice appelle **setLocalDesctiption()**
3. Alice **sérialise l'offre** et l'envoie à Eve
4. Eve appelle la méthode **setRemoteDescription()** avec l'offre
5. Eve appelle la méthode **createAnswer()**
6. Eve appelle la méthode **setLocalDescription()** avec la réponse envoyée à Alice
7. Alice reçoit la réponse et appelle **setRemoteDescription()**

#### Gestion du chemin Ice Candidate (ICE pour Interactive Connectivity Establishement)

1. Alice & Eve ont leur **RTCPeerConnection**
2. En cas de succès de chaque côté les **IceCanditates** sont envoyées
3. Alice **sérialise** ses IceCandidates et les envoie à Eve
4. Eve reçoit les IceCandidates d'Alice et appelle **addIceCandidate()**
5. Eve **sérialise** ses IceCandidates et les envoie à Alice
6. Alice reçoit les IceCandidates d'Eve et appelle **addIceCandidate()**
7. Les 2 savent comment communiquer.

#### Plus d’infos

Si vous souhaitez plus d’information sur le WebRTC : 
* [http://www.html5rocks.com/en/tutorials/webrtc/basics/](http://www.html5rocks.com/en/tutorials/webrtc/basics/)
* [http://www.html5rocks.com/en/tutorials/webrtc/datachannels/](http://www.html5rocks.com/en/tutorials/webrtc/datachannels/)

## Retour au Projet Portal

Après cette rapide introduction sur la technologie WebRTC. Nous allons maintenant nous intéresser à notre projet et nous allons voir comment réaliser notre “Portal”. 

Comme tout bon projet, je me suis inspiré de ce que je trouvais sur le net afin de gagner du temps. Ainsi, plutôt que de vous noyer sous des montagnes de code compréhensible et/ou incompréhensible. Je vous donnerais plutôt les deltas que j’ai effectué et pourquoi je les ai fait.

### Etape 1 : cloner les projets références

La base du projet WebRTC repose sur le codelab initialisé par Sam Dutton : ingénieur chez Google et travaillant sur l’implémentation de WebRTC dans Chrome : [https://bitbucket.org/webrtc/codelab](https://bitbucket.org/webrtc/codelab). De façon plus précise notre point de départ sera le step7 de ce codelab.

La base graphique des flammes repose sur le projet de Chris Longo :  [https://github.com/chrislongo/html5-canvas-demo](https://github.com/chrislongo/html5-canvas-demo)

Nous allons donc commencer par cloner les 2 projets afin de récupérer une base de code propre et fonctionnelle que nous allons nettoyer petit à petit pour coller avec notre besoin.

### Etape 2 : création du squelette de l’application

L’application est structurée comme suit : 

* assets/ : fichiers externes
 * fonts/ : les fonts spéciales utilisées pour le projet
 * images/ : les ressources graphiques utilisées pour le projet
* css/ : le style de notre page
* js/ : les fichiers javascripts utilisés par le projet
* package.json : fichier des dépendances node utilisées pour le serveur node
* server.js : le serveur nodeJS
* index.html : notre application

Téléchargement des ressources annexes

* Vous trouverez la font ici : [http://fontmeme.com/freefonts/34868/portal.font](http://fontmeme.com/freefonts/34868/portal.font)
* Les images utilisées dans le projet sont disponible aux urls suivantes : 
  * Image du BugDroid Portal : [https://goo.gl/vT6svL](https://goo.gl/vT6svL)
  * Image du footer : [https://goo.gl/J6CknB](https://goo.gl/J6CknB)
  * Image du header : [https://goo.gl/AQnIoo](https://goo.gl/AQnIoo)
  * Image du logo WebRTC : [https://goo.gl/XeimoA](https://goo.gl/XeimoA)

### Etape 3 : Ecriture du Serveur

Comme expliqué précédemment, nous allons baser notre travail sur le step7 du codelab. 

#### ./package.json

```javascript
{
  "author": "jefBinomed",
  "name": "protal-devfest-2013",
  "dependencies": {
    "socket.io": "~0.9.14",
    "node-static" : "~0.6.9"
  }
}
```

#### ./server.js

Nous reprenons le serveur tel qu’il est dans le codelab

Ce serveur fait donc 2 choses : 
1. Dans un premier temps, on va définir un serveur http pour servir notre contenu html
2. On créé un serveur de webSockets afin d’assurer la partie “Signaling”.  Un message transféré au serveur sera automatiquement partagé à l’autre client.

Il ne nous reste plus à qu’à récupérer les modules node avec l’instruction : 

```bash
npm install
```

De cette manière, les dépendances nodes seront téléchargées dans notre projet

### Etape 4 : Ecriture du projet WebRTC 

Nous allons poser le style graphique de notre application : 

#### ./assets/fonts/stylesheet.css

```css
@font-face {
    font-family: 'portalportal';
    src: url('portal.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
```


#### ./css/main.css

```css
body{
    background-color:black;
    font-family: "portalportal";
    text-align: center;
    color: #636468;
    margin: 0;
    overflow: hidden;
}

#videos{
    margin: auto;
    
}

header{
    position: absolute;
    left: -342px;
    top: -100px;
    font-size: 40px;
    background-image: url(../assets/images/navigation_bg.png);
    background-repeat: no-repeat;
    background-size:750px;
    height: 147px;
    width: 750px;
}

.landscape header{
    left:50%;
    margin-left:-325px;
    top:inherit;
}

header .textHeader{
    position: absolute;
    width: calc(100% * 2/3);
    height: 100%;
    top:40px;
    right: calc(100% / 3);
    text-align: right;
}

header .firstLine{
    text-transform: uppercase;
}

header .secondLine{
    font-size: 20px;
}

header .portalImg{
    position: absolute;
    right: calc(100% / 3 - 60px);
    top: 40px;
}


#container{
    position: absolute;
    left: 137px;
    height: 99%;
    width: calc(100% - 60px - 137px);

}

footer{
    background-image: url(../assets/images/showcase_bg.png);
    background-repeat: no-repeat;
    background-size: 750px;
    position: absolute;
    bottom: -100px;
    right: -345px;
    width: 750px;
    font-size: 14px;
    line-height: 60px;
    height: 60px;
}

.landscape footer{
    right: inherit;
    left: 50%;
    margin-left: -325px;
    bottom: 0;
}

canvas{    
    position: absolute;
    
}
```

#### index.html

```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Server presentation</title>
        <!-- Main Css-->
        <link rel="stylesheet" href="assets/fonts/stylesheet.css">
        <link rel="stylesheet" href="css/main.css">
                
    </head>
    <body class="landscape">

    <header>
        <div class="textHeader">
            <span class="firstLine">Projet PORTAL 2O15</span><br>
            <span class="secondLine">une expérience interactive</span>
        </div>
        <img  src="assets/images/bugdroidportal_2.png" height="100px" class="portalImg"></img>
    </header>
   
    
    <div id='container'>
        <video id='remoteVideo' autoplay muted style="display:none;"></video>
        <canvas id="canvasFireLocalVideo"></canvas>
        <canvas id="canvasRemoteVideo"></canvas>
    </div>


    <footer>
        Une création utilisant la technologie <a href="www.webrtc.org">WEBRTC&nbsp;<img width="32px" src="assets/images/webrtc.png"></a>. Credits to @Binomed
    </footer>

    <script src='/socket.io/socket.io.js'></script>
    <script src='js/lib/adapter.js'></script>
    <script src='js/canvasFire.js'></script>
    <script src='js/app.js'></script>


    </body>
</html>
```

#### ./js/lib/adapter.js

Ce fichier doit être copié tel quel depuis le codelab car il s’agit de la classe Polyfill qui permet d’uniformiser l’API WebRTC entre Chrome & Firefox

#### ./js/canvasFire.js

Initialiser ce fichier à vide afin d’avoir l’import depuis le fichier html qui fonctionne

#### ./js/app.js

Nous allons partir du fichier issu du step7 : ./js/main.js. 

Copiez l’intégralité du fichier et nous allons retirer ce qui ne nous intéresse pas.

##### LocalVideo

Dans notre projet, nous ne sommes pas intéressé pour afficher le retour de notre webCam à l’écran, nous allons donc supprimer toutes les références à cet élément.

```javascript
var localVideo = document.querySelector('#localVideo');
```

et 

```javascript
 attachMediaStream(localVideo, stream);
```

dans la fonction handleUserMedia(stream)

##### DataChannel

De la même façon tout ce qui concerne le DataChannel ne nous sert pas

```javascript
var sendChannel;
var sendButton = document.getElementById("sendButton");
var sendTextarea = document.getElementById("dataChannelSend");
var receiveTextarea = document.getElementById("dataChannelReceive");

sendButton.onclick = sendData;
```

Au début du projet. Ensuite 

```javascript
var pc_constraints = {
  'optional': [
    {'DtlsSrtpKeyAgreement': true},
    {'RtpDataChannels': true}
  ]};
```

est à remplacer par :

```javascript
var pc_constraints = {
  'optional': [
    {'DtlsSrtpKeyAgreement': true}
  ]};
```

Et aussi il faut supprimer tout ce qui suit qui se situe au niveau de la fonction createPeerConnection

```javascript
if (isInitiator) {
    try {
      // Reliable Data Channels not yet supported in Chrome
      sendChannel = pc.createDataChannel("sendDataChannel",
        {reliable: false});
      sendChannel.onmessage = handleMessage;
      trace('Created send data channel');
    } catch (e) {
      alert('Failed to create data channel. ' +
            'You need Chrome M25 or later with RtpDataChannel enabled');
      trace('createDataChannel() failed with exception: ' + e.message);
    }
    sendChannel.onopen = handleSendChannelStateChange;
    sendChannel.onclose = handleSendChannelStateChange;
  } else {
    pc.ondatachannel = gotReceiveChannel;
  }
}

function sendData() {
  var data = sendTextarea.value;
  sendChannel.send(data);
  trace('Sent data: ' + data);
}

function gotReceiveChannel(event) {
  trace('Receive Channel Callback');
  sendChannel = event.channel;
  sendChannel.onmessage = handleMessage;
  sendChannel.onopen = handleReceiveChannelStateChange;
  sendChannel.onclose = handleReceiveChannelStateChange;
}

function handleMessage(event) {
  trace('Received message: ' + event.data);
  receiveTextarea.value = event.data;
}

function handleSendChannelStateChange() {
  var readyState = sendChannel.readyState;
  trace('Send channel state is: ' + readyState);
  enableMessageInterface(readyState == "open");
}

function handleReceiveChannelStateChange() {
  var readyState = sendChannel.readyState;
  trace('Receive channel state is: ' + readyState);
  enableMessageInterface(readyState == "open");
}

function enableMessageInterface(shouldEnable) {
    if (shouldEnable) {
    dataChannelSend.disabled = false;
    dataChannelSend.focus();
    dataChannelSend.placeholder = "";
    sendButton.disabled = false;
  } else {
    dataChannelSend.disabled = true;
    sendButton.disabled = true;
  }
}
```


Et enfin pour finir

```javascript
var constraints = {'optional': [], 'mandatory': {'MozDontOfferDataChannel': true}};
```

de la fonction doCall() est à remplacer par : 

```javascript
var constraints = {'optional': [], 'mandatory': {}};
```

#### Tester

Nous pouvons à présent tester notre application pour vérifier que la vidéo passe bien à travers l’API WebRTC. Pour ce faire, il suffit simplement de lancer notre serveur à l’aide de la commande : 

```bash
node server.js
```

Notre serveur tourne sur le port 2013. Il faut donc entrer dans notre navigateur l’url : http://localhost:2013. Il est très important d’accepter le partage de vidéo sinon cela ne pourra pas fonctionner.

A ce moment là, vous devriez avoir un écran noir. En effet, comme nous ne faisons pas de retour visuel de notre propre caméra, nous devons ouvrir un deuxième onglet sur la même url pour vérifier le bon fonctionnement. Cependant, il y a une deuxième raison pour laquelle nous ne voyons rien, la balise video remoteVideo a un style ‘display:none’. Il faudra supprimer ce display: none le temps du test.
Si tout se passe bien, vous devriez avoir une vidéo sur les 2 onglets correspondant au rendu de votre webcam. Pour chaque tests futurs, je vous conseille de fermer les 2 onglets à chaque fois car le serveur Node stocke le nombre de clients connectés et la limite a été fixée à 2 clients maximum !

### Etape 5 : Ajout du mur de flammes

Maintenant que nous nous sommes occupés de la partie WebRTC, nous allons ajouter un peu de graphisme à tout ça. Pour le moment, notre flux WebRTC arrive directement dans une balise vidéo, mais il se trouve que les canvas et les vidéos marchent très bien ensemble !  En effet, nous allons faire des snapshots de notre balise vidéo que nous allons injecter dans un canvas et ainsi pouvoir commencer à jouer plus sérieusement avec des effets graphiques.

Nous allons donc avoir 
* 1 balise vidéo en “display:none”
* 1 canvas restituant la vidéo mais avec un masque
* 1 canvas affichant le mur de flamme.


#### display:none

Pour ce faire, il suffit simplement de faire en sorte que dans notre html, nous ayons le code suivant : 

```html
<video id='remoteVideo' autoplay muted style="display:none;"></video>
```

#### canvas avec la vidéo

Nous allons maintenant ajouter à notre application (app.js) l’affichage du canvas qui recevra la vidéo.

```javascript
var canvasRemoteElement = document.querySelector('#canvasRemoteVideo');
var ctxRemote = canvasRemoteElement.getContext('2d');

function snapshot(){
    var canvasToUse = canvasRemoteElement;
    var contextToUse = ctxRemote;
    var videoToUse = remoteVideo;

    canvasRemoteElement.width = remoteVideo.videoWidth;
    canvasRemoteElement.height = remoteVideo.videoHeight;
    if (remoteStream){
        ctxRemote.drawImage(remoteVideo, 0,0);        
    }


    window.requestAnimationFrame(snapshot);
}

snapshot();
```

Nous utilisons simplement la possibilité de dessiner dans un canvas une image d’une vidéo

#### Mur de flamme

Vous devez copier le contenu du fichier canvas.js du projet html5-canvas-demo dans notre fichier ./js/canvasFire.js

Nous allons maintenant afficher le mur dans un canvas. Nous devons donc éditer notre fichier app.js

```javascript
var canvasFireElement = document.querySelector('#canvasFireLocalVideo');
var ctxFire = canvasFireElement.getContext('2d');
```

Nous allons aussi modifier la méthode snapshot afin d’y intégrer toute la partie flammes

```javascript
var init = false;
function snapshot(){
    var canvasToUse = canvasRemoteElement;
    var contextToUse = ctxRemote;
    var videoToUse = remoteVideo;

    canvasRemoteElement.width = remoteVideo.videoWidth;
    canvasRemoteElement.height = remoteVideo.videoHeight;
    if (remoteStream){
        ctxRemote.drawImage(remoteVideo, 0,0);        
    }

    var idealWidth = Math.min(canvasToUse.parentElement.clientWidth, videoToUse.videoWidth + 100);
    var minVideoWidth = Math.min(canvasToUse.parentElement.clientWidth - 50, videoToUse.videoWidth);
    var ratio = videoToUse.videoWidth / videoToUse.videoHeight;
    var idealHeight = Math.min(idealWidth / ratio, videoToUse.videoHeight);
    var useVideoWidth = idealWidth === videoToUse.videoWidth + 100;
    
    canvasToUse.width = idealWidth; //landscapeMode ? idealHeight : idealWidth;
    canvasToUse.height = canvasToUse.width;
    canvasToUse.style.top = ((canvasToUse.parentElement.clientHeight - canvasToUse.height) / 2)+"px";
    canvasToUse.style.left = ((canvasToUse.parentElement.clientWidth - canvasToUse.width) / 2)+"px";

    canvasFireElement.width = idealWidth;// landscapeMode ? idealHeight : idealWidth;
    canvasFireElement.height = canvasFireElement.width;
    canvasFireElement.style.top = ((canvasToUse.parentElement.clientHeight - canvasFireElement.height) / 2)+"px";
    canvasFireElement.style.left = ((canvasToUse.parentElement.clientWidth - canvasFireElement.width) / 2)+"px";

    var refValue = idealWidth;
    if (localStream){
      if (!init 
          && canvasToUse.width == Math.round(refValue)
          && canvasToUse.height == Math.round(refValue)
          && canvasFireElement.width == Math.round(refValue)
          && canvasFireElement.height == Math.round(refValue)){

        if (canvasFireElement.width != 100){

          init = true;
          canvasDemo.canvas = document.getElementById('canvasFireLocalVideo');
          canvasDemo.init();
        }
      }

      if (init){
        canvasDemo.refresh();
      }
    }

    window.requestAnimationFrame(snapshot);
}
```

Le code ajouté nous permet d’initialiser graphiquement le canvas et de demander de piloter les rafraîchissements du mur de flammes à partir de notre application. Nous allons donc devoir faire une modification dans le fichier canvasFire.js : Nous ajoutons une méthode rafraîchissement et nous supprimons l’appel au requestAnimationFrame : 

```javascript
    this.refresh = function(){
        update();
    }

    // main render loop
    var update = function()
    {
        smooth();
        draw();
        frames++;

        //requestAnimFrame(function() { update(); });
    };
```


### Etape 6 : Ajouter un cercle de feux

#### Principe

Le principe pour le mur de flamme est simple : Le projet html5-canvas-demo nous fournit un seul mur de flammes, hors nous, nous voulons 1 cercle. Nous allons nous y prendre en plusieurs étapes. 

1. Nous allons créer un mur de flammes sur chacun des axes cardinaux. De cette façon nous aurons des flammes partout autour de notre image
2. Nous allons ensuite mettre en place un masque ovale afin de restreindre la zone affichant les flammes
3. Nous allons faire tourner ces flammes pour leur donner plus de mouvement et se rapprocher du rendu du jeu Portal.
4. Enfin, nous allons autoriser une deuxième couleur car chaque portail possède sa propre couleur (bleu et orange)

Pour rappel, le projet initial fonctionne de la façon suivante : A chaque fois qu’il peut dessiner (window.requestAnimationFrame), on dessine une image de particules de flammes avec la méthode drawImage du context du canvas.

#### Flammes selon les axes cardinaux

Afin d’afficher les flammes selon les axes nous allons créer une fonction qui nous permet d’afficher pour un angle donné une image de flamme dans le fichier canvasFire.js.

```javascript
var drawAngle = function(angleDegree){
        var rad = angleDegree * Math.PI / 180;
        var fullWidth = width * scale;
        var fullHeight = height * scale;

        context.translate(fullWidth / 2, fullHeight / 2);
        context.rotate(rad);
        context.translate(-fullWidth / 2, -fullHeight / 2);
        var trY = Math.abs(Math.cos(rad))*((fullHeight - dims.height) / 2);
        context.translate(0,-trY);
        context.drawImage(buffer, 0, 0, width * scale, height * scale);
        // On doit revenir en arriere sur le mouvement pour traiter un nouvel angle
        context.translate(0,trY);
        context.translate(fullWidth / 2, fullHeight / 2);
        context.rotate(-rad);
        context.translate(-fullWidth / 2, -fullHeight / 2);
    }
```

Cette méthode fait donc une rotation du context du canvas avant de dessiner la flamme. Une des choses importante dans cette méthode est le retour à la position initiale !  C’est très important pour pouvoir traiter un nouvel angle ! 

Nous devons maintenant appeler cette méthode là où le drawImage d’origine était effectué à savoir dans la méthode “draw”. Le contenu de cette fonction sera donc maintenant le suivant : 

```javascript
    // draw colormap->palette values to screen
    var draw = function()
    {
        // render the image data to the offscreen buffer...
        bufferContext.putImageData(imageData, 0, 0);
        // ...then draw it to scale to the onscreen canvas
        // Image de base en bas !
 
        drawAngle(0);
        drawAngle(90);
        drawAngle(180);
        drawAngle(270);

    };
```

Il faut aussi ajouter les dimensions de l’image destination afin de calculer les bons angles.

```javascript
    var dims = {};
    
    this.canvas = undefined;

    this.init = function(dim)
    {
        context = this.canvas.getContext('2d');

        width = Math.round(this.canvas.width / scale);
        height = Math.round(this.canvas.height / scale);
        
        if (dim){
            dims = dim;
        }else{
            dims = {width: width, height : height};
        }

        colorMap = Array(width * height);

        for(var i = 0; i < colorMap.length; i++)
            colorMap[i] = 0;

        initPalette();
        initBuffer();

        update();
    };
```

Il faut enfin modifier la façon d’afficher les pixels afin de forcer un affichage de pixels transparents ! En effet, actuellement seul le dernier canvas est affiché. Il faut donc modifier la fonction drawPixel comme suit : 

```javascript
    // set pixels in imageData
    var drawPixel = function(x, y, color)
    {
        var offset = (x + y * imageData.width) * 4;
        imageData.data[offset] = color[0];
        imageData.data[offset + 1] = color[1];
        imageData.data[offset + 2] = color[2];
        if (color[0] <= 100 && color[1] === 0 && color[2] <= 100){
            imageData.data[offset + 3] = 0;
        }else{
            imageData.data[offset + 3] = 255;
        }
    };
```

Comme nous avons changé la méthode init de canvasFire.js. Nous devons donc changer l’appel à cette méthode dans app.js. Ainsi dans la méthode snapshot, il faut remplacer : 

```javascript
canvasDemo.init();
```

par 

```javascript
canvasDemo.init({width :minVideoWidth, height : idealHeight + 100});
```

On constate qu’on va bien afficher 4 murs de flammes autour de notre vidéo

#### Mise en place des masques

Dans l’application finale, la vidéo et les flammes sont dans un ovale. Nous allons utiliser pour ce faire une fonction des canvas : clip. Cette dernière nous permettra de définir une zone ovale dans le canvas et nous y dessinerons notre vidéo et nos flammes. Plus précisément, nous allons dessiner un ovale de flammes et par dessus, nous dessinerons un ovale contenant l’image de la vidéo. Voici donc la version presque finale de la méthode snaphot dans le fichier app.js

```javascript
function snapshot(){
    var canvasToUse = canvasRemoteElement;
    var contextToUse = ctxRemote;
    var videoToUse = remoteVideo;

    canvasRemoteElement.width = remoteVideo.videoWidth;
    canvasRemoteElement.height = remoteVideo.videoHeight;
    if (remoteStream){
        ctxRemote.drawImage(remoteVideo, 0,0);        
    }

    var delta = 50;
    var idealWidth = Math.min(canvasToUse.parentElement.clientWidth, videoToUse.videoWidth + 100);
    var minVideoWidth = Math.min(canvasToUse.parentElement.clientWidth - 50, videoToUse.videoWidth);
    var ratio = videoToUse.videoWidth / videoToUse.videoHeight;
    var idealHeight = Math.min(idealWidth / ratio, videoToUse.videoHeight);
    var useVideoWidth = idealWidth === videoToUse.videoWidth + 100;

    canvasToUse.width = idealWidth; 
    canvasToUse.height = canvasToUse.width;
    canvasToUse.style.top = ((canvasToUse.parentElement.clientHeight - canvasToUse.height) / 2)+"px";
    canvasToUse.style.left = ((canvasToUse.parentElement.clientWidth - canvasToUse.width) / 2)+"px";

    canvasFireElement.width = idealWidth;
    canvasFireElement.height = canvasFireElement.width;
    canvasFireElement.style.top = ((canvasToUse.parentElement.clientHeight - canvasFireElement.height) / 2)+"px";
    canvasFireElement.style.left = ((canvasToUse.parentElement.clientWidth - canvasFireElement.width) / 2)+"px";

    var refValue = idealWidth;
    if (localStream){
      if (!init 
          && canvasToUse.width == Math.round(refValue)
          && canvasToUse.height == Math.round(refValue)
          && canvasFireElement.width == Math.round(refValue)
          && canvasFireElement.height == Math.round(refValue)){

        if (canvasFireElement.width != 100){

          init = true;
          canvasDemo.canvas = document.getElementById('canvasFireLocalVideo');
          canvasDemo.init({width :minVideoWidth, height : idealHeight + 100});
        }
      }

      var deltaX = 0, deltaY = 0;
      


      ctxFire.save();
      ctxFire.beginPath();
      
      deltaX =  (canvasFireElement.width - minVideoWidth) / 2;
      deltaY =  (canvasFireElement.height- idealHeight) / 2;
      ctxFire.fillStyle = "rgba(0, 0, 0, 0)";
      drawEllipse(ctxFire, deltaX, deltaY, minVideoWidth, idealHeight);
      // Clip to the current path
      ctxFire.clip(); 
      // Undo the clipping
      if (init){
        canvasDemo.refresh();
      }
      ctxFire.restore();
     

      // Save the state, so we can undo the clipping
      contextToUse.save();
      contextToUse.beginPath();
      deltaX =  (canvasToUse.width - minVideoWidth +delta) / 2;
      deltaY =  (canvasToUse.height - idealHeight+delta) / 2;
      contextToUse.fillStyle = "rgba(0, 0, 0, 0)";
      drawEllipse(contextToUse, deltaX , deltaY, minVideoWidth-delta , idealHeight-delta);
      // Clip to the current path
      contextToUse.clip();
      contextToUse.drawImage(videoToUse,0,0, videoToUse.videoWidth, videoToUse.videoHeight, deltaX, deltaY, minVideoWidth, idealHeight);
      // Undo the clipping
      contextToUse.restore();
      
    }

    window.requestAnimationFrame(snapshot);
}
```

et il faut donc ajouter la fonction 

```javascript
function drawEllipse(ctx, x, y, w, h) {
  var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

  ctx.beginPath();
  ctx.moveTo(x, ym);
  ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  ctx.closePath();
  ctx.stroke();
}
```

On peut donc voir que l’on dessine des Ellipses dans lesquelles nous faisons nos affichages de flammes suivit de l’affichage de la vidéo 

#### Rotation des flammes

La gestion de la rotation des flammes se fait dans le fichier canvasFire.js. Tout à l’heure nous avons définit l’affichage du mur de flammes selon 4 axes cardinaux. Nous allons donc simplement faire évoluer ces angles au fil du temps pour mettre en place la rotation.

Commençons par ajouter de nouvelles variables globales : 

```javascript
    var timeOut = 7;
    var angleInc = 360 / (timeOut * 100);
    var angle = 0;
    var lastTime = 0;
```

et nous allons simplement mettre à jour le contenu de la fonction draw pour faire évoluer les angles : 

```javascript
    // draw colormap->palette values to screen
    var draw = function()
    {
        // render the image data to the offscreen buffer...
        bufferContext.putImageData(imageData, 0, 0);
        // ...then draw it to scale to the onscreen canvas
        // Image de base en bas !
 
        var timeStamp = new Date().getTime();
        angle += angleInc * ((lastTime - timeStamp) / 100);
        angle = angle % 360;
        lastTime = timeStamp;

        drawAngle(angle);
        drawAngle(angle+90);
        drawAngle(angle+180);
        drawAngle(angle+270);

    };
```

Maintenant notre cercle de flamme évolue en tournant

#### Ajout d’une autre couleur

Afin de compléter comme il se doit notre portal, nous devons donc ajouter une deuxième couleur ! Dans le fichier canvasFire.js la définition de la couleur utilisée se fait dans la méthode initPalette();

```javascript
    // init palette from warm to white hot colors
    var initPalette = function()
    {
        palette = Array(256);

        for(var i = 0; i < 64; i++)
        {
            if (color === 'red'){
                palette[i] = [(i << 2), 0, 0];
                palette[i + 64] = [255, (i << 2), 0];
                palette[i + 128] = [255, 255, (i << 2)];
                palette[i + 192] = [255, 255, 255];
            }else if (color === 'blue') {

                palette[i] = [0, 0, (i << 2)];
                palette[i + 64] = [0, (i << 2), 255];
                palette[i + 128] = [0, 128, 100+(i << 2)];
                palette[i + 192] = [0, 128, 255];
            }
        }
    };
```

Et nous allons donc modifier son appel dans la méthode init et ajouter la variable globale color.

```javascript
    var color = 'red';    

    this.init = function(colorToApply, dim)
    {
        if (colorToApply){
            color = colorToApply;
        }
        context = this.canvas.getContext('2d');

        width = Math.round(this.canvas.width / scale);
        height = Math.round(this.canvas.height / scale);
        
        if (dim){
            dims = dim;
        }else{
            dims = {width: width, height : height};
        }

        colorMap = Array(width * height);

        for(var i = 0; i < colorMap.length; i++)
            colorMap[i] = 0;

        initPalette();
        initBuffer();

        update();
    };
```

Comme vous le constatez, nous avons fait évolué la signature de la méthode init. Ceci veut dire que nous allons faire notre ultime modification dans le fichier app.js dans la méthode snapshot(). Nous allons remplacer : 

```javascript
canvasDemo.init({width :minVideoWidth, height : idealHeight + 100});
```

par : 

```javascript
canvasDemo.init(isInitiator ? 'red' : 'blue', {width :minVideoWidth, height : idealHeight + 100});
```

Nous en avons fini avec le code ! 

### Etape 7 : Fin 

Il ne vous reste plus qu’à projeter le résultat de l’application sur 2 murs différents avec une webcam de chaque côté pour filmer le tout ! 

## Crédits : 
Tout le code source est disponible ici : [https://github.com/GDG-Nantes/portal-devfest-2013](https://github.com/GDG-Nantes/portal-devfest-2013)



<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="text/javascript" src="/assets/2015-07-PortalWebRTC/portal-custo.js"></script>
