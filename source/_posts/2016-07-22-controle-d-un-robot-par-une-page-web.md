title: "Contrôle d'un robot par une page web"
tags:
  - Chrome
  - WebBluetooth
  - HTML5
  - Bluetooth 4.0
category:
  - Tech
toc: false
date: 2016-07-22 10:31:34
---


J'ai acheté pour ma fille il y a quelque temps ce robot : [MBot](http://makeblock.com/mbot-stem-educational-robot-kit-for-kids/). C'est un robot basé sur un shield Arduino et pouvant être programmé via [Scratch](https://scratch.mit.edu/). Le modèle que j'ai choisi est celui avec la version Bluetooth, car je savais que cela allait me laisser plus de possibilités pour le hacker plus tard.

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/mbot-blue-pink-.jpg">
</div>


Il y a environ un an, j'ai aussi appris l'existence de deux APIs : 

* L'[API WebBluetooth](https://github.com/WebBluetoothCG/web-bluetooth#web-bluetooth). Cette API permet de contrôler un appareil Bluetooth Low Energy (BLE) depuis une page web ! 
* Le [Physical Web](https://google.github.io/physical-web/). 

Je me suis donc posé la question suivante : et si je pouvais enrichir mon Mbot pour qu'il me propose d'interagir avec lui mais sans que j'ai d'application à installer. C'est ce que nous allons voir dans cet article !

# Physical Web

Prenez un périphérique BLE. Faites lui émettre une URL avec la norme [EddyStone](https://github.com/google/eddystone). Vous obtiendrez un appareil Physical Web !

Le principe du Physical Web est très simple. Il s'agit juste d'un appareil BLE qui émet une URL. Vous pouvez le comparer grossièrement à un QR Code sauf que ce dernier est Bluetooth.

## Comment ça marche ?

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/Principe_PhysicalWeb.jpg">
</div>


1. L'appareil doit émettre une trame [EddyStone URL](https://github.com/google/eddystone/tree/master/eddystone-url) de façon à ce que votre téléphone puisse la capter. 
2. Le navigateur du téléphone (ou une application compatible Physical Web) va interroger son serveur pour vérifier si l'URL exposée est une URL blacklistée.
3. Le serveur va interroger la page.
4. Les métas données sont renvoyés au serveur.
5. Le serveur va pouvoir répondre au téléphone pour que ce dernier affiche une notification sur le téléphone.

Voici à quoi ressemble une notification Physical Web : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/physical_web_android_res.png">
</div>


## Quel intérêt par rapport à un QR Code ?

En fait les intérêts sont nombreux : 

* C'est aussi simple d'utilisation qu'un QR Code et ça permet plus !
* Contrairement à un QR Code, aucune application n'a besoin  d'être installée pour capter la balise si ce n'est votre navigateur.
* Les sites malveillants ne seront pas exposés au public car ils auront été filtrés par le serveur.
* L'appareil qui émet l'URL pourra interagir avec le téléphone une fois que l'on y sera connecté.
* On pourra mettre à jour l'URL de l'appareil si on le souhaite contrairement à un QR Code.
* Les notifications sont silencieuses !  En effet, ce n'est pas parce que l'on est proche d'un appareil Physical Web que notre téléphone va passer son temps à sonner. L'utilisateur ne verra la notification que si ce dernier regarde les notifications de son téléphone !

# Rappel sur le fonctionnement d'un appareil Bluetooth Low Energy

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/ble_hierarchy.jpg">
</div>

Un appareil via un **serveur** Bluetooth va exposer un ensemble de **services**. Chaque service va lui-même exposer des **caractéristiques** sur lesquelles on pourra lire / écrire / s'abonner. L'appareil, les services et les caractéristiques sont identifiées par un **UUID** qui est unique.

Maintenant que la partie théorie est passée, nous allons nous intéresser à notre cas d'utilisation : le Mbot.

# Hack du protocole du Mbot

Afin de savoir quels services je dois appeler et quel type de données je dois transférer, je me suis lancé dans une opération de "reverse engineering" du Mbot pour comprendre comment l'utiliser. Je me suis appuyé sur cet article : [Reverse Engineering a Bluetooth Low Energy Ligth Bulb](https://learn.adafruit.com/reverse-engineering-a-bluetooth-low-energy-light-bulb/) qui m'a beaucoup aidé. Je vous conseille de le lire car il rentre un peu plus en détail que moi sur les étapes à suivre pour Hacker un appareil BLE.

Je me contenterais ici de simplement lister les étapes principales que j'ai suivies et les résultats que j'ai obtenus.

## 0. Avoir un téléphone Android 4.4+

Le téléphone Android est obligatoire car nous allons analyser les trames Bluetooth émises par l'application officielle [Mbot](https://play.google.com/store/apps/details?id=cc.makeblock.mbot). La fonctionnalité qui permet de "sniffer" les trames Bluetooth n'est disponible que depuis Android 4.4. 


## 1. Préparation du téléphone

Il faut installer l'application Mbot et aussi l'application [nRF Connect for Mobile](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp&hl=en). Cette dernière va nous permettre de connaître les services disponibles et donc de trouver les bons UUIDs.

## 2. Détection des services  

À l'aide nRF, je me suis connecté à mon Mbot : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/nrf_devices.png">
</div>

J'ai ensuite analysé les services Bluetooth qui étaient disponibles : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/nrf_service_1.png">
</div>

On peut voir que les UUID des services sont disponibles. À ce moment-là, je ne sais pas lequel choisir. Il faut donc cliquer sur les deux services pour analyser leurs caractéristiques.

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/nrf_service_2.png">
</div>

En regardant les flèches sur la droite. On comprend facilement que le premier service expose une caractéristique en mode "notification" et une caractéristique en mode "écriture". J'ai donc supposé que les UUID qui m'intéressaient étaient : 

* Le Service avec l'UUID : **0000ffe1-0000-1000-8000-00805f9b34fb**
* La caractéristique avec l'UUID : **0000ffe3-0000-1000-8000-00805f9b34fb**

J'ai aussi noté que le nom de mon appareil était "**Makeblock_LE**"


## 3. Écoute des trames

Il faut maintenant configurer son téléphone pour écouter les trames Bluetooth : **Paramètres->Options de développement->Journal snoop HCI Bluetooth**

Le fait d'activer cette option fait que le téléphone va écrire dans un fichier de log les trames Bluetooth. Sur mon Nexus le fichier est disponible sous `/sdcard/btsnoop_hci.log` mais sous mon Galaxy, le fichier est disponible sous `/sdcard/Android/data/btsnoop_hci.log`

## 4. Générer les fichiers de logs

Afin de comprendre et analyser au mieux les trames, j'ai procédé par étapes. J'ai ainsi généré plusieurs fichiers de logs afin d'isoler les instructions envoyées. 

Voici par exemple, des fichiers de logs générés : 

* Logs des moteurs : [btsnoop_hci_motor.log](/assets/2016-07-Mbot/btsnoop_hci_motor.log)
* Logs des leds RGB : [btsnoop_hci_rbg.log](/assets/2016-07-Mbot/btsnoop_hci_rgb.log)

## 5. Analyse des trames

Afin d'analyser les trames, je me suis servi de [WireShark](https://www.wireshark.org/).

J'ai ensuite injecté mes fichiers dans WireShark pour faire ressortir les trames qui m'intéressaient. Contrairement à l'exemple fourni sur l'article de "reverse engineering". Les instructions envoyées ne sont pas des instructions BLE mais Bluetooth classiques. Heureusement pour moi, les instructions binaires restent les mêmes.

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/wireshark.png">
</div>

J'ai aussi eu la chance que le Mbot soit un projet open source. Ça m'a permis d'être sur des instructions à regarder et comment les interpréter. J'ai pris pour exemple l'application Android : [MeModule.java](https://github.com/Makeblock-official/Makeblock-App-For-Android/blob/master/src/cc/makeblock/modules/MeModule.java)

## 6. Catalogue des instructions

Voici ce que j'ai pu comprendre. Une instruction Bluetooth du Mbot doit respecter le format suivant : 

```javascript
 /*
ff 55 len idx action device port  slot  data a
0  1  2   3   4      5      6     7     8
*/
```

Chaque message fait 13 bytes à répartir comme suit : 

```javascript
var byte0 = 0xff, // Static header
    byte1 = 0x55, // Static header
    byte2 = 0x09, // len
    byte3 = 0x00, // idx
    byte4 = 0x02, // action
    byte5 = type, // device
    byte6 = port, // port
    byte7 = slot; // slot
//dynamics values
var byte8 = 0x00, // data
    byte9 = 0x00, // data
    byte10 = 0x00, // data
    byte11 = 0x00; // data
//End of message
var byte12 = 0x0a,
```



# Fonctionnement de l'API 

Maintenant que nous savons comment contrôler notre robot, il nous faut nous intéresser à l'API WebBluetooth.

Avant toute chose, cette API est encore expérimentale et il faut encore l'activer dans Chrome : [enable-web-bluetooth](chrome://flags/#enable-web-bluetooth). Elle fonctionne sous Linux / Chrome OS / Mac / Android 6- (Chromium) / Android 6+ (Chrome). Veuillez vous référer à cette page pour savoir ce qui est compatible : [Tableau de compatibilité](https://github.com/WebBluetoothCG/web-bluetooth/blob/gh-pages/implementation-status.md)

Pour accéder à un appareil Bluetooth, il faut passer par plusieurs étapes : 

1. Rechercher l'appareil
2. Se connecter 
3. Récupérer le service
4. Récupérer la caractéristique
5. Écrire / Lire

Toute l'API du WebBluetooth fonctionne sur des promesses. Chaque appel à l'API renverra une promesse.

## Rechercher l'appareil

```javascript
let options = {
    "filters": [{
        "name": "Makeblock_LE"
    }],
    "optionalServices": ["0000ffe1-0000-1000-8000-00805f9b34fb"]
};
navigator.bluetooth.requestDevice(options)
    .then(device => {
        return device;
});
```

En précisant le nom du service dans le champ `optionalServices`, je pourrais me connecter au service. En effet, si on ne précise pas le nom du service, on ne pourra pas s'y connecter par la suite.

## Connexion à l'appareil

```javascript
device.gatt.connect()
.then(server=>{
    return server;
})
```

Une fois connecté, nous récupérerons un serveur qui nous permettra de récupérer le service.

## Récupération du service

Deux possibilités s'offrent à nous pour nous connecter à notre service :  Depuis l'objet `device` ou à partir du serveur récupéré lors de la connexion.

```javascript
// A partir du serveur
device.gatt.connect()
.then(server=>{
    return server.getPrimaryService('UUID_Service');
})
.then(service=>{
    return service
});

// A partir du device (on doit s'être connecté préalablement)
device.gatt.getPrimaryService('UUID_Service')
.then(service=>{
    return service
})
```

**/!\ Le UUID Service doit respecter le format suivant : `0000ffe1-0000-1000-8000-00805f9b34fb`. En effet, `0000ffe100001000800000805f9b34fb` ne sera pas reconnu. Il est donc important lors des connexions de faire attention à ça !**

## Caractéristiques

La caractéristique doit se récupérer sur l'objet service

```javascript
// A partir du gatt (on doit s'être connecté préalablement)
service.getCharacteristic('UUID_Char')
.then(characteristic=>{
    return characteristic
})
```

## Lecture / Ecriture / Abonnement

On va pouvoir interagir de 3 façons avec une caractéristique : 


```javascript
// Lecture
characteristic.readValue()
.then(value=>{
    return value
})

// Ecriture
characteristic.writeValue(bufferValue)
.then(_=>{})

// Notification start
characteristic.startNotifications().then(_=>{
    characteristic.addEventListener('characteristicvaluechanged', callback);
})
// Notification stop
characteristic.stopNotifications().then(_=>{
    characteristic.removeEventListener('characteristicvaluechanged', callback);
})
```


## Helper 

Tout ce code peut être généré grâce à [François Beaufort](https://plus.google.com/u/0/+FrancoisBeaufort) qui a mis à disposition un générateur [WebBluetoothGenerator](http://beaufortfrancois.github.io/sandbox/web-bluetooth/generator/)

## Attention aux données

Les données manipulées sont des données binaires. Il convient donc de faire les transformations nécessaires pour lire / écrire correctement. Pour les données textuelles il faut utiliser les objets `TextEncoder` et `TextDecoder` pour encoder et décoder correctement vos données !

## Démo

Voici un exemple de lecture des caractéristiques de n'importe quel appareil : 

<button>Get Bluetooth Device Information Characteristics</button>

<h3>Live Output</h3>
<div id="output" class="output">
  <div id="content"></div>
  <div id="status"></div>
  <div id="log"></div>
</div>

<i> Ce code est extrait du [Device Information Characteristics Sample](https://googlechrome.github.io/samples/web-bluetooth/device-information-characteristics.html)</i>

# Contrôle du Mbot

Maintenant que l'on a vu comment manipuler l'API, nous allons essayer de passer les instructions à notre robot pour l'animer.

## Rappel sur le protocole du Mbot

Pour rappel, le Mbot répond aux contraintes suivantes : 

* Nom : **Makeblock_LE**
* Service : **0000ffe1-0000-1000-8000-00805f9b34fb**
* Caractéristique : **0000ffe3-0000-1000-8000-00805f9b34fb**
* Format d'échange : 

```javascript
/*
ff 55 len idx action device port  slot  data a
0  1  2   3   4      5      6     7     8
*/
```

## Comment donner à manger des données qui sont déjà binaires ?

Quand on regarde le format des instructions Bluetooth, on se rend compte qu'on ne manipule pas ici des chiffres ou des chaines de caractères mais bel et bien une instruction binaire. Comment faire pour que cette donnée soit transférée correctement au Mbot ?

C'est très simple, la fonction `writeValue` d'une caractéristique attend un buffer et on va lui donner des données binaires. 

Prenons en exemple l'instruction suivante : `ff:55:09:00:02:0a:09:64:00:00:00:00:0a` Il s'agit d'une instruction moteur qui fait 13 bytes. Le buffer étant **une puissance de 2**, il va falloir compléter le buffer avec des 0 et ainsi préparer un buffer de **16 bytes**.

Une des subtilités de l'utilisation d'un buffer est qu'il faut inverser par paire les bytes à envoyer, sinon la donnée n'est pas reçue dans l'ordre ! Ainsi pour envoyer `ff:55:09:00:02:0a:09:64:00:00:00:00:0a` , je me retrouve à envoyer quelque chose comme ça : `0x55ff;0x0009;0x0a02;0x0964;0x0000;0x0000;0x000a;0x0000;`

Voici donc le code associé à l'écriture de l'instruction précédente : 

```javascript
// UUIDs
var SERVICE_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb";
var CHAR_UUID = "0000ffe3-0000-1000-8000-00805f9b34fb";

// Static values
var buf = new ArrayBuffer(16);
var bufView = new Uint16Array(buf);

var byte0 = 0xff, // Static header
    byte1 = 0x55, // Static header
    byte2 = 0x09, // len
    byte3 = 0x00, // idx
    byte4 = 0x02, // action
    byte5 = 0x0a, // device
    byte6 = 0x09, // port
    byte7 = 0x64; // slot
//dynamics values
var byte8 = 0x00, // data
    byte9 = 0x00, // data
    byte10 = 0x00, // data
    byte11 = 0x00; // data
//End of message
var byte12 = 0x0a,
    byte13 = 0x00,
    byte14 = 0x00,
    byte15 = 0x00;

// Gestion de l'inversion par paire des bytes
bufView[0] = byte1 << 8 | byte0;
bufView[1] = byte3 << 8 | byte2;
bufView[2] = byte5 << 8 | byte4;
bufView[3] = byte7 << 8 | byte6;
bufView[4] = byte9 << 8 | byte8;
bufView[5] = byte11 << 8 | byte10;
bufView[6] = byte13 << 8 | byte12;
bufView[7] = byte15 << 8 | byte14;   

// Envoie des données
device.gatt.getPrimaryService(SERVICE_UUID)
.then(service=>service.getCharacteristic(this.config.charateristic()))
.then(characteristic => characteristic.writeValue(buf));
```

# Résultat

Voici le résultat en vidéo

<iframe width="560" height="315" src="https://www.youtube.com/embed/j7VDRXxgqRE" frameborder="0" allowfullscreen></iframe>

Vous pouvez accéder à l'application à l'adresse suivante : [App Mbot-WebBluetooth](https://jef.binomed.fr/mbot-webbluetooth) (/!\ à bien avoir configuré son navigateur pour autoriser le web-bluetooth)

# Crédits

Le code source du projet est disponible ici : [Mbot-webbluetooth](https://github.com/binomed/mbot-webbluetooth/blob/master/index.html)


<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="text/javascript" src="/assets/2016-07-Mbot/mbot.js"></script>
