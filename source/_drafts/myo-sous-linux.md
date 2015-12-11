title: Myo sous linux
tags:
---

Cette semaine à SQLI, lors d'une soirée Hack, j'ai eu l'occasion de prendre le temps pour faire un truc que j'aurais du faire depuis bien longtemps à savoir : Faire marcher mon bracelet [https://www.myo.com/](Myo) sous Linux ! 

# PyoConnect

Les développeurs de Myo, n'ont pas encore pris le temps de dévopper le sdk pour linux ni l'application de gestion MyoConect. Heureusement la communauté est là et un développeur (Fernano Cosentino) a développé basée sur Python nous permettant de contrôler notre myo en simulant le SDK officiel sous linux !

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


Une fois cette installation faite, il vous télécharger le zip contenant le script python : [http://www.fernandocosentino.net/pyoconnect/PyoConnect_v2.0.zip](PyoConnect V2.0)

Vous pouvez le dezziper où bon vous semble car après ce répertoire sera votre point de départ. Nous allons appeler le chemin vers ce répertorie : **$PYO_PATH** pour le reste de l'article

# Lancement

Il ne nous reste plus qu'à lancer le script afin de voir ce que celà donne :)

1. Branchez votre dongle bluetooth myo
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

vous aurez donc la possibilité de vous connecter ou vous déconnecter à votre Myo. La connection vous permet de démarer les scripts qui sont sur ON avec les bons événements du SDK. 

Dans l'exemple précédent, par défaut, le module de prise de main de LibreOffice Impress est actif.

Si vous cliquez sur Disconnect, votre myo rentrera en veille prolongée au bout de 3 minutes. J'ai demandé au développeur s'il ne pouvait pas mettre à disposition le "Turn Off" mais il m'a répondu que pour l'instant, ça ne fait pas parti de sa roadmap.

# Comment aller plus loin ?

C'est bien beau tout ça, mais si j'ai envie d'avoir un contrôle un peu plus poussé de certaines de mes applications comment je dois procéder ?

## Gestion des scripts

Le développeur à prévu les choses simplement. En effet, pour ajouter des fonctionnalités à son manager, il vous simplement d'ajouter un script pyhton répondant au sdk lua de Thalmic dans le répertoire "scripts" de  **$PYO_PATH**

Ainsi, au prochain démarage, vous aurez la possibiltié de démarer ou arrêter votre script ! That's all falks ! 

## Surcouche Python

Et bien fait le développeur à pensé a tout en nous mettant à disposition le SDK de Myo via Python : 

1. C'est du coup très rapide d'écrire du code pour contrôler des éléments.
2. On voit que l'équipe de Thalmic a vraiment bien bosser en mettant une grosse couche d'abstraction sur la complexité du Myo.

Voici par exemple ce qu'il est possible de faire : 

* Identifier la fenêtre à l'écran et n'activer le script que dans cette fenêtre
* Action avec la souris : 
    - Déplacement de la souris
    - Clic Droit
    - Clic Gauche
* Actions clavier : 
    - Emission d'une touche selon 3 états Down / Up / Press (down & up rapidement)
    - Gestion des touches types SHIFT / CTRL, pour pouvoir gérer les combinaisons de touches
* Actions sur le myo : 
    - Connection / Déconnection
    - Vibration 
    - Récupération des métriques liées au myo : Yaw / Pitch / Roll / ....

Cerise sur le gateau il a même ajouté des méthodes qui ne sont pas présentes dans le SDK Lua. Je vous conseille d'aller voir la partie "Library Documentation" sur le site officiel de PyoConnect pour prendre connaissance de ces ajouts : http://www.fernandocosentino.net/pyoconnect/

Il y a juste quelques méthodes qui à l'oposé il n'a pas réussit à implémenter. De la même façon ceci est bien expliqué à la fin de sa documentation.



# Controle de présentation HML5

Du coup passé cette première lecture, je me suis lancé dans mon premier script : Contrôle de mes présentations html5 par le bracelet. Le use est vraiment très simple : 

1. je veux delocker mon myo sur la gestion doubleTap
2. Une fois ce dernier délocker, je veux passer mes slides avec cette même gesture.
3. Enfin, je veux pouvoir locker le myo sur la gesture fist.


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

Je spécifie son nom dans le manager PyoConnect


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

Enfin, je gère les poses Myo pour correspondre à mon besoin. Le Edge correspond à l'état de détection de la pose par le myo : 

* on : la gesture commence
* off : la gesture se termine


Je penses qu'il faut que j'expérimente encore un peu à l'utilisation ce script mais globalement, il répond bien à mon besoin de simplement passer des slides