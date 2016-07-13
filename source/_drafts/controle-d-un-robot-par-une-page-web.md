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

# Rappels du fonctionnement d'un appareil bluetooth low energy

Voici un petit rappel sur le fonctionnement d'un appareil Bluetooth Low Energy.

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/ble_hierarchy.jpg">
</div>

Un appareil via un **serveur** bluetooth va exposer un ensemble de **services**. Chaque service va lui même exposer des **charactéristiques** sur lesquelles on pourra lire / écrire / s'abonner. L'appareil, les services et les charactérisques sont identifiées par un **UUID** qui est unique.

# Hack du protocol

Afin de savoir quels services je devais appeler et quel type de données, je devais transféré, je me suis lancé dans une opération de "reverse engineering" du mBot pour comprendre comment l'utiliser. Je me suis appuyer sur cet article : [Reverse Engineering a Bluetooth Low Energy Ligth Bulb](https://learn.adafruit.com/reverse-engineering-a-bluetooth-low-energy-light-bulb/) qui m'a grandement aidé et je vous conseille de le lire car il rentre en détail dans les étapes à suivre pour Hacker un protocole.

Je me contenterais ici de simplement lister les étapes principales à suivre et les résultats que j'ai obtenir.

## 0. Avoir un téléphone Android

Le téléphone Android est obligatoire car nous allons analyser les trames bluetooth émises par l'application officielle [Mbot](https://play.google.com/store/apps/details?id=cc.makeblock.mbot). La possibilité de "sniffer" les trames bluetooth est disponible depuis Android 4.4. 


## 1. Préparation du téléphone

Il faut installer l'application Mbot précédement citée et aussi l'application [nRF Connect for Mobile](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp&hl=en). Cette dernière va nous permettre d'analyser les services disponibles et ainsi de connaitre les bons UUID à cibler.

## 2. Détection des services  

A l'aide nRF, je me suis connecté à mon mBot : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/nrf_devices.png">
</div>

J'ai ensuite analysé les services bluetooth qui étaient disponibles : 

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/nrf_service_1.png">
</div>

On peut voir que les UUID des services sont disponibles. Seulement à ce moment là, je ne sais pas lequel choisir. Il faut donc cliquer sur les 2 services pour analyser leurs caractéristiques.

<div style="text-align:center; width:100%;">
    <img src="/assets/2016-07-Mbot/nrf_service_2.png">
</div>

En regardeant les flèches sur la droite. On comprend facilement que le premier service expose une caractéristique en mode "notification" et une caractéristique en mode écriture. J'ai donc supposé que les UUID qui m'intéressaient étaient  : 

* Le Service avec l'UUID : **0000ffe1-0000-1000-8000-00805f9b34fb**
* La caractéristique avec l'UUID : **0000ffe3-0000-1000-8000-00805f9b34fb**

J'ai aussi noté que le nom de mon appareil était "**Makeblock_LE**"


## 3. Ecoute des trames

Il faut maintenant configurer son téléphone pour écouter les trames Bluetooth : **Paramètres->Options de développement->Journal snoop HCI Bluetooth**

Le fait d'activer cette option fait que le téléphone va écrire dans un fichier de log les trames bluetooth. Sur mon nexus le fichier est disponible sous `/sdcard/btsnoop_hci.log` mais sous mon galaxy, le fichier est disponible sous `/sdcard/Android/data/btsnoop_hci.log`

## 4. Générer les fichiers de logs

Afin de comprendre et analyser au mieux les trames j'ai procédé par étape. En effet, j'ai généré plusieurs fichiers de logs afin d'isoler les instructions envoyées. 

Voici par exemple des fichiers de logs générés : 

* Logs des moteurs : [btsnoop_hci_motor.log](/assets/2016-07-Mbot/btsnoop_hci_motor.log)
* Logs des leds RGB : [btsnoop_hci_rbg.log](/assets/2016-07-Mbot/btsnoop_hci_rgb.log)

## 5. Analyse des trames

Afin d'analyser les trames, je me suis servit de [WireShark](https://www.wireshark.org/).

J'ai donc injecté mes fichiers dans le logiciels pour faire ressortir les trames qui m'intéressait. Contrairement à l'exemple fournit sur l'article de reverse engineering. Les instructions envoyées ne sont pas des instructions BLE mais bluetooth classiques. Heuresement pour moi, les instructions restent les mêmes.

J'ai aussi eu la chance que le code soit disponible en open source. Ceci m'a permis d'être sur des instructions à regarder et de comment les interpréter. J'ai pris pour exemple l'application android : [MeModule.java](https://github.com/Makeblock-official/Makeblock-App-For-Android/blob/master/src/cc/makeblock/modules/MeModule.java)

## 6. Catalogue des instructions

Voici ce que j'ai pu comprendre. Une instructions bluetooth du Mbot doit respecter le format suivant : 

```javascript
 /*
ff 55 len idx action device port  slot  data a
0  1  2   3   4      5      6     7     8
*/
```

Chaque message fait 12 bytes à répartir comme suit : 

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



# Fonctionnement de l'api 

faire la détection générique d'appareils

# Subtilité de l'écriture


# Résultat

vidéo + lien vers l'app


<script type="text/javascript" src="/assets/js_helper/jef-binomed-helper.js"></script>
<script type="text/javascript" src="/assets/2015-07-PortalWebRTC/portal-custo.js"></script>
