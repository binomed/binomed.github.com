title: Myo sous linux
tags:
  - myo
  - linux
category:
  - Tech
date: 2015-12-11 21:59:15
---


![](/assets/2015-12-MyoLinux/myo_logo.png)

Cette semaine à SQLI, lors d'une soirée Hack, j'ai eu l'occasion de prendre le temps pour faire un truc que j'aurais dû faire depuis bien longtemps à savoir : Faire marcher mon bracelet [Myo](https://www.myo.com/) sous Linux ! 


# PyoConnect

Les développeurs de Myo, n'ont pas encore pris le temps de développer le sdk pour Linux ni l'application de gestion MyoConnect. Heureusement la communauté est là ! Un développeur (Fernando Cosentino) a développé une solution basée sur Python nous permettant de contrôler notre Myo en simulant le SDK officiel [LUA](http://www.lua.org/) sous Linux !

Le projet est disponible ici : http://www.fernandocosentino.net/pyoconnect/

# Installation 

L'installation est très simple à effectuer

```sh
// plug bluetooth adapter
// permission to ttyACM0 - must restart linux user after this
sudo usermod -a -G dialout $USER

// dependencies
sudo apt-get install python-pip
sudo pip install pySerial --upgrade
sudo pip install enum34
sudo pip install PyUserInput
sudo apt-get install python-Xlib
sudo apt-get install python-tk

// now reboot
```


Une fois cette installation faite, il vous faut télécharger le zip contenant le script python : [PyoConnect V2.0](http://www.fernandocosentino.net/pyoconnect/PyoConnect_v2.0.zip)

Vous pouvez le dezziper où bon vous semble car après ce répertoire sera votre point de départ. Nous allons appeler le chemin vers ce répertoire : `$PYO_PATH` pour le reste de l'article

# Lancement

Il ne nous reste plus qu'à lancer le script afin de voir ce que cela donne :)

1. Branchez votre dongle bluetooth Myo
2. Vérifiez que votre Myo est bien allumé
3. Tapez : 


```sh
// Aller dans le répertoire de Pyo Connect
cd $PYO_PATH
// Lancez le script python
python PyoManager.pyc
```

à partir de là, une fenêtre se lance : 

![](/assets/2015-12-MyoLinux/pyoconnect_manager.png)

Vous aurez donc la possibilité de vous connecter ou vous déconnecter à votre Myo. La connexion vous permet de démarrer les scripts qui sont sur ON. 

Dans l'exemple précédent, par défaut, le module de prise en main de LibreOffice Impress est actif.

Si vous cliquez sur Disconnect, votre Myo rentrera en veille prolongée au bout de 3 minutes. J'ai demandé au développeur s'il ne pouvait pas mettre à disposition le "Turn Off" mais il m'a répondu que pour l'instant, ça ne fait pas partie de sa roadmap.

# Comment aller plus loin ?

C'est bien beau tout ça, mais si j'ai envie d'avoir un contrôle un peu plus poussé de certaines de mes applications comment je dois procéder ?

## Gestion des scripts

Le développeur à prévu les choses simplement. En effet, pour ajouter des fonctionnalités à son manager, il vous suffit simplement d'ajouter un script pyhton répondant au sdk lua de Thalmic dans le répertoire "scripts" de  `$PYO_PATH`

Ainsi, au prochain démarrage, vous aurez la possibilité de démarrer ou arrêter votre Myo ! That's all falks ! 

## Surcouche Python

Le développeur à pensé a tout en nous mettant à disposition le SDK de Myo via Python : 

1. C'est du coup très rapide d'écrire du code pour contrôler des éléments. Et accessoirement, ça tourne aussi sous windows & mac ;)
2. On voit que l'équipe de Thalmic a vraiment bien bossé en mettant une grosse couche d'abstraction sur la complexité du Myo.

Voici par exemple ce qu'il est possible de faire : 

* Identifier la fenêtre à l'écran et n'activer le script que dans cette fenêtre
* Action avec la souris : 
    - Déplacement de la souris
    - Clic Droit
    - Clic Gauche
* Actions claviers : 
    - Émission d'une touche selon 3 états : Down / Up / Press (down & up rapidement)
    - Gestion des touches de type SHIFT / CTRL, pour pouvoir gérer les combinaisons de touches.
* Actions sur le Myo : 
    - Connexion / Déconnexion
    - Vibration 
    - Récupération des métriques liées au Myo : Yaw / Pitch / Roll / ....

Cerise sur le gâteau il a même ajouté des méthodes qui ne sont pas présentes dans le SDK Lua. Je vous conseille d'aller voir la partie "Library Documentation" sur le site officiel de PyoConnect pour prendre connaissance de ces ajouts : http://www.fernandocosentino.net/pyoconnect/

Il y a juste quelques méthodes qui à l’opposé ne sont pas implémentées. Ceci est bien expliqué à la fin de sa documentation.


# Contrôle de présentation HML5

Du coup, passé cette première lecture, je me suis lancé dans mon premier script : Contrôle de mes présentations HTML5 par le bracelet. Le "use case" est vraiment très simple : 

1. je veux délocker mon Myo sur la gestion `doubleTap`
2. Une fois ce dernier délocker, je veux passer mes slides avec cette même gesture.
3. Enfin, je veux pouvoir locker le Myo sur la gesture `fist`.


```python
scriptTitle = "KeyBoard"
scriptDescription = "Keyboard Control"


def onUnlock():
    myo.unlock("hold")
    print("Unlock ! ")

def onLock():
    print("Lock ! ")
    
def onPoseEdge(pose, edge):
    if (edge == "on"):  
        print(pose)
    if (pose == 'doubleTap') and (edge == "on"): 
        myo.keyboard("right_arrow","press","")
    if (pose == 'fist') and (edge == "on"):
        myo.lock()
```

Voici ce qu'on peut retenir de ce script


```python
scriptTitle = "KeyBoard"
scriptDescription = "Keyboard Control"
```

Je spécifie son nom tel qu'il apparaîtra dans le manager PyoConnect


```python
def onUnlock():
    myo.unlock("hold")
    print("Unlock ! ")
```

Quand le Myo passe en Unlock, je lui demande de le rester (car sinon, je pourrais lui demander de se locker automatiquement en fonction d'un certain temps)


```python
def onPoseEdge(pose, edge):
    if (edge == "on"):  
        print(pose)
    if (pose == 'doubleTap') and (edge == "on"): 
        myo.keyboard("right_arrow","press","")
    if (pose == 'fist') and (edge == "on"):
        myo.lock()
```

Enfin, je gère les poses Myo pour correspondre à mon besoin. Le Edge correspond à l'état de détection de la pose par le Myo : 

* on : la gesture commence
* off : la gesture se termine


Je pense qu'il faut que je joue encore un peu avec ce script mais globalement, il répond bien à mon besoin de simplement passer des slides.

Je tacherais de publier des scripts un peu plus pousser prochainement ;)

# Pour aller encore plus loin 

Si vous êtes intéressés par le développement Myo, je vous conseille de suivre le blog de Thalmic : http://developerblog.myo.com/