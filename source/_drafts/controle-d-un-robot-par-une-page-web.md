title: "Controle d'un robot par une page web"
tags:
  - Chrome
  - WebBluetooth
  - HTML5
  - Bluetooth 4.0
category:
  - Tech
toc: false
---

J'ai acheté pour ma fille il y a quelques temps ce robot : [MBot](http://makeblock.com/mbot-stem-educational-robot-kit-for-kids/). C'est un robot basé sur un shield Arduino et permettant de se programmer via le célèbre logiciel [Scratch](https://scratch.mit.edu/). 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/mbot-blue-pink-.jpg">
</div>


Le modèle que j'ai choisi est celui avec la version bluetooth car je savais que cela allait me laisser plus de possibilités pour jouer avec.

Il y a peu moins d'un an, j'ai appris l'existence de l'[API WebBluetooth](https://github.com/WebBluetoothCG/web-bluetooth#web-bluetooth). Cette api permet de contrôler un appareil Bluetooth Low Energy depuis une page web ! 

A peu près au même moment, j'ai entendu parlé du [Physical Web](https://google.github.io/physical-web/). 

Je me suis donc posé la question suivante : Et si je pouvais enrichir mon Mbot pour qu'il me propose d'intéragir avec lui mais sans que j'ai d'application à installer ? C'est ce que nous allons voir dans cet article !

# Physical Web

Prenez un périphérique bluetooth low energy. Fait lui émettre une url avec la norme [EddyStone](https://github.com/google/eddystone). Vous obtiendrez un device Physical Web !

Le principe du Physical Web est très simple. Il s'agit juste d'un appareil BLE qui emet une URL. Vous pouvez le comparer grossièrement à un QR Code sauf que ce dernier est bluetooth.

## Comment ça marche ?

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/Principe_PhysicalWeb.jpg">
</div>


1. L'appareil doit emmettre une trame [EddyStone Url](https://github.com/google/eddystone/tree/master/eddystone-url) de façon à que votre téléphone puisse le capter. 
2. Le navigateur du téléphone (ou une application compatible Physical Web) va intérroger son serveur pour vérifier si l'url exposée est une url blacklistée.
3. Le serveur va intéroger la page.
4. Les méta données sont renvoyées au serveur
5. Le serveur va pouvoir répondre au téléphone pour que ce dernier affiche une notification sur le téléphone

Voici à quoi ressemble une notification Physical Web : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/physical_web_android_res.png">
</div>


## Quel est l'intérêt du coup par rapport à un QR Code ?

En fait les intérêts sont nombreux : 

* C'est aussi simple d'utilisation qu'un QR Code et ça permet plus !
* Contrairement à un QR Code, aucune application n'a besoin  d'être installée pour capter l'appareil si ce n'est votre navigateur.
* Les sites malveillants ne seront pas exposés au public car ils auront été filtré par le serveur.
* L'appareil qui emet l'url pourra intéragir avec le téléphone une fois que l'on s'y sera connecté.
* On pourra mettre à jour l'url de l'appareil si on le souhaite contrairement à un QR Code.
* Les notifications sont silencieuses !  En effet, ce n'est pas par ce que l'on est proche d'un appareil que notre téléphone va passer son temps à sonner. L'utilisateur ne verra la notification que si ce dernier regarde les notifications de son téléphone !

# Principe du bluetooth low energy

# Hack du protocol

cf article

# Fonctionnement de l'api 

faire la détection générique d'appareils

# Subtilité de l'écriture


# Résultat

vidéo + lien vers l'app


<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="text/javascript" src="/assets/2015-07-PortalWebRTC/portal-custo.js"></script>
